import { NavLink } from "react-router-dom";
import { Home, Sparkles, Compass, Heart } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/create", label: "Create", icon: Sparkles },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/saved", label: "Saved", icon: Heart },
];

export function BottomNav() {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t" style={{
      background: "hsl(var(--card) / 0.9)",
      borderColor: "hsl(var(--glass-border))",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
    }}>
      <div className="flex justify-around items-center h-16 px-2">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl min-w-[60px] transition-all duration-200 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? "bg-primary/15" : ""}`}>
                  <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : ""}`} />
                </div>
                <span className={`text-[10px] font-semibold ${isActive ? "text-primary" : ""}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
