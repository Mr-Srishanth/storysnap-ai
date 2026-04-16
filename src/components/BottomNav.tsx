import { NavLink } from "react-router-dom";
import { Home, Sparkles, Compass, Clock, Heart } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/create", label: "Create", icon: Sparkles },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/history", label: "History", icon: Clock },
  { to: "/saved", label: "Saved", icon: Heart },
];

export function BottomNav() {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border">
      <div className="flex justify-around items-center h-16 px-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl min-w-[52px] transition-all duration-200 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? "bg-primary/10" : ""}`}>
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
