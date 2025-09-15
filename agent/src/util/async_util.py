import asyncio
import threading
import concurrent.futures
from typing import Optional, Awaitable, Any


class NewLoop:

    def __init__(self):
        self._loop: Optional[asyncio.AbstractEventLoop] = None
        self._loop_ready = threading.Event()
        self._thread = threading.Thread(target=self._start_event_loop, daemon=True)
        self._thread.start()
        self._loop_ready.wait()

    def _start_event_loop(self):
        self._loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self._loop)
        self._loop_ready.set()
        self._loop.run_forever()

    def run_async(self, coro: Awaitable[Any]) -> concurrent.futures.Future:
        return asyncio.run_coroutine_threadsafe(coro, self._loop)

    def stop(self):
        self._loop.call_soon_threadsafe(self._loop.stop)
        self._thread.join()

