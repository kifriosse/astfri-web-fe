
"use client";

import React, { useEffect, useState } from 'react';
import { Activity, Layout, Github, ShieldCheck } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { checkHealth } from '@/lib/api';

export function Header() {
  const [healthStatus, setHealthStatus] = useState<'Healthy' | 'Error' | 'Checking'>('Checking');

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        await checkHealth();
        setHealthStatus('Healthy');
      } catch {
        setHealthStatus('Error');
      }
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="bg-primary p-2 rounded-lg">
              <Layout className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-xl font-headline font-bold tracking-tight text-primary">
              ASTFRI <span className="text-accent">Web</span>
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            <Badge variant="secondary" className="bg-accent/10 text-accent border-none font-medium">
              v1.0.4-beta
            </Badge>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs font-medium">
            <span className="text-muted-foreground uppercase tracking-widest">API Status:</span>
            <div className="flex items-center space-x-1">
              <Activity className={`w-3 h-3 ${healthStatus === 'Healthy' ? 'text-green-500' : healthStatus === 'Error' ? 'text-red-500' : 'text-yellow-500 animate-pulse'}`} />
              <span className={healthStatus === 'Healthy' ? 'text-green-600' : healthStatus === 'Error' ? 'text-red-600' : 'text-yellow-600'}>
                {healthStatus}
              </span>
            </div>
          </div>
          
          <div className="h-6 w-px bg-border mx-2" />
          
          <div className="flex items-center space-x-3">
             <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <div className="flex items-center space-x-1 bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold text-primary/80">Secure</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
