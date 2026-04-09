import { openSidebar } from "../store/sidebarSlice";
import { useAppDispatch } from "../store/hooks";

const IconMenu: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconSparkle: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
    <path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" />
    <path d="M19 3l.9 2.7L22 7l-2.1.3L19 10l-.9-2.7L16 7l2.1-.3z" />
  </svg>
);

const NavBar: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <header className="flex items-center gap-3 px-4 md:px-6 py-4 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-sm shrink-0">
      <button
        onClick={() => dispatch(openSidebar())}
        className="md:hidden text-slate-400 hover:text-white transition-colors"
      >
        <IconMenu className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2.5">
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/30">
            <IconSparkle className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white font-display">
            YojnaMitrAI
          </p>
          <p className="text-xs text-emerald-400 font-medium">
            Online · Ready to help
          </p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
        </div>
      </div>
    </header>
  );
};

export default NavBar;
