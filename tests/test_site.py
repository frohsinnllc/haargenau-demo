"""Static acceptance contract. Run with Python's standard library only."""
from html.parser import HTMLParser
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]

class Document(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.nodes = []
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        self.nodes.append((tag, dict(attrs)))

class SiteContract(unittest.TestCase):
    def setUp(self):
        self.assertTrue((ROOT / 'index.html').exists(), 'Missing implemented page: index.html')
        self.html = (ROOT / 'index.html').read_text()
        self.doc = Document(self.html)
        self.text = re.sub(r'\s+', ' ', re.sub('<[^>]+>', ' ', self.html))
    def test_semantics_and_hero(self):
        self.assertIn(('html', {'lang': 'de'}), self.doc.nodes)
        for tag in ['main', 'header', 'footer', 'h1']:
            self.assertEqual(sum(t == tag for t, _ in self.doc.nodes), 1, tag)
        self.assertIn('Haargenau. Ihr Friseur in Frankfurt.', self.text)
    def test_verified_facts(self):
        for fact in ['Ginnheimer Landstraße 173', '60431 Frankfurt', '069 523239', '9:30–18:00', '9:30–19:00', '9:00–15:00']:
            self.assertIn(fact, self.text)
    def test_demo_and_honesty(self):
        for tag in ['header', 'footer']:
            content = re.search(fr'<{tag}\b[^>]*>(.*?)</{tag}>', self.html, re.S).group(1)
            self.assertIn('Demo', content)
        for text in ['Vorschlag', 'kein bestätigtes Leistungsangebot', 'Illustration', 'kein Salonsfoto']:
            self.assertIn(text, self.text)
        self.assertTrue(any(t == 'meta' and a.get('name') == 'robots' and 'noindex' in a.get('content', '') for t, a in self.doc.nodes))
        self.assertFalse((ROOT / 'robots.txt').exists())
    def test_links_and_anchors(self):
        ids = [a['id'] for _, a in self.doc.nodes if 'id' in a]
        self.assertEqual(len(ids), len(set(ids)))
        links = [a['href'] for t, a in self.doc.nodes if t == 'a']
        self.assertIn('tel:+4969523239', links)
        self.assertTrue(any(h.startswith('https://www.google.com/maps/') for h in links))
        for href in links:
            if href.startswith('#'):
                self.assertIn(href[1:], ids)
    def test_self_contained_and_no_forms(self):
        self.assertNotIn('form', [t for t, _ in self.doc.nodes])
        for tag, attrs in self.doc.nodes:
            if tag in ['script', 'img', 'link']:
                path = attrs.get('src', attrs.get('href', ''))
                self.assertNotRegex(path, r'^(https?:)?//')
                self.assertTrue((ROOT / path).is_file(), path)
        css = (ROOT / 'styles.css').read_text()
        self.assertNotIn('@import', css)
        self.assertNotRegex(css, r'https?://')
        for marker in ['prefers-reduced-motion', ':focus-visible', '@media', '44px']:
            self.assertIn(marker, css)
        js = (ROOT / 'script.js').read_text()
        self.assertNotRegex(js, r'fetch\(|localStorage|document.cookie|XMLHttpRequest')
    def test_illustration_is_local_valid_svg(self):
        import xml.etree.ElementTree as ET
        svg = ET.parse(ROOT / 'assets/hair-illustration.svg').getroot()
        self.assertTrue(svg.tag.endswith('svg'))
        self.assertIn('viewBox', svg.attrib)

if __name__ == '__main__':
    unittest.main()
