"""In-memory ring buffer of recent CAPI delivery attempts.

Exposed via /api/debug/pixels so CAPI health can be inspected without SSH/logs.
"""

import time
from collections import deque
from threading import Lock

_MAX = 100
_buffer: deque[dict] = deque(maxlen=_MAX)
_lock = Lock()


def record(platform: str, event: str, event_id: str | None, ok: bool, detail: dict) -> None:
    entry = {
        "ts": int(time.time()),
        "platform": platform,
        "event": event,
        "event_id": event_id,
        "ok": ok,
        "detail": detail,
    }
    with _lock:
        _buffer.appendleft(entry)


def recent(limit: int = 50) -> list[dict]:
    with _lock:
        return list(_buffer)[:limit]
