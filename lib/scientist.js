const Experiment = require("./Experiment");

module.exports = function scientist(
  controlImplementation,
  experimentImplementation,
  logger = console
) {
  const experiment = new Experiment(
    experimentImplementation,
    controlImplementation
  );

  experiment.handleReport = report => {
    if (report.passed) {
      logger.log(report.message, {
        control: report.control,
        experiment: report.experiment
      });
    } else {
      logger.error(report.message, {
        control: report.control,
        experiment: report.experiment
      });
    }
  };

  return (...args) => experiment.run(...args);
};
