import time


class Clock:
    """This is a convenience class which has a method that will sleep until a specific amount of time has passed since the last tick."""

    def __init__(self, tick_len=1.0 / 30.0):
        self.last_tick = 0
        self.tick_len = tick_len

    def tick(self):
        """sleep until 'tick_len' time has passed since last tick"""
        cur_time = time.time()  # in seconds
        dt = cur_time - self.last_tick
        self.last_tick = cur_time
        if dt < self.tick_len:
            time.sleep(self.tick_len - dt)

        return self.tick_len
