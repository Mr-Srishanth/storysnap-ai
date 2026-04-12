// ==========================================
// StorySnap — Advanced Story Engine v2
// ==========================================

export type StoryStyle = "adventure" | "funny" | "emotional";
export type ExplainLevel = "child" | "student" | "developer";

export interface GeneratedStory {
  title: string;
  story: string;
  summary: string;
  keyLesson: string;
  realLifeExample: string;
}

// --------------- DATA POOLS (20+ each) ---------------

const characters = [
  "a curious kid named Leo",
  "a smart robot called Spark",
  "a confused student named Maya",
  "a magical wizard named Orion",
  "a young explorer called Nova",
  "a detective named Riley",
  "a clever fox named Fynn",
  "a space traveler called Zara",
  "a tiny ant named Pip",
  "a dreamy artist named Luna",
  "a fearless astronaut named Kai",
  "a clumsy inventor named Gizmo",
  "a shy bookworm named Sage",
  "a musical bird named Melody",
  "a time-traveler named Echo",
  "a mischievous cat called Whiskers",
  "a brave sailor named Marina",
  "a gentle giant named Atlas",
  "a curious penguin named Frost",
  "a playful dolphin named Splash",
  "a wise owl named Professor Hoot",
];

const settings = [
  "in a small village by the mountains",
  "in outer space on a tiny spaceship",
  "inside a colorful school",
  "in a magical world full of wonders",
  "inside a giant computer system",
  "deep under the ocean in a coral city",
  "at the edge of a glowing forest",
  "in a bustling futuristic city",
  "on a floating island above the clouds",
  "inside a massive library that never ends",
  "in an underground cave filled with crystals",
  "on a train that travels between dimensions",
  "in a cozy treehouse during a thunderstorm",
  "at a secret laboratory hidden in the desert",
  "inside a snowglobe that came to life",
  "on a pirate ship sailing through the stars",
  "in a garden where flowers whisper secrets",
  "at a carnival where every ride teaches something",
  "in a quiet café at the end of the universe",
  "inside a painting that became real",
];

const goals = [
  "trying to understand",
  "on a mission to learn about",
  "super curious about",
  "exploring the idea of",
  "determined to figure out",
  "desperate to make sense of",
  "fascinated by the mystery of",
  "itching to decode",
  "drawn to the puzzle of",
  "obsessed with cracking",
  "eager to unravel",
  "absolutely captivated by",
  "quietly wondering about",
  "on a wild quest to master",
  "hunting for the secret behind",
  "daydreaming about",
  "ready to dive deep into",
  "slowly piecing together",
  "chasing the truth about",
  "asking big questions about",
];

const obstacles = [
  "but it felt confusing at first 😵‍💫",
  "and nothing made sense at all 🤯",
  "but it was incredibly complicated 😰",
  "and everyone explained it in a really hard way 😤",
  "but all the books were full of big, scary words 📚",
  "and the more they read, the more lost they got 😶‍🌫️",
  "but every explanation felt like another puzzle 🧩",
  "and their brain felt like it was doing backflips 🤸",
  "but the topic seemed to have a million layers 🎂",
  "and nobody around them could explain it simply 🙈",
  "but every answer just led to more questions ❓",
  "and the experts used words nobody understood 🤷",
  "but the information was scattered everywhere 🌪️",
  "and they almost gave up three times already 😩",
  "but the concept kept slipping through their fingers 💨",
  "and it felt like trying to catch a cloud ☁️",
  "but every tutorial assumed they already knew everything 😅",
  "and the subject felt impossibly abstract 🌀",
  "but their confidence was running dangerously low 📉",
  "and they wondered if they were just not smart enough 💭",
];

const analogies: Record<string, string[]> = {
  tech: [
    "like sending a letter through a chain of helpful mailmen 📬",
    "like a giant filing cabinet that organizes itself 🗄️",
    "like traffic lights directing cars on a busy highway 🚦",
    "like a recipe that a very fast chef follows step by step 👨‍🍳",
    "like a library where books fly to you when you think of them 📚",
    "like a translator who speaks every language at once 🌐",
    "like a puzzle where each piece snaps in automatically 🧩",
    "like invisible pipes carrying water to exactly the right faucet 🚿",
  ],
  science: [
    "like tiny Lego bricks building everything you can see 🧱",
    "like a garden where every seed follows its own schedule 🌱",
    "like invisible strings pulling on everything in the universe 🎻",
    "like a dance where every partner knows their exact move 💃",
    "like a river that always finds the easiest path downhill 🏞️",
    "like magnets deciding who they want to be friends with 🧲",
    "like a weather forecast — patterns you can learn to read ⛅",
    "like dominos falling in a perfectly planned chain reaction ⛓️",
  ],
  general: [
    "like a puzzle where each piece clicks into place 🧩",
    "like building blocks stacking one on top of another 🧱",
    "like a fun game where you level up step by step 🎮",
    "like a recipe — you just follow the steps 🍳",
    "like a storybook that unfolds page by page 📖",
    "like learning to ride a bike — wobbly, then amazing 🚲",
    "like a map where X marks the treasure of understanding 🗺️",
    "like peeling an onion — one layer reveals the next 🧅",
    "like climbing stairs — each step gets you higher 🪜",
    "like connecting dots to reveal a hidden picture ✏️",
    "like tuning a radio until the music becomes crystal clear 📻",
    "like sorting a messy drawer — suddenly everything makes sense 🗂️",
  ],
};

