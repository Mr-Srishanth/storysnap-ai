import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Mic, MicOff, Search, Maximize2, Minimize2 } from "lucide-react";
import { StoryOutput } from "@/components/StoryOutput";
import { ProgressBar } from "@/components/ProgressBar";
import { useStoryHistory } from "@/hooks/useStoryHistory";
import { useProgress } from "@/hooks/useProgress";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import {
  generateStory, generateSimplerVersion, suggestedTopics,
  type StoryStyle, type ExplainLevel, type Language, type GeneratedStory,
} from "@/lib/storyEngine";

const styles: { value: StoryStyle; label: string }[] = [
  { value: "story", label: "📖 Story" },
  { value: "funny", label: "😂 Funny" },
  { value: "cinematic", label: "🎬 Cinematic" },
  { value: "teacher", label: "👨‍🏫 Teacher" },
];

const levels: { value: ExplainLevel; label: string }[] = [
  { value: "child", label: "👶 ELI5" },
  { value: "student", label: "🎓 Student" },
  { value: "developer", label: "🧠 Advanced" },
];

const languages: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी" },
  { value: "te", label: "తెలుగు" },
];

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
  const [followUp, setFollowUp] = useState("");
  const [suggested] = useState(() => getRandomTopics(6));
  const [immersive, setImmersive] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const { addEntry } = useStoryHistory();
  const { progress, recordTopic, toggleSave, isSaved } = useProgress();
  const voice = useVoiceInput(lang);

  useEffect(() => {
    const urlTopic = searchParams.get("topic");
    if (urlTopic && !story) handleGenerate(urlTopic);
  }, []);

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
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
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
    handleGenerate(`${topic.trim()} — specifically: ${followUp.trim()}`);
    setFollowUp("");
  };

  const handleMic = () => {
    if (voice.listening) voice.stopListening();
    else voice.startListening((text) => setTopic(text));
  };

  const containerClass = immersive
    ? "fixed inset-0 z-50 bg-background overflow-y-auto"
    : "animate-page-enter pb-20 sm:pb-10";

  return (
    <div className={containerClass}>
      {story && (
        <button
          onClick={() => setImmersive(!immersive)}
          className="fixed top-4 right-4 z-[60] p-2.5 rounded-xl border border-border text-muted-foreground hover:text-primary bg-card/80 backdrop-blur-lg transition-all"
          title={immersive ? "Exit Focus Mode" : "Focus Mode"}
        >
          {immersive ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      )}

      {!immersive && (
        <section className="max-w-2xl mx-auto px-6 sm:px-10 pt-6 pb-4">
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-foreground mb-6 text-center">
            ✨ Create a Story
          </h1>

          <div className="mb-6">
            <ProgressBar
              streak={progress.streak}
              topicsLearned={progress.topicsLearned}
              dailyCount={progress.dailyCount}
              dailyGoal={progress.dailyGoal}
            />
          </div>

          {/* Topic input */}
          <div className="flex gap-2 mb-4">
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
                className={`p-3.5 rounded-2xl border transition-all duration-200 shrink-0 ${
                  voice.listening
                    ? "border-red-500/50 bg-red-500/10 text-red-400 animate-pulse"
                    : "border-border text-muted-foreground hover:text-primary hover:border-primary/40"
                }`}
              >
                {voice.listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}
          </div>

          {/* Suggested */}
          <div className="flex flex-wrap gap-2 mb-5 justify-center">
            {suggested.map((t) => (
              <button key={t} onClick={() => handleGenerate(t)} className="chip text-xs">{t}</button>
            ))}
          </div>

          {/* Selectors */}
          <div className="space-y-4 mb-5">
            <div className="flex gap-2">
              {levels.map((l) => (
                <button
                  key={l.value}
                  onClick={() => setLevel(l.value)}
                  className={`flex-1 rounded-full px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    level === l.value ? "chip-active" : "chip"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Style</label>
                <div className="flex gap-1.5">
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
              <div className="sm:w-44">
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Language</label>
                <div className="flex gap-1.5">
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
          </div>

          {/* Generate button */}
          <button
            onClick={() => handleGenerate()}
            disabled={!topic.trim() || loading}
            className="btn-primary w-full text-base py-3.5"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                StorySnap AI is creating your story<span className="loading-dots" />
              </span>
            ) : (
              "✨ Generate Story"
            )}
          </button>
        </section>
      )}

      {/* Story Output */}
      <section className={`max-w-2xl mx-auto px-6 sm:px-10 ${immersive ? "pt-16 pb-10" : "pb-10"}`}>
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
              immersive={immersive}
            />
          )}
        </div>

        {story && !loading && !immersive && (
          <div className="glass-card p-5 sm:p-6 mt-6 animate-slide-up">
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
              <button onClick={handleFollowUp} disabled={!followUp.trim()} className="btn-primary !px-6 !py-3 text-sm">
                Ask ✨
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
