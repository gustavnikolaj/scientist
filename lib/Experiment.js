const Timer = require("./Timer");

class Experiment {
  constructor(experimentImplementation, controlImplementation) {
    this.experimentImplementation = experimentImplementation;
    this.controlImplementation = controlImplementation;
  }

  report(opts) {
    if (typeof this.handleReport !== "function") {
      return;
    }

    const {
      args,
      controlReturn,
      controlError,
      controlTime,
      experimentReturn,
      experimentError,
      experimentTime
    } = opts;

    const report = {
      args,
      control: {
        return: controlReturn,
        error: controlError,
        ms: controlTime
      },
      experiment: {
        return: experimentReturn,
        error: experimentError,
        ms: experimentTime
      }
    };

    // Compare results
    if (
      typeof controlError === "undefined" &&
      controlReturn !== experimentReturn
    ) {
      // The control implementation did not throw
      if (typeof experimentError !== "undefined") {
        // failed experiment (throwing)
        report.passed = false;
        report.message = "Failed: Experiment threw an Error.";
      } else {
        // returned the wrong value
        report.passed = false;
        report.message = "Failed: Experiment returned different value.";
      }
    } else if (typeof controlError !== "undefined") {
      // the control did throw
      if (typeof experimentError !== "undefined") {
        // successful experiment - both threw
        report.passed = true;
        report.message = "Passed: Both functions threw an Error.";
      } else {
        // failed experiment - experiment returned a value where the control threw
        report.passed = false;
        report.message =
          "Failed: Control implementation threw, but Experiment returned.";
      }
    } else {
      // report a successful experiment, both returned the right values.
      report.passed = true;
      report.message = "Passed: Both functions returned the same.";
    }

    report.failed = !report.passed;

    this.handleReport(report);
  }

  run(...args) {
    const timer = new Timer();

    // Run control
    let controlReturn;
    let controlError;

    try {
      controlReturn = this.controlImplementation(...args);
    } catch (e) {
      controlError = e;
    }

    const controlTime = timer.split();

    // Run new
    let experimentReturn;
    let experimentError;

    try {
      experimentReturn = this.experimentImplementation(...args);
    } catch (e) {
      experimentError = e;
    }

    const experimentTime = timer.split();

    this.report({
      args,
      controlReturn,
      controlError,
      controlTime,
      experimentReturn,
      experimentError,
      experimentTime
    });

    if (typeof controlError === "undefined") {
      return controlReturn;
    } else {
      throw controlError;
    }
  }
}

module.exports = Experiment;
