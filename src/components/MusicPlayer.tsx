/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DUMMY_SONGS, NEON_COLORS } from '../constants';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const currentTrack = DUMMY_SONGS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + (100 / currentTrack.duration);
        });
      }, 1000);
    } else {
      if (progressInterval.current) clearInterval(progressInterval.current);
    }

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [isPlaying, currentTrackIndex]);

  const handleTogglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_SONGS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_SONGS.length) % DUMMY_SONGS.length);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = (progress / 100) * currentTrack.duration;

  return (
    <div className="w-full max-w-md bg-[#111] border border-[#222] rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
      {/* Background Glow */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/10 blur-[80px] rounded-full"
        style={{ pointerEvents: 'none' }}
      />
      <div 
        className="absolute bottom-0 left-0 w-32 h-32 bg-magenta-600/10 blur-[80px] rounded-full"
        style={{ pointerEvents: 'none' }}
      />

      <div className="flex items-center gap-6 mb-8">
        <div className="relative w-24 h-24 flex-shrink-0">
          <motion.div
            key={currentTrack.cover}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full h-full rounded-xl overflow-hidden shadow-lg border border-white/5"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          {isPlaying && (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 border-2 border-dashed border-cyan-400/20 rounded-full"
            />
          )}
        </div>

        <div className="flex-grow overflow-hidden">
          <motion.h3 
            key={currentTrack.title}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-lg font-bold text-white truncate mb-1"
          >
            {currentTrack.title}
          </motion.h3>
          <motion.p 
            key={currentTrack.artist}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xs uppercase tracking-[0.2em] text-[#666] mb-3"
          >
            {currentTrack.artist}
          </motion.p>
          <div className="flex items-center gap-2 text-cyan-400/60">
            <Music2 size={12} />
            <span className="text-[10px] uppercase font-mono tracking-widest">AI Mastered Lossless</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="relative h-1.5 bg-[#222] rounded-full overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-magenta-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between font-mono text-[10px] text-[#444]">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Volume2 size={14} className="text-[#444]" />
          <div className="w-16 h-1 bg-[#222] rounded-full">
            <div className="h-full bg-cyan-400/40 rounded-full" style={{ width: `${volume}%` }} />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            id="prev-track"
            onClick={handlePrev}
            className="p-2 text-[#666] hover:text-white transition-colors"
          >
            <SkipBack size={20} />
          </button>
          
          <button 
            id="play-pause"
            onClick={handleTogglePlay}
            className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>

          <button 
            id="next-track"
            onClick={handleNext}
            className="p-2 text-[#666] hover:text-white transition-colors"
          >
            <SkipForward size={20} />
          </button>
        </div>

        <div className="w-10 h-10 flex items-center justify-center border border-[#222] rounded-lg text-[#333] text-[10px] font-mono">
          {currentTrackIndex + 1}/{DUMMY_SONGS.length}
        </div>
      </div>

      <div className="mt-8 pt-6 border-top border-[#222]">
        <div className="flex items-center gap-3 text-[10px] text-[#333] uppercase tracking-[0.3em]">
          <div className="w-2 h-2 rounded-full bg-green-500/40 animate-pulse" />
          Neural Synthesis Engine v4.2 Active
        </div>
      </div>
    </div>
  );
}
