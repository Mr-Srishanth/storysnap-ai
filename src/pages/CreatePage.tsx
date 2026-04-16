import { useState, useRef, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Mic, MicOff, Maximize2, Minimize2 } from "lucide-react";
import { StoryPlayer } from "@/components/StoryPlayer";
import { useStoryHistory } from "@/hooks/useStoryHistory";
import { useProgress } from "@/hooks/useProgress";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import {
  generateStory, suggestedTopics,
  type StoryStyle, type ExplainLevel, type Language, type GeneratedStory,
} from "@/lib/storyEngine";

const styles: { value: StoryStyle; label: string; emoji: string }[] = [
  { value: "story", label: "Story", emoji: "📖" },
  { value: "funny", label: "Funny", emoji: "😂" },
  { value: "cinematic", label: "Cinematic", emoji: "🎬" },
  { value: "teacher", label: "Teacher", emoji: "👨‍🏫" },
];

const levels: { value: ExplainLevel; label: string; emoji: string }[] = [
  { value: "child", label: "ELI5", emoji: "👶" },
  { value: "student", label: "Student", emoji: "🎓" },
  { value: "developer", label: "Advanced", emoji: "🧠" },
];

const languages: { value: Language; label: string; flag: string }[] = [
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { value: "te", label: "తెలుగు", flag: "🇮🇳" },
];

const placeholders = ["AI…", "Blockchain…", "Gravity…", "DNA…", "Black Holes…", "Evolution…"];

function getRandomTopics(n: number) {
  return [...suggestedTopics].sort(() => Math.random() - 0.5).slice(0, n);
}

export default function CreatePage() {
  const [searchParams] = useSearchParams();
  const [topic, setTopic] = useState(searchParams.get("topic") || "");
  const [style, setStyle] = useState<StoryStyle>("story");
  const [level, setLevel] = useState<ExplainLevel>("student");
  const [lang, setLang] = useState<Language>("en");
  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [loading, setLoading] = useState(false);
  const [immersive, setImmersive] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const outputRef = useRef<HTMLDivElement>(null);
  const { addEntry } = useStoryHistory();
  const { recordTopic, toggleSave, isSaved } = useProgress();
  const voice = useVoiceInput(lang);
  const suggested = useMemo(() => getRandomTopics(5), []);

  // Animated placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx(i => (i + 1) % placeholders.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto-generate from URL
  useEffect(() => {
    const urlTopic = searchParams.get("topic");
    if (urlTopic && !story) handleGenerate(urlTopic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = (overrideTopic?: string) => {
    const t = (overrideTopic || topic).trim();
    if (!t || loading) return;
    if (overrideTopic) setTopic(overrideTopic);
    setLoading(true);
    setStory(null);
    setTimeout(() => {
      const result = generateStory(t, style, level, lang);
      setStory(result);
      addEntry(t, style, level, result);
      recordTopic();
      setLoading(false);
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }, 800);
  };

  const handleMic = () => {
    if (voice.listening) voice.stopListening();
    else voice.startListening((text) => setTopic(text));
  };

  const containerClass = immersive
    ? "fixed inset-0 z-50 bg-foreground overflow-y-auto"
    : "animate-page-enter pb-20 sm:pb-10";

  return (
    <div className={containerClass}>
      {/* Immersive toggle */}
      {story && (
        <button
          onClick={() => setImmersive(!immersive)}
          className={`fixed top-4 right-4 z-[60] p-2.5 rounded-xl border transition-all duration-200 ${
            immersive
              ? "border-background/30 text-background/70 hover:text-background"
              : "border-border text-muted-foreground hover:text-primary bg-card"
          }`}
        >
          {immersive ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      )}

      {!immersive && (
        <section className="max-w-2xl mx-auto px-5 sm:px-10 pt-8 pb-4">
          {/* Input with mic inside */}
          <div className="relative mb-5">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder={`What do you want to learn? e.g. ${placeholders[placeholderIdx]}`}
              className="input-field !pr-14 text-base sm:text-lg !py-4"
            />
            {voice.isSupported && (
              <button
                onClick={handleMic}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 ${
                  voice.listening
                    ? "bg-destructive/10 text-destructive mic-pulse"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                }`}
              >
                {voice.listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {suggested.map((t) => (
              <button key={t} onClick={() => handleGenerate(t)} className="chip text-xs">
                {t}
              </button>
            ))}
          </div>

          {/* Option Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Mode */}
            <div className="glass-card p-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">🧠 Mode</h3>
              <div className="space-y-1.5">
                {levels.map(l => (
                  <button
                    key={l.value}
                    onClick={() => setLevel(l.value)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      level === l.value
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:bg-muted border border-transparent"
                    }`}
                  >
                    {l.emoji} {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Style */}
            <div className="glass-card p-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">🎨 Style</h3>
              <div className="space-y-1.5">
                {styles.map(s => (
                  <button
                    key={s.value}
                    onClick={() => setStyle(s.value)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      style === s.value
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:bg-muted border border-transparent"
                    }`}
                  >
                    {s.emoji} {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="glass-card p-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">🌍 Language</h3>
              <div className="space-y-1.5">
                {languages.map(l => (
                  <button
                    key={l.value}
                    onClick={() => setLang(l.value)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      lang === l.value
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:bg-muted border border-transparent"
                    }`}
                  >
                    {l.flag} {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={() => handleGenerate()}
            disabled={!topic.trim() || loading}
            className="btn-primary w-full text-base py-4 group"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="inline-block w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span>Creating your story<span className="loading-dots" /></span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                ✨ Generate Story
              </span>
            )}
          </button>

          {/* Loading shimmer */}
          {loading && (
            <div className="mt-6 space-y-3 animate-pulse">
              <div className="h-6 bg-muted rounded-xl w-3/4" />
              <div className="h-4 bg-muted rounded-xl w-full" />
              <div className="h-4 bg-muted rounded-xl w-5/6" />
              <div className="h-4 bg-muted rounded-xl w-2/3" />
              <div className="h-10 bg-muted rounded-xl w-1/2 mt-4" />
            </div>
          )}
        </section>
      )}

      {/* Story Player */}
      <section className={`max-w-3xl mx-auto px-5 sm:px-10 ${immersive ? "pt-16 pb-10" : "pb-10"}`}>
        <div ref={outputRef}>
          {story && !loading && (
            <StoryPlayer
              story={story}
              onAnother={() => handleGenerate()}
              onNextTopic={(t) => handleGenerate(t)}
              isSaved={isSaved(topic)}
              onToggleSave={() => toggleSave(topic)}
              immersive={immersive}
            />
          )}
        </div>
      </section>
    </div>
  );
}
