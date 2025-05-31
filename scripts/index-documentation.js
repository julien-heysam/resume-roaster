#!/usr/bin/env node

/**
 * Documentation Indexing Script for Resume Roaster
 * 
 * This script indexes the DOCUMENTATION.md file into Pinecone
 * for use by the AI chatbot knowledge base.
 */

const { Pinecone } = require('@pinecone-database/pinecone');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const INDEX_NAME = 'documents';
const EMBEDDING_MODEL = 'text-embedding-3-small';
const MAX_CHUNK_SIZE = 1000; // tokens

if (!PINECONE_API_KEY) {
  console.error('❌ PINECONE_API_KEY environment variable is required');
  process.exit(1);
}

if (!OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY environment variable is required');
  process.exit(1);
}

const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

/**
 * Clean text content to avoid encoding issues
 */
function cleanText(text) {
  return text
    // Remove emojis and special Unicode characters
    .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
    // Remove control characters
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    // Remove surrogate pairs and other problematic Unicode
    .replace(/[\uD800-\uDFFF]/g, '')
    // Remove any remaining non-ASCII characters that might cause issues
    .replace(/[^\x00-\x7F]/g, ' ')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Estimate token count (rough approximation: 1 token ≈ 4 characters)
 */
function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

/**
 * Parse the markdown documentation and create chunks
 */
function parseAndChunkDocumentation(content) {
  const chunks = [];
  const lines = content.split('\n');
  
  let currentSection = '';
  let currentSubsection = '';
  let currentContent = '';
  let currentTitle = '';
  let chunkIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect main sections (## heading)
    if (line.startsWith('## ')) {
      // Save previous chunk if it exists
      if (currentContent.trim()) {
        chunks.push(...createChunksFromContent(
          currentTitle || currentSection,
          currentContent.trim(),
          currentSection,
          currentSubsection,
          chunkIndex
        ));
        chunkIndex = chunks.length;
      }
      
      currentSection = cleanText(line.replace('## ', '').replace(/[🔗🏗️🔐🎯📄💳🤖🛠️🗄️🔌🎨🔒🚀📝]/g, '').trim());
      currentTitle = currentSection;
      currentContent = '';
      currentSubsection = '';
    }
    // Detect subsections (### heading)
    else if (line.startsWith('### ')) {
      // Save previous chunk if it exists
      if (currentContent.trim()) {
        chunks.push(...createChunksFromContent(
          currentTitle || currentSubsection || currentSection,
          currentContent.trim(),
          currentSection,
          currentSubsection,
          chunkIndex
        ));
        chunkIndex = chunks.length;
      }
      
      currentSubsection = cleanText(line.replace('### ', '').trim());
      currentTitle = currentSubsection;
      currentContent = '';
    }
    // Regular content
    else {
      currentContent += line + '\n';
    }
  }

  // Don't forget the last chunk
  if (currentContent.trim()) {
    chunks.push(...createChunksFromContent(
      currentTitle || currentSection,
      currentContent.trim(),
      currentSection,
      currentSubsection,
      chunkIndex
    ));
  }

  return chunks;
}

/**
 * Create chunks from content, respecting token limits
 */
function createChunksFromContent(title, content, section, subsection, startIndex) {
  const chunks = [];
  
  // Clean the content
  const cleanedContent = cleanText(content);
  const cleanedTitle = cleanText(title);
  
  const contentTokens = estimateTokens(cleanedContent);
  
  if (contentTokens <= MAX_CHUNK_SIZE) {
    // Content fits in one chunk
    chunks.push({
      id: `chunk-${startIndex}`,
      title: cleanedTitle,
      content: cleanedContent,
      section,
      subsection,
      chunkIndex: startIndex,
      tokenCount: contentTokens
    });
  } else {
    // Split content into multiple chunks
    const sentences = cleanedContent.split(/[.!?]\s+/);
    let currentChunk = '';
    let chunkCount = 0;
    
    for (const sentence of sentences) {
      const potentialChunk = currentChunk + (currentChunk ? '. ' : '') + sentence;
      
      if (estimateTokens(potentialChunk) > MAX_CHUNK_SIZE && currentChunk) {
        // Save current chunk
        chunks.push({
          id: `chunk-${startIndex + chunkCount}`,
          title: `${cleanedTitle} (Part ${chunkCount + 1})`,
          content: currentChunk,
          section,
          subsection,
          chunkIndex: startIndex + chunkCount,
          tokenCount: estimateTokens(currentChunk)
        });
        
        chunkCount++;
        currentChunk = sentence;
      } else {
        currentChunk = potentialChunk;
      }
    }
    
    // Don't forget the last chunk
    if (currentChunk) {
      chunks.push({
        id: `chunk-${startIndex + chunkCount}`,
        title: `${cleanedTitle} (Part ${chunkCount + 1})`,
        content: currentChunk,
        section,
        subsection,
        chunkIndex: startIndex + chunkCount,
        tokenCount: estimateTokens(currentChunk)
      });
    }
  }
  
  return chunks;
}

/**
 * Create embeddings for all chunks
 */
async function createEmbeddings(chunks) {
  const chunksWithEmbeddings = [];
  
  // Process in batches to avoid rate limits
  const batchSize = 10;
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    
    try {
      const embeddings = await openai.embeddings.create({
        model: EMBEDDING_MODEL,
        input: batch.map(chunk => `${chunk.title}\n\n${chunk.content}`)
      });
      
      for (let j = 0; j < batch.length; j++) {
        chunksWithEmbeddings.push({
          ...batch[j],
          embedding: embeddings.data[j].embedding
        });
      }
      
      console.log(`📊 Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(chunks.length / batchSize)}`);
      
      // Small delay to respect rate limits
      if (i + batchSize < chunks.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error(`❌ Error creating embeddings for batch ${Math.floor(i / batchSize) + 1}:`, error);
      throw error;
    }
  }
  
  return chunksWithEmbeddings;
}

/**
 * Main indexing function
 */
async function indexDocumentation() {
  console.log('🔍 Starting documentation indexing with Pinecone...');
  
  try {
    // Read the documentation file
    const filePath = path.join(__dirname, '..', 'DOCUMENTATION.md');
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileHash = crypto.createHash('sha256').update(content).digest('hex');

    // Get or create index
    const index = pinecone.index(INDEX_NAME);

    // Check if we need to re-index by looking for a metadata record
    const existingMetadata = await index.fetch(['metadata-DOCUMENTATION.md']);
    if (existingMetadata.records['metadata-DOCUMENTATION.md']?.metadata?.fileHash === fileHash) {
      console.log('📄 Documentation is up to date, skipping indexing');
      return;
    }

    // Parse and chunk the documentation
    const chunks = parseAndChunkDocumentation(content);
    console.log(`📝 Created ${chunks.length} chunks from documentation`);

    // Create embeddings for all chunks
    const chunksWithEmbeddings = await createEmbeddings(chunks);
    console.log('🧠 Generated embeddings for all chunks');

    // Clear existing data for this file
    try {
      await index.deleteMany({
        filter: { sourceFile: { $eq: 'DOCUMENTATION.md' } }
      });
      console.log('🧹 Cleared existing data');
    } catch (error) {
      console.log('ℹ️ No existing data to clear (this is normal for first-time indexing)');
    }

    // Prepare vectors for Pinecone
    const vectors = chunksWithEmbeddings.map(chunk => ({
      id: chunk.id,
      values: chunk.embedding,
      metadata: {
        title: chunk.title,
        content: chunk.content,
        section: chunk.section,
        subsection: chunk.subsection || '',
        chunkIndex: chunk.chunkIndex,
        tokenCount: chunk.tokenCount,
        sourceFile: 'DOCUMENTATION.md'
      }
    }));

    // Create a metadata embedding using the file hash as content
    const metadataEmbedding = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: `Documentation metadata for DOCUMENTATION.md - Hash: ${fileHash}`
    });

    // Add metadata record with proper embedding
    vectors.push({
      id: 'metadata-DOCUMENTATION.md',
      values: metadataEmbedding.data[0].embedding,
      metadata: {
        type: 'metadata',
        sourceFile: 'DOCUMENTATION.md',
        fileHash,
        totalChunks: chunks.length,
        lastIndexedAt: new Date().toISOString(),
        title: 'Documentation Metadata',
        content: 'Metadata for DOCUMENTATION.md',
        section: 'metadata',
        subsection: '',
        chunkIndex: -1,
        tokenCount: 0
      }
    });

    // Upsert in batches
    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      await index.upsert(batch);
      console.log(`💾 Stored batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(vectors.length / batchSize)}`);
    }

    console.log('✅ Documentation indexing completed successfully');
  } catch (error) {
    console.error('❌ Error indexing documentation:', error);
    process.exit(1);
  }
}

// Run the indexing
indexDocumentation(); 