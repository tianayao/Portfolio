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
        self.assertEqual(source.count('data-skill-group'), 3)
        for phrase in ['Creative &amp; Marketing', 'Audience &amp; Strategy',
                       'Design &amp; Technology', 'SEO &amp; Audience Growth',
                       'Python, SQL &amp; AI Workflows',
                       'Where audience insight, creative storytelling and technology come together.']:
            self.assertIn(phrase, source)
        self.assertNotIn('[Replace with your personal story', source)
        self.assertNotIn('[Replace with a design skill]', source)
        self.assertNotIn('[Replace with a personal interest]', source)
        self.assertIn('id="contact-replacement-note"', source)
        self.assertRegex(source, r'<button[^>]+discovery-button[^>]+aria-expanded="false"[^>]+aria-controls=')
        self.assertRegex(source, r'<a[^>]+back-to-surface[^>]+href="#home"')

    def test_public_status_copy_matches_the_completed_profile(self):
        source = (ROOT / 'index.html').read_text()
        self.assertIn('Four real case studies · two clearly labelled illustrative explorations.', source)
        self.assertIn('Four real case studies and two illustrative concepts', source)
        self.assertNotIn('One product-design case study and five illustrative concepts', source)
        self.assertNotIn('Personal details and five illustrative concepts are awaiting replacement.', source)

        readme = (ROOT / 'README.md').read_text()
        self.assertIn('Four real case studies and two explicitly illustrative concepts', readme)
        self.assertIn('profile.skillGroups', readme)
        self.assertNotIn('profile.skills', readme)
        self.assertNotIn('profile.interests', readme)

        content = (ROOT / 'assets/js/content.js').read_text()
        for path in [
                'assets/images/snuffmouth/snuffmouth-overview-final-output.png',
                'assets/images/snuffmouth/snuffmouth-problem-cutout.png',
                'assets/images/snuffmouth/snuffmouth-research-school-exposure.png',
                'assets/images/snuffmouth/snuffmouth-research-asia-smoking.png',
                'assets/images/snuffmouth/snuffmouth-solution-storyboard.png',
                'assets/images/snuffmouth/snuffmouth-solution-concept-material.png',
                'assets/images/snuffmouth/snuffmouth-reflection-prototype.png']:
            self.assertIn(path, content)

    def test_contact_fallbacks_link_to_tinas_email_and_linkedin(self):
        links = [attrs for tag, attrs in self.doc.elements if tag == 'a']
        self.assertTrue(any(link.get('href') == 'mailto:030224yaoyu@gmail.com'
                            for link in links))
        self.assertTrue(any(link.get('href') == 'https://www.linkedin.com/in/yu-yao-221647179/'
                            for link in links))
        notes = [attrs for _, attrs in self.doc.elements
                 if attrs.get('id') == 'contact-replacement-note']
        self.assertEqual(len(notes), 1)
        self.assertIn('hidden', notes[0])

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

    def test_snuffmouth_storybook_evidence_is_local_and_nonempty(self):
        content = (ROOT / 'assets/js/content.js').read_text()
        for phrase in [
            'Independent project',
            'campus art museum',
            'motor torque',
            'https://www.who.int/en/news-room/fact-sheets/detail/tobacco',
            'https://pmc.ncbi.nlm.nih.gov/articles/PMC11154104/',
        ]:
            self.assertIn(phrase, content)
        self.assertNotIn("type: 'Team project · physical computing & interaction design'", content)
        paths = [
            'assets/images/snuffmouth/snuffmouth-overview-final-output.png',
            'assets/images/snuffmouth/snuffmouth-problem-cutout.png',
            'assets/images/snuffmouth/snuffmouth-research-school-exposure.png',
            'assets/images/snuffmouth/snuffmouth-research-asia-smoking.png',
            'assets/images/snuffmouth/snuffmouth-solution-storyboard.png',
            'assets/images/snuffmouth/snuffmouth-solution-concept-material.png',
            'assets/images/snuffmouth/snuffmouth-reflection-prototype.png',
        ]
        for relative in paths:
            asset = ROOT / relative
            self.assertTrue(asset.is_file(), f'Missing SnuffMouth evidence: {relative}')
            self.assertGreater(asset.stat().st_size, 10_000, f'SnuffMouth evidence is unexpectedly small: {relative}')

    def test_exofits_storybook_is_independent_traceable_and_uses_local_evidence(self):
        content = (ROOT / 'assets/js/content.js').read_text()
        for phrase in [
            "slug: 'exofits'",
            'Independent project · AR, body tracking & exhibition design',
            'Open interactive prototype in Figma ↗',
            'https://science.nasa.gov/solar-system/planets/',
            'https://docs.unity.cn/Packages/com.unity.xr.arfoundation%406.6/manual/features/body-tracking.html',
            'https://www.figma.com/design/hgR9uTrAHUs9RrchdEiw8D/exhibtion?node-id=0-1&t=eJpDqFuzQuz0Gr5B-1',
        ]:
            self.assertIn(phrase, content)
        self.assertNotIn("slug: 'little-paths'", content)
        paths = [
            'assets/images/exofits/exofits-concept-full-body-projection.png',
            'assets/images/exofits/exofits-concept-hand-projection.png',
            'assets/images/exofits/exofits-poster-orange.png',
            'assets/images/exofits/exofits-poster-jupiter.png',
            'assets/images/exofits/exofits-poster-question.png',
            'assets/images/exofits/exofits-instructions.png',
            'assets/images/exofits/exofits-overview-panorama.png',
        ]
        for relative in paths:
            asset = ROOT / relative
            self.assertTrue(asset.is_file(), f'Missing Exo-Fits evidence: {relative}')
            self.assertGreater(asset.stat().st_size, 10_000, f'Exo-Fits evidence is unexpectedly small: {relative}')

    def test_intro_video_is_local_user_activated_and_directly_playable(self):
        videos = [attrs for tag, attrs in self.doc.elements if tag == 'video'
                  and attrs.get('id') == 'intro-video']
        self.assertEqual(len(videos), 1, 'Introduction video is missing')
        video = videos[0]
        self.assertIn('controls', video)
        self.assertIn('playsinline', video)
        self.assertNotIn('autoplay', video)
        self.assertNotIn('loop', video)
        self.assertEqual(video.get('preload'), 'metadata')
        self.assertEqual(video.get('aria-label'), "Play Tina's introduction video")
        self.assertEqual(video.get('poster'), 'assets/images/tina-introduction-poster.jpg')

        sources = [attrs for tag, attrs in self.doc.elements if tag == 'source'
                   and attrs.get('src') == 'assets/media/tina-introduction.m4v']
        self.assertEqual(len(sources), 1)
        self.assertEqual(sources[0].get('type'), 'video/mp4')
        self.assertTrue((ROOT / video['poster']).is_file())
        self.assertTrue((ROOT / sources[0]['src']).is_file())

    def test_intro_exploration_has_three_readable_concepts(self):
        tabs = [attrs for tag, attrs in self.doc.elements
                if tag == 'button' and 'concept-tab' in attrs.get('class', '').split()]
        panels = [attrs for _, attrs in self.doc.elements if 'data-concept-panel' in attrs]
        self.assertEqual([tab.get('data-concept-tab') for tab in tabs],
                         ['observe', 'listen', 'make'])
        self.assertEqual([panel.get('data-concept-panel') for panel in panels],
                         ['observe', 'listen', 'make'])
        self.assertTrue(all(tab.get('role') == 'tab' for tab in tabs))
        self.assertTrue(all('hidden' not in panel for panel in panels),
                        'All definitions must remain readable before JavaScript runs')
        controls = {tab.get('aria-controls') for tab in tabs}
        panel_ids = {panel.get('id') for panel in panels}
        self.assertEqual(controls, panel_ids)

    def test_intro_mobile_reading_order_is_concepts_note_then_video(self):
        positions = {}
        for index, (_, attrs) in enumerate(self.doc.elements):
            classes = attrs.get('class', '').split()
            if 'intro-concepts' in classes:
                positions['concepts'] = index
            if 'paper-note' in classes:
                positions['note'] = index
            if 'intro-video-card' in classes:
                positions['video'] = index
        self.assertEqual(set(positions), {'concepts', 'note', 'video'})
        self.assertLess(positions['concepts'], positions['note'])
        self.assertLess(positions['note'], positions['video'])

    def test_intro_editorial_spread_removes_old_principles_and_respects_motion(self):
        shell = (ROOT / 'index.html').read_text()
        ocean = (ROOT / 'assets/css/ocean.css').read_text()
        self.assertNotIn('principle-row', shell)
        self.assertNotIn('Audience insight', shell)
        self.assertNotIn('Creative experimentation', shell)
        for contract in [
                '@media (min-width: 961px)',
                '.intro-heading::before',
                '.intro-story::before',
                'intro-shoreline-drift',
                '.intro-copy-group--philosophy:hover',
                'prefers-reduced-motion: reduce']:
            self.assertIn(contract, ocean)

    def test_turtle_release_uses_a_cache_busted_contained_image(self):
        content = (ROOT / 'assets/js/content.js').read_text()
        cards = (ROOT / 'assets/js/cards.js').read_text()
        self.assertIn("'slow-table': 'assets/images/work-slow-table-turtle.png?v=2'", content)
        self.assertIn("character.style.objectFit = 'contain'", cards)
        self.assertIn("character.style.objectPosition = 'center center'", cards)

    def test_exofits_posters_use_a_portrait_storybook_treatment(self):
        content = (ROOT / 'assets/js/content.js').read_text()
        storybook = (ROOT / 'assets/css/storybook.css').read_text()
        exofits = content[content.index('function exoFitsChapters()'):content.index('function prototypeCover')]
        self.assertEqual(exofits.count("layout: 'portrait'"), 5)
        self.assertIn('.storybook-media-image--portrait', storybook)

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
        self.assertIn('illustrative: sample.illustrative !== false', content)
        self.assertEqual(content.count('illustrative: false'), 4)
        self.assertIn('Product design case study', content)
        self.assertIn('https://bl-universal-media-library-portfolio.dessertthebest.chatgpt.site/', content)
        for phrase in ['does not describe delivered work', 'No interviews, observations, or findings are claimed',
                       'No impact metrics are claimed']:
            self.assertIn(phrase, content)
        shell = (ROOT / 'index.html').read_text()
        self.assertIn('Four real case studies and two illustrative concepts', shell)
        self.assertNotIn('One product-design case study and five illustrative concepts', shell)
        self.assertNotIn('Six illustrative concepts', shell)

    def test_bl_case_study_uses_traceable_research_without_invented_validation(self):
        content = (ROOT / 'assets/js/content.js').read_text()
        for phrase in [
            'Japan, China and Korea',
            'desk research',
            'community observation',
            'prototype testing',
            'approximately 170 million monthly users',
            'broader webcomic context, not BL market size',
            'no formal interviews',
            'https://journals.sagepub.com/doi/pdf/10.1177/29768624251320367',
            'https://www.sec.gov/Archives/edgar/data/1997859/000119312524162032/d396527ds1a.htm',
            'https://about.webtoon.com/terms',
        ]:
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
