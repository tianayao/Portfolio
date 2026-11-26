import { test, assert, equal } from './harness.js';
import { createStoryState } from '../assets/js/state.js';
import { profile, contact, projects, chapterLabels } from '../assets/js/content.js?v=14';

const fixtures = [
  { slug: 'first', chapters: [{ images: [{}, {}, {}] }, { images: [{}] }, { images: [] }, {}] },
  { slug: 'second', chapters: [{ images: [{}] }] },
];
const opened = () => { const story = createStoryState(fixtures); story.openProject('first'); return story; };

// Catches missing project selection and stale indices after reopening.
test('opening a valid project selects its first chapter and image', () => {
  const story = opened();
  equal(story.state.activeProject.slug, 'first');
  equal(story.state.chapterIndex, 0); equal(story.state.imageIndex, 0);
  story.moveImage(2); story.setChapter(1); story.openProject('second');
  equal(story.state.activeProject.slug, 'second');
  equal(story.state.chapterIndex, 0); equal(story.state.imageIndex, 0);
});
// Catches gallery navigation leaking into chapter navigation or failing to wrap.
test('image navigation wraps independently within the current chapter', () => {
  const story = opened();
  equal(story.moveImage(-1), true); equal(story.state.imageIndex, 2);
  story.moveImage(1); equal(story.state.imageIndex, 0);
  story.moveImage(7); equal(story.state.imageIndex, 1);
  equal(story.state.chapterIndex, 0);
});
test('changing chapter resets the gallery to the first image', () => {
  const story = opened(); story.moveImage(2);
  equal(story.setChapter(1), true);
  equal(story.state.chapterIndex, 1); equal(story.state.imageIndex, 0);
});
test('invalid project chapter and image requests preserve state', () => {
  const story = opened(); story.moveImage(1);
  const before = story.state;
  for (const slug of ['missing', null, undefined]) equal(story.openProject(slug), false);
  for (const index of [-1, 4, 1.5, NaN, '1']) equal(story.setChapter(index), false);
  for (const delta of [NaN, Infinity, 0.5, '1']) equal(story.moveImage(delta), false);
  equal(story.state, before);
});
test('empty and missing galleries keep a safe zero image index', () => {
  const story = opened();
  story.setChapter(2); equal(story.moveImage(1), false); equal(story.state.imageIndex, 0);
  story.setChapter(3); equal(story.moveImage(-1), false); equal(story.state.imageIndex, 0);
});
// Catches rapid repeat navigation and premature changes during the animation.
test('a pending transition locks navigation until completion', () => {
  const story = opened(); story.moveImage(2);
  equal(story.beginTransition(1), true);
  equal(story.state.isTransitioning, true); equal(story.state.pendingChapter, 1);
  equal(story.state.chapterIndex, 0);
  equal(story.beginTransition(2), false); equal(story.setChapter(2), false);
  equal(story.moveImage(1), false); equal(story.openProject('second'), false);
  equal(story.completeTransition(), true);
  equal(story.state.chapterIndex, 1); equal(story.state.imageIndex, 0);
  equal(story.state.isTransitioning, false); equal(story.state.pendingChapter, null);
  equal(story.completeTransition(), false);
});
test('invalid transition targets never acquire the navigation lock', () => {
  const story = opened();
  for (const target of [-1, 4, NaN, 0.5, '1', 0]) equal(story.beginTransition(target), false);
  equal(story.state.isTransitioning, false);
});
test('closing cancels pending navigation and clears the active project', () => {
  const story = opened(); story.moveImage(2); story.beginTransition(1); story.closeProject();
  equal(story.state.activeProject, null); equal(story.state.chapterIndex, 0);
  equal(story.state.imageIndex, 0); equal(story.state.isTransitioning, false);
  equal(story.state.pendingChapter, null); equal(story.completeTransition(), false);
  equal(story.setChapter(0), false); equal(story.moveImage(1), false);
  equal(story.beginTransition(1), false);
});
test('state snapshots cannot be overwritten by consumers', () => {
  const story = opened();
  assert(Object.isFrozen(story.state));
  try { story.state.chapterIndex = 99; } catch { /* ES module strict mode */ }
  equal(story.state.chapterIndex, 0);
});

