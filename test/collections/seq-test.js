const Seq = require('../../src/seq');
const Test = require('../test');
const {
  printfn,
  errorfn,
} = require('../../src/log');


const testArray = () => {
  const seq = Seq.ofArray([1,2,3,4]).map(i => i * 2);

  printfn("testing");
  Seq.iter(i => printfn("%s", i))(seq);
  Seq.iter(i => printfn("%s", i))(seq);
}

const testObject = () => {
  const seq = Seq.ofObject({
    a: 1,
    b: 2,
    c: 3,
  })

  printfn("testing");
  Seq.iter(i => printfn("%s", i))(seq);
  Seq.iter(i => printfn("%s", i))(seq);
}

const testFilter = () => {
  const ls =
    Seq
      .init(100)(i => i)
      .filter(i => i < 5)
      .cache()
      .sum();

  Test.shouldBe(ls, 10)

  Test.shouldBe(
    Seq.init(100)(i => i).fold((acc, i) => i)(0),
    99,
  )
}

const testObjects = () => {
  const obj = Object({
    a: 1,
    b: 2,
    c: 3,
    d: 4,
  })
  const seq = Seq.ofObject(obj).map(pair => pair.value);

  Test.shouldBe(
    seq.map(x => x * x).sum(),
    13,
  )
  Test.shouldBe(
    seq.map(x => x * x).sum(),
    13,
  )
}

Test.unit("Object.iter", () => {
  const seq = Seq.ofObject({
    a: 1,
    b: 2,
    c: 3,
    d: 4,
  })

  let counter = 0;
  seq.iter(i => ++counter);
  seq.iter(i => ++counter);
  Test.shouldBe(counter, 8);
})

Test.unit("Object.map", () => {
  const seq = Seq.ofObject({
    a: 1,
    b: 2,
    c: 3,
    d: 4,
  }).map(pair => pair.value);

  Test.shouldBe(seq.sum(), 10);
  Test.shouldBe(seq.sum(), 10);
})

Seq.iter(f => f())(
  Seq.ofArray([
    testArray,
    testObject,
    testFilter,
  ])
)