
"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { CodeEditor } from '@/components/CodeEditor';
import { OutputViewer } from '@/components/OutputViewer';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Settings2, Sparkles, Wand2 } from 'lucide-react';
import { transformSourceCode, TransformResponse } from '@/lib/api';
import config from '@/lib/config.json';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(config.InputLibs[0]);
  const [sourceCode, setSourceCode] = useState<string>((config as any).InputLibsDefaults[config.InputLibs[0]] || "");
  const [selectedOutput, setSelectedOutput] = useState<string>(config.OutputLibs[0]);
  const [transformationResult, setTransformationResult] = useState<TransformResponse | null>(null);
  const [isTransforming, setIsTransforming] = useState<boolean>(false);

  const handleLanguageChange = (newLang: string) => {
    setSelectedLanguage(newLang);
    const defaultCode = (config as any).InputLibsDefaults[newLang];
    if (defaultCode) {
      setSourceCode(defaultCode);
    }
  };

  const handleTransform = async () => {
    setIsTransforming(true);
    setTransformationResult(null);
    
    try {
      const response = await transformSourceCode({
        inputText: sourceCode,
        inputLib: selectedLanguage,
        outputLib: selectedOutput
      });
      setTransformationResult(response);
    } catch (err) {
      setTransformationResult({
        result: "",
        error: "Nastala neočakávaná chyba pri komunikácii so serverom."
      });
    } finally {
      setIsTransforming(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-accent/30">
      <Header />
      
      <main className="flex-1 flex flex-col p-6 max-w-[1600px] mx-auto w-full space-y-6">
        {/* Controls Bar */}
        <div className="bg-white rounded-xl border p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex flex-col space-y-1.5 w-full sm:w-48">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Source Library</label>
              <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Input Lib" />
                </SelectTrigger>
                <SelectContent>
                  {config.InputLibs.map(lib => (
                    <SelectItem key={lib} value={lib}>{lib.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1.5 w-full sm:w-48">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Output Library</label>
              <Select value={selectedOutput} onValueChange={setSelectedOutput}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Output Lib" />
                </SelectTrigger>
                <SelectContent>
                  {config.OutputLibs.map(lib => (
                    <SelectItem key={lib} value={lib}>{lib.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none border-dashed border-2">
              <Settings2 className="w-4 h-4 mr-2" />
              Config
            </Button>
            <Button 
              size="lg"
              disabled={isTransforming}
              onClick={handleTransform}
              className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              {isTransforming ? (
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4 mr-2" />
              )}
              {isTransforming ? "Transforming..." : "Execute Transformation"}
            </Button>
          </div>
        </div>

        {/* Vertical Layout Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
          <div className="flex flex-col animate-in slide-in-from-left duration-500 overflow-hidden h-full">
            <CodeEditor 
              value={sourceCode} 
              onChange={setSourceCode} 
              language={selectedLanguage.toUpperCase()} 
            />
          </div>
          
          <div className="flex flex-col animate-in slide-in-from-right duration-700 overflow-hidden h-full">
            <OutputViewer 
              content={transformationResult?.result || ""} 
              isLoading={isTransforming} 
              error={transformationResult?.error}
              logs={transformationResult?.logs}
              isUml={selectedOutput === 'uml'}
            />
          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-xs text-muted-foreground border-t bg-white">
        <p>© 2026 ASTFRI Transformation Engine. Powering automated software analysis.</p>
      </footer>
      <Toaster />
    </div>
  );
}
