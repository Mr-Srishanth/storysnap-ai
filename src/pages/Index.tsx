import { useState, useRef } from "react";
import { History, Mic, MicOff } from "lucide-react";
import { StoryOutput } from "@/components/StoryOutput";
import { HistorySidebar } from "@/components/HistorySidebar";
import { ProgressBar } from "@/components/ProgressBar";
import { useStoryHistory } from "@/hooks/useStoryHistory";
import { useProgress } from "@/hooks/useProgress";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { generateStory, generateSimplerVersion, suggestedTopics, type StoryStyle, type ExplainLevel, type Language, type GeneratedStory } from "@/lib/storyEngine";

const styles: { value: StoryStyle; label: string }[] = [
  { value: "story", label: "Story 📖" },
  { value: "funny", label: "Funny 😂" },
  { value: "cinematic", label: "Cinematic 🎬" },
  { value: "teacher", label: "Teacher 👨‍🏫" },
];

const levels: { value: ExplainLevel; label: string; icon: string }[] = [
  { value: "child", label: "I'm 5", icon: "🧒" },
  { value: "student", label: "Student", icon: "🎓" },
  { value: "developer", label: "Pro", icon: "💻" },
];

const languages: { value: Language; label: string }[] = [
  { value: "en", label: "English 🇬🇧" },
  { value: "hi", label: "हिन्दी 🇮🇳" },
  { value: "te", label: "తెలుగు 🇮🇳" },
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
      <div className="max-w-xl mx-auto px-4 py-10 sm:py-14">
        {/* Header */}
        <header className="text-center mb-8 relative">
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute right-0 top-0 p-2.5 rounded-xl border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-200"
            title="Story History"
          >
            <History className="w-5 h-5" />
            {history.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {history.length > 9 ? "9+" : history.length}
              </span>
            )}
          </button>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-foreground mb-2">
            ⚡ StorySnap AI
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Learn Anything in a Snap
          </p>
        </header>

        {/* Progress bar */}
        <div className="mb-8">
          <ProgressBar
            streak={progress.streak}
            topicsLearned={progress.topicsLearned}
            dailyCount={progress.dailyCount}
            dailyGoal={progress.dailyGoal}
          />
        </div>

        {/* Input Card */}
        <div className="story-card p-6 sm:p-8 mb-8">
          <div className="space-y-5">
            {/* Topic input with mic */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                What do you want to learn?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  placeholder="e.g., AI, Blockchain, Quantum Physics"
                  className="input-field flex-1"
                />
                {voice.isSupported && (
                  <button
                    onClick={handleMic}
                    className={`p-3 rounded-xl border transition-all duration-200 shrink-0 ${
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
            </div>

            {/* Suggested Topics */}
            <div className="flex flex-wrap gap-2">
              {suggested.map((t) => (
                <button key={t} onClick={() => handleGenerate(t)} className="chip">
                  {t}
                </button>
              ))}
            </div>

            {/* Language selector */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Language
              </label>
              <div className="flex gap-2">
                {languages.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLang(l.value)}
                    className={`flex-1 rounded-xl px-2 py-2.5 text-sm font-medium transition-all duration-200 border ${
                      lang === l.value ? "chip-active" : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Style selector */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Style
              </label>
              <div className="flex gap-2">
                {styles.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStyle(s.value)}
                    className={`flex-1 rounded-xl px-2 py-2.5 text-sm font-medium transition-all duration-200 border ${
                      style === s.value ? "chip-active" : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Level selector */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Explain Like…
              </label>
              <div className="flex gap-2">
                {levels.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLevel(l.value)}
                    className={`flex-1 rounded-xl px-2 py-2.5 text-sm font-medium transition-all duration-200 border ${
                      level === l.value ? "chip-active" : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {l.icon} {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={() => handleGenerate()}
              disabled={!topic.trim() || loading}
              className="btn-primary w-full text-base py-3.5"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Generating<span className="loading-dots" />
                </span>
              ) : (
                "Generate Story ✨"
              )}
            </button>
          </div>
        </div>

        {/* Output */}
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

        {/* Follow-up input */}
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
      </div>

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
