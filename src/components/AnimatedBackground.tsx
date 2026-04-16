export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Animated gradient */}
      <div className="absolute inset-0 bg-gradient-animated opacity-30" />

      {/* Floating blobs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-primary/8 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-secondary/8 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-2/3 left-1/3 w-56 h-56 rounded-full bg-accent/6 blur-3xl animate-float" style={{ animationDelay: "4s" }} />
    </div>
  );
}
