import React, { useState } from 'react';
import { Video, BookOpen, Layers, RefreshCw, Settings, Github, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface NavbarProps {
  activeTab: 'analyzer' | 'showcases' | 'spec';
  setActiveTab: (tab: 'analyzer' | 'showcases' | 'spec') => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenSettings }) => {
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  const handleDesktopSync = async () => {
    try {
      setSyncing(true);
      setSyncResult(null);
      const res = await fetch('/api/desktop-sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSyncResult('同步成功！');
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.1 }
        });
        setTimeout(() => setSyncResult(null), 3500);
      } else {
        alert('同步失败: ' + (data.error || '未知错误'));
      }
    } catch (e: any) {
      alert('同步失败: ' + e.message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('analyzer')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20 ring-1 ring-white/20">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">Video2Knowledge</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Studio
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">视频分析与高保真知识库沉淀工作台</p>
          </div>
        </div>

        {/* Center Tabs */}
        <nav className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/80 border border-slate-800/80">
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'analyzer'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>智能分析</span>
          </button>

          <button
            onClick={() => setActiveTab('showcases')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'showcases'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>硬核案例馆</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-500/30 text-indigo-200 border border-indigo-500/40">
              4篇旗舰
            </span>
          </button>

          <button
            onClick={() => setActiveTab('spec')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'spec'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>六段式规范</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Sync to Desktop button */}
          <button
            onClick={handleDesktopSync}
            disabled={syncing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              syncResult
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-900 border-slate-700/80 hover:border-brand-500/50 text-slate-300 hover:text-white'
            }`}
            title="一键将知识库产物同步至桌面 Obsidian 知识库 (C:\Users\jiang\Desktop\开发经验\开发者经验分析)"
          >
            {syncing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-400" />
            ) : syncResult ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5 text-brand-400" />
            )}
            <span className="hidden md:inline">{syncResult || (syncing ? '同步中...' : '同步桌面经验库')}</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            title="模型与生成设置"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* GitHub Repo Link */}
          <a
            href="https://github.com/yurongfu-01/video-to-knowledge"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            title="访问 GitHub 开源仓库"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
