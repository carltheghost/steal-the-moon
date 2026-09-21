#!/usr/bin/env python3
"""Verify the exported Steal the Moon browser artifact is launch-safe."""

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
ARTIFACT = ROOT / "web" / "index.html"
failures = []

if not ARTIFACT.is_file():
    failures.append("web/index.html is missing")
else:
    raw = ARTIFACT.read_bytes()
    size = len(raw)
    if size < 10_000_000:
        failures.append(f"web/index.html unexpectedly small: {size:,} bytes")
    if size > 25_000_000:
        failures.append(f"web/index.html exceeds the 25 MB launch budget: {size:,} bytes")

    text = raw.decode("utf-8")
    required = (
        "<!doctype html>",
        '<title>Steal the Moon',
        "THE MIMAS INQUIRY",
        "Saturn",
        "24-screen archive",
        "data:application/javascript;base64,",
    )
    for marker in required:
        if marker not in text:
            failures.append(f"artifact missing required marker: {marker}")

    forbidden = (
        "fetch(",
        "XMLHttpRequest",
        "new WebSocket(",
        "navigator.sendBeacon(",
        '<script src="http://',
        '<script src="https://',
        '<link rel="stylesheet" href="http://',
        '<link rel="stylesheet" href="https://',
    )
    for marker in forbidden:
        if marker in text:
            failures.append(f"runtime-network pattern found in artifact: {marker}")

if failures:
    print("\n".join(failures))
    sys.exit(1)

print(f"web artifact check: OK ({ARTIFACT.stat().st_size:,} bytes)")
