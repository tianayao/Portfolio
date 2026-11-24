// Composition root: later controllers attach to the semantic mounts in index.html.
// The HTML remains readable before JavaScript enhancement.
import { projects, profile, contact } from './content.js?v=18';
import { createStoryState } from './state.js';
import { createThemeController } from './theme.js';
import { initNavigation, initOcean } from './ocean.js';
import { renderProjectCards } from './cards.js?v=7';
import { createStorybook } from './storybook.js?v=10';
import { renderIntro, renderAbout, renderContact, initIntroConcepts, initDiscoveries, initBackToSurface, syncPointerMode } from './sections.js?v=9';

export const storyState = createStoryState(projects);

let storage;
try { storage = window.localStorage; } catch { /* Storage access can be disabled. */ }
export const themeController = createThemeController(storage, document.documentElement, document.querySelectorAll('[data-theme-choice]'));

initNavigation();
initOcean();
renderIntro(document, profile);
initIntroConcepts(document);
renderAbout(document, profile);
renderContact(document, contact);
initDiscoveries(document);
initBackToSurface(document, window);
syncPointerMode(document, window);

const projectGrid = document.querySelector('#project-grid');
const storybookDialog = document.querySelector('#storybook-dialog');
let cardRenderer;
export const storybook = storybookDialog ? createStorybook({
  dialog: storybookDialog,
  state: storyState,
  projects,
  getTheme: () => document.documentElement.dataset.theme || 'coast',
  onThemeChange: theme => themeController.setTheme(theme),
  onClosed: () => cardRenderer?.reset(),
}) : null;

if (projectGrid) cardRenderer = renderProjectCards(projectGrid, projects, (slug, origin) => storybook?.open(slug, origin));
