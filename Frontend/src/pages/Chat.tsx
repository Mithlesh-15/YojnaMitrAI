import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import type { KeyboardEvent } from "react";
import NavBar from "../components/Navbar";
import Sidebar from "../components/SideBar";
import SchemeDetailModal from "../components/SchemeDetailModal";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { closeSidebar } from "../store/sidebarSlice";
import api from "../api/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Scheme {
  id: string;
  title: string;
  description: string;
  category: string;
  state: string;
  eligibility?: string;
  applyLink?: string;
  benefits?: string;
  documentsRequired?: string;
  lastDate?: string;
  ministry?: string;
}

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  results?: Scheme[];
  timestamp: Date;
}

interface Suggestion {
  label: string;
  query: string;
  emoji: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconSend: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const IconSparkle: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
    <path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" />
    <path d="M19 3l.9 2.7L22 7l-2.1.3L19 10l-.9-2.7L16 7l2.1-.3z" />
  </svg>
);

const IconExternalLink: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const SUGGESTIONS: Suggestion[] = [
  { label: "Scholarships", query: "What scholarship schemes are available for students?", emoji: "📚" },
  { label: "Farmer Schemes", query: "Tell me about schemes for farmers", emoji: "🌾" },
  { label: "Housing Schemes", query: "What housing schemes can I apply for?", emoji: "🏠" },
  { label: "Health Benefits", query: "What healthcare schemes am I eligible for?", emoji: "🏥" },
  { label: "Women Welfare", query: "What schemes are available for women?", emoji: "👩" },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "init-1",
    role: "bot",
    text: "Namaste! 🙏 I'm **YojnaMitrAI**, your personal guide to government schemes across India.\n\nTell me about yourself — your age, occupation, income, and state — and I'll instantly match you with schemes you actually qualify for.\n\nOr pick a quick topic below to get started!",
    timestamp: new Date(),
  },
];

// ─── Category badge colors ────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Education:   { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/30" },
  student:     { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/30" },
  Agriculture: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  farmer:      { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  Housing:     { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/30" },
  Health:      { bg: "bg-rose-500/10",    text: "text-rose-400",    border: "border-rose-500/30" },
  Women:       { bg: "bg-pink-500/10",    text: "text-pink-400",    border: "border-pink-500/30" },
  Finance:     { bg: "bg-violet-500/10",  text: "text-violet-400",  border: "border-violet-500/30" },
  Employment:  { bg: "bg-cyan-500/10",    text: "text-cyan-400",    border: "border-cyan-500/30" },
};

const fallbackColors = { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/30" };

// ─── Helper: Format message text (bold + newlines) ────────────────────────────

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <React.Fragment key={i}>
            {parts.map((part, j) =>
              j % 2 === 1 ? (
                <strong key={j} className="font-semibold">
                  {part}
                </strong>
              ) : (
                <span key={j}>{part}</span>
              )
            )}
            {i < lines.length - 1 && <br />}
          </React.Fragment>
        );
      })}
    </>
  );
};

// ─── SchemeCard (inline in chat) ──────────────────────────────────────────────

interface SchemeCardProps {
  scheme: Scheme;
  onClick?: (scheme: Scheme) => void;
}

