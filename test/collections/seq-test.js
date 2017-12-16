const _ = require('lodash');
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

Test.unit("Seq.filter", () => {
  const seq =
    Seq
      .init(100)(i => i)
      .filter(i => i < 20)
      ;

  Test.shouldBe(seq.sum(), 190);
  Test.shouldBe(seq.sum(), 190);
})

Test.unit("Seq.cache", () => {
  const seq =
    Seq
      .init(100)(i => i)
      .filter(i => i > 20)
      .filter(i => i < 80)
      .map(i => i * i)
      .cache()
      ;

  Test.shouldBe(seq.sum(), 164610);
  Test.shouldBe(seq.sum(), 164610);
})

Test.unit("Object Seq.iter speed", () => {
  const obj =
    Seq
      .init(1 << 23)(i => i)
      .fold((obj, i) => { obj[i] = i; return obj })({})
      ;

  const seqf = Test.timef(() => {
    const seq =
      Seq
        .ofObject(obj)
        .map(pair => pair.value)
      ;
    const sum = seq.sum();
    const sump2 = seq.map(i => i * i).sum();
    const min = seq.fold((min, i) => {
      if (Number.isNaN(min)) return i;
      return i < min ? i : min;
    })(NaN);
    const max = seq.fold((max, i) => {
      if (Number.isNaN(max)) return i;
      return i > max ? i : max;
    })(NaN);

    return {
      sum,
      sump2,
      min,
      max,
    }
  })()

  console.log("Seq = %s", seqf.time);
  console.dir(seqf.result);

  const _f = Test.timef(() => {
    const sum = _.sum(obj);
    const sump2 = _.sum(_.map(obj, i => i * i));
    const min = _.min(obj, i => i);
    const max = _.max(obj, i => i);

    return {
      sum,
      sump2,
      min,
      max,
    }
  })()

  console.log("_ = %s", _f.time);
  console.dir(_f.result);
});

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