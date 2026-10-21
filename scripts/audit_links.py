#!/usr/bin/env python3
"""Conservative availability checks for official resource links.

HTTP 403 / 429 can be anti-bot responses and are not evidence of a dead resource.
Do not delete any entry automatically, or mark uninspected content as verified.
"""
import concurrent.futures
import datetime as dt
import json
import urllib.error
import urllib.request
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
TODAY = dt.datetime.now(dt.timezone.utc).date().isoformat()
HEADERS = {"User-Agent": "MicroNanoResourceAudit/1.0 (curated GitHub learning library)", "Accept": "text/html,application/xhtml+xml,*/*;q=0.8"}

def check(url):
    try:
        request = urllib.request.Request(url, method="GET", headers=HEADERS)
        with urllib.request.urlopen(request, timeout=14) as response:
            response.read(4096)
            return url, {"status": "reachable", "http": response.status, "final_url": response.geturl(), "checked": TODAY}
    except urllib.error.HTTPError as exc:
        status = "restricted" if exc.code in (401, 403, 407, 429) else "needs_review"
        return url, {"status": status, "http": exc.code, "checked": TODAY}
    except Exception as exc:
        return url, {"status": "needs_review", "reason": str(exc)[:140], "checked": TODAY}

def main():
    records = json.loads((DATA / "resources.json").read_text(encoding="utf-8"))["resources"]
    sources = sorted({row["url"] for row in records if row["kind"] != "Book" and row.get("url", "").startswith(("http://", "https://"))})
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        checked = dict(pool.map(check, sources))
    summary = {
        "checked": TODAY, "sources": len(sources), "reachable": sum(v["status"] == "reachable" for v in checked.values()),
        "restricted": sum(v["status"] == "restricted" for v in checked.values()),
        "needs_review": sum(v["status"] == "needs_review" for v in checked.values()),
        "note": "Link checks are not an endorsement of current content, free access or download eligibility.",
        "results": checked
    }
    (DATA / "link-health.json").write_text(json.dumps(summary, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("Resource audit:", summary["sources"], "checked;", summary["reachable"], "reachable;",
          summary["restricted"], "restricted;", summary["needs_review"], "need review.")

if __name__ == "__main__":
    main()
