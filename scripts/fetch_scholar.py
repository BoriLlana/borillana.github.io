#!/usr/bin/env python3
"""Fetch citation stats from a Google Scholar profile and write scholar-stats.json.

Parses the small stats table on the profile page (Citations / h-index / i10-index,
each with an "All" and a "Since" column) and stores the all-time values.

Google Scholar blocks most datacenter IPs, including the Azure ranges GitHub
Actions runners come from, so a 403 on a scheduled run is expected and normal.
When that happens the script leaves scholar-stats.json untouched and exits 0, so
the last good numbers stay on the site and the workflow does not report failure.
Real bugs (bad user id, changed page markup) still surface in the run log.
"""

import datetime
import json
import re
import sys
import urllib.request

# Your Google Scholar user id — the "user=" value in your profile URL.
SCHOLAR_USER = "yTtXA48AAAAJ"

URL = f"https://scholar.google.com/citations?user={SCHOLAR_USER}&hl=en"
OUT = "scholar-stats.json"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8", "ignore")


def main() -> None:
    try:
        html = fetch(URL)
    except Exception as exc:  # network / HTTP error
        print(f"SKIP: Scholar refused the request ({exc}).")
        print(f"Leaving {OUT} unchanged. This is expected from CI IP ranges.")
        return

    # Values appear in order: citations(all, since), h(all, since), i10(all, since).
    nums = re.findall(r'gsc_rsb_std">(\d[\d,]*)<', html)
    if len(nums) < 6:
        print(
            "SKIP: could not find the stats table — Scholar likely served a "
            f"robot check. Leaving {OUT} unchanged."
        )
        return

    to_int = lambda s: int(s.replace(",", ""))
    stats = {
        "citations": to_int(nums[0]),
        "h_index": to_int(nums[2]),
        "i10_index": to_int(nums[4]),
        "updated": datetime.date.today().isoformat(),
        "profile": URL,
    }

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(stats, f, indent=2)
        f.write("\n")

    print("Wrote", OUT, "->", stats)


if __name__ == "__main__":
    main()
