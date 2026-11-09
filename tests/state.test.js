import { test, assert, equal } from './harness.js';
import { createStoryState } from '../assets/js/state.js';
import { profile, contact, projects, chapterLabels } from '../assets/js/content.js';

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

// Catches incomplete editable records that would leave cards or book pages empty.
test('illustrative content supplies six distinct complete project journeys', () => {
  equal(projects.length, 6);
  equal(new Set(projects.map(project => project.slug)).size, 6);
  equal(projects.map(project => project.cardShape).join(','), 'clam,starfish,conch,whale,turtle,jellyfish');
  equal(chapterLabels.join(','), 'Overview,Problem,Research,Ideation,Solution,Reflection');
  for (const project of projects) {
    assert(project.illustrative === true);
    for (const field of ['slug', 'title', 'type', 'summary', 'accent']) assert(project[field]?.length > 0, `Missing ${field}`);
    assert(project.coverMedia.caption.includes('Illustrative'));
    equal(project.chapters.length, 6);
    project.chapters.forEach((chapter, index) => {
      equal(chapter.number, index + 1); equal(chapter.label, chapterLabels[index]);
      for (const field of ['title', 'narrative', 'insight']) assert(chapter[field]?.length > 0, `Missing ${field}`);
      assert(Array.isArray(chapter.images));
      for (const image of chapter.images) assert(image.caption && Object.hasOwn(image, 'src'));
    });
  }
  assert(profile.displayName.includes('Replace'));
  assert(profile.about.length > 0 && profile.skills.length > 0 && profile.interests.length > 0);
  equal(contact.email, null); equal(contact.linkedin, null); equal(contact.resume, null);
});