const synonyms = {
  understand: ["grasp", "get", "wrap their head around", "make sense of", "decode", "figure out", "click with"],
  confusing: ["tricky", "puzzling", "brain-bending", "mind-boggling", "baffling", "head-scratching", "tangled"],
  simple: ["easy", "clear", "straightforward", "no-brainer", "a piece of cake", "crystal clear", "obvious"],
  amazing: ["incredible", "mind-blowing", "spectacular", "jaw-dropping", "breathtaking", "unbelievable"],
  learned: ["discovered", "realized", "uncovered", "figured out", "cracked", "unlocked", "mastered"],
};

const adventureVerbs = [
  "embarked on a quest", "set sail into the unknown", "charged forward bravely",
  "ventured deep into uncharted territory", "leaped into action", "mapped out a daring route",
  "followed a mysterious trail", "unlocked a hidden gateway", "discovered a secret passage",
  "crossed a treacherous bridge", "climbed to the peak of knowledge", "navigated through a maze",
];

const funnyPhrases = [
  "which was funnier than a cat wearing a top hat 🎩🐱",
  "and honestly, even the smart robot was confused 🤖😂",
  "like trying to teach a fish to ride a bicycle 🐟🚲",
  "which made everyone laugh so hard they cried 😂",
  "kind of like explaining colors to a goldfish 🐠",
  "about as graceful as a penguin on roller skates 🐧⛸️",
  "more confusing than a GPS in a cornfield 🌽",
  "like watching a squirrel try to solve a Rubik's cube 🐿️",
  "funnier than a robot trying to tell a joke 🤖",
  "about as smooth as a hedgehog doing ballet 🦔💃",
  "which was like trying to fold a fitted sheet — impossible 😅",
  "more chaotic than a cat in a room full of laser pointers 🔴🐱",
];

const emotionalPhrases = [
  "and it felt like the whole world suddenly made sense 🌍✨",
  "with tears of joy because learning felt so powerful 🥹",
  "and a warm feeling spread through their heart ❤️",
  "realizing that struggling was part of the beautiful journey 🌱",
  "feeling a spark of pride they hadn't felt in ages ✨",
  "and for the first time, they believed in themselves 💪",
  "like watching a sunrise after the longest night 🌅",
  "and the weight of confusion finally lifted off their shoulders 🕊️",
  "feeling like they had just unlocked a superpower 🦸",
  "and their eyes lit up with the fire of understanding 🔥",
  "realizing that every mistake had been a stepping stone 🪨",
  "feeling connected to something bigger than themselves 🌌",
];

const suggestedTopics = [
  "Artificial Intelligence", "Blockchain", "Quantum Physics", "Machine Learning",
  "Black Holes", "DNA & Genetics", "Cryptocurrency", "Neural Networks",
  "Climate Change", "Relativity", "Evolution", "Internet of Things",
  "Photosynthesis", "Supply & Demand", "Algorithms", "Dark Matter",
];

// --------------- UTILITY ---------------

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function synonym(word: keyof typeof synonyms): string {
  return pick(synonyms[word]);
}

function detectTopicType(topic: string): "tech" | "science" | "general" {
  const t = topic.toLowerCase();
  const techWords = ["ai", "blockchain", "crypto", "code", "programming", "software", "algorithm", "data", "internet", "web", "api", "machine learning", "neural", "computer", "database", "cloud", "server", "network", "iot", "app"];
  const scienceWords = ["physics", "quantum", "atom", "molecule", "biology", "chemistry", "evolution", "dna", "gene", "cell", "gravity", "relativity", "energy", "photosynthesis", "climate", "planet", "space", "black hole", "dark matter", "ecosystem"];
  if (techWords.some(w => t.includes(w))) return "tech";
  if (scienceWords.some(w => t.includes(w))) return "science";
  return "general";
}

// --------------- STORY STRUCTURES ---------------

type OpeningType = "question" | "scene" | "dialogue" | "action";
let lastOpening: OpeningType | null = null;

