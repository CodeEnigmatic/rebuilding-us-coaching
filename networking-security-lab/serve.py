#!/usr/bin/env python3
"""Dependency-free, loopback-only networking practice lab."""
import argparse
from collections import deque
from datetime import datetime, timezone
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer, BaseHTTPRequestHandler
import json
from pathlib import Path
import threading
from urllib.request import urlopen

EVENTS = deque(maxlen=200)
LOCK = threading.Lock()

class Target(BaseHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split('?', 1)[0]
        if path == '/health':
            status, payload = 200, {'service': 'practice-target', 'status': 'healthy'}
        elif path == '/protected':
            authorized = self.headers.get('Authorization') == 'Bearer lab-student'
            status = 200 if authorized else 401
            payload = {'message': 'Access granted' if authorized else 'Bearer token required'}
        elif path == '/incident':
            status, payload = 503, {'error': 'Intentional training outage', 'hint': 'Compare /health with /incident. The listener is available.'}
        elif path == '/logs':
            with LOCK:
                payload = {'events': list(EVENTS)}
            status = 200
        else:
            status, payload = 404, {'error': 'No such route', 'routes': ['/health', '/protected', '/incident', '/logs']}
        with LOCK:
            EVENTS.append({'time': datetime.now(timezone.utc).isoformat(), 'client': self.client_address[0], 'method': 'GET', 'path': path, 'status': status})
        body = (json.dumps(payload, indent=2) + '\n').encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(body)))
        if status == 401:
            self.send_header('WWW-Authenticate', 'Bearer realm="training"')
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *_):
        pass

class Dashboard(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.split('?', 1)[0] == '/site-health':
            healthy = False
            port = getattr(self.server, 'target_port', None)
            if port:
                try:
                    with urlopen(f'http://127.0.0.1:{port}/health', timeout=2) as response:
                        healthy = response.status == 200 and json.loads(response.read()).get('status') == 'healthy'
                except Exception:
                    healthy = False
            body = json.dumps({'dashboard': True, 'target': healthy}).encode()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Cache-Control', 'no-store')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        if self.path.split('?', 1)[0] == '/local-baseline.json':
            source = Path(__file__).resolve().parent / 'private' / 'baseline.json'
            body = source.read_bytes() if source.exists() else b'null'
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Cache-Control', 'no-store')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def log_message(self, *_):
        pass


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8765, help='Dashboard port; target uses the next port. Default labs assume 8765.')
    args = parser.parse_args()
    root = Path(__file__).resolve().parent / 'web'
    # Bind both before starting either, so a port conflict cannot leave a partial lab.
    with ThreadingHTTPServer(('127.0.0.1', args.port), partial(Dashboard, directory=str(root))) as dashboard:
        with ThreadingHTTPServer(('127.0.0.1', args.port + 1), Target) as target:
            dashboard.target_port = args.port + 1
            threading.Thread(target=target.serve_forever, daemon=True).start()
            print(f'Lab dashboard: http://127.0.0.1:{args.port}', flush=True)
            print(f'Practice target: http://127.0.0.1:{args.port + 1}/health', flush=True)
            print('Press Ctrl+C to stop both services. Target logs are temporary.', flush=True)
            try:
                dashboard.serve_forever()
            except KeyboardInterrupt:
                pass
            finally:
                target.shutdown()

if __name__ == '__main__':
    main()