const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, onClick }) => {
  const colors = CATEGORY_COLORS[scheme.category] ?? fallbackColors;

  return (
    <div
      className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3.5 transition-all duration-200 hover:border-blue-500/40 hover:bg-slate-800/80 group cursor-pointer"
      onClick={() => onClick?.(scheme)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick?.(scheme); }}
    >
      {/* Title */}
      <h4 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-blue-300 transition-colors">
        {scheme.title}
      </h4>

      {/* Description */}
      <p className="text-xs text-slate-400 leading-relaxed mt-1.5 line-clamp-2">
        {scheme.description}
      </p>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mt-2.5">
        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium ${colors.bg} ${colors.text} ${colors.border}`}>
          {scheme.category}
        </span>
        <span className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
          📍 {scheme.state}
        </span>
      </div>

      {/* View details hint */}
      <p className="text-[10px] text-slate-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        Click to view details →
      </p>

      {/* Apply button */}
      {scheme.applyLink && (
        <a
          href={scheme.applyLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-2 flex items-center justify-center gap-1.5 w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-900/30"
        >
          Apply Now
          <IconExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface MessageBubbleProps {
  message: Message;
  onSchemeClick?: (scheme: Scheme) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onSchemeClick }) => {
  const isUser = message.role === "user";
  const time = message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className={`flex items-end gap-2.5 animate-fadeIn ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 mb-1 shadow-lg shadow-blue-900/30">
          <IconSparkle className="w-4 h-4 text-white" />
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md
            ${isUser
              ? "bg-blue-600 text-white rounded-br-sm shadow-blue-900/30"
              : "bg-slate-800/80 text-slate-100 rounded-bl-sm border border-slate-700/60 backdrop-blur-sm"
            }`}
        >
          <FormattedText text={message.text} />
        </div>

        {/* Scheme results inside chat */}
        {!isUser && message.results && message.results.length > 0 && (
          <div className="w-full mt-2 space-y-2">
            <p className="text-[11px] text-slate-500 font-medium px-1">
              🎯 {message.results.length} scheme{message.results.length > 1 ? "s" : ""} found
            </p>
            <div className="space-y-2">
              {message.results.map((scheme) => (
                <SchemeCard key={scheme.id} scheme={scheme} onClick={onSchemeClick} />
              ))}
            </div>
          </div>
        )}

        <span className="text-xs text-slate-600 px-1">{time}</span>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-linear-to-br from-slate-600 to-slate-700 flex items-center justify-center shrink-0 mb-1 border border-slate-600/50 text-xs font-bold text-slate-300">
          U
        </div>
      )}
    </div>
  );
};

const TypingIndicator: React.FC = () => (
  <div className="flex items-end gap-2.5 animate-fadeIn">
    <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/30">
      <IconSparkle className="w-4 h-4 text-white" />
    </div>
    <div className="bg-slate-800/80 border border-slate-700/60 backdrop-blur-sm px-4 py-3.5 rounded-2xl rounded-bl-sm shadow-md">
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
        <span className="text-xs text-slate-400 ml-2 font-medium">Thinking…</span>
      </div>
    </div>
  </div>
);

// ─── Main Chat Component ──────────────────────────────────────────────────────

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeNav, setActiveNav] = useState("chat");
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.sidebar.sidebarOpen);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isTyping) return;

      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: "user",
        text: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);
      setShowSuggestions(false);

      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = "24px";
      }

      try {
        const { data } = await api.post("/api/ai/query", {
          query: text.trim(),
        });

        const botMsg: Message = {
          id: `b-${Date.now()}`,
          role: "bot",
          text: data.message || "Here's what I found for you:",
          results: data.results ?? [],
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMsg]);
      } catch (error) {
        console.error("AI query failed:", error);

        const errorMsg: Message = {
          id: `e-${Date.now()}`,
          role: "bot",
          text: "Sorry, I'm having trouble connecting right now. Please try again in a moment. 🙏",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsTyping(false);
      }
    },
    [isTyping]
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleSchemeClick = async (scheme: Scheme) => {
    // Open modal immediately with partial data
    setSelectedScheme(scheme);
    setIsModalOpen(true);
    setLoadingDetails(true);

    try {
      const response = await api.get(`/api/schemes/${scheme.id}`);
      if (response.data.success) {
        setSelectedScheme(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch full scheme details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-blue-700/8 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-indigo-700/6 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Sidebar */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        isOpen={sidebarOpen}
        onClose={() => dispatch(closeSidebar())}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col flex-1 min-w-0">
        {/* Top bar */}
        <NavBar />

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-5 scroll-smooth">
          <div className="max-w-2xl mx-auto space-y-5 pb-2">
            {messages.map((msg: Message) => (
              <MessageBubble key={msg.id} message={msg} onSchemeClick={handleSchemeClick} />
            ))}

            {isTyping && <TypingIndicator />}

            {/* Suggestions — show only initially */}
            {showSuggestions && !isTyping && (
              <div className="animate-fadeIn">
                <p className="text-xs text-slate-500 font-medium mb-3 px-1">
                  Quick topics to explore
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => sendMessage(s.query)}
                      className="flex items-center gap-1.5 bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60 hover:border-blue-500/40 text-slate-300 hover:text-white text-xs font-medium px-3.5 py-2 rounded-xl transition-all duration-200 hover:-translate-y-0.5 backdrop-blur-sm"
                    >
                      <span>{s.emoji}</span>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="shrink-0 px-4 md:px-8 py-4 border-t border-slate-800/60 bg-slate-950/80 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto">
            {/* Re-show suggestions when chat is active */}
            {!showSuggestions && messages.length > 1 && !isTyping && (
              <div className="flex flex-wrap gap-2 mb-3">
                {SUGGESTIONS.slice(0, 3).map((s) => (
                  <button
                    key={s.label}
                    onClick={() => sendMessage(s.query)}
                    className="flex items-center gap-1 bg-slate-800/50 hover:bg-slate-700/60 border border-slate-700/50 text-slate-400 hover:text-white text-xs px-3 py-1.5 rounded-lg transition-all duration-150"
                  >
                    <span className="text-sm">{s.emoji}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-end gap-3 bg-slate-800/60 border border-slate-700/60 hover:border-slate-600/80 focus-within:border-blue-500/60 rounded-2xl px-4 py-3 transition-all duration-200 backdrop-blur-sm shadow-xl shadow-black/20">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Ask about government schemes..."
                rows={1}
                disabled={isTyping}
                className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm resize-none outline-none leading-relaxed min-h-6 max-h-35 disabled:opacity-50 font-sans"
                style={{ height: "24px" }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
                className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
                  ${input.trim() && !isTyping
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40 hover:scale-105 active:scale-95"
                    : "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                  }`}
              >
                <IconSend className="w-4 h-4" />
              </button>
            </div>
            <p className="text-center text-xs text-slate-600 mt-2">
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>

      {/* Scheme detail modal */}
      {isModalOpen && selectedScheme && (
        <SchemeDetailModal
          scheme={selectedScheme}
          loading={loadingDetails}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Custom animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.28s ease-out both;
        }
        .font-display {
          font-family: 'Sora', 'DM Sans', system-ui, sans-serif;
        }
      `}
      </style>
    </div>
  );
};

export default Chat;
