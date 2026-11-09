// Composition root: later controllers attach to the semantic mounts in index.html.
// The HTML remains readable before JavaScript enhancement.
import { projects, profile, contact } from './content.js';
import { createStoryState } from './state.js';
import { createThemeController } from './theme.js';
import { initNavigation, initOcean } from './ocean.js';
import { renderProjectCards } from './cards.js?v=2';
import { createStorybook } from './storybook.js?v=2';
import { renderAbout, renderContact, initDiscoveries, initBackToSurface, syncPointerMode } from './sections.js?v=3';

export const storyState = createStoryState(projects);

let storage;
try { storage = window.localStorage; } catch { /* Storage access can be disabled. */ }
export const themeController = createThemeController(storage, document.documentElement, document.querySelectorAll('[data-theme-choice]'));

// textContent keeps editable profile copy separate from trusted interface markup.
for (const node of document.querySelectorAll('[data-profile]')) {
  const value = profile[node.dataset.profile];
  if (typeof value === 'string') node.textContent = value;
}
initNavigation();
initOcean();
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
