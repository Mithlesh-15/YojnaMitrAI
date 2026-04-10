import Sidebar from "../components/SideBar";
import NavBar from "../components/Navbar";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { closeSidebar } from "../store/sidebarSlice";
import YojnaCard from "../components/YojnaCard";

function Saved() {
  const [activeNav, setActiveNav] = useState("saved");
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.sidebar.sidebarOpen);
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
        <YojnaCard
          id="1"
          title="PM Yashasvi Yojana"
          description="Scholarship for OBC students..."
          category="Education" // badge ka color isse decide hota hai
          state="All India"
          eligibility="OBC/EBC students, income below ₹2.5L"
          ministry="Ministry of Social Justice" // optional
          benefit="Up to ₹1.25L/year" // optional — green box
          ageRequirement="13-17 years" // optional — "More details" mein
          qualification="60% marks required" // optional — "More details" mein
          deadline="Dec 31" // optional — red badge
          applyLink="https://scholarships.gov.in" // optional
          isSaved={false} // optional
          onSave={(id, saved) => console.log(id, saved)}
          onApply={(id) => console.log(id)}
        />
        <YojnaCard
          id="1"
          title="PM Yashasvi Yojana"
          description="Scholarship for OBC students..."
          category="Education" // badge ka color isse decide hota hai
          state="All India"
          eligibility="OBC/EBC students, income below ₹2.5L"
          ministry="Ministry of Social Justice" // optional
          benefit="Up to ₹1.25L/year" // optional — green box
          ageRequirement="13-17 years" // optional — "More details" mein
          qualification="60% marks required" // optional — "More details" mein
          deadline="Dec 31" // optional — red badge
          applyLink="https://scholarships.gov.in" // optional
          isSaved={false} // optional
          onSave={(id, saved) => console.log(id, saved)}
          onApply={(id) => console.log(id)}
        />
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
}

export default Saved;
