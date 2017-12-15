const Enumerator = require('./enumerator');
const ArrayEnumerator = require('./array-enumerator');
const ObjectEnumerator = require('./object-enumerator');

class MappingEnumerator extends Enumerator {
  constructor(mapping, e) {
    super();
    this._e = e;
    this._mapping = mapping;
  }

  moveNext() {
    return this._e.moveNext()
  }

  current() {
    return this._mapping(this._e.current());
  }

  clone() {
    return new MappingEnumerator(this._mapping, this._e);
  }
}

class FilterEnumerator extends Enumerator {
  constructor(predicate, e) {
    super();
    this._e = e;
    this._predicate = predicate;
    this._current = undefined;
  }

  moveNext() {
    while (this._e.moveNext()) {
      const cur = this._e.current();
      if (this._predicate(cur)) {
        this._current = cur;
        return true;
      }
    }
    return false;
  }

  current() {
    return this._current;
  }

  clone() {
    return new FilterEnumerator(this._predicate, this._e);
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

  map(mapping) {
    const enumerator = this.getEnumerator();
    return new Seq(new MappingEnumerator(mapping, enumerator));
  }

  filter(predicate) {
    const enumerator = this.getEnumerator();
    return new Seq(new FilterEnumerator(predicate, enumerator));
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