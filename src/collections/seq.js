const Option = require('../option');

class Enumerator {
  constructor(moveNext, current, clone) {
    this.moveNext = moveNext;
    this.current = current;
    this.clone = clone;
  }
}

class Seq {
  constructor(enumerator) {
    this._enumerator = enumerator;
  }

  moveNext() {
    return this._enumerator.moveNext();
  }

  current() {
    return this._enumerator.current();
  }

  getEnumerator() {
    return this._enumerator.clone();
  }

  map() {
    const enumerator = this.getEnumerator();
    let current = undefined;

    return new Seq(new Enumerator(
      () => {
        if (enumerator.moveNext()) {
          current = mapping(enumerator.current());
          return true;
        }
        else {
          return false;
        }
      },
      () => current,
    ));
  }
}

class ArrayEnumerator {
  constructor(array) {
    this._index = -1;
    this._array = array;
    this._length = array.length;
    this._current = undefined;
  }

  moveNext() {
    const index = this._index;
    const length = this._length;

    if (index < length - 1) {
      this._index = index + 1;
      this._current = this._array[this._index];
      return true;
    }
    return false;
  }

  current() {
    return this._current;
  }

  clone() {
    return new ArrayEnumerator(this._array);
  }
}

class KeyValue {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }

  toString() {
    return "(" + this.key + "," + this.value.toString() + ")";
  }
}

class ObjectEnumerator {
  constructor(obj) {
    this._enum = new ArrayEnumerator(Object.keys(obj));
    this._obj = obj;
    this._current = undefined;
  }

  moveNext() {
    if (this._enum.moveNext()) {
      const key = this._enum.current();
      this._current = new KeyValue(
        key,
        this._obj[key],
      );
      return true;
    }
    else return false;
  }

  current() {
    return this._current;
  }

  clone() {
    return new ObjectEnumerator(this._obj);
  }
}

const ofArray = array => new Seq(new ArrayEnumerator(array));
const ofObject = obj => new Seq(new ObjectEnumerator(obj));

const map = mapping => seq => seq.map(mapping);

const iter = action => seq => {
  const enumerator = seq.getEnumerator();
  while (enumerator.moveNext()) {
    action(enumerator.current());
  }
}

const fold = folder => state => seq => {
  const enumerator = seq.getEnumerator();
  var acc = state;
  while (enumerator.moveNext()) {
    acc = folder(acc, enumerator.current())
  }

  return acc;
}

module.exports = {
  ofArray,
  ofObject,
  map,
  iter,
  fold,
}