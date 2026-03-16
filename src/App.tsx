/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  Copy, 
  Check, 
  Code, 
  FileText, 
  RefreshCw,
  Layout,
  Tag,
  Zap,
  Heart
} from 'lucide-react';
import Markdown from 'react-markdown';
import { generateProductDescriptions, ProductInput, GeneratedDescription } from './services/gemini';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [input, setInput] = useState<ProductInput>({
    name: '',
    features: '',
    benefits: '',
    keywords: '',
    tone: 'Chuyên nghiệp'
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GeneratedDescription[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'markdown' | 'html'>('markdown');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.name) return;
    
    setLoading(true);
    try {
      const descriptions = await generateProductDescriptions(input);
      setResults(descriptions);
    } catch (error) {
      alert('Có lỗi xảy ra khi tạo mô tả. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <ShoppingBag className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight">E-com AI</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Product Copywriter</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-slate-600">
            <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-amber-500" /> AI Powered</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-indigo-500" /> Fast Generation</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Form */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Layout className="w-5 h-5 text-indigo-600" />
                Thông tin sản phẩm
              </h2>
              
              <form onSubmit={handleGenerate} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tên sản phẩm *</label>
                  <input 
                    required
                    type="text"
                    placeholder="Ví dụ: Tai nghe Bluetooth Sony WH-1000XM5"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    value={input.name}
                    onChange={e => setInput({...input, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tính năng chính</label>
                  <textarea 
                    rows={3}
                    placeholder="Chống ồn chủ động, Pin 30h, Sạc nhanh..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                    value={input.features}
                    onChange={e => setInput({...input, features: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Lợi ích cho khách hàng</label>
                  <textarea 
                    rows={3}
                    placeholder="Trải nghiệm âm nhạc không gián đoạn, thoải mái đeo cả ngày..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                    value={input.benefits}
                    onChange={e => setInput({...input, benefits: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Tag className="w-4 h-4" /> Từ khóa SEO
                  </label>
                  <input 
                    type="text"
                    placeholder="tai nghe chống ồn, sony wh-1000xm5, tai nghe bluetooth"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    value={input.keywords}
                    onChange={e => setInput({...input, keywords: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tông giọng</label>
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                    value={input.tone}
                    onChange={e => setInput({...input, tone: e.target.value})}
                  >
                    <option>Chuyên nghiệp</option>
                    <option>Thân thiện</option>
                    <option>Hào hứng</option>
                    <option>Sang trọng</option>
                    <option>Ngắn gọn</option>
                  </select>
                </div>

                <button 
                  disabled={loading || !input.name}
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Tạo mô tả ngay
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {results.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-slate-800">Kết quả gợi ý</h3>
                    <div className="flex bg-slate-200 p-1 rounded-lg">
                      <button 
                        onClick={() => setViewMode('markdown')}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${viewMode === 'markdown' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600'}`}
                      >
                        <FileText className="w-3.5 h-3.5" /> Markdown
                      </button>
                      <button 
                        onClick={() => setViewMode('html')}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${viewMode === 'html' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600'}`}
                      >
                        <Code className="w-3.5 h-3.5" /> HTML
                      </button>
                    </div>
                  </div>

                  {results.map((res, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                    >
                      <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Phiên bản {res.version}</span>
                        <button 
                          onClick={() => copyToClipboard(viewMode === 'markdown' ? res.content : res.html, idx)}
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-bold flex items-center gap-1.5 transition-colors"
                        >
                          {copiedIndex === idx ? (
                            <><Check className="w-4 h-4" /> Đã sao chép</>
                          ) : (
                            <><Copy className="w-4 h-4" /> Sao chép</>
                          )}
                        </button>
                      </div>
                      <div className="p-6">
                        {viewMode === 'markdown' ? (
                          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-p:text-slate-600 prose-li:text-slate-600">
                            <Markdown>{res.content}</Markdown>
                          </div>
                        ) : (
                          <pre className="bg-slate-900 text-slate-300 p-4 rounded-xl text-sm overflow-x-auto font-mono leading-relaxed whitespace-pre-wrap">
                            {res.html}
                          </pre>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="h-[600px] flex flex-col items-center justify-center text-center px-8 border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                    <Sparkles className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Chưa có nội dung được tạo</h3>
                  <p className="text-slate-500 max-w-xs mx-auto">
                    Điền thông tin sản phẩm ở bên trái và nhấn nút tạo để bắt đầu sản xuất nội dung chuyên nghiệp.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="mt-20 py-12 border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-800">E-com AI</span>
          </div>
          <p className="text-sm text-slate-500 flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> for online sellers
          </p>
        </div>
      </footer>
    </div>
  );
}
