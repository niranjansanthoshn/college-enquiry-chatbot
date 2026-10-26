import { useState, useRef, useEffect } from 'react';
import {
  Send,
  RotateCcw,
  Sparkles,
  Bot,
  User as UserIcon,
  HelpCircle,
  Copy,
  Check,
  ChevronRight,
  Info,
  Clock,
  History,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Chatbot() {
  const {
    messages,
    isTyping,
    error,
    suggestedQuestions,
    sendMessage,
    clearConversation,
    loadConversation,
    inputDraft,
    setInputDraft
  } = useChat();

  const { isAuthenticated } = useAuth();
  const [inputText, setInputText] = useState(inputDraft || '');
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Sync draft if prefilled
  useEffect(() => {
    if (inputDraft) {
      setInputText(inputDraft);
      setInputDraft('');
      inputRef.current?.focus();
    }
  }, [inputDraft, setInputDraft]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Fetch past conversation history if authenticated
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/chat/history');
        if (res.data.success) {
          setHistoryList(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load past history:', err);
      }
    };
    if (isAuthenticated) {
      fetchHistory();
    }
  }, [isAuthenticated, messages.length]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isTyping) return;
    sendMessage(inputText);
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedClick = (question) => {
    sendMessage(question);
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-65px)] bg-slate-50 dark:bg-slate-950">
      
      {/* Sidebar for Past Conversations (Authenticated Students) */}
      {isAuthenticated && (
        <aside
          className={`fixed inset-y-16 left-0 z-40 w-72 transform border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out md:static md:translate-x-0 dark:border-slate-800 dark:bg-slate-900 ${
            historyOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white">
                <History className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                <span>Chat History</span>
              </div>
              <button
                onClick={clearConversation}
                title="Start New Chat"
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 flex-1 overflow-y-auto space-y-1.5 pr-1">
              {historyList.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No previous saved chats found. Start asking questions!
                </div>
              ) : (
                historyList.map((item) => (
                  <button
                    key={item._id}
                    onClick={() => {
                      loadConversation(item._id);
                      setHistoryOpen(false);
                    }}
                    className="w-full text-left rounded-lg p-2.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400">
                      {item.title}
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{item.category || 'General'}</span>
                      <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400">
              Student inquiries are securely saved to your account.
            </div>
          </div>
        </aside>
      )}

      {/* Main Chat Area */}
      <main className="flex flex-1 flex-col overflow-hidden">
        
        {/* Chat Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 sm:px-6">
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"
                aria-label="Toggle History"
              >
                <History className="h-4 w-4" />
              </button>
            )}
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white shadow-md">
                <Bot className="h-5 w-5" />
              </div>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900"></span>
            </div>
            <div>
              <h2 className="font-heading text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Apex AI Assistant
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Online
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ground truth from verified institutional database
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="clear-chat-btn"
              onClick={clearConversation}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 space-y-6">
          
          {/* Welcome Announcement / Suggested Prompts */}
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-brand-100 bg-gradient-to-r from-brand-50/70 to-blue-50/70 p-4 text-xs text-slate-700 shadow-sm dark:border-brand-950 dark:from-brand-950/30 dark:to-slate-900 dark:text-slate-300 mb-6">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-brand-600 shrink-0 mt-0.5 dark:text-brand-400" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white mb-1">
                    Welcome to the 24/7 AI Admissions & Enquiry Cell!
                  </p>
                  <p className="leading-relaxed">
                    You can ask questions regarding courses, eligibility, fees, scholarships, hostel amenities, or placement statistics. Click any suggested topic below or type your inquiry directly.
                  </p>
                </div>
              </div>

              {/* 8 Suggested Questions Pills */}
              <div className="mt-4 pt-3 border-t border-brand-200/60 dark:border-brand-900/60">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
                  <HelpCircle className="h-3 w-3" />
                  Suggested Questions:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      id={`suggested-q-${idx}`}
                      onClick={() => handleSuggestedClick(q)}
                      className="rounded-lg bg-white/90 border border-brand-200 px-2.5 py-1 text-[11px] font-medium text-brand-700 hover:bg-brand-600 hover:text-white dark:bg-slate-800 dark:border-slate-700 dark:text-brand-300 dark:hover:bg-brand-600 dark:hover:text-white transition-all shadow-sm cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Render Messages */}
            <div className="space-y-5">
              {messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs shadow-sm ${
                        isUser
                          ? 'bg-slate-800 text-white dark:bg-slate-700'
                          : 'bg-brand-600 text-white'
                      }`}
                    >
                      {isUser ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>

                    {/* Bubble Content */}
                    <div className={`max-w-[85%] sm:max-w-[75%] space-y-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed chat-message-bubble ${
                          isUser
                            ? 'bg-brand-600 text-white rounded-tr-none'
                            : msg.isError
                            ? 'bg-red-50 text-red-700 border border-red-200 rounded-tl-none dark:bg-red-950/40 dark:text-red-300 dark:border-red-900'
                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800'
                        }`}
                      >
                        {/* Display message content preserving formatting/lines */}
                        <div className="whitespace-pre-line">{msg.content}</div>

                        {/* Demo Mode / Grounded Knowledge Notice Badge */}
                        {!isUser && msg.isDemoMode && (
                          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1.5">
                            <Info className="h-3.5 w-3.5 shrink-0" />
                            <span>💡 Grounded in Verified Database Records (Demo Mode)</span>
                          </div>
                        )}

                        {/* Verified Sources list if available */}
                        {!isUser && msg.sources && msg.sources.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                              Verified Sources:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {msg.sources.map((src, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                >
                                  ✓ {src}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Bubble Footer (Timestamp & Copy Action) */}
                      <div className={`flex items-center gap-2 px-1 text-[10px] text-slate-400 ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <span>
                          {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                        {!isUser && !msg.isError && (
                          <button
                            onClick={() => copyToClipboard(msg.content, index)}
                            title="Copy Response"
                            className="hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-0.5"
                          >
                            {copiedIdx === index ? (
                              <Check className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-start gap-3 animate-fade-in">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl rounded-tl-none border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-brand-500 animate-bounce"></span>
                      <span className="h-2 w-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]"></span>
                      <span className="h-2 w-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.4s]"></span>
                      <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">Consulting college database...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

        </div>

        {/* Input Bar Form */}
        <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <form onSubmit={handleSend} className="mx-auto max-w-3xl flex items-center gap-2">
            <input
              id="chat-input-field"
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about courses, fees, admissions, hostel..."
              disabled={isTyping}
              className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-brand-400 transition-all disabled:opacity-50"
            />
            <button
              id="chat-send-btn"
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-500/20 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <div className="mx-auto max-w-3xl mt-2 text-center text-[11px] text-slate-400">
            Official AIST Admissions Assistant • Powered by RAG with Verified Institutional Knowledge
          </div>
        </div>

      </main>

    </div>
  );
}