function getOpening(character: string, setting: string, topic: string): { type: OpeningType; text: string } {
  const openings: { type: OpeningType; text: string }[] = [
    { type: "question", text: `"What on earth is ${topic}?" That was the question that kept ${character} awake every single night ${setting}. 🤔` },
    { type: "scene", text: `The sky was glowing faintly ${setting} when ${character} stumbled upon something that would change everything — the mystery of ${topic}. ✨` },
    { type: "dialogue", text: `"Has anyone here ever heard of ${topic}?" asked ${character}, looking around ${setting}. Silence. Nobody had a clue. 😶` },
    { type: "action", text: `${character.charAt(0).toUpperCase() + character.slice(1)} jumped out of bed ${setting}, grabbed a notebook, and wrote one word in huge letters: ${topic}. Today was the day. 🚀` },
  ];

  const available = openings.filter(o => o.type !== lastOpening);
  const chosen = pick(available);
  lastOpening = chosen.type;
  return chosen;
}

function getLevelPrefix(level: ExplainLevel): string {
  switch (level) {
    case "child": return "Imagine";
    case "student": return "Think of it this way —";
    case "developer": return "In technical terms, but simply put —";
  }
}

function getLevelTone(level: ExplainLevel, topic: string, analogy: string): string {
  switch (level) {
    case "child":
      return `${analogy}. It's actually super ${synonym("simple")} when you picture it that way!`;
    case "student":
      return `${analogy}. Once you break it down, ${topic} becomes much easier to ${synonym("understand")}.`;
    case "developer":
      return `${analogy}. At its core, ${topic} follows this pattern — and once you see it, you can build on it.`;
  }
}

// --------------- TRANSITIONS ---------------

const transitions = [
  "At first,", "Then,", "Slowly,", "Suddenly,", "After a while,",
  "Before long,", "Little by little,", "Out of nowhere,", "Eventually,",
  "Just when they least expected it,", "In that moment,", "Without warning,",
];

const detailPhrases = [
  "The air hummed with possibility.",
  "A flicker of curiosity danced in their eyes.",
  "The silence was thick with wonder.",
  "Something shifted — like a door cracking open.",
  "They could almost feel the pieces rearranging.",
  "The world around them seemed to hold its breath.",
  "A quiet excitement began to build.",
  "Their mind raced, connecting invisible threads.",
];

// --------------- FLOW STRUCTURES ---------------

type FlowOrder = "classic" | "explanation_first" | "question_driven";
let lastFlow: FlowOrder | null = null;

function pickFlow(): FlowOrder {
  const flows: FlowOrder[] = ["classic", "explanation_first", "question_driven"];
  const available = flows.filter(f => f !== lastFlow);
  const chosen = pick(available);
  lastFlow = chosen;
  return chosen;
}

// --------------- MAIN GENERATOR ---------------

