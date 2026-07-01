#!/usr/bin/env python3
from __future__ import annotations

import argparse
import gzip
import json
import re
from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urlsplit

LOG_RE = re.compile(
    r'(?P<ip>\S+) \S+ \S+ \[(?P<time>[^\]]+)\] '
    r'"(?P<method>\S+) (?P<target>\S+)(?: \S+)?" '
    r'(?P<status>\d{3}) (?P<bytes>\S+)'
    r'(?: "(?P<referrer>[^"]*)" "(?P<agent>[^"]*)")?'
)

STATIC_EXTENSIONS = {
    ".css", ".js", ".map", ".png", ".jpg", ".jpeg", ".gif", ".svg",
    ".ico", ".webp", ".avif", ".woff", ".woff2", ".ttf", ".json",
    ".pdf", ".txt", ".xml",
}

BOT_HINTS = (
    "bot", "crawler", "spider", "slurp", "bingpreview", "facebookexternalhit",
    "whatsapp", "telegrambot", "discordbot", "curl", "wget",
)


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--logs", default="/var/log/nginx/access.log*")
    parser.add_argument("--output", default="/var/www/streckentool/admin/stats.json")
    parser.add_argument("--days", type=int, default=30)
    return parser.parse_args()


def open_log(path: Path):
    if path.suffix == ".gz":
        return gzip.open(path, "rt", encoding="utf-8", errors="replace")
    return path.open("r", encoding="utf-8", errors="replace")


def parse_time(value: str) -> datetime | None:
    try:
        return datetime.strptime(value, "%d/%b/%Y:%H:%M:%S %z")
    except ValueError:
        return None


def clean_path(target: str) -> str:
    parsed = urlsplit(target)
    path = parsed.path or "/"
    return path.rstrip("/") or "/"


def is_static_path(path: str) -> bool:
    if path.startswith("/assets/") or path.startswith("/admin/"):
        return True

    suffix = Path(path).suffix.lower()
    return suffix in STATIC_EXTENSIONS


def is_pageview(method: str, path: str, status: int, agent: str) -> bool:
    if method not in {"GET", "HEAD"}:
        return False
    if status >= 400:
        return False
    if is_bot(agent):
        return False
    return not is_static_path(path)


def is_bot(agent: str) -> bool:
    lower = (agent or "").lower()
    return any(hint in lower for hint in BOT_HINTS)


def device_from_agent(agent: str) -> str:
    lower = (agent or "").lower()
    if is_bot(agent):
        return "Bot"
    if "mobile" in lower or "iphone" in lower or "android" in lower:
        return "Mobile"
    if "ipad" in lower or "tablet" in lower:
        return "Tablet"
    return "Desktop"


def referrer_label(referrer: str) -> str | None:
    if not referrer or referrer == "-":
        return None

    parsed = urlsplit(referrer)
    if not parsed.netloc:
        return None

    host = parsed.netloc.lower()
    if "streckentool" in host:
        return None

    return host


def main():
    args = parse_args()
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(days=args.days)

    log_paths = sorted(Path("/").glob(args.logs.lstrip("/")))

    total_hits = 0
    total_pageviews = 0
    bot_hits = 0

    all_visitors = set()
    today_visitors = set()
    week_visitors = set()
    month_visitors = set()

    top_pages = Counter()
    top_referrers = Counter()
    devices = Counter()
    status_codes = Counter()
    daily_pageviews = defaultdict(int)
    daily_visitors = defaultdict(set)
    recent_pageviews = []

    today_key = now.date().isoformat()
    week_cutoff = now - timedelta(days=7)

    for path in log_paths:
      if not path.is_file():
        continue

      try:
        handle = open_log(path)
      except PermissionError:
        continue

      with handle:
        for line in handle:
          match = LOG_RE.match(line)
          if not match:
            continue

          entry_time = parse_time(match.group("time"))
          if entry_time is None or entry_time < cutoff:
            continue

          ip = match.group("ip")
          method = match.group("method")
          target = match.group("target")
          status = int(match.group("status"))
          agent = match.group("agent") or ""
          referrer = match.group("referrer") or ""
          path_value = clean_path(target)
          device = device_from_agent(agent)

          total_hits += 1
          status_codes[str(status)] += 1
          devices[device] += 1

          if is_bot(agent):
            bot_hits += 1

          if not is_pageview(method, path_value, status, agent):
            continue

          day = entry_time.date().isoformat()

          total_pageviews += 1
          all_visitors.add(ip)
          daily_pageviews[day] += 1
          daily_visitors[day].add(ip)
          top_pages[path_value] += 1

          if day == today_key:
            today_visitors.add(ip)
          if entry_time >= week_cutoff:
            week_visitors.add(ip)
          month_visitors.add(ip)

          label = referrer_label(referrer)
          if label:
            top_referrers[label] += 1

          recent_pageviews.append({
            "time": entry_time.isoformat(),
            "path": path_value,
            "status": status,
            "device": device,
          })

    days = []
    for offset in range(args.days - 1, -1, -1):
      day = (now.date() - timedelta(days=offset)).isoformat()
      days.append({
        "date": day,
        "pageviews": daily_pageviews[day],
        "visitors": len(daily_visitors[day]),
      })

    device_total = sum(devices.values()) or 1
    output = {
      "generatedAt": now.isoformat(),
      "rangeDays": args.days,
      "totals": {
        "hits": total_hits,
        "pageviews": total_pageviews,
        "visitors": len(all_visitors),
        "botHits": bot_hits,
        "todayPageviews": daily_pageviews[today_key],
        "todayVisitors": len(today_visitors),
        "last7DaysPageviews": sum(day["pageviews"] for day in days[-7:]),
        "last7DaysVisitors": len(week_visitors),
        "last30DaysPageviews": sum(day["pageviews"] for day in days),
        "last30DaysVisitors": len(month_visitors),
      },
      "daily": days,
      "topPages": [
        {"path": path, "count": count}
        for path, count in top_pages.most_common(10)
      ],
      "topReferrers": [
        {"referrer": referrer, "count": count}
        for referrer, count in top_referrers.most_common(10)
      ],
      "devices": [
        {
          "device": device,
          "count": count,
          "percent": round(count * 100 / device_total, 1),
        }
        for device, count in devices.most_common()
      ],
      "statusCodes": dict(status_codes.most_common()),
      "recentPageviews": recent_pageviews[-25:][::-1],
    }

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(output, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {output_path}")


if __name__ == "__main__":
    main()
