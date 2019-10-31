class Timer {
  constructor() {
    this.time = Date.now();
  }

  split() {
    const now = Date.now();
    const duration = now - this.time;
    this.time = now;
    return duration;
  }
}

module.exports = Timer;
