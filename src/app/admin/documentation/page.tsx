'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, Database, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface IndexStatus {
  success: boolean;
  totalChunks: number;
  lastIndexedAt?: string;
  sections: string[];
  error?: string;
}

export default function DocumentationAdminPage() {
  const [isIndexing, setIsIndexing] = useState(false);
  const [indexStatus, setIndexStatus] = useState<IndexStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchIndexStatus = async () => {
    try {
      const response = await fetch('/api/admin/index-documentation');
      const data = await response.json();
      setIndexStatus(data);
    } catch (error) {
      console.error('Error fetching index status:', error);
      setIndexStatus({
        success: false,
        totalChunks: 0,
        sections: [],
        error: 'Failed to fetch status'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleIndexDocumentation = async () => {
    setIsIndexing(true);
    try {
      const response = await fetch('/api/admin/index-documentation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh status after successful indexing
        await fetchIndexStatus();
      } else {
        setIndexStatus({
          success: false,
          totalChunks: 0,
          sections: [],
          error: result.error || 'Indexing failed'
        });
      }
    } catch (error) {
      console.error('Error indexing documentation:', error);
      setIndexStatus({
        success: false,
        totalChunks: 0,
        sections: [],
        error: 'Network error during indexing'
      });
    } finally {
      setIsIndexing(false);
    }
  };

  useEffect(() => {
    fetchIndexStatus();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Documentation Management</h1>
          <p className="text-muted-foreground">
            Manage the AI chatbot's knowledge base using Pinecone vector database
          </p>
        </div>

        {/* Status Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Pinecone Index Status
            </CardTitle>
            <CardDescription>
              Current status of the documentation knowledge base
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading status...</span>
              </div>
            ) : indexStatus ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {indexStatus.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-medium">
                    {indexStatus.success ? 'Index Active' : 'Index Error'}
                  </span>
                  {indexStatus.error && (
                    <Badge variant="destructive">{indexStatus.error}</Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-2xl font-bold">{indexStatus.totalChunks}</div>
                    <div className="text-sm text-muted-foreground">Total Chunks</div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-2xl font-bold">{indexStatus.sections.length}</div>
                    <div className="text-sm text-muted-foreground">Sections</div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm font-medium">Last Indexed</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(indexStatus.lastIndexedAt)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">Failed to load status</div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documentation Actions
            </CardTitle>
            <CardDescription>
              Index the DOCUMENTATION.md file into Pinecone for AI chatbot knowledge
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleIndexDocumentation}
                disabled={isIndexing}
                className="flex items-center gap-2"
              >
                {isIndexing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {isIndexing ? 'Indexing...' : 'Index Documentation'}
              </Button>

              <Button
                variant="outline"
                onClick={fetchIndexStatus}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Status
              </Button>
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>Index Documentation:</strong> Processes DOCUMENTATION.md, creates semantic chunks, 
                generates embeddings, and stores them in Pinecone for AI chatbot search.
              </p>
              <p>
                <strong>Note:</strong> The system automatically detects if the documentation has changed 
                and only re-indexes when necessary.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Vector Database:</span>
                <span className="font-mono">Pinecone</span>
              </div>
              <div className="flex justify-between">
                <span>Embedding Model:</span>
                <span className="font-mono">text-embedding-3-small</span>
              </div>
              <div className="flex justify-between">
                <span>Max Chunk Size:</span>
                <span className="font-mono">1000 tokens</span>
              </div>
              <div className="flex justify-between">
                <span>Index Name:</span>
                <span className="font-mono">documents</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 