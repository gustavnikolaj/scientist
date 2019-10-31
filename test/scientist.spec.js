const expect = require("unexpected");
const scientist = require("../lib/scientist");

class ConsoleMock {
  constructor() {
    this.logCalls = [];
    this.errorCalls = [];
  }

  log(...args) {
    this.logCalls.push(args);
  }

  error(...args) {
    this.errorCalls.push(args);
  }
}

describe("scientist", () => {
  it("should be a function", () => {
    expect(scientist, "to be a function");
  });

  it("should run an experiment", () => {
    const experiment = scientist(
      x => `bar${x}`,
      x => `foo${x}`,
      new ConsoleMock()
    );
    expect(experiment("bar"), "to equal", "barbar");
  });

  it("should log the results of a passed experiment", () => {
    const consoleMock = new ConsoleMock();
    const experiment = scientist(x => `foo${x}`, x => `foo${x}`, consoleMock);
    experiment("bar");
    expect(consoleMock, "to satisfy", {
      errorCalls: [],
      logCalls: [["Passed: Both functions returned the same.", {}]]
    });
  });

  it("should log the results of a failed experiment", () => {
    const consoleMock = new ConsoleMock();
    const experiment = scientist(x => `bar${x}`, x => `foo${x}`, consoleMock);
    experiment("bar");
    expect(consoleMock, "to satisfy", {
      errorCalls: [["Failed: Experiment returned different value.", {}]],
      logCalls: []
    });
  });
});
