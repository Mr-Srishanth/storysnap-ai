import { useState, useRef, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Mic, MicOff, Maximize2, Minimize2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { StoryPlayer } from "@/components/StoryPlayer";
import { useStoryHistory } from "@/hooks/useStoryHistory";
import { useProgress } from "@/hooks/useProgress";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import {
  suggestedTopics,
  type StoryStyle, type ExplainLevel, type Language,
} from "@/lib/storyEngine";
import { generateAIStory, type AIStory, type ArtStyle } from "@/lib/aiStory";

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

const artStyles: { value: ArtStyle; label: string; emoji: string }[] = [
  { value: "comic", label: "Comic", emoji: "💥" },
  { value: "anime", label: "Anime", emoji: "🌸" },
  { value: "realistic", label: "Realistic", emoji: "📷" },
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
  const [artStyle, setArtStyle] = useState<ArtStyle>("comic");
  const [story, setStory] = useState<AIStory | null>(null);
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [immersive, setImmersive] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const outputRef = useRef<HTMLDivElement>(null);
  const { addEntry, updateEntry } = useStoryHistory();
  const { recordTopic, toggleSave, isSaved } = useProgress();
  const voice = useVoiceInput(lang);
  const suggested = useMemo(() => getRandomTopics(5), []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx(i => (i + 1) % placeholders.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const urlTopic = searchParams.get("topic");
    if (urlTopic && !story) handleGenerate(urlTopic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = async (overrideTopic?: string) => {
    const t = (overrideTopic || topic).trim();
    if (!t || loading) return;
    if (overrideTopic) setTopic(overrideTopic);
    setLoading(true);
    setStory(null);
    setCurrentEntryId(null);
    try {
      const result = await generateAIStory({ topic: t, language: lang, level, style, artStyle });
      setStory(result);
      const entry = addEntry(t, style, level, result);
      setCurrentEntryId(entry.id);
      recordTopic();
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Couldn't generate story. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMic = () => {
    if (voice.listening) voice.stopListening();
    else voice.startListening((text) => setTopic(text));
  };

  const handleImagesUpdate = (urls: (string | undefined)[]) => {
    if (!story || !currentEntryId) return;
    const updated: AIStory = {
      ...story,
      scenes: story.scenes.map((s, i) => ({ ...s, imageUrl: urls[i] ?? s.imageUrl })),
    };
    setStory(updated);
    updateEntry(currentEntryId, updated);
  };

  const containerClass = immersive
    ? "fixed inset-0 z-50 bg-foreground overflow-y-auto"
    : "animate-page-enter pb-20 sm:pb-10";

  return (
    <div className={containerClass}>
      {story && (
        <button
          onClick={() => setImmersive(!immersive)}
          className={`fixed top-4 right-4 z-[60] p-2.5 rounded-xl border transition-all duration-200 ${
            immersive
              ? "border-background/30 text-background/70 hover:text-background"
              : "border-border text-muted-foreground hover:text-primary bg-card"
          }`}
          aria-label="Toggle focus mode"
        >
          {immersive ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      )}

      {!immersive && (
        <section className="max-w-2xl mx-auto px-5 sm:px-10 pt-8 pb-4">
          {/* Input + Mic */}
          <div className="relative mb-5 group">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder={`What do you want to learn? e.g. ${placeholders[placeholderIdx]}`}
              className="input-field !pr-14 text-base sm:text-lg !py-4"
              disabled={loading}
            />
            {voice.isSupported && (
              <button
                onClick={handleMic}
                disabled={loading}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 ${
                  voice.listening
                    ? "bg-destructive/10 text-destructive mic-pulse"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                }`}
                aria-label={voice.listening ? "Stop listening" : "Start voice input"}
              >
                {voice.listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}
          </div>

          {voice.listening && (
            <div className="flex items-center justify-center gap-2 mb-5 text-sm text-destructive font-medium animate-pulse">
              <span className="w-2 h-2 rounded-full bg-destructive animate-ping" />
              Listening… speak your topic
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {suggested.map((t) => (
              <button key={t} onClick={() => handleGenerate(t)} className="chip text-xs" disabled={loading}>
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <OptionCard title="🧠 Mode" value={level} onChange={setLevel} options={levels} />
            <OptionCard title="🎨 Style" value={style} onChange={setStyle} options={styles} />
            <OptionCard title="🌍 Language" value={lang} onChange={setLang} options={languages.map(l => ({ value: l.value, label: l.label, emoji: l.flag }))} />
            <OptionCard title="🖼 Art" value={artStyle} onChange={setArtStyle} options={artStyles} />
          </div>

          <button
            onClick={() => handleGenerate()}
            disabled={!topic.trim() || loading}
            className="btn-primary w-full text-base py-4 group"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="inline-block w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span>Crafting your story<span className="loading-dots" /></span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" /> Generate Story
              </span>
            )}
          </button>

          {loading && (
            <div className="mt-6 space-y-3 animate-pulse">
              <div className="h-40 bg-muted rounded-2xl" />
              <div className="h-6 bg-muted rounded-xl w-3/4" />
              <div className="h-4 bg-muted rounded-xl w-full" />
              <div className="h-4 bg-muted rounded-xl w-5/6" />
            </div>
          )}
        </section>
      )}

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
              onImagesGenerated={handleImagesUpdate}
            />
          )}
        </div>
      </section>
    </div>
  );
}

interface OptionCardProps<T extends string> {
  title: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; emoji: string }[];
}

function OptionCard<T extends string>({ title, value, onChange, options }: OptionCardProps<T>) {
  return (
    <div className="glass-card p-3">
      <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 truncate">{title}</h3>
      <div className="space-y-1">
        {options.map(o => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              value === o.value
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-muted-foreground hover:bg-muted border border-transparent"
            }`}
          >
            {o.emoji} {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
