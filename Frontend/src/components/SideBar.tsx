const IconSparkle: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
    <path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" />
    <path d="M19 3l.9 2.7L22 7l-2.1.3L19 10l-.9-2.7L16 7l2.1-.3z" />
  </svg>
);

const IconClose: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconChat: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

const IconBookmark: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </svg>
);

interface SidebarProps {
  activeNav: string;
  setActiveNav: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "chat", label: "Chat", icon: <IconChat className="w-5 h-5" /> },
  { id: "saved", label: "Saved", icon: <IconBookmark className="w-5 h-5" /> },
];

const Sidebar: React.FC<SidebarProps> = ({ activeNav, setActiveNav, isOpen, onClose }) => (
  <>
    {/* Mobile overlay */}
    {isOpen && (
      <div
        className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm"
        onClick={onClose}
      />
    )}
    <aside
      className={`fixed md:static top-0 left-0 h-full w-64 z-30 flex flex-col
        bg-slate-950/95 md:bg-transparent border-r border-slate-800/60
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
            <IconSparkle className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-base tracking-tight font-display">
            YojnaMitr<span className="text-blue-400">AI</span>
          </span>
        </div>
        <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white transition-colors">
          <IconClose className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => { setActiveNav(item.id); onClose(); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${activeNav === item.id
                ? "bg-blue-600/20 text-blue-300 border border-blue-500/25"
                : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
          >
            {item.icon}
            {item.label}
            {item.id === "chat" && (
              <span className="ml-auto w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-800/60">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500/30 to-indigo-500/30 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-300">
            U
          </div>
          <div>
            <p className="text-xs font-medium text-white">User</p>
            <p className="text-xs text-slate-500">Free Plan</p>
          </div>
        </div>
      </div>
    </aside>
  </>
);
export default Sidebar;