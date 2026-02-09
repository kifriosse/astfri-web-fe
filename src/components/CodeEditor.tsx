
"use client";

import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Code, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

export function CodeEditor({ value, onChange, language }: CodeEditorProps) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onChange(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Code className="w-5 h-5 text-accent" />
          <Label className="text-lg font-headline tracking-tight">Source Code Input</Label>
        </div>
        <div className="relative">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
            accept=".cpp,.java,.cs,.txt"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('file-upload')?.click()}
            className="flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload File</span>
          </Button>
        </div>
      </div>
      
      <div className="relative flex-1 group">
        <div className="absolute inset-0 bg-accent/5 rounded-lg border-2 border-dashed border-accent/20 transition-all group-focus-within:border-accent/50 group-focus-within:bg-accent/[0.02]" />
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter your ${language} code here...`}
          className="relative z-10 w-full h-full min-h-[500px] p-6 font-mono text-sm bg-transparent border-none resize-none focus-visible:ring-0"
        />
        <div className="absolute bottom-4 right-4 text-xs text-muted-foreground z-20 pointer-events-none">
          {value.length} characters
        </div>
      </div>
    </div>
  );
}
