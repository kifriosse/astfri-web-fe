
"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Terminal, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface OutputViewerProps {
  content: string;
  isLoading: boolean;
  error?: string;
  logs?: string[];
}

export function OutputViewer({ content, isLoading, error, logs }: OutputViewerProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Output copied to clipboard.",
    });
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-accent" />
          <Label className="text-lg font-headline tracking-tight">Transformation Result</Label>
        </div>
        {content && !isLoading && !error && (
          <Button variant="ghost" size="sm" onClick={handleCopy} className="text-muted-foreground hover:text-accent">
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
        )}
      </div>

      <div className="relative flex-1">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-background/50 z-30 rounded-lg">
            <div className="w-full max-w-xs space-y-2">
              <Progress value={logs?.length ? (logs.length / 4) * 100 : 33} className="h-2" />
              <p className="text-sm text-center text-muted-foreground animate-pulse">
                {logs?.[logs.length - 1] || "Spracúvanie..."}
              </p>
            </div>
          </div>
        ) : null}

        <Card className="h-full border-none shadow-sm overflow-hidden bg-white">
          <CardContent className="p-0 h-full flex flex-col">
            {error ? (
              <div className="flex flex-col items-center justify-center flex-1 p-12 text-center">
                <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                <h3 className="text-lg font-headline font-bold text-destructive">Chyba</h3>
                <p className="text-muted-foreground mt-2">{error}</p>
              </div>
            ) : content ? (
              <pre className="flex-1 p-6 font-mono text-sm overflow-auto whitespace-pre-wrap leading-relaxed">
                {content}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 p-12 text-center text-muted-foreground">
                <CheckCircle2 className="w-12 h-12 mb-4 opacity-20" />
                <p>Run transformation to see results</p>
              </div>
            )}
            
            {logs && logs.length > 0 && !error && (
              <div className="bg-muted p-4 border-t max-h-32 overflow-auto">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Logs</h4>
                <div className="space-y-1">
                  {logs.map((log, i) => (
                    <p key={i} className="text-[10px] font-mono opacity-70">
                      <span className="text-accent-foreground/50 mr-2">[{new Date().toLocaleTimeString()}]</span>
                      {log}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
