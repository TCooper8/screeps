const Array = require("../src/array");

let assert = assertion => {
  if (!assertion()) {
    console.error("Test assertion failed");
  }
}

let shouldEqual = (a, b) => {
  if (a !== b) {
    console.error("%s !== %s", a, b);
  }
}

let sumTest = () => {
  shouldEqual(
    [1,2,3].sum(),
    6,
  )
  shouldEqual(
    Object.values({
      a: 1,
      b: 2
    }).sum(),
    3
  )
  shouldEqual(
    Object.values({
      a: 1,
      b: 2,
      c: 6,
    }).filter(i => i < 5)
      .map(i => i * 2)
      .sum(),
    6
  )
}

sumTest();