// Catches any real project falling back to fictional copy, invented claims, or a broken evidence route.
test('portfolio content distinguishes four factual case studies from two illustrative concepts', () => {
  equal(projects.length, 6);
  equal(new Set(projects.map(project => project.slug)).size, 6);
  equal(projects.map(project => project.cardShape).join(','), 'clam,starfish,conch,whale,turtle,jellyfish');
  equal(chapterLabels.join(','), 'Overview,Problem,Research,Ideation,Solution,Reflection');

  const snuffMouth = projects[0];
  equal(snuffMouth.slug, 'snuffmouth');
  equal(snuffMouth.title, 'SnuffMouth');
  equal(snuffMouth.illustrative, false);
  equal(snuffMouth.cardLabel, 'Design robotics case study');
  assert(/independent project/i.test(snuffMouth.type));
  assert(snuffMouth.type.includes('physical computing'));
  assert(snuffMouth.summary.includes('physical, visual and sonic feedback'));
  equal(snuffMouth.characterMedia.src, 'assets/images/work-tide-notes-porcupinefish.png');
  equal(snuffMouth.chapters.length, 6);
  const snuffNarrative = snuffMouth.chapters.map(chapter => `${chapter.title} ${chapter.narrative} ${chapter.insight}`).join(' ');
  for (const phrase of ['2026', 'three to four months', 'I designed', 'HC-SR04', 'Arduino/C++', 'stepper', 'Music Maker', 'humidifier', 'laser-cut', 'campus art museum', 'photograph', 'cleaning', 'torque']) {
    assert(snuffNarrative.includes(phrase), `Missing SnuffMouth evidence: ${phrase}`);
  }
  assert(!/\bteam project\b|\bthe team\b|\bwe\b/i.test(`${snuffMouth.type} ${snuffNarrative}`), 'SnuffMouth must preserve Tina\'s sole ownership');
  const snuffResearch = snuffMouth.chapters.find(chapter => chapter.label === 'Research');
  equal(snuffResearch.sources.map(source => source.href).join(','), [
    'https://www.who.int/en/news-room/fact-sheets/detail/tobacco',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC11154104/',
  ].join(','));
  for (const source of snuffResearch.sources) assert(source.label?.length > 0 && source.href.startsWith('https://'));
  const snuffMedia = snuffMouth.chapters.flatMap(chapter => chapter.images);
  equal(snuffMedia.length, 7);
  equal(snuffMedia.map(image => image.src).join(','), [
    'assets/images/snuffmouth/snuffmouth-overview-final-output.png',
    'assets/images/snuffmouth/snuffmouth-problem-cutout.png',
    'assets/images/snuffmouth/snuffmouth-research-school-exposure.png',
    'assets/images/snuffmouth/snuffmouth-research-asia-smoking.png',
    'assets/images/snuffmouth/snuffmouth-solution-storyboard.png',
    'assets/images/snuffmouth/snuffmouth-solution-concept-material.png',
    'assets/images/snuffmouth/snuffmouth-reflection-prototype.png',
  ].join(','));
  for (const media of snuffMedia) {
    assert(media.alt?.length > 0 && media.caption?.length > 0);
    assert(!/placeholder|awaiting/i.test(`${media.alt} ${media.caption}`));
    equal(Object.hasOwn(media, 'href'), false);
  }

  const exoFits = projects[1];
  equal(exoFits.slug, 'exofits');
  equal(exoFits.title, 'Exo-Fits');
  equal(exoFits.illustrative, false);
  equal(exoFits.cardLabel, 'Interactive AR installation case study');
  equal(exoFits.type, 'Independent project · AR, body tracking & exhibition design');
  assert(exoFits.summary.includes('immersive AR spacewear experience'));
  equal(exoFits.characterMedia.src, 'assets/images/work-little-paths-tuna.png');
  equal(exoFits.coverMedia.src, 'assets/images/exofits/exofits-overview-panorama.png');
  equal(exoFits.chapters.length, 6);
  const exoNarrative = exoFits.chapters.map(chapter => `${chapter.title} ${chapter.narrative} ${chapter.insight}`).join(' ');
  for (const phrase of ['planetary', 'body tracking', 'camera', 'iPad', 'Unity', 'projector', 'qualitative', 'solo visitor', 'gesture']) {
    assert(exoNarrative.includes(phrase), `Missing Exo-Fits evidence: ${phrase}`);
  }
  assert(!/\bgroup project\b|\bthe team\b|\bwe\b/i.test(`${exoFits.type} ${exoNarrative}`), 'Exo-Fits copy must preserve the approved independent-project framing');
  const exoOverview = exoFits.chapters.find(chapter => chapter.label === 'Overview');
  equal(exoOverview.images.length, 1);
  equal(exoOverview.images[0].src, 'assets/images/exofits/exofits-overview-panorama.png');
  equal(exoOverview.images[0].panorama, true);
  equal(exoOverview.images[0].href, 'https://www.figma.com/design/hgR9uTrAHUs9RrchdEiw8D/exhibtion?node-id=0-1&t=eJpDqFuzQuz0Gr5B-1');
  equal(exoOverview.images[0].cta, 'Open interactive prototype in Figma ↗\uFE0E');
  const exoResearch = exoFits.chapters.find(chapter => chapter.label === 'Research');
  equal(exoResearch.sources.map(source => source.href).join(','), [
    'https://science.nasa.gov/solar-system/planets/',
    'https://docs.unity.cn/Packages/com.unity.xr.arfoundation%406.6/manual/features/body-tracking.html',
  ].join(','));
  const exoMedia = exoFits.chapters.flatMap(chapter => chapter.images);
  equal([...new Set(exoMedia.map(image => image.src))].join(','), [
    'assets/images/exofits/exofits-overview-panorama.png',
    'assets/images/exofits/exofits-poster-question.png',
    'assets/images/exofits/exofits-poster-jupiter.png',
    'assets/images/exofits/exofits-concept-hand-projection.png',
    'assets/images/exofits/exofits-concept-full-body-projection.png',
    'assets/images/exofits/exofits-instructions.png',
    'assets/images/exofits/exofits-poster-orange.png',
  ].join(','));
  for (const media of exoMedia) {
    assert(media.alt?.length > 0 && media.caption?.length > 0);
    assert(!/placeholder|awaiting/i.test(`${media.alt} ${media.caption}`));
  }

  const caseStudy = projects[2];
  equal(caseStudy.slug, 'bl-universal-media-library');
  equal(caseStudy.title, 'BL Universal Media Library');
  equal(caseStudy.illustrative, false);
  equal(caseStudy.cardLabel, 'Product design case study');
  assert(caseStudy.summary.includes('discovery and tracking layer'));
  equal(caseStudy.chapters.length, 6);
  const blNarrative = caseStudy.chapters.map(chapter => `${chapter.title} ${chapter.narrative} ${chapter.insight}`).join(' ');
  for (const phrase of ['Japan', 'China', 'Korea', 'desk research', 'community observation', 'prototype testing', 'official provider', 'approximately 170 million monthly users', 'more than 150 countries', 'broader webcomic context', 'not BL market size', 'no formal interviews']) {
    assert(blNarrative.includes(phrase), `Missing BL case-study evidence: ${phrase}`);
  }
  assert(/does not host|not a content host/i.test(blNarrative));
  assert(/automated QA.+cannot|cannot.+automated QA/i.test(blNarrative));
  const blResearch = caseStudy.chapters.find(chapter => chapter.label === 'Research');
  equal(blResearch.sources.map(source => source.href).join(','), [
    'https://journals.sagepub.com/doi/pdf/10.1177/29768624251320367',
    'https://www.sec.gov/Archives/edgar/data/1997859/000119312524162032/d396527ds1a.htm',
    'https://about.webtoon.com/terms',
  ].join(','));
  for (const [index, chapter] of caseStudy.chapters.entries()) {
    equal(chapter.number, index + 1);
    equal(chapter.label, chapterLabels[index]);
    for (const field of ['title', 'narrative', 'insight']) assert(chapter[field]?.length > 0, `Missing Work 03 ${field}`);
    equal(chapter.images.length, 1);
    equal(chapter.images[0].href, 'https://bl-universal-media-library-portfolio.dessertthebest.chatgpt.site/');
    assert(chapter.images[0].title.includes('BL Universal Media Library'));
  }

  equal(projects.filter(project => project.illustrative).length, 2);
  equal(projects.filter(project => !project.illustrative).length, 4);
  for (const project of projects) {
    for (const field of ['slug', 'title', 'type', 'summary', 'accent']) assert(project[field]?.length > 0, `Missing ${field}`);
    assert(project.cardLabel?.length > 0);
    assert(project.coverMedia.caption?.length > 0);
    equal(project.chapters.length, 6);
    project.chapters.forEach((chapter, index) => {
      equal(chapter.number, index + 1); equal(chapter.label, chapterLabels[index]);
      for (const field of ['title', 'narrative', 'insight']) assert(chapter[field]?.length > 0, `Missing ${field}`);
      assert(Array.isArray(chapter.images));
      for (const image of chapter.images) assert(image.caption && Object.hasOwn(image, 'src'));
    });
  }
  for (const project of projects.filter(project => project.illustrative)) {
    equal(project.cardLabel, 'Coming soon');
    equal(project.locked, true);
    equal(createStoryState(projects).openProject(project.slug), false);
    assert(project.coverMedia.caption.includes('Illustrative'));
  }
  equal(profile.displayName, 'Tina!');
  equal(profile.role, 'Curious about people. Playful with technology.');
  equal(profile.intro.length, 2);
  equal(profile.philosophy.length, 2);
  assert(profile.intro.some(paragraph => paragraph.includes('**Interactive Media and Design Informatics**')));
  assert(profile.intro[0].includes('creative marketing, audience research and experience design'));
  assert(!profile.intro.some(paragraph => paragraph.startsWith('My experience spans SEO')));
  assert(profile.philosophy.some(paragraph => paragraph.includes('**empathy, cultural curiosity and experimentation**')));
  equal(profile.about.length, 3);
  assert(profile.about[0].includes('creative marketing, audience research and design technology'));
  equal(profile.skillGroups.length, 3);
  equal(profile.skillGroups.map(group => group.title).join(','), 'Creative & Marketing,Audience & Strategy,Design & Technology');
  equal(profile.skillGroups.map(group => group.items.length).join(','), '4,4,6');
  assert(profile.skillGroups.flatMap(group => group.items).includes('SEO & Audience Growth'));
  assert(profile.skillGroups.flatMap(group => group.items).includes('Python, SQL & AI Workflows'));
  assert(profile.skillGroups.flatMap(group => group.items).includes('Arduino, C++ & Physical Computing'));
  assert(profile.skillGroups.flatMap(group => group.items).includes('Digital Fabrication & Prototyping'));
  assert(profile.about.some(paragraph => paragraph.includes('Arduino/C++ and digital fabrication')));
  equal(profile.note, 'A little space for curiosity — where small observations grow into playful ideas.');
  assert(profile.about.length > 0 && profile.skillGroups.every(group => group.items.length > 0));
  equal(contact.email, '030224yaoyu@gmail.com');
  equal(contact.linkedin, 'https://www.linkedin.com/in/yu-yao-221647179/');
  equal(contact.resume, null);
});
