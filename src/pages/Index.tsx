import { useState, useRef } from "react";
import { History, Mic, MicOff, BookOpen, Compass, Heart, Info, Search } from "lucide-react";
import { StoryOutput } from "@/components/StoryOutput";
import { HistorySidebar } from "@/components/HistorySidebar";
import { ProgressBar } from "@/components/ProgressBar";
import { useStoryHistory } from "@/hooks/useStoryHistory";
import { useProgress } from "@/hooks/useProgress";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { generateStory, generateSimplerVersion, suggestedTopics, type StoryStyle, type ExplainLevel, type Language, type GeneratedStory } from "@/lib/storyEngine";
import heroBook from "@/assets/hero-book.png";

const styles: { value: StoryStyle; label: string }[] = [
  { value: "story", label: "Story 📖" },
  { value: "funny", label: "Funny 😂" },
  { value: "cinematic", label: "Cinematic 🎬" },
  { value: "teacher", label: "Teacher 👨‍🏫" },
];

const levels: { value: ExplainLevel; label: string; icon: string }[] = [
  { value: "child", label: "ELI5", icon: "👶" },
  { value: "student", label: "Student", icon: "🎓" },
  { value: "developer", label: "Advanced", icon: "🧠" },
];

const languages: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी" },
  { value: "te", label: "తెలుగు" },
];

