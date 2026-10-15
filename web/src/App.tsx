import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroAnalyzer } from './components/HeroAnalyzer';
import { ShowcaseGrid, ShowcaseItem } from './components/ShowcaseGrid';
import { KnowledgeViewer } from './components/KnowledgeViewer';
import { SpecViewer } from './components/SpecViewer';
import { SettingsModal } from './components/SettingsModal';
import { Sparkles, CheckCircle, Clock, Layers, ArrowRight } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'showcases' | 'spec'>('analyzer');
  const [showcases, setShowcases] = useState<ShowcaseItem[]>([]);
  const [activeShowcaseData, setActiveShowcaseData] = useState<any | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  // Fetch showcase list on mount
  useEffect(() => {
    fetch('/api/showcases')
      .then(res => res.json())
      .then(data => {
        if (data.showcases) {
          setShowcases(data.showcases);
        }
      })
      .catch(err => console.error('Failed to load showcases:', err));
  }, []);

  // Select a showcase to view
  const handleSelectShowcase = async (id: string) => {
    try {
      const res = await fetch(`/api/showcases/${id}`);
      const data = await res.json();
      if (data.id) {
        setActiveShowcaseData(data);
      }
    } catch (err) {
      console.error('Failed to load showcase detail:', err);
    }
  };

  // Start analysis
  const handleStartAnalysis = async (params: {
    sourceUrl: string;
    platform: string;
    mode: 'mode_b' | 'mode_a' | 'mode_c';
    transcript?: string;
    title?: string;
    author?: string;
  }) => {
    try {
      setAnalyzing(true);
      setAnalysisStep(1); // 1. 解析元数据

      let finalTitle = params.title || '技术讲座';
      let finalAuthor = params.author || '演讲讲师';
      let finalDuration = '18:30';
      let segments: any[] = [];

      // If Bilibili, fetch real info first
      if (params.platform === 'bilibili' && params.sourceUrl) {
        setAnalysisStep(2); // 2. 抓取字轨
        try {
          const bResp = await fetch('/api/extract/bilibili', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: params.sourceUrl })
          });
          const bData = await bResp.json();
          if (bData.success) {
            finalTitle = bData.title || finalTitle;
            finalAuthor = bData.author || finalAuthor;
            finalDuration = bData.duration || finalDuration;
            if (bData.subtitles && bData.subtitles.length > 0) {
              segments = bData.subtitles.map((s: any) => ({
                timestamp: formatSecs(s.from),
                content: s.content
              }));
            }
          }
        } catch (e) {
          console.warn('Bilibili fast extract fallback:', e);
        }
      }

      setAnalysisStep(3); // 3. 语义切片
      await new Promise(r => setTimeout(r, 600));

      setAnalysisStep(4); // 4. 模式推理与 Mermaid 拓扑
      const provider = localStorage.getItem('v2k_provider') || 'local_rule';
      const apiKey = localStorage.getItem('v2k_api_key') || '';

      const resp = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceUrl: params.sourceUrl,
          platform: params.platform,
          mode: params.mode,
          title: finalTitle,
          author: finalAuthor,
          duration: finalDuration,
          transcript: params.transcript,
          segments,
          apiKey,
          provider
        })
      });

      setAnalysisStep(5); // 5. 自检准出
      await new Promise(r => setTimeout(r, 400));

      const result = await resp.json();
      if (result.success) {
        setActiveShowcaseData({
          title: finalTitle,
          author: finalAuthor,
          platform: params.platform.toUpperCase(),
          source_url: params.sourceUrl,
          duration: finalDuration,
          date: new Date().toISOString().split('T')[0],
          markdown: result.markdown,
          slides: []
        });
      } else {
        alert('分析失败: ' + (result.error || '未知错误'));
      }
    } catch (err: any) {
      alert('分析请求异常: ' + err.message);
    } finally {
      setAnalyzing(false);
      setAnalysisStep(0);
    }
  };

  function formatSecs(sec: number) {
    const s = Math.floor(sec || 0);
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${String(m).padStart(2, '0')}:${String(rs).padStart(2, '0')}`;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-brand-500/30">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={tab => {
          setActiveTab(tab);
          if (tab !== 'analyzer') {
            setActiveShowcaseData(null);
          }
        }}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Analyzing Pipeline Overlay */}
        {analyzing && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-slate-800 shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-brand-500/25 ring-1 ring-white/20 animate-pulse">
                <Sparkles className="w-8 h-8 text-white" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">正在执行视频逆向研读流水线</h3>
                <p className="text-xs text-slate-400">严格遵守六段式工程规范与 Obsidian PKM 标准</p>
              </div>

              {/* Steps Progress */}
              <div className="space-y-2.5 text-left text-xs font-medium">
                {[
                  { step: 1, title: '解析视频指纹与平台元数据 (Title / CID / Cover)' },
                  { step: 2, title: '抓取官方/AI 字幕字轨并毫秒级对齐 (Subtitle Alignment)' },
                  { step: 3, title: '滑动窗口语义切片与上下文精简 (Context Compression)' },
                  { step: 4, title: '模式 B 架构推演与 Mermaid 拓扑绘制 (Architecture & Sequence)' },
                  { step: 5, title: '工业高危盲区注入与 Pre-flight 自检准出 (Checklist Verification)' }
                ].map(s => (
                  <div
                    key={s.step}
                    className={`flex items-center gap-2.5 p-2 rounded-xl transition-all ${
                      analysisStep > s.step
                        ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/50'
                        : analysisStep === s.step
                        ? 'bg-brand-950/60 text-brand-300 border border-brand-500/60 font-semibold ring-1 ring-brand-500/50'
                        : 'text-slate-500 bg-slate-900/40 border border-slate-900'
                    }`}
                  >
                    {analysisStep > s.step ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : analysisStep === s.step ? (
                      <div className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 text-[10px] flex items-center justify-center text-slate-500 flex-shrink-0">
                        {s.step}
                      </div>
                    )}
                    <span className="line-clamp-1">{s.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* View Mode Switching */}
        {activeShowcaseData ? (
          <KnowledgeViewer
            data={activeShowcaseData}
            onBack={() => setActiveShowcaseData(null)}
          />
        ) : activeTab === 'analyzer' ? (
          <div>
            <HeroAnalyzer
              onStartAnalysis={handleStartAnalysis}
              onSelectShowcase={handleSelectShowcase}
              loading={analyzing}
            />
            {/* Embedded showcases preview */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              <div className="flex items-center justify-between mb-6 pt-6 border-t border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-brand-400" />
                    <span>工业级经典标杆案列 (Showcase)</span>
                  </h3>
                  <p className="text-xs text-slate-400">点击卡片即可直接进入沉浸式图文对照研读</p>
                </div>
                <button
                  onClick={() => setActiveTab('showcases')}
                  className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1"
                >
                  <span>查看全部</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {showcases.slice(0, 2).map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectShowcase(item.id)}
                    className="p-4 rounded-2xl glass-panel border border-slate-800 hover:border-brand-500/50 transition-all cursor-pointer flex gap-4 group"
                  >
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="w-32 h-24 object-cover rounded-xl bg-slate-900 flex-shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300">
                            {item.platform}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ⏱️ {item.duration}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                          {item.summary}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-brand-400 flex items-center gap-1 mt-2">
                        <span>立即阅读</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === 'showcases' ? (
          <ShowcaseGrid
            showcases={showcases}
            onSelect={handleSelectShowcase}
          />
        ) : (
          <SpecViewer />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-4 text-slate-400">
          <a href="https://github.com/yurongfu-01/video-to-knowledge" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            GitHub 仓库
          </a>
          <span>•</span>
          <button onClick={() => setActiveTab('spec')} className="hover:text-white transition-colors">
            六段式规范 (Mode B)
          </button>
          <span>•</span>
          <span>Obsidian PKM 原生兼容</span>
        </div>
        <p>© 2026 Video2Knowledge Studio • 开源驱动的高保真视频学习与技术沉淀平台</p>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
