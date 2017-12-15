const log = require('../src/log');

const shouldBe = (a, b) => {
  if (a !== b) {
    log.errorfn("%s !== %s", a, b);
  }
}

module.exports = {
  shouldBe,
}