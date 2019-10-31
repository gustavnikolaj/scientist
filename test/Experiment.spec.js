const expect = require("unexpected");
const Experiment = require("../lib/Experiment");

describe("Experiment", () => {
  it("should return the value from the control implementation", () => {
    const newImplementation = () => "bar";
    const controlImplementation = () => "foo";

    const experiment = new Experiment(newImplementation, controlImplementation);

    return expect(experiment.run(), "to equal", "foo");
  });

  it("should report details of the results", () => {
    const newImplementation = () => "bar";
    const controlImplementation = () => {
      const startTime = Date.now();
      let foo = "foo";

      while (Date.now() - startTime < 2) {
        foo = "foo";
      }

      return foo;
    };

    const reports = [];
    const experiment = new Experiment(newImplementation, controlImplementation);

    experiment.handleReport = report => reports.push(report);
    experiment.run();

    return expect(reports, "to satisfy", [
      {
        passed: false,
        failed: true,
        message: "Failed: Experiment returned different value.",
        control: {
          return: "foo",
          error: undefined,
          ms: expect.it("to be a number").and("to be greater than", 1)
        },
        experiment: {
          return: "bar",
          error: undefined,
          ms: expect.it("to be a number")
        }
      }
    ]);
  });

  it("should report a throwing experiment", () => {
    const reports = [];
    const experiment = new Experiment(
      () => {
        throw new Error("foo");
      },
      () => "foo"
    );

    experiment.handleReport = report => reports.push(report);
    experiment.run();

    return expect(reports, "to satisfy", [
      {
        passed: false,
        message: "Failed: Experiment threw an Error."
      }
    ]);
  });

  it("should report a experiment with different return value", () => {
    const reports = [];
    const experiment = new Experiment(() => "Foo", () => "foo");

    experiment.handleReport = report => reports.push(report);
    experiment.run();

    return expect(reports, "to satisfy", [
      {
        passed: false,
        message: "Failed: Experiment returned different value."
      }
    ]);
  });

  it("should report a returning experiment with a throwing control", () => {
    const reports = [];
    const experiment = new Experiment(
      () => "foo",
      () => {
        throw new Error("foo");
      }
    );

    experiment.handleReport = report => reports.push(report);
    try {
      experiment.run();
    } catch (e) {}

    return expect(reports, "to satisfy", [
      {
        passed: false,
        message:
          "Failed: Control implementation threw, but Experiment returned."
      }
    ]);
  });

  it("should report a passed experiment", () => {
    const reports = [];
    const experiment = new Experiment(() => "foo", () => "foo");

    experiment.handleReport = report => reports.push(report);
    experiment.run();

    return expect(reports, "to satisfy", [
      {
        passed: true,
        message: "Passed: Both functions returned the same."
      }
    ]);
  });

  it("should report a passed experiment when both throw", () => {
    const reports = [];
    const experiment = new Experiment(
      () => {
        throw new Error("foo");
      },
      () => {
        throw new Error("foo");
      }
    );

    experiment.handleReport = report => reports.push(report);
    try {
      experiment.run();
    } catch (e) {}

    return expect(reports, "to satisfy", [
      {
        passed: true,
        message: "Passed: Both functions threw an Error."
      }
    ]);
  });
});
