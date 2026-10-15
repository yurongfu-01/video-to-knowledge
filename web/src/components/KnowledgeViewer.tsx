import React, { useState } from 'react';
import { 
  FileText, 
  Layers, 
  Copy, 
  Download, 
  ExternalLink, 
  Check, 
  ArrowLeft, 
  Clock, 
  User, 
  Tag, 
  Eye, 
  Sparkles,
  RefreshCw,
  Maximize2
} from 'lucide-react';
import { MarkdownViewer } from './MarkdownViewer';
import confetti from 'canvas-confetti';

interface Slide {
  id: number;
  title: string;
  filename: string;
  url: string;
  timestamp: string;
}

interface KnowledgeViewerProps {
  data: {
    id?: string;
    title: string;
    author: string;
    platform: string;
    source_url?: string;
    duration: string;
    date: string;
    markdown: string;
    verbatimMarkdown?: string;
    slides?: Slide[];
    videoEmbedUrl?: string;
  };
  onBack: () => void;
  onTriggerSync?: () => void;
}

export const KnowledgeViewer: React.FC<KnowledgeViewerProps> = ({ data, onBack, onTriggerSync }) => {
  const [activeMode, setActiveMode] = useState<'mode_b' | 'mode_a'>('mode_b');
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [slideZoom, setSlideZoom] = useState<boolean>(false);

  const slides = data.slides || [];
  const currentSlide = slides[activeSlideIndex];

  const currentMarkdown = activeMode === 'mode_a' && data.verbatimMarkdown 
    ? data.verbatimMarkdown 
    : data.markdown;

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(currentMarkdown);
    setCopied(true);
    confetti({
      particleCount: 30,
      spread: 45,
      origin: { y: 0.1 }
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMd = () => {
    const blob = new Blob([currentMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.title.replace(/[\\/:*?"<>|]/g, '_')}_${activeMode}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleTimestampClick = (timestamp: string) => {
    if (slides.length > 0) {
      // Find matching slide near this timestamp
      const foundIdx = slides.findIndex(s => s.timestamp.startsWith(timestamp) || timestamp.startsWith(s.timestamp));
      if (foundIdx !== -1) {
        setActiveSlideIndex(foundIdx);
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-slate-800">
        <div className="flex items-start sm:items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="返回分析首页"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                {data.platform}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                <Clock className="w-3 h-3" /> {data.duration}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <User className="w-3 h-3" /> {data.author}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight line-clamp-1">
              {data.title}
            </h1>
          </div>
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          {data.verbatimMarkdown && (
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 mr-2">
              <button
                onClick={() => setActiveMode('mode_b')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeMode === 'mode_b'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>六段式研读</span>
              </button>
              <button
                onClick={() => setActiveMode('mode_a')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeMode === 'mode_a'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>原貌切片档</span>
              </button>
            </div>
          )}

          {/* Copy Markdown */}
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-200 hover:text-white transition-all cursor-pointer"
            title="一键复制完整 Markdown 文本 (含 YAML Frontmatter)"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">已复制</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>复制 Markdown</span>
              </>
            )}
          </button>

          {/* Download .md */}
          <button
            onClick={handleDownloadMd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-medium shadow-md shadow-brand-600/20 transition-all cursor-pointer"
            title="下载为 Obsidian / Notion 兼容的 Markdown 文件"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">导出 .md</span>
          </button>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Media / Slides / Timestamps (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          {/* Slide Gallery Card (if slides available) */}
          {slides.length > 0 ? (
            <div className="glass-panel rounded-2xl p-4 border border-slate-800 shadow-xl overflow-hidden space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-brand-400" />
                  <span>讲座原画幻灯片 ({activeSlideIndex + 1} / {slides.length})</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-brand-300 font-mono text-[11px]">
                  ⏱️ {currentSlide.timestamp}
                </span>
              </div>

              {/* Main Active Slide Display */}
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group">
                <img
                  src={currentSlide.url}
                  alt={currentSlide.title}
                  className="w-full max-h-[300px] object-contain transition-transform duration-300 cursor-pointer"
                  onClick={() => setSlideZoom(true)}
                />
                <button
                  onClick={() => setSlideZoom(true)}
                  className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="放大查看原图"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-xs text-slate-300 font-medium line-clamp-1">
                {currentSlide.title}
              </div>

              {/* Thumbnail Strip */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSlideIndex(idx)}
                    className={`flex-shrink-0 w-14 h-9 rounded-md overflow-hidden border transition-all ${
                      activeSlideIndex === idx
                        ? 'border-brand-500 ring-2 ring-brand-500/50 scale-105'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                    title={`[${s.timestamp}] ${s.title}`}
                  >
                    <img src={s.url} alt={s.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Fallback preview banner */
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-white">架构级知识库研读报告</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                本报告遵循六段式规范，涵盖 Mermaid 架构时序、高危工程盲区与 Pre-flight Checklist。
              </p>
            </div>
          )}

          {/* Quick Chapter Navigator */}
          {slides.length > 0 && (
            <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-400" />
                <span>核心里程碑直达</span>
              </span>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {slides.filter((_, i) => [0, 4, 8, 14, 20, 24, 29, 35, 41].includes(i)).map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      const idx = slides.findIndex(item => item.id === s.id);
                      if (idx !== -1) setActiveSlideIndex(idx);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-800/80 transition-colors flex items-center justify-between text-slate-400 hover:text-brand-300 group"
                  >
                    <span className="line-clamp-1">{s.title}</span>
                    <span className="font-mono text-[10px] text-slate-500 group-hover:text-brand-400 ml-2">
                      {s.timestamp}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Markdown Synthesis Content (7 cols on lg) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl overflow-hidden min-h-[600px]">
          {/* YAML Frontmatter Pill Badge Card */}
          <div className="mb-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs font-mono space-y-1.5">
            <div className="flex items-center justify-between text-slate-500 font-bold border-b border-slate-800 pb-1 mb-2">
              <span>YAML FRONTMATTER (Obsidian PKM Ready)</span>
              <span className="text-emerald-400 font-semibold">● Validated</span>
            </div>
            <div className="text-slate-400">
              <span className="text-brand-300">type</span>: {activeMode === 'mode_b' ? 'video-deep-synthesis' : 'video-verbatim-slice'}
            </div>
            <div className="text-slate-400">
              <span className="text-brand-300">platform</span>: {data.platform}
            </div>
            <div className="text-slate-400">
              <span className="text-brand-300">author</span>: {data.author}
            </div>
            <div className="text-slate-400">
              <span className="text-brand-300">duration</span>: "{data.duration}"
            </div>
          </div>

          {/* Rendered Markdown Document */}
          <MarkdownViewer 
            content={currentMarkdown} 
            onTimestampClick={handleTimestampClick}
          />
        </div>
      </div>

      {/* Slide Modal Zoom */}
      {slideZoom && currentSlide && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSlideZoom(false)}
        >
          <div className="max-w-5xl max-h-[90vh] bg-slate-900 rounded-2xl p-2 border border-slate-700 overflow-hidden relative shadow-2xl">
            <img
              src={currentSlide.url}
              alt={currentSlide.title}
              className="max-w-full max-h-[82vh] object-contain rounded-xl"
            />
            <div className="p-3 text-center text-sm font-semibold text-white">
              [{currentSlide.timestamp}] {currentSlide.title}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
