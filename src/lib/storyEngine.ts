// ==========================================
// StorySnap AI — Human-like Story Engine v4
// Natural, conversational, 5-7 lines
// ==========================================

export type StoryStyle = "story" | "funny" | "cinematic" | "teacher";
export type ExplainLevel = "child" | "student" | "developer";
export type Language = "en" | "hi" | "te";

export interface GeneratedStory {
  title: string;
  story: string;
  summary: string;
  keyLesson: string;
  realLifeExample: string;
  quiz: { question: string; options: string[]; correct: number };
  nextTopics: string[];
  language: Language;
}

// --------------- DATA POOLS ---------------

const characters = [
  "Leo", "Spark", "Maya", "Orion", "Nova", "Riley", "Fynn", "Zara",
  "Pip", "Luna", "Kai", "Sage", "Melody", "Echo", "Marina", "Atlas",
  "Ravi", "Priya", "Arjun", "Neha", "Kira", "Dante", "Siri", "Jin",
];

const settings = [
  "a quiet rooftop at sunset", "a buzzing coffee shop", "a dusty old library",
  "a train rushing through the night", "a garden after the rain",
  "a tiny boat on a calm lake", "a classroom after hours",
  "a park bench on a windy day", "a kitchen at midnight",
  "a starlit balcony", "a crowded marketplace", "a workshop full of tools",
  "a mountain trail at dawn", "a cozy bookshop corner", "an old radio station",
];

// --------------- UTILITY ---------------

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function detectTopicType(topic: string): "tech" | "science" | "general" {
  const t = topic.toLowerCase();
  const techWords = ["ai", "blockchain", "crypto", "code", "programming", "software", "algorithm", "data", "internet", "web", "api", "machine learning", "neural", "computer", "database", "cloud", "server", "network", "iot", "app", "cybersecurity"];
  const scienceWords = ["physics", "quantum", "atom", "molecule", "biology", "chemistry", "evolution", "dna", "gene", "cell", "gravity", "relativity", "energy", "photosynthesis", "climate", "planet", "space", "black hole", "dark matter", "ecosystem"];
  if (techWords.some(w => t.includes(w))) return "tech";
  if (scienceWords.some(w => t.includes(w))) return "science";
  return "general";
}

// --------------- ANALOGY POOLS ---------------

const analogies: Record<string, string[]> = {
  tech: [
    "sending a letter through a chain of mailmen",
    "a filing cabinet that organizes itself",
    "traffic lights directing cars on a highway",
    "a recipe a super-fast chef follows step by step",
    "invisible pipes carrying water to the right faucet",
    "a translator who speaks every language at once",
    "a librarian who remembers every book ever written",
    "a GPS recalculating the fastest route in real time",
  ],
  science: [
    "tiny Lego bricks building everything you see",
    "a garden where each seed has its own schedule",
    "invisible strings pulling on the whole universe",
    "a river that always finds the easiest path downhill",
    "dominos falling in a perfectly planned chain",
    "a symphony where every instrument has a role",
    "a dance where partners switch without missing a beat",
    "layers of paint — each one changes the picture",
  ],
  general: [
    "a puzzle where each piece clicks into place",
    "building blocks stacking one on top of another",
    "learning to ride a bike — wobbly at first, then effortless",
    "peeling an onion — one layer reveals the next",
    "tuning a radio until the static becomes music",
    "planting a seed — you don't see growth until it's there",
    "connecting the dots — the picture appears suddenly",
    "a conversation where the last sentence changes everything",
  ],
};

// --------------- OPENING ENGINE ---------------

type OpeningType = "dialogue" | "scene" | "action" | "question";
let lastOpening: OpeningType | null = null;
let lastCharIdx = -1;

function getChar(): string {
  let idx = Math.floor(Math.random() * characters.length);
  while (idx === lastCharIdx) idx = Math.floor(Math.random() * characters.length);
  lastCharIdx = idx;
  return characters[idx];
}

