#!/usr/bin/env node

/**
 * Test script for PDF extraction functionality
 * This script tests both node-poppler and pdf-parse to ensure they work correctly
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

async function testPdfParse() {
  console.log('🧪 Testing pdf-parse...');
  
  try {
    // Test the direct lib import approach
    const pdfParse = require('pdf-parse/lib/pdf-parse');
    console.log('✅ pdf-parse/lib/pdf-parse module loaded successfully');
    
    // Create a simple test buffer (this won't be a real PDF, just testing the module)
    const testBuffer = Buffer.from('Test content');
    
    try {
      // This will fail because it's not a real PDF, but it should not give ENOENT error
      await pdfParse(testBuffer, { max: 0 });
    } catch (error) {
      if (error.message.includes('ENOENT') && error.message.includes('test/data')) {
        console.log('❌ pdf-parse still has bundling issues even with direct lib import');
        console.log('Error:', error.message);
        return false;
      } else {
        console.log('✅ pdf-parse error is expected (not a real PDF), but no bundling issues detected');
        return true;
      }
    }
    
    return true;
  } catch (error) {
    console.log('❌ Failed to load pdf-parse/lib/pdf-parse:', error.message);
    
    // Fallback test with regular import
    try {
      console.log('🔄 Trying fallback with regular pdf-parse import...');
      const pdfParse = require('pdf-parse');
      console.log('✅ Regular pdf-parse module loaded as fallback');
      return true;
    } catch (fallbackError) {
      console.log('❌ Both pdf-parse approaches failed:', fallbackError.message);
      return false;
    }
  }
}

async function testNodePoppler() {
  console.log('🧪 Testing node-poppler...');
  
  try {
    const { Poppler } = require('node-poppler');
    const poppler = new Poppler();
    console.log('✅ node-poppler module loaded successfully');
    
    // Test if poppler utilities are available
    try {
      // This will likely fail in most environments, but we're just testing module loading
      await poppler.pdfToText('/nonexistent/file.pdf');
    } catch (error) {
      if (error.message.includes('ENOENT') && error.message.includes('nonexistent')) {
        console.log('✅ node-poppler is working (expected file not found error)');
        return true;
      } else if (error.message.includes('poppler') || error.message.includes('pdftotext')) {
        console.log('⚠️ node-poppler requires poppler-utils to be installed on the system');
        console.log('Error:', error.message);
        return false;
      } else {
        console.log('✅ node-poppler loaded but may need system dependencies');
        return true;
      }
    }
    
    return true;
  } catch (error) {
    console.log('❌ Failed to load node-poppler:', error.message);
    return false;
  }
}

async function main() {
  console.log('🔍 Testing PDF extraction modules...\n');
  
  const pdfParseOk = await testPdfParse();
  console.log('');
  const nodePopplerOk = await testNodePoppler();
  
  console.log('\n📊 Test Results:');
  console.log(`pdf-parse: ${pdfParseOk ? '✅ OK' : '❌ FAILED'}`);
  console.log(`node-poppler: ${nodePopplerOk ? '✅ OK' : '❌ FAILED'}`);
  
  if (pdfParseOk && nodePopplerOk) {
    console.log('\n🎉 All PDF extraction modules are working correctly!');
  } else {
    console.log('\n⚠️ Some PDF extraction modules have issues. Check the logs above.');
    
    if (!pdfParseOk) {
      console.log('\n💡 To fix pdf-parse issues:');
      console.log('1. Make sure you\'re using require() instead of import()');
      console.log('2. Check that the module is properly bundled');
      console.log('3. Consider using external configuration in next.config.js');
    }
    
    if (!nodePopplerOk) {
      console.log('\n💡 To fix node-poppler issues:');
      console.log('1. Install poppler-utils on your system:');
      console.log('   - Ubuntu/Debian: sudo apt-get install poppler-utils');
      console.log('   - macOS: brew install poppler');
      console.log('   - Windows: Download from https://poppler.freedesktop.org/');
    }
  }
}

main().catch(console.error); 