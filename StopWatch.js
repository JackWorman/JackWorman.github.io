class StopWatch {
  constructor() {
    this.startTime = 0;
    this.stopTime = 0;
    this.running = false;
  }

  currentTime() {
    return new Date().getTime();
  }

  start() {
    this.startTime = this.currentTime();
    this.running = true;
  }

  stop() {
    this.stopTime = this.currentTime();
    this.running = false;
  }

  getElapsedMilliseconds() {
    if (this.running) {
      this.stopTime = this.currentTime();
    }
    return this.stopTime - this.startTime;
  }

  getElapsedSeconds() {
    return this.getElapsedMilliseconds() / 1000;
  }
}