function getOpening(char: string, setting: string, topic: string, style: StoryStyle): string {
  const openings: { type: OpeningType; texts: string[] }[] = [
    { type: "dialogue", texts: [
      `"Wait… so what exactly is ${topic}?" ${char} asked, leaning forward in ${setting}.`,
      `"Okay, explain ${topic} to me like I'm five," ${char} said, sitting in ${setting}.`,
      `"I've read about ${topic} a hundred times," ${char} muttered. "Still don't get it."`,
      `"You know what confuses me?" ${char} said. "It's ${topic}."`,
    ]},
    { type: "scene", texts: [
      `${char} was sitting in ${setting}, staring at the word "${topic}" written on a napkin.`,
      `The rain tapped softly outside ${setting}. ${char} had one question: what is ${topic}, really?`,
      `It was late. ${char} sat alone in ${setting}, trying to crack ${topic}.`,
    ]},
    { type: "action", texts: [
      `${char} put down the textbook. "Forget the jargon. Let me think about ${topic} differently."`,
      `${char} grabbed a pen, drew a circle, and wrote "${topic}" in the center.`,
      `Mid-conversation, ${char} suddenly stopped. "Hold on — I think I finally understand ${topic}."`,
    ]},
    { type: "question", texts: [
      `Here's the thing about ${topic} — everyone uses the word, but do they really understand it?`,
      `What if ${topic} isn't as complicated as we've been told?`,
      `Think about this — what if you already understand ${topic}, but just don't know it yet?`,
    ]},
  ];

  const available = openings.filter(o => o.type !== lastOpening);
  const chosen = pick(available);
  lastOpening = chosen.type;
  return pick(chosen.texts);
}

// --------------- STORY BUILDERS BY STYLE ---------------

function buildStory(topic: string, style: StoryStyle, level: ExplainLevel, lang: Language): string {
  if (lang === "hi") return buildHindiStory(topic, style, level);
  if (lang === "te") return buildTeluguStory(topic, style, level);

  const char = getChar();
  const setting = pick(settings);
  const topicType = detectTopicType(topic);
  const analogy = pick(analogies[topicType] || analogies.general);

  const hook = getOpening(char, setting, topic, style);

  const confusion = pick([
    `The more ${char} read, the more tangled it got.`,
    `Every explanation used bigger words. Not helpful.`,
    `Books, videos, articles — nothing made it click.`,
    `It felt like trying to hold water in open hands.`,
    `"Why does everyone explain this so badly?" ${char} wondered.`,
  ]);

  const bridge = pick([
    `But then someone put it simply: "${topic}? Think of it as ${analogy}."`,
    `A friend leaned in and said, "What if ${topic} is just like ${analogy}?"`,
    `Then came the moment — ${topic} is basically ${analogy}.`,
    `One sentence changed everything: "It's just ${analogy}."`,
  ]);

  const aha = `💡 And suddenly… it made sense.`;

  const styleFlavor = getStyleFlavor(style, char, topic);

  const resolution = getResolution(level, char, topic, analogy);

  const lines = [hook, confusion, bridge, aha, styleFlavor, resolution].filter(Boolean);
  return lines.join("\n\n");
}

function getStyleFlavor(style: StoryStyle, char: string, topic: string): string {
  switch (style) {
    case "story":
      return pick([
        `${char} smiled — the mystery of ${topic} had finally unraveled, one thread at a time.`,
        `Like turning the last page of a book, everything about ${topic} fell into place.`,
        `${char} sat back, amazed. Something that felt impossible now felt obvious.`,
      ]);
    case "funny":
      return pick([
        `${char} burst out laughing. "That's IT? I stressed about THIS?" 😂`,
        `"I literally overthought ${topic} for weeks," ${char} groaned, half-laughing. 🤦`,
        `Turns out ${topic} was simpler than assembling IKEA furniture. And that's saying something. 😂`,
        `${char} looked around. "Is anyone else embarrassed they didn't get this sooner?" 😂`,
      ]);
    case "cinematic":
      return pick([
        `Time slowed. The fog lifted. ${char} saw ${topic} with crystal clarity.`,
        `Everything went quiet. Then — like sunlight breaking through clouds — it was clear.`,
        `The world seemed to pause. ${char}'s eyes widened. This was the moment.`,
      ]);
    case "teacher":
      return pick([
        `"So here's the key," ${char} explained. "Break ${topic} into pieces. Each piece is simple."`,
        `"The trick?" ${char} said. "Don't memorize. Understand the 'why' behind ${topic}."`,
        `"Step one: forget everything you've been told. Let's rebuild ${topic} from scratch."`,
      ]);
  }
}

