"""Integration checks for the real local services; uses ephemeral ports."""
from functools import partial
from http.server import ThreadingHTTPServer
from pathlib import Path
import threading
import unittest
from urllib.request import Request, urlopen
from urllib.error import HTTPError
import json
from serve import Target, Dashboard, EVENTS


class LabTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.servers = []
        for handler in (Target, partial(Dashboard, directory=str(Path(__file__).parent / 'web'))):
            server = ThreadingHTTPServer(('127.0.0.1', 0), handler)
            cls.servers.append(server)
            threading.Thread(target=server.serve_forever, daemon=True).start()
        cls.servers[1].target_port = cls.servers[0].server_port
        cls.base = 'http://127.0.0.1:' + str(cls.servers[0].server_port)
        cls.web = 'http://127.0.0.1:' + str(cls.servers[1].server_port)

    @classmethod
    def tearDownClass(cls):
        for server in cls.servers:
            server.shutdown()
            server.server_close()

    def request(self, path, headers=None):
        try:
            response = urlopen(Request(self.base + path, headers=headers or {}), timeout=3)
        except HTTPError as error:
            response = error
        with response:
            return response.status, json.loads(response.read())

    def test_health_and_failures(self):
        for path, expected in [('/health', 200), ('/incident', 503), ('/missing', 404)]:
            with self.subTest(path=path):
                self.assertEqual(self.request(path)[0], expected)

    def test_access_control(self):
        self.assertEqual(self.request('/protected')[0], 401)
        self.assertEqual(self.request('/protected', {'Authorization': 'Bearer wrong'})[0], 401)
        self.assertEqual(self.request('/protected', {'Authorization': 'Bearer lab-student'})[0], 200)

    def test_logs_bounded_and_no_credentials(self):
        EVENTS.clear()
        self.request('/protected', {'Authorization': 'Bearer wrong'})
        status, payload = self.request('/logs')
        self.assertEqual(status, 200)
        self.assertEqual(payload['events'][0]['status'], 401)
        self.assertNotIn('Bearer', json.dumps(payload))
        self.assertEqual(EVENTS.maxlen, 200)

    def test_local_baseline_endpoint(self):
        with urlopen(self.web + '/local-baseline.json', timeout=3) as response:
            self.assertEqual(response.headers['Cache-Control'], 'no-store')
            data = json.loads(response.read())
            if data is not None:
                self.assertIn('gateway', data)
                self.assertIn('dns', data)
        with self.assertRaises(HTTPError) as error:
            urlopen(self.web + '/private/baseline.json', timeout=3)
        self.assertEqual(error.exception.code, 404)

    def test_website_health(self):
        with urlopen(self.web + '/site-health', timeout=3) as response:
            self.assertEqual(json.loads(response.read()), {'dashboard': True, 'target': True})
        port = self.servers[1].target_port
        self.servers[1].target_port = None
        try:
            with urlopen(self.web + '/site-health', timeout=3) as response:
                self.assertEqual(json.loads(response.read()), {'dashboard': True, 'target': False})
        finally:
            self.servers[1].target_port = port

    def test_dashboard_and_asset(self):
        for path, marker in [('/', b'Kyle traverses and secures networks'), ('/app.js', b'const labs'), ('/style.css', b'color-scheme')]:
            with urlopen(self.web + path, timeout=3) as response:
                self.assertEqual(response.status, 200)
                self.assertIn(marker, response.read())
        with self.assertRaises(HTTPError) as error:
            urlopen(self.web + '/.env.local', timeout=3)
        self.assertEqual(error.exception.code, 404)


if __name__ == '__main__':
    unittest.main(verbosity=2)