export function generateStory(
  topic: string,
  style: StoryStyle,
  level: ExplainLevel = "student"
): GeneratedStory {
  const character = pick(characters);
  const setting = pick(settings);
  const goal = pick(goals);
  const obstacle = pick(obstacles);
  const topicType = detectTopicType(topic);
  const analogyPool = analogies[topicType] || analogies.general;
  const analogy = pick(analogyPool);
  const flow = pickFlow();
  const trans = () => pick(transitions);
  const detail = () => pick(detailPhrases);

  const name = character.split(" ").find(w => w.charAt(0) === w.charAt(0).toUpperCase() && w.length > 2) || character.split(" ")[0];

  // --- Build sections ---
  const hook = getOpening(character, setting, topic).text;

  const problem = [
    `They were ${goal} ${topic}, ${obstacle}.`,
    pick([
      `"Why is ${topic} so ${synonym("confusing")}?" they whispered.`,
      `Every explanation made it feel even more ${synonym("confusing")}.`,
      `They asked friends, searched books — ${topic} remained a mystery.`,
      `The more they tried, the further away the answer drifted.`,
      `${trans()} the frustration was real. ${detail()}`,
    ]),
  ].join("\n\n");

  const prefix = getLevelPrefix(level);
  const explanation = [
    `${trans()} something clicked. ${detail()}`,
    `${prefix} ${topic} is ${getLevelTone(level, topic, analogy)}`,
  ].join("\n\n");

  let stylePart: string;
  if (style === "adventure") {
    const verbs = pickN(adventureVerbs, 2);
    stylePart = [
      `Fueled by this understanding, they ${verbs[0]} to explore every corner of ${topic}. 🗺️`,
      `${trans()} they ${verbs[1]}, and each step revealed another ${synonym("amazing")} layer. ${detail()}`,
      `Challenges appeared, but nothing could stop them now — they had the key. 🔑`,
    ].join("\n\n");
  } else if (style === "funny") {
    stylePart = [
      `The moment of clarity was ${pick(funnyPhrases)}.`,
      `They tried explaining ${topic} to a friend, ${pick(funnyPhrases)}.`,
      `But hey, at least NOW they actually ${synonym("understand")} ${topic}! 🎉`,
    ].join("\n\n");
  } else {
    stylePart = [
      `The journey of learning ${topic} wasn't ${synonym("simple")}, ${pick(emotionalPhrases)}.`,
      `${trans()} every small step forward was a quiet victory, ${pick(emotionalPhrases)}.`,
      `The struggle made the understanding feel ${synonym("amazing")}. 🌟`,
    ].join("\n\n");
  }

  const resolution = pick([
    `In the end, ${name} ${synonym("learned")} ${topic} so well, they could explain it to anyone — even a five-year-old! 🧒`,
    `And just like that, ${topic} went from impossible to perfectly ${synonym("simple")} in ${name}'s mind.`,
    `From that day on, ${name} never feared a ${synonym("confusing")} topic again. Knowledge was their superpower. 💡`,
    `${name} smiled. What once felt impossible was now crystal clear. ${detail()} The end. 🌈`,
  ]);

  // --- Assemble based on flow ---
  let story: string;
  if (flow === "classic") {
    story = [hook, problem, explanation, stylePart, resolution].join("\n\n");
  } else if (flow === "explanation_first") {
    story = [hook, explanation, problem, stylePart, resolution].join("\n\n");
  } else {
    // question_driven: hook → mini explanation → problem deepens → full explanation → resolution
    story = [hook, explanation.split("\n\n")[0], problem, explanation.split("\n\n")[1] || "", stylePart, resolution].filter(Boolean).join("\n\n");
  }

  const title = `The Story of ${topic}`;

  const summaries = [
    `${topic} is essentially ${analogy.replace(/like /i, "").replace(/\s*[^\w\s].?$/, "")}. Once you look at it from the right angle, the complexity melts away.`,
    `At its core, ${topic} follows a ${synonym("simple")} pattern. Break it into small pieces, and each piece makes perfect sense on its own.`,
    `The secret to ${synonym("understand")}ing ${topic}? Find the right comparison. When you connect it to something familiar, everything clicks.`,
  ];

  const lessons = [
    `Even the most ${synonym("confusing")} ideas become ${synonym("simple")} when you find the right angle. 💡`,
    `Understanding ${topic} isn't about raw intelligence — it's about finding the right story. 📖`,
    `Every expert was once a confused beginner. Curiosity is the only prerequisite. 🔍`,
    `Complex doesn't mean impossible. It just means you haven't found the right explanation yet. 🧠`,
    `The best way to learn is to connect new ideas to things you already know. 🔗`,
  ];

  const realLifeExamples = generateRealLifeExample(topic, topicType);

  return {
    title,
    story,
    summary: pick(summaries),
    keyLesson: pick(lessons),
    realLifeExample: realLifeExamples,
  };
}

function generateRealLifeExample(topic: string, type: string): string {
  const t = topic.toLowerCase();
  const techExamples: Record<string, string> = {
    "ai": "When Netflix suggests a show you end up binge-watching — that's AI predicting what you'll like based on your history. 🎬",
    "blockchain": "Imagine a shared Google Doc that nobody can secretly edit or delete — that's basically what blockchain does for transactions. 📄",
    "machine learning": "Your email's spam filter gets smarter over time by learning which emails you mark as junk — that's machine learning at work! 📧",
    "algorithm": "Following a recipe step-by-step to bake a cake? That's an algorithm — a set of instructions that produces a result. 🎂",
  };
  const scienceExamples: Record<string, string> = {
    "quantum": "Your phone's GPS uses quantum physics to calculate your position — without it, maps would be off by miles! 📍",
    "dna": "DNA is like a biological instruction manual — it tells your cells how to build YOU, from your eye color to your height. 🧬",
    "gravity": "Every time you drop your phone and panic — that's gravity doing exactly what it always does! 📱",
    "evolution": "Dog breeds are a fast-forward example of evolution — humans selected traits over generations to create everything from chihuahuas to Great Danes. 🐕",
  };

  const pool = type === "tech" ? techExamples : type === "science" ? scienceExamples : {};
  for (const key of Object.keys(pool)) {
    if (t.includes(key)) return pool[key];
  }

  const generic = [
    `Think about the last time you used your phone — ${topic} is quietly at work behind the scenes, making things possible you don't even notice. 📱`,
    `Next time you're in a grocery store, look around — the systems behind stocking those shelves connect to ${topic} in surprising ways. 🏪`,
    `Every time you search something online, principles of ${topic} are silently working to get you answers in milliseconds. ⚡`,
    `The weather app on your phone? It uses concepts closely related to ${topic} to predict tomorrow's forecast. 🌤️`,
  ];
  return pick(generic);
}

export function generateSimplerVersion(story: GeneratedStory, topic: string): GeneratedStory {
  return generateStory(topic, "funny", "child");
}

export { suggestedTopics };