function getResolution(level: ExplainLevel, char: string, topic: string, analogy: string): string {
  const resolutions: Record<ExplainLevel, string[]> = {
    child: [
      `${topic} is just like ${analogy} — super simple when you see it the right way! 🎉`,
      `Now ${char} could explain ${topic} to literally anyone. Even a goldfish. 🐠`,
      `"So THAT'S what ${topic} means!" ${char} grinned. Not scary at all. ✨`,
    ],
    student: [
      `Once you find the right angle, ${topic} stops being complex — it becomes obvious.`,
      `${char} realized: ${topic} isn't hard. It was just explained badly before.`,
      `Break ${topic} into small pieces. Each piece makes perfect sense on its own.`,
    ],
    developer: [
      `At its core, ${topic} is an elegant system — ${analogy}. Pattern recognized.`,
      `${topic} maps cleanly to a known model. Architecture understood. 🔓`,
      `The abstraction layer clicked: ${topic} is just ${analogy}, with constraints.`,
    ],
  };
  return pick(resolutions[level]);
}

// --------------- HINDI STORIES ---------------

function buildHindiStory(topic: string, style: StoryStyle, level: ExplainLevel): string {
  const char = pick(["रवि", "प्रिया", "अर्जुन", "नेहा", "काजल", "विकास"]);
  const topicType = detectTopicType(topic);
  const analogyPool: Record<string, string[]> = {
    tech: ["डाक का सिस्टम", "एक रसोइया जो रेसिपी फॉलो करता है", "ट्रैफिक सिग्नल जो गाड़ियों को रास्ता दिखाता है"],
    science: ["बीज जो पेड़ बनता है", "नदी जो अपना रास्ता खुद बनाती है", "लेगो ब्लॉक्स जो कुछ भी बना सकते हैं"],
    general: ["साइकिल चलाना सीखना", "प्याज के छिलके उतारना", "पहेली के टुकड़े जोड़ना"],
  };
  const analogy = pick(analogyPool[topicType] || analogyPool.general);

  const hooks = [
    `"यार, ${topic} आखिर है क्या?" ${char} ने सिर खुजाते हुए पूछा।`,
    `${char} को ${topic} समझ नहीं आ रहा था। हर बार एक नई उलझन।`,
    `"सब कहते हैं ${topic} आसान है, पर मुझे तो कुछ समझ नहीं आता," ${char} बोला।`,
  ];

  const confusions = [
    `जितना पढ़ा, उतना और उलझ गया।`,
    `हर एक्सप्लेनेशन और मुश्किल लगता था।`,
    `किताबें, वीडियो — कुछ काम नहीं आया।`,
  ];

  const bridges = [
    `फिर किसी ने कहा: "${topic}? ये तो बस ${analogy} जैसा है।"`,
    `एक दोस्त ने समझाया: "इसे ${analogy} की तरह सोचो।"`,
    `तभी एक बात दिमाग में आई — ${topic} तो बस ${analogy} है।`,
  ];

  const aha = `💡 और अचानक… सब समझ आ गया।`;

  const styleFlavors: Record<StoryStyle, string[]> = {
    story: [`${char} मुस्कुराया — ${topic} की गुत्थी आखिर सुलझ गई।`],
    funny: [`"बस इतना सा था?! मैं तो PhD कर रहा था इस पर!" ${char} हंसा। 😂`],
    cinematic: [`सब कुछ रुक गया। धुंध छंटी। ${topic} एकदम साफ दिखा।`],
    teacher: [`"देखो, ${topic} को टुकड़ों में तोड़ो। हर टुकड़ा आसान है," ${char} ने समझाया।`],
  };

  const resolutions = [
    `${topic} उतना मुश्किल नहीं है — बस सही नज़रिए की ज़रूरत थी।`,
    `अब ${char} किसी को भी ${topic} समझा सकता था। 🎉`,
  ];

  return [pick(hooks), pick(confusions), pick(bridges), aha, pick(styleFlavors[style]), pick(resolutions)].join("\n\n");
}

// --------------- TELUGU STORIES ---------------

