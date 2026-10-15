import React, { useState, useEffect } from 'react';
import { X, Key, Cpu, Sparkles, Check, Globe } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [provider, setProvider] = useState<string>('local_rule');
  const [apiKey, setApiKey] = useState<string>('');
  const [baseUrl, setBaseUrl] = useState<string>('');
  const [modelName, setModelName] = useState<string>('');
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    const p = localStorage.getItem('v2k_provider') || 'local_rule';
    const k = localStorage.getItem('v2k_api_key') || '';
    const b = localStorage.getItem('v2k_base_url') || '';
    const m = localStorage.getItem('v2k_model_name') || '';
    setProvider(p);
    setApiKey(k);
    setBaseUrl(b);
    setModelName(m);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('v2k_provider', provider);
    localStorage.setItem('v2k_api_key', apiKey);
    localStorage.setItem('v2k_base_url', baseUrl);
    localStorage.setItem('v2k_model_name', modelName);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-slate-800 shadow-2xl space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">模型与推理引擎配置</h3>
            <p className="text-xs text-slate-400">配置在线长上下文大模型或使用内置本地引擎</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">推理提供商 (Provider)</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'local_rule', name: '内置启发式引擎', desc: '免 Key / 离线极速' },
                { id: 'deepseek', name: 'DeepSeek (深度求索)', desc: '高智力 / 极低成本' },
                { id: 'openai', name: 'OpenAI (GPT-4o)', desc: '工业级通用' },
                { id: 'claude', name: 'Anthropic Claude', desc: '超长上下文首选' },
                { id: 'gemini', name: 'Google Gemini', desc: '200万超大窗口' },
                { id: 'ollama', name: 'Ollama 本地大模型', desc: '私有化部署' }
              ].map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProvider(p.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    provider === p.id
                      ? 'bg-brand-950/60 border-brand-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold">{p.name}</div>
                  <div className="text-[10px] text-slate-500">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* API Key */}
          {provider !== 'local_rule' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-brand-400" />
                  <span>API Key</span>
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-brand-400" />
                  <span>自定义 API Base URL (可选)</span>
                </label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={e => setBaseUrl(e.target.value)}
                  placeholder="https://api.deepseek.com/v1 或留空使用默认"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500 font-mono"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white shadow-md shadow-brand-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>已保存</span>
              </>
            ) : (
              <span>保存配置</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
