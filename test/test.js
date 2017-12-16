const {
  printfn,
  errorfn,
} = require('../src/log');

const shouldBe = (a, b) => {
  if (a !== b) {
    const msg = "$0 !== $1".replace("$0", a).replace("$1", b);
    throw new Error(msg);
  }
}

const tryf = f => {
  try {
    return { success: f() };
  }
  catch (err) {
    return { failure: err };
  }
}

const timef = (label, f) => (...args) => {
  const ti = process.hrtime()[1];
  printfn(ti)
  const result = f(...args);
  const tf = process.hrtime()[1];
  const time = (tf - ti) / (1000000.0);

  return {
    time,
    result,
  }
}

class TestResult {
  constructor(label, time, result, error) {
    this.label = label;
    this.time = time;
    this.result = result;
    this.error = error;
  }

  report() {
    if (!this.error) {
      printfn("Test[%s] completed in %s seconds.", this.label, this.time / 1000.0);
    }
    else {
      errorfn("Test[%s] failed in %s seconds with %s", this.label, this.time / 1000.0, this.error);
    }
  }
}

const unit = (label, fun) => {
  printfn("Test[%s] Running", this.label);
  const result = timef(
    this.label,
    fun
  )();
  const testResult = new TestResult(
    label,
    result.time,
    result.result,
    result.failure,
  )

  testResult.report();
}

module.exports = {
  shouldBe,
  unit,
}