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

const timef =
  label =>
  f => {
    const ti = performance.now();
    const result = f();
    const tf = performance.now();
    const dt = tf - ti;
    console.log("Time[%s] Ran in %s seconds", label, dt / 1000.0);
    return result;
  }

const initTest = () => {
  shouldEqual(
    Array.init(1)(i => i),
    [2],
  )
}

const sumTest = () => {
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

const appendTest = () => {
  shouldEqual(
    [1,2].append([3]),
    [1,2,3],
  )
}

Array.iter(
  [ initTest,
    sumTest,
    appendTest,
  ],
  f => f()
);