function buildTeluguStory(topic: string, style: StoryStyle, level: ExplainLevel): string {
  const char = pick(["రవి", "ప్రియ", "అర్జున్", "నేహ", "కిరణ్", "లక్ష్మి"]);
  const topicType = detectTopicType(topic);
  const analogyPool: Record<string, string[]> = {
    tech: ["ఉత్తరాల వ్యవస్థ", "వంటవాడు రెసిపీ ఫాలో చేయడం", "ట్రాఫిక్ సిగ్నల్ కార్లకు దారి చూపడం"],
    science: ["విత్తనం చెట్టు అవ్వడం", "నది తన దారి తానే చేసుకోవడం", "లెగో బ్లాక్స్‌తో ఏదైనా తయారు చేయడం"],
    general: ["సైకిల్ నేర్చుకోవడం", "ఉల్లిపాయ పొరలు తీయడం", "పజిల్ ముక్కలు కలపడం"],
  };
  const analogy = pick(analogyPool[topicType] || analogyPool.general);

  const hooks = [
    `"${topic} అంటే ఏమిటి?" ${char} తల గోక్కుంటూ అడిగాడు.`,
    `${char}కి ${topic} ఎంత చదివినా అర్థం కాలేదు.`,
    `"అందరూ ${topic} ఈజీ అంటారు, కానీ నాకు అర్థం కాదు," ${char} అన్నాడు.`,
  ];

  const confusions = [
    `ఎంత చదివితే అంత గందరగోళం.`,
    `ప్రతి వివరణ మరింత కష్టంగా అనిపించింది.`,
  ];

  const bridges = [
    `అప్పుడు ఎవరో చెప్పారు: "${topic}? ఇది ${analogy} లాంటిదే."`,
    `ఒక స్నేహితుడు చెప్పాడు: "దీన్ని ${analogy} లాగా ఆలోచించు."`,
  ];

  const aha = `💡 అకస్మాత్తుగా… అంతా అర్థమైంది.`;

  const styleFlavors: Record<StoryStyle, string[]> = {
    story: [`${char} నవ్వాడు — ${topic} చివరకు అర్థమైంది.`],
    funny: [`"ఇంతేనా?! నేను దీనికోసం చాలా సేపు ఆలోచించాను!" ${char} నవ్వాడు. 😂`],
    cinematic: [`అంతా ఆగిపోయింది. మబ్బు తొలగింది. ${topic} స్పష్టంగా కనిపించింది.`],
    teacher: [`"చూడు, ${topic}ని ముక్కలుగా విభజించు. ప్రతి ముక్క సులభం," ${char} వివరించాడు.`],
  };

  const resolutions = [
    `${topic} అంత కష్టం కాదు — సరైన దృష్టికోణం కావాలి.`,
    `ఇప్పుడు ${char} ఎవరికైనా ${topic} వివరించగలడు. 🎉`,
  ];

  return [pick(hooks), pick(confusions), pick(bridges), aha, pick(styleFlavors[style]), pick(resolutions)].join("\n\n");
}

// --------------- QUIZ GENERATOR ---------------

function generateQuiz(topic: string, analogy: string): { question: string; options: string[]; correct: number } {
  const quizzes = [
    {
      question: `What's a good way to think about ${topic}?`,
      options: [`It's like ${analogy}`, `It's completely random`, `Nobody can understand it`, `It has no real pattern`],
      correct: 0,
    },
    {
      question: `What's the first step to understanding ${topic}?`,
      options: [`Memorize everything`, `Find a simple comparison`, `Give up and move on`, `Read a 500-page book`],
      correct: 1,
    },
    {
      question: `Why do complex topics feel hard at first?`,
      options: [`They're actually impossible`, `We haven't found the right angle yet`, `Only experts can learn them`, `They require special tools`],
      correct: 1,
    },
  ];
  return pick(quizzes);
}

// --------------- NEXT TOPICS ---------------

const suggestedTopics = [
  "Artificial Intelligence", "Blockchain", "Quantum Physics", "Machine Learning",
  "Black Holes", "DNA & Genetics", "Cryptocurrency", "Neural Networks",
  "Climate Change", "Relativity", "Evolution", "Internet of Things",
  "Photosynthesis", "Supply & Demand", "Algorithms", "Dark Matter",
  "Cybersecurity", "Cloud Computing", "Big Data", "Renewable Energy",
];

function getNextTopics(currentTopic: string): string[] {
  const filtered = suggestedTopics.filter(t => t.toLowerCase() !== currentTopic.toLowerCase());
  return pickN(filtered, 3);
}

// --------------- MULTI-LANGUAGE ---------------

