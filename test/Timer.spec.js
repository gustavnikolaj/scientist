const expect = require("unexpected");
const Timer = require("../lib/Timer");

describe("Timer", () => {
  it("should return a number", () => {
    const timer = new Timer();
    expect(timer.split(), "to be a number");
  });

  it("should measure time from instantiation", () => {
    const timer = new Timer();
    expect(timer.split(), "to be", 0);
  });

  it("should measure split times", () => {
    const wait = ms => {
      const startTime = Date.now();
      while (Date.now() - startTime < ms) {}
    };

    const timer = new Timer();
    wait(2);
    const firstSplit = timer.split();
    wait(3);
    const secondSplit = timer.split();

    expect(firstSplit, "to be greater than or equal to", 2);
    expect(secondSplit, "to be greater than or equal to", 3);
  });
});
