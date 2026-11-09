/** Edit this file to replace sample content. Null media/links are intentionally unavailable. */
export const profile = {
  displayName: '[Replace with your name]',
  role: 'UI/UX product designer — [replace with your role]',
  intro: '[Replace with a short introduction to your practice and the people you design for.]',
  philosophy: '[Replace with your design philosophy: what matters to you, and why.]',
  about: [
    '[Replace with your personal story, in your own words.]',
    '[Replace with the way you approach design, collaboration, and learning.]',
  ],
  skills: ['[Replace with a design skill]', '[Replace with a collaboration skill]'],
  interests: ['[Replace with a personal interest]'],
  experience: null,
  education: null,
  note: 'A little space for curiosity — [replace with your own note].',
};

export const contact = {
  email: null, // Replace with your email address; never publish a made-up address.
  linkedin: null, // Replace with your full LinkedIn URL.
  resume: null, // Replace with a local résumé path or an HTTPS URL.
  portfolioLinks: [], // Add { label, href } records for your other portfolio links.
  replacementNote: 'Contact details are awaiting replacement with your own email, LinkedIn, and résumé.',
};

export const chapterLabels = ['Overview', 'Problem', 'Research', 'Ideation', 'Solution', 'Reflection'];

// Each sample is an editable concept, never a claim of completed client work.
const samples = [
  { slug: 'tide-notes', title: 'Tide Notes', cardShape: 'clam', accent: '#996448', type: 'Illustrative · journaling concept', summary: 'An illustrative exploration of a quieter daily journal.', audience: 'people who want to reflect without pressure', question: 'How might a journal invite a small thought without demanding a daily streak?', direction: 'a single gentle prompt and an optional open writing space', caution: 'whether a quiet prompt feels inviting across different writing habits' },
  { slug: 'little-paths', title: 'Little Paths', cardShape: 'starfish', accent: '#9b5545', type: 'Illustrative · discovery concept', summary: 'An illustrative exploration of discovering nearby walks.', audience: 'people looking for a short nearby walk', question: 'How might someone choose a walk when time and energy are limited?', direction: 'routes described by time, terrain, and places to pause', caution: 'the reliability and accessibility of route information' },
  { slug: 'shell-library', title: 'Shell Library', cardShape: 'conch', accent: '#775c86', type: 'Illustrative · reading concept', summary: 'An illustrative exploration of a small personal reading library.', audience: 'readers gathering books and unfinished thoughts', question: 'How might a reading list stay useful without becoming another task list?', direction: 'a small shelf with flexible notes and an easy return to unfinished books', caution: 'whether flexible organization makes books easier to find' },
  { slug: 'blue-hour', title: 'Blue Hour', cardShape: 'whale', accent: '#416c83', type: 'Illustrative · planning concept', summary: 'An illustrative exploration of planning a more spacious day.', audience: 'people making room for a few meaningful daily tasks', question: 'How might planning make capacity visible before adding more tasks?', direction: 'a simple day view that includes breaks alongside commitments', caution: 'how different schedules and care responsibilities affect planning' },
  { slug: 'slow-table', title: 'Slow Table', cardShape: 'turtle', accent: '#496d59', type: 'Illustrative · food planning concept', summary: 'An illustrative exploration of flexible meal planning.', audience: 'people planning meals around what is already available', question: 'How might a meal plan adapt when ingredients or plans change?', direction: 'ingredient-led suggestions with clear substitutions and a reusable list', caution: 'dietary requirements, ingredient availability, and the clarity of substitutions' },
  { slug: 'drift-space', title: 'Drift Space', cardShape: 'jellyfish', accent: '#856385', type: 'Illustrative · collaboration concept', summary: 'An illustrative exploration of sharing early creative ideas.', audience: 'small teams sharing work before it feels finished', question: 'How might a shared space make the kind of feedback an idea needs clear?', direction: 'idea notes paired with a specific feedback request and visible context', caution: 'whether feedback requests support participation across different working styles' },
];

function chaptersFor(sample) {
  const narrative = [
    `Illustrative concept for ${sample.audience}. This sample frames a possible design journey; it does not describe delivered work, a client engagement, or measured results.`,
    `Illustrative design question: ${sample.question} The problem is a starting hypothesis, awaiting real context and validation.`,
    `Illustrative research plan: speak with ${sample.audience}, review existing approaches, and observe relevant tasks with consent. No interviews, observations, or findings are claimed here.`,
    `Illustrative ideation direction: explore ${sample.direction}. Compare a few low-fidelity alternatives before choosing a direction with participant input.`,
    `Illustrative proposed solution: ${sample.direction}. Replace this description and the media slots with your own screens, interaction details, and evidence. This is not a tested or launched product.`,
    `Illustrative reflection: a useful next step would be to investigate ${sample.caution}. Replace this sample with your own tradeoffs, learning, and supported outcomes.`,
  ];
  const insights = [
    'Illustrative scope only; add your actual role, collaborators, and dates.',
    'A question to investigate, rather than a validated user need.',
    'Research is proposed, not completed. Add evidence only when it exists.',
    'Show alternatives and the reasoning behind your real decisions.',
    'Replace sample media independently from the decorative ocean frame.',
    'No impact metrics are claimed. Add results only with supporting evidence.',
  ];
  return chapterLabels.map((label, index) => ({
    number: index + 1,
    label,
    title: `${label}: ${sample.title}`,
    narrative: narrative[index],
    insight: insights[index],
    images: Array.from({ length: index === 2 || index === 4 ? 2 : 1 }, (_, image) => ({
      src: null,
      alt: `Illustrative ${sample.title} ${label.toLowerCase()} media slot ${image + 1}; awaiting replacement`,
      caption: `Illustrative placeholder · ${label} ${image + 1}. Replace with your own image and caption.`,
    })),
  }));
}

export const projects = samples.map(sample => ({
  slug: sample.slug,
  title: sample.title,
  type: sample.type,
  summary: sample.summary,
  illustrative: true,
  cardShape: sample.cardShape,
  accent: sample.accent,
  coverMedia: { src: null, alt: `Illustrative ${sample.title} cover awaiting replacement`, caption: 'Illustrative placeholder · replace with your own project cover.' },
  chapters: chaptersFor(sample),
}));