function getRandomTopics(n: number) {
  const shuffled = [...suggestedTopics].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export default function Index() {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState<StoryStyle>("story");
  const [level, setLevel] = useState<ExplainLevel>("student");
  const [lang, setLang] = useState<Language>("en");
  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [loading, setLoading] = useState(false);
  const [followUp, setFollowUp] = useState("");
  const [suggested] = useState(() => getRandomTopics(6));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const { history, addEntry, removeEntry, clearHistory } = useStoryHistory();
  const { progress, recordTopic, toggleSave, isSaved } = useProgress();
  const voice = useVoiceInput(lang);

  const handleGenerate = (overrideTopic?: string) => {
    const t = (overrideTopic || topic).trim();
    if (!t || loading) return;
    if (overrideTopic) setTopic(overrideTopic);
    setLoading(true);
    setStory(null);
    setFollowUp("");

    setTimeout(() => {
      const result = generateStory(t, style, level, lang);
      setStory(result);
      addEntry(t, style, level, result);
      recordTopic();
      setLoading(false);
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 800);
  };

  const handleSimpler = () => {
    if (!story || loading) return;
    setLoading(true);
    setTimeout(() => {
      const result = generateSimplerVersion(story, topic.trim(), lang);
      setStory(result);
      addEntry(topic.trim(), "funny", "child", result);
      setLoading(false);
    }, 600);
  };

  const handleFollowUp = () => {
    if (!followUp.trim() || loading) return;
    const combined = `${topic.trim()} — specifically: ${followUp.trim()}`;
    setFollowUp("");
    handleGenerate(combined);
  };

  const handleSelectHistory = (entry: typeof history[0]) => {
    setTopic(entry.topic);
    setStyle(entry.style);
    setLevel(entry.level);
    setStory(entry.story);
    setTimeout(() => {
      outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleMic = () => {
    if (voice.listening) {
      voice.stopListening();
    } else {
      voice.startListening((text) => setTopic(text));
    }
  };

  return (
    <div className="min-h-screen animate-page-enter">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 sm:px-10 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          <span className="font-heading font-extrabold text-lg text-primary">Story Learning AI</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <BookOpen className="w-4 h-4" /> Home
          </button>
          <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <Compass className="w-4 h-4" /> Explore
          </button>
          <button onClick={() => setSidebarOpen(true)} className="flex items-center gap-1.5 hover:text-primary transition-colors relative">
            <Heart className="w-4 h-4" /> Saved
            {history.length > 0 && (
              <span className="absolute -top-1.5 -right-3 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                {history.length > 9 ? "9+" : history.length}
              </span>
            )}
          </button>
          <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <Info className="w-4 h-4" /> About
          </button>
        </div>
        {/* Mobile history button */}
        <button onClick={() => setSidebarOpen(true)} className="sm:hidden p-2 rounded-xl text-muted-foreground hover:text-primary transition-colors relative">
          <History className="w-5 h-5" />
          {history.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
              {history.length > 9 ? "9+" : history.length}
            </span>
          )}
        </button>
      </nav>

      {/* Hero Section — Split Layout */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 pt-8 pb-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left side */}
          <div className="flex-1 max-w-xl">
            <span className="badge-pill mb-4 inline-block">✨ AI-Powered Learning</span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-tight mb-4">
              Story Learning <span className="gradient-text">AI</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg mb-1">
              Turn hard topics into simple stories ✨
            </p>
            <p className="text-muted-foreground text-sm mb-8">
              Learn anything like a story 📖
            </p>

            {/* Input */}
            <div className="flex gap-2 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  placeholder="Type a topic... e.g., Gravity, Photosynthesis"
                  className="input-field !pl-11"
                />
              </div>
              {voice.isSupported && (
                <button
                  onClick={handleMic}
                  className={`p-3.5 rounded-[20px] border transition-all duration-200 shrink-0 ${
                    voice.listening
                      ? "border-red-400 bg-red-50 text-red-500 animate-pulse"
                      : "border-border text-muted-foreground hover:text-primary hover:border-primary/40"
                  }`}
                  title={voice.listening ? "Stop listening" : "Voice input"}
                >
                  {voice.listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}
            </div>

            {/* Level pills */}
            <div className="flex gap-2 mb-5">
              {levels.map((l) => (
                <button
                  key={l.value}
                  onClick={() => setLevel(l.value)}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    level === l.value ? "chip-active" : "chip"
                  }`}
                >
                  {l.icon} {l.label}
                </button>
              ))}
            </div>

            {/* Generate */}
            <button
              onClick={() => handleGenerate()}
              disabled={!topic.trim() || loading}
              className="btn-primary text-base py-3.5 px-10"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Generating<span className="loading-dots" />
                </span>
              ) : (
                "✨ Explain as Story"
              )}
            </button>
          </div>

          {/* Right side — Illustration */}
          <div className="flex-1 flex justify-center lg:justify-end max-w-md lg:max-w-lg">
            <img
              src={heroBook}
              alt="Magical storybook with characters"
              width={1024}
              height={1024}
              className="w-full max-w-sm lg:max-w-md animate-float select-none pointer-events-none"
            />
          </div>
        </div>
      </section>

      {/* Controls — below hero on wider screens */}
      <section className="max-w-2xl mx-auto px-6 sm:px-10 pb-6">
        {/* Progress */}
        <div className="mb-6">
          <ProgressBar
            streak={progress.streak}
            topicsLearned={progress.topicsLearned}
            dailyCount={progress.dailyCount}
            dailyGoal={progress.dailyGoal}
          />
        </div>

        {/* Suggested Topics */}
        <div className="flex flex-wrap gap-2 mb-5 justify-center">
          {suggested.map((t) => (
            <button key={t} onClick={() => handleGenerate(t)} className="chip">
              {t}
            </button>
          ))}
        </div>

        {/* Style & Language selectors */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Style</label>
            <div className="flex gap-2">
              {styles.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  className={`flex-1 rounded-full px-2 py-2 text-xs font-semibold transition-all duration-200 ${
                    style === s.value ? "chip-active" : "chip"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="sm:w-48">
            <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Language</label>
            <div className="flex gap-2">
              {languages.map((l) => (
                <button
                  key={l.value}
                  onClick={() => setLang(l.value)}
                  className={`flex-1 rounded-full px-2 py-2 text-xs font-semibold transition-all duration-200 ${
                    lang === l.value ? "chip-active" : "chip"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Output */}
      <section className="max-w-2xl mx-auto px-6 sm:px-10 pb-10">
        <div ref={outputRef}>
          {story && (
            <StoryOutput
              story={story}
              onSimpler={handleSimpler}
              onAnother={() => handleGenerate()}
              onNextTopic={(t) => handleGenerate(t)}
              loading={loading}
              isSaved={isSaved(topic)}
              onToggleSave={() => toggleSave(topic)}
            />
          )}
        </div>

        {/* Follow-up */}
        {story && !loading && (
          <div className="story-card p-5 sm:p-6 mt-6 animate-slide-up">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              🧠 Still confused? Ask anything…
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFollowUp()}
                placeholder="e.g., How does it actually work?"
                className="input-field flex-1 !py-3 text-sm"
              />
              <button
                onClick={handleFollowUp}
                disabled={!followUp.trim()}
                className="btn-primary !px-6 !py-3 text-sm"
              >
                Ask ✨
              </button>
            </div>
          </div>
        )}
      </section>

      {/* History Sidebar */}
      <HistorySidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        history={history}
        onSelect={handleSelectHistory}
        onRemove={removeEntry}
        onClear={clearHistory}
      />
    </div>
  );
}