const translations: Record<Language, { learnedIt: string; stillConfused: string; nextUp: string }> = {
  en: { learnedIt: "✅ You learned something!", stillConfused: "Still confused? Ask anything…", nextUp: "Try next:" },
  hi: { learnedIt: "✅ आपने कुछ नया सीखा!", stillConfused: "अभी भी confused? कुछ भी पूछो…", nextUp: "अगला:" },
  te: { learnedIt: "✅ మీరు ఏదైనా నేర్చుకున్నారు!", stillConfused: "ఇంకా అర్థం కాలేదా? ఏదైనా అడగండి…", nextUp: "తదుపరి:" },
};

// --------------- REAL-LIFE EXAMPLES ---------------

function generateRealLifeExample(topic: string, type: string): string {
  const t = topic.toLowerCase();
  const techExamples: Record<string, string> = {
    "ai": "Netflix suggesting your next show — that's AI predicting your taste. 🎬",
    "blockchain": "A shared Google Doc nobody can secretly edit — that's blockchain. 📄",
    "machine learning": "Your spam filter learning which emails to block — that's ML in action. 📧",
    "algorithm": "A recipe you follow step-by-step to bake a cake — that's an algorithm. 🎂",
    "cybersecurity": "The lock on your front door, but for your digital life — that's cybersecurity. 🔒",
  };
  const scienceExamples: Record<string, string> = {
    "quantum": "Your phone's GPS uses quantum physics — without it, maps would be off by miles. 📍",
    "dna": "DNA is your body's instruction manual — eye color, height, everything. 🧬",
    "gravity": "Every time you drop your phone — that's gravity doing its thing. 📱",
    "evolution": "From wolves to chihuahuas — that's evolution shaped by humans. 🐕",
  };

  const pool = type === "tech" ? techExamples : type === "science" ? scienceExamples : {};
  for (const key of Object.keys(pool)) {
    if (t.includes(key)) return pool[key];
  }

  return pick([
    `Your phone uses principles of ${topic} every single day — you just don't notice. 📱`,
    `Next time you search online, remember: ${topic} is quietly working behind the scenes. ⚡`,
    `That weather app prediction? Closely tied to ${topic}. 🌤️`,
  ]);
}

// --------------- TITLE GENERATOR ---------------

function generateTitle(topic: string, style: StoryStyle): string {
  const titles: Record<StoryStyle, string[]> = {
    story: [`The Story of ${topic}`, `How ${topic} Finally Made Sense`, `${topic}: A Little Story`],
    funny: [`${topic} (It's Not That Scary)`, `The ${topic} Moment`, `Wait… That's ${topic}?!`],
    cinematic: [`${topic}: The Breakthrough`, `Into ${topic}`, `${topic} — Unveiled`],
    teacher: [`${topic} — Simply Explained`, `Understanding ${topic}`, `${topic}: The Basics`],
  };
  return pick(titles[style]);
}

// --------------- MAIN GENERATOR ---------------

export function generateStory(
  topic: string,
  style: StoryStyle,
  level: ExplainLevel = "student",
  lang: Language = "en"
): GeneratedStory {
  const topicType = detectTopicType(topic);
  const analogy = pick(analogies[topicType] || analogies.general);

  const story = buildStory(topic, style, level, lang);

  const summaries = [
    `${topic} is like ${analogy}. Simple when you find the right lens.`,
    `Break ${topic} into small pieces — each one clicks on its own.`,
    `The secret to ${topic}? Connect it to something you already know.`,
  ];

  const lessons = [
    `Even the trickiest ideas become clear with the right perspective. 💡`,
    `Understanding ${topic} isn't about being smart — it's about finding the right story. 📖`,
    `Every expert was once confused. Curiosity is the only prerequisite. 🔍`,
  ];

  return {
    title: generateTitle(topic, style),
    story,
    summary: pick(summaries),
    keyLesson: pick(lessons),
    realLifeExample: generateRealLifeExample(topic, topicType),
    quiz: generateQuiz(topic, analogy),
    nextTopics: getNextTopics(topic),
    language: lang,
  };
}

export function generateSimplerVersion(_story: GeneratedStory, topic: string, lang: Language = "en"): GeneratedStory {
  return generateStory(topic, "funny", "child", lang);
}

export { suggestedTopics, translations };
