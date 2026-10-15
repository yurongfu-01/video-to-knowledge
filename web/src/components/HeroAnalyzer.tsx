import React, { useState } from 'react';
import { 
  Play, 
  Sparkles, 
  FileText, 
  Layers, 
  UploadCloud, 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  Film, 
  SlidersHorizontal,
  Clock,
  Compass
} from 'lucide-react';

interface HeroAnalyzerProps {
  onStartAnalysis: (params: {
    sourceUrl: string;
    platform: string;
    mode: 'mode_b' | 'mode_a' | 'mode_c';
    transcript?: string;
    title?: string;
    author?: string;
  }) => void;
  onSelectShowcase: (id: string) => void;
  loading: boolean;
}

export const HeroAnalyzer: React.FC<HeroAnalyzerProps> = ({
  onStartAnalysis,
  onSelectShowcase,
  loading
}) => {
  const [platform, setPlatform] = useState<'bilibili' | 'youtube' | 'x' | 'local' | 'text'>('bilibili');
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState<'mode_b' | 'mode_a' | 'mode_c'>('mode_b');
  const [transcriptText, setTranscriptText] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customAuthor, setCustomAuthor] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (platform === 'text' && !transcriptText.trim()) {
      alert('请粘贴字幕或文稿内容！');
      return;
    }
    if (platform !== 'text' && !url.trim()) {
      alert('请输入视频链接或 BV 号！');
      return;
    }

    onStartAnalysis({
      sourceUrl: url || (platform === 'text' ? '本地文稿导入' : 'https://...'),
      platform,
      mode,
      transcript: transcriptText,
      title: customTitle || (platform === 'bilibili' ? 'B站技术视频' : '技术讲座与深度研读'),
      author: customAuthor || '资深专家'
    });
  };

  const setSampleUrl = (sampleUrl: string, samplePlat: 'bilibili' | 'youtube' | 'x') => {
    setPlatform(samplePlat);
    setUrl(sampleUrl);
  };

  return (
    <div className="w-full pt-8 pb-12">
      {/* Hero Badge & Heading */}
      <div className="text-center max-w-3xl mx-auto space-y-4 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 text-brand-400" />
          <span>跨平台视频逆向学习与双轨知识沉淀引擎</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          将技术视频秒变为 <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400">
            高保真架构级知识库
          </span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          摒弃无意义的口语化堆砌。支持 B站、YouTube、X 与本地音视频：
          <span className="text-slate-200 font-medium">【六段式深度研读】</span>沉淀架构时序与避坑自检，
          <span className="text-slate-200 font-medium">【原貌切片复刻】</span>留存不可篡改的一手事实字轨。
        </p>
      </div>

      {/* Main Analyzer Card */}
      <div className="mt-8 max-w-4xl mx-auto px-4">
        <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-500" />

          {/* Platform Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-slate-800/80">
            <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-brand-400" /> 数据来源:
            </span>
            {[
              { id: 'bilibili', label: 'Bilibili 哔哩哔哩', icon: '📺' },
              { id: 'youtube', label: 'YouTube', icon: '▶️' },
              { id: 'x', label: 'X (Twitter)', icon: '𝕏' },
              { id: 'text', label: '字幕/逐字稿直接导入', icon: '📝' }
            ].map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlatform(p.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  platform === p.id
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/60'
                }`}
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {platform !== 'text' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {platform === 'bilibili' && 'B站视频链接或 BV 号（内置免登录官方与 AI 字幕极速抓取）'}
                  {platform === 'youtube' && 'YouTube 视频完整链接'}
                  {platform === 'x' && 'X (Twitter) 包含演讲视频的推文链接'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder={
                      platform === 'bilibili'
                        ? '例如：https://www.bilibili.com/video/BV1xx411c7mD 或直接输入 BV 号'
                        : platform === 'youtube'
                        ? '例如：https://www.youtube.com/watch?v=...'
                        : '例如：https://x.com/leerob/status/2108650243365736855'
                    }
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all font-mono"
                  />
                  {url && (
                    <button
                      type="button"
                      onClick={() => setUrl('')}
                      className="absolute right-3 top-3.5 text-xs text-slate-500 hover:text-slate-300 px-2 py-0.5 rounded bg-slate-800"
                    >
                      清空
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  粘贴带时间戳的文稿、VTT / SRT 格式字幕或纯语音转文字文本
                </label>
                <textarea
                  rows={5}
                  value={transcriptText}
                  onChange={e => setTranscriptText(e.target.value)}
                  placeholder={`[00:00] 各位同学好，今天我们深入解析分布式事务...\n[04:15] 很多架构师认为横向扩容就能解决问题，实际上底层行锁才是瓶颈...\n[12:30] 接下来我们看这张 Canal 监听 binlog 的架构拓扑图...`}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all font-mono leading-relaxed"
                />
              </div>
            )}

            {/* Mode Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2.5 flex items-center justify-between">
                <span>生成模式选择 (Output Mode)</span>
                <span className="text-[11px] text-brand-400 font-normal">支持一键切换并适配 Obsidian / Notion</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Mode B */}
                <div
                  onClick={() => setMode('mode_b')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    mode === 'mode_b'
                      ? 'bg-brand-950/40 border-brand-500 ring-1 ring-brand-500 text-white'
                      : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-brand-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" /> 模式 B：六段式深度研读
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 font-semibold">推荐</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Mermaid 推进轴、架构时序图、底层动机、工业高危盲区反模式表、落地配置代码与 Pre-flight 检查清单。
                  </p>
                </div>

                {/* Mode A */}
                <div
                  onClick={() => setMode('mode_a')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    mode === 'mode_a'
                      ? 'bg-brand-950/40 border-brand-500 ring-1 ring-brand-500 text-white'
                      : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> 模式 A：高保真原貌切片
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold">一手事实</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    零主观加工、按语义毫秒级切分结构化时间片，文末附加完整带时间戳逐字稿，供全库模糊检索。
                  </p>
                </div>

                {/* Mode C */}
                <div
                  onClick={() => setMode('mode_c')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    mode === 'mode_c'
                      ? 'bg-brand-950/40 border-brand-500 ring-1 ring-brand-500 text-white'
                      : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> 模式 C：智能双轨融合
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">双全其美</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    正文呈现高密度六段式研读方案，文末以可交互折叠卡片形式无缝嵌入全量时间轴原貌字轨。
                  </p>
                </div>
              </div>
            </div>

            {/* Advanced Metadata Settings Toggle */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-slate-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{showAdvanced ? '收起自定义元数据' : '展开自定义元数据 (视频标题/讲师姓名)'}</span>
              </button>

              {showAdvanced && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">自定义视频/文章标题</label>
                    <input
                      type="text"
                      value={customTitle}
                      onChange={e => setCustomTitle(e.target.value)}
                      placeholder="自动提取或手动指定"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">主讲人 / 组织机构</label>
                    <input
                      type="text"
                      value={customAuthor}
                      onChange={e => setCustomAuthor(e.target.value)}
                      placeholder="例如：Lee Robinson / SpaceX"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Action Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span>快速体验经典案例:</span>
                <button
                  type="button"
                  onClick={() => onSelectShowcase('stanford-cs146s')}
                  className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-brand-300 transition-colors"
                >
                  🎓 斯坦福 CS146S (42张幻灯片)
                </button>
                <button
                  type="button"
                  onClick={() => onSelectShowcase('distributed-systems')}
                  className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-indigo-300 transition-colors"
                >
                  ⚡ B站高并发演进
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>智能分析中...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-brand-200 group-hover:scale-110 transition-transform" />
                    <span>立即开始深度分析</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
