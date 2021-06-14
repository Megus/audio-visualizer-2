import easings from "./animations/easings";

class ScriptSystem {
  constructor() {
    this.scripts = [];
    this.easing = easings;
  }

  addScript(script) {
    this.scripts.push(script(this));
  }

  animate(p, key, easing, duration, to) {
    if (Array.isArray(p[key])) {
      this.addScript(this._animateArray(p, key, easing, duration, to));
    } else {
      this.addScript(this._animateNumber(p, key, easing, duration, to));
    }
  }

  update(timestamp, dTimestamp) {
    this.timestamp = timestamp;
    const finishedScripts = [];
    this.scripts.forEach((script) => {
      const status = script.next();
      if (status.done === true) {
        finishedScripts.push(script);
      }
    });
    this.scripts = this.scripts.filter((script) => finishedScripts.indexOf(script) == -1);
  }

  // Script helper functions
  * wait(duration) {
    const waitUntil = this.timestamp + duration;
    while (this.timestamp < waitUntil) {
      yield;
    }
  }


  // Private methods
  _animateArray(p, key, easing, duration, to) {
    const startTime = this.timestamp;
    const stopTime = startTime + duration;
    const from = p[key];

    return function * () {
      while (this.timestamp < stopTime) {
        const t = (this.timestamp - startTime) / duration;
        p[key] = from.map((a, i) => a + (to[i] - a) * easing(t));
        yield;
      }
      p[key] = to;
    }.bind(this);
  }

  _animateNumber(p, key, easing, duration, to) {
    const startTime = this.timestamp;
    const stopTime = startTime + duration;
    const from = p[key];

    return function * () {
      while (this.timestamp < stopTime) {
        const t = (this.timestamp - startTime) / duration;
        p[key] = from + (to - from) * easing(t);
        yield;
      }
      p[key] = to;
    }.bind(this);
  }
}

export default ScriptSystem;