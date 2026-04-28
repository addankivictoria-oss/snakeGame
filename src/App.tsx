/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Terminal, Cpu, Zap, Activity } from 'lucide-react';

export default function App() {
  const [timestamp, setTimestamp] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTimestamp(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#050507] text-[#e0e0e0] font-sans overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Decorative Grid */}
      <div 
        className="fixed inset-0 opacity-[0.03]"
        style={{ 
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Top Navigation / Status Bar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              <Zap size={18} className="text-black" />
            </div>
            <h1 className="text-xl font-black uppercase tracking-tighter italic">Neon Pulse</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-[10px] uppercase tracking-[0.3em] text-[#444]">
            <div className="flex items-center gap-2 text-cyan-400">
              <Activity size={12} />
              <span>Network: Latency 12ms</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu size={12} />
              <span>Core: Stable</span>
            </div>
          </div>
        </div>

        <div className="font-mono text-xs text-[#666] flex items-center gap-4">
          <span className="text-cyan-400/60 hidden sm:inline">User: Guest@ais-studio</span>
          <span>{timestamp.toLocaleTimeString().toUpperCase()}</span>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 container mx-auto px-4 py-12 lg:py-24 flex flex-col lg:grid lg:grid-cols-[1fr_400px] gap-12 items-center lg:items-start lg:justify-center max-w-7xl">
        
        {/* Center Section: Snake Game */}
        <section className="w-full flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[600px] bg-[#0c0c0e] border border-white/5 rounded-3xl p-8 lg:p-12 shadow-inner relative overflow-hidden"
          >
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-magenta-500/30 rounded-br-3xl" />
            
            <div className="flex items-center gap-4 mb-10 w-full">
              <div className="p-2 bg-white/5 rounded-lg">
                <Terminal size={16} className="text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xs uppercase tracking-[0.4em] font-bold text-white/40">Subsystem.01</h2>
                <div className="text-sm font-mono text-white tracking-widest">SNAKE_MODULE</div>
              </div>
              <div className="ml-auto w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-cyan-400"
                  animate={{ x: [-48, 48] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </div>

            <SnakeGame />

            <div className="mt-12 text-[10px] text-[#333] font-mono leading-relaxed uppercase tracking-widest max-w-[400px] mx-auto text-center border-t border-white/5 pt-8">
              Protocol established. Collect energy packets to extend system endurance. 
              Avoid lattice collision at all costs.
            </div>
          </motion.div>
        </section>

        {/* Right Section: Music Player */}
        <aside className="w-full lg:sticky lg:top-24 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-0.5 flex-grow bg-white/5" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#444] font-bold">Audio Interface</span>
              <div className="h-0.5 w-12 bg-white/5" />
            </div>
            
            <MusicPlayer />

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-[#111] border border-white/5 p-4 rounded-xl">
                <div className="text-[10px] text-[#444] uppercase tracking-widest mb-2 font-bold">Bitrate</div>
                <div className="font-mono text-cyan-400/80">320kbps</div>
              </div>
              <div className="bg-[#111] border border-white/5 p-4 rounded-xl">
                <div className="text-[10px] text-[#444] uppercase tracking-widest mb-2 font-bold">Format</div>
                <div className="font-mono text-magenta-400/80">FLAC_SYNTH</div>
              </div>
            </div>
          </motion.div>
        </aside>

      </main>

      {/* Footer / Meta Info */}
      <footer className="mt-auto px-6 py-12 border-t border-white/5 bg-black/20">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_5px_#06b6d4]" />
              <span className="text-xs font-bold uppercase tracking-[0.3em]">System Online</span>
            </div>
            <p className="text-[10px] text-[#444] uppercase tracking-widest">
              © 2026 Neon Pulse Interactive. Built for AI Studio.
            </p>
          </div>

          <div className="flex gap-8">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-[#333] uppercase font-bold tracking-widest">Engine</span>
              <span className="text-[11px] font-mono text-[#666]">VITE_RE_CORE_v6.2</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-[#333] uppercase font-bold tracking-widest">Uptime</span>
              <span className="text-[11px] font-mono text-[#666]">100.0%</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
