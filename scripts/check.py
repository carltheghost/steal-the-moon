#!/usr/bin/env python3
"""Steal the Moon smoke check.

- every data/*.json parses
- every .webp filename referenced in data/ exists in assets/
- every data/*.json is listed in the README data dictionary
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
failures = []

for path in sorted((ROOT / "data").glob("*.json")):
    try:
        json.load(open(path, encoding="utf-8"))
    except Exception as exc:  # noqa: BLE001 - report anything that breaks parsing
        failures.append(f"{path.name}: invalid JSON ({exc})")

known_assets = {p.name for p in (ROOT / "assets").glob("*.webp")}
referenced = set()
for path in (ROOT / "data").glob("*.json"):
    referenced |= set(re.findall(r"[a-z0-9][a-z0-9-]*\.webp", path.read_text(encoding="utf-8")))
for name in sorted(referenced):
    if name not in known_assets:
        failures.append(f"data references missing asset: {name}")

readme = (ROOT / "README.md").read_text(encoding="utf-8")
for path in (ROOT / "data").glob("*.json"):
    if f"`{path.name}`" not in readme:
        failures.append(f"README data dictionary missing entry for {path.name}")

if failures:
    print("\n".join(failures))
    sys.exit(1)
print("steal-the-moon check: OK")
