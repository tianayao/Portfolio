"""Verify the static site's public HTML/asset boundaries without dependencies."""
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class Document(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.elements = []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        self.elements.append((tag, dict(attrs)))


class StaticShellTests(unittest.TestCase):
    def setUp(self):
        self.assertTrue((ROOT / 'index.html').is_file(), 'Static homepage is missing')
        self.doc = Document((ROOT / 'index.html').read_text())

    def test_landmarks_and_section_targets_are_available(self):
        tags = [tag for tag, _ in self.doc.elements]
        for tag in ['header', 'nav', 'main', 'footer', 'dialog', 'svg']:
            self.assertIn(tag, tags)
        ids = {attrs['id'] for _, attrs in self.doc.elements if 'id' in attrs}
        for target in ['main-content', 'home', 'intro', 'work', 'about', 'contact',
                       'project-grid', 'storybook-dialog', 'hero-content',
                       'intro-content', 'about-content', 'contact-links']:
            self.assertIn(target, ids)
        self.assertTrue(any(tag == 'a' and attrs.get('href') == '#main-content'
                            for tag, attrs in self.doc.elements))

    def test_mobile_metadata_and_module_entry_are_present(self):
        metas = {attrs.get('name'): attrs for tag, attrs in self.doc.elements if tag == 'meta'}
        self.assertIn('width=device-width', metas['viewport']['content'])
        self.assertTrue(metas['theme-color']['content'])
        self.assertTrue(any(tag == 'script' and attrs.get('type') == 'module'
                            and attrs.get('src', '').split('?', 1)[0] == 'assets/js/app.js'
                            for tag, attrs in self.doc.elements))

    def test_local_shell_assets_exist(self):
        for tag, attrs in self.doc.elements:
            for attribute in ['src', 'href']:
                value = attrs.get(attribute, '')
                if value and not value.startswith(('#', 'http:', 'https:', 'mailto:', 'data:')):
                    local_path = value.split('?', 1)[0]
                    self.assertTrue((ROOT / local_path).is_file(), f'Missing {value}')

    def test_deep_sections_keep_accessible_editable_fallbacks(self):
        source = (ROOT / 'index.html').read_text()
        self.assertIn('assets/css/sections.css', source)
        self.assertIn('assets/css/responsive.css', source)
        self.assertRegex(source, r'<img[^>]+reef-garden\.png[^>]+width="\d+"[^>]+height="\d+"')
        self.assertIn('id="skill-list"', source)
        self.assertIn('id="interest-list"', source)
        self.assertIn('id="contact-replacement-note"', source)
        self.assertRegex(source, r'<button[^>]+discovery-button[^>]+aria-expanded="false"[^>]+aria-controls=')
        self.assertRegex(source, r'<a[^>]+back-to-surface[^>]+href="#home"')

    def test_responsive_and_motion_contracts_are_explicit(self):
        source = (ROOT / 'assets/css/responsive.css').read_text()
        for contract in ['max-width: 960px', 'max-width: 680px', 'max-width: 460px',
                         'pointer: coarse', 'prefers-reduced-motion: reduce']:
            self.assertIn(contract, source)
        self.assertIn('.project-grid', source)
        self.assertIn('.storybook-book', source)
        self.assertIn('.discovery-button', source)

    def test_content_images_have_release_loading_metadata(self):
        images = {attrs.get('src'): attrs for tag, attrs in self.doc.elements if tag == 'img'}
        for source in ['assets/images/hero-jellyfish.png', 'assets/images/reef-garden.png']:
            self.assertIn(source, images)
            self.assertGreater(int(images[source].get('width', 0)), 0)
            self.assertGreater(int(images[source].get('height', 0)), 0)
            self.assertEqual(images[source].get('decoding'), 'async')
        hero = images['assets/images/hero-jellyfish.png']
        reef = images['assets/images/reef-garden.png']
        self.assertNotEqual(hero.get('loading'), 'lazy')
        self.assertEqual(hero.get('fetchpriority'), 'high')
        self.assertEqual(reef.get('loading'), 'lazy')

    def test_no_unintended_submission_or_blank_book_assets(self):
        for tag, attrs in self.doc.elements:
            if tag == 'form':
                action = attrs.get('action', '')
                self.assertFalse(action.startswith(('http://', 'https://')), action)
        searchable = [ROOT / 'index.html']
        searchable.extend((ROOT / 'assets').rglob('*.js'))
        searchable.extend((ROOT / 'assets').rglob('*.css'))
        combined = '\n'.join(path.read_text() for path in searchable).lower()
        for forbidden in ['blank-book.png', 'blank-book.jpg', 'blank_book']:
            self.assertNotIn(forbidden, combined)

    def test_motion_fallbacks_and_illustrative_policy_are_release_ready(self):
        for name in ['base.css', 'ocean.css', 'cards.css', 'storybook.css',
                     'sections.css', 'responsive.css']:
            source = (ROOT / 'assets/css' / name).read_text()
            self.assertIn('prefers-reduced-motion: reduce', source, name)
        content = (ROOT / 'assets/js/content.js').read_text()
        self.assertEqual(content.count("slug: '"), 6)
        self.assertIn('illustrative: true', content)
        for phrase in ['does not describe delivered work', 'No interviews, observations, or findings are claimed',
                       'No impact metrics are claimed']:
            self.assertIn(phrase, content)

    def test_release_docs_and_domain_files_cover_replacement_and_deployment(self):
        for path in ['README.md', 'docs/DEPLOYMENT.md', 'CNAME', '.nojekyll']:
            self.assertTrue((ROOT / path).is_file(), f'Missing release file: {path}')
        self.assertEqual((ROOT / 'CNAME').read_text().strip(), 'tinana.co.uk')
        readme = (ROOT / 'README.md').read_text()
        deployment = (ROOT / 'docs/DEPLOYMENT.md').read_text()
        for phrase in ['python3 -m http.server 4173', 'python3 -m unittest discover',
                       'assets/js/content.js', 'profile', 'contact', 'projects', 'chapters',
                       'coverMedia', 'hero-jellyfish', 'reef-garden']:
            self.assertIn(phrase, readme)
        for phrase in ['GitHub Pages', 'repository root', 'CNAME', 'Wix', 'tinana.co.uk',
                       'GitHub’s current documentation']:
            self.assertIn(phrase, deployment)


if __name__ == '__main__':
    unittest.main()
