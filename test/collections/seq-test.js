const Seq = require('../../src/collections/seq');
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

Seq.iter(f => f())(
  Seq.ofArray([
    testArray,
    testObject,
  ])
)