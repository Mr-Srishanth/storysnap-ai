import { NavLink } from "react-router-dom";
import { BookOpen, Sparkles, Compass, Clock, Heart } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: BookOpen },
  { to: "/create", label: "Create", icon: Sparkles },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/history", label: "History", icon: Clock },
  { to: "/saved", label: "Saved", icon: Heart },
];

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 sm:px-10 py-4 max-w-7xl mx-auto">
      <NavLink to="/" className="flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-primary" />
        <span className="font-heading font-extrabold text-lg text-primary">StorySnap AI</span>
      </NavLink>
      <div className="hidden sm:flex items-center gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "text-primary bg-primary/10 font-semibold"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
