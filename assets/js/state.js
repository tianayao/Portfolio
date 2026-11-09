/** Deterministic reader state. No DOM, timers, storage, or animation dependencies. */
export function createStoryState(projects = []) {
  const initial = () => ({ activeProject: null, chapterIndex: 0, imageIndex: 0, isTransitioning: false, pendingChapter: null });
  let current = Object.freeze(initial());
  const update = changes => { current = Object.freeze({ ...current, ...changes }); return true; };
  const validChapter = index => Number.isInteger(index) && index >= 0 && index < (current.activeProject?.chapters?.length ?? 0);
  return {
    get state() { return current; },
    openProject(slug) {
      if (current.isTransitioning) return false;
      const project = projects.find(item => item.slug === slug);
      if (!project || !Array.isArray(project.chapters) || !project.chapters.length) return false;
      return update({ ...initial(), activeProject: project });
    },
    setChapter(index) {
      if (current.isTransitioning || !validChapter(index)) return false;
      return update({ chapterIndex: index, imageIndex: 0 });
    },
    moveImage(delta) {
      if (current.isTransitioning || !Number.isSafeInteger(delta)) return false;
      const images = current.activeProject?.chapters?.[current.chapterIndex]?.images;
      if (!Array.isArray(images) || !images.length) return false;
      const count = images.length;
      return update({ imageIndex: ((current.imageIndex + delta % count) % count + count) % count });
    },
    beginTransition(target) {
      if (current.isTransitioning || !validChapter(target) || target === current.chapterIndex) return false;
      return update({ isTransitioning: true, pendingChapter: target });
    },
    completeTransition() {
      if (!current.isTransitioning) return false;
      return update({ chapterIndex: current.pendingChapter, imageIndex: 0, isTransitioning: false, pendingChapter: null });
    },
    closeProject() { current = Object.freeze(initial()); return true; },
  };
}
