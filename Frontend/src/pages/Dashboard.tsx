import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import type { KeyboardEvent } from "react";
import NavBar from "../components/Navbar";
import Sidebar from "../components/SideBar";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { closeSidebar } from "../store/sidebarSlice";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "user" | "ai";

interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
}

interface Suggestion {
  label: string;
  query: string;
  emoji: string;
}

// ─── Mock AI Responses ────────────────────────────────────────────────────────

const AI_RESPONSES: Record<string, string> = {
  default:
    "I can help you discover government schemes you're eligible for! Please share details like your age, occupation, income range, and state — and I'll match you with the most relevant schemes instantly.",
  scholarship:
    "📚 Here are key scholarship schemes you may qualify for:\n\n• **NSP (National Scholarship Portal)** — Central scholarships for SC/ST/OBC/Minority students up to ₹12,000/year\n• **PM Yashasvi Yojana** — For OBC/EWS students in Class 9–12, up to ₹1,25,000/year\n• **INSPIRE Scholarship** — For top science students, ₹80,000/year\n• **Pragati & Saksham (AICTE)** — For girl students & differently-abled in technical education\n\nWould you like eligibility details for any of these?",
  farmer:
    "🌾 Top schemes for farmers currently active:\n\n• **PM-KISAN** — ₹6,000/year direct income support, 3 instalments\n• **PM Fasal Bima Yojana** — Crop insurance at subsidised premiums\n• **KCC (Kisan Credit Card)** — Short-term credit up to ₹3 lakh at 4% interest\n• **eNAM** — Online trading of agricultural produce\n• **Soil Health Card Scheme** — Free soil testing & recommendations\n\nShall I help you apply for any of these?",
  housing:
    "🏠 Housing schemes available:\n\n• **PMAY-Urban (Gramin)** — Subsidy up to ₹2.67 lakh for first-time home buyers\n• **PMAY-G** — Free housing for Below Poverty Line rural families\n• **DAY-NULM** — Urban livelihood & shelter for homeless\n\nYour eligibility depends on income group (EWS/LIG/MIG). Want me to check for your category?",
  health:
    "🏥 Healthcare schemes to explore:\n\n• **Ayushman Bharat PM-JAY** — Free hospitalisation up to ₹5 lakh/year for eligible families\n• **CGHS** — Central Government Health Scheme for government employees\n• **JSSK** — Free services for pregnant women & sick newborns\n• **Rashtriya Swasthya Bima Yojana** — BPL family health cover\n\nDo you know your Ayushman Bharat eligibility? I can help you check.",
  women:
    "👩 Schemes specifically for women:\n\n• **Ujjwala Yojana** — Free LPG connection for BPL families\n• **Sukanya Samriddhi Yojana** — Tax-free savings scheme for girl child\n• **Beti Bachao Beti Padhao** — Education & welfare of girl child\n• **PM Matru Vandana Yojana** — ₹5,000 maternity benefit for first child\n• **Stand-Up India** — Loans ₹10L–₹1Cr for women entrepreneurs\n\nWould you like more details on any scheme?",
};

function getMockResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("scholar") || lower.includes("education") || lower.includes("study"))
    return AI_RESPONSES.scholarship;
  if (lower.includes("farm") || lower.includes("kisan") || lower.includes("agriculture") || lower.includes("crop"))
    return AI_RESPONSES.farmer;
  if (lower.includes("house") || lower.includes("home") || lower.includes("housing") || lower.includes("pmay"))
    return AI_RESPONSES.housing;
  if (lower.includes("health") || lower.includes("hospital") || lower.includes("medical") || lower.includes("ayushman"))
    return AI_RESPONSES.health;
  if (lower.includes("women") || lower.includes("girl") || lower.includes("mahila") || lower.includes("maternity"))
    return AI_RESPONSES.women;
  return AI_RESPONSES.default;
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
    role: "ai",
    text: "Namaste! 🙏 I'm **YojnaMitrAI**, your personal guide to government schemes across India.\n\nTell me about yourself — your age, occupation, income, and state — and I'll instantly match you with schemes you actually qualify for.\n\nOr pick a quick topic below to get started!",
    timestamp: new Date(),
  },
];

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

// ─── Sub-components ───────────────────────────────────────────────────────────

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
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
        <span className="text-xs text-slate-400 ml-2 font-medium">AI is typing</span>
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

      // Simulate AI thinking delay (1–2.5s)
      const delay = 1000 + Math.random() * 1500;
      await new Promise((r) => setTimeout(r, delay));

      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        role: "ai",
        text: getMockResponse(text),
        timestamp: new Date(),
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, aiMsg]);
    },
    [isTyping]
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
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
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
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
      `}</style>
    </div>
  );
};

export default Chat;
