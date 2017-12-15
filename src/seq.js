const Enumerator = require('./enumerator');
const ArrayEnumerator = require('./array-enumerator');
const ObjectEnumerator = require('./object-enumerator');

class Pair {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
}

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

class ActionEnumerator extends Enumerator {
  constructor(action, e) {
    super();
    this._action = action;
    this._e = e;
  }

  moveNext() {
    return this._e.moveNext();
  }

  current() {
    const cur = this._e.current();
    this._action(cur);
    return cur;
  }

  clone() {
    return new ActionEnumerator(this._action, this._e);
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

class InitEnumerator extends Enumerator {
  constructor(init, limit) {
    super();
    this._init = init;
    this._index = -1;
    this._limit = limit;
    this._current = undefined;
  }

  moveNext() {
    if (this._index >= this._limit - 1) {
      return false;
    }
    ++this._index;
    this._current = this._init(this._index);
    return true;
  }

  current() {
    return this._current;
  }

  clone() {
    return new InitEnumerator(this._init, this._limit)
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

  iter(action) {
    const e = this.getEnumerator();
    while (e.moveNext()) {
      action(e.current())
    }
  }

  filter(predicate) {
    const enumerator = this.getEnumerator();
    return new Seq(new FilterEnumerator(predicate, enumerator));
  }

  sum() {
    var acc = 0;
    while (this._enumerator.moveNext()) {
      acc += this._enumerator.current();
    }

    return acc;
  }

  tap(action) {
    return new Seq(new ActionEnumerator(action, this.getEnumerator()));
  }

  toArray() {
    const e = this._enumerator;
    var array = [];
    while (e.moveNext()) {
      array.push(e.current());
    }

    return array;
  }

  cache() {
    const array = this.toArray();
    return new Seq(new ArrayEnumerator(array));
  }

  count() {
    const e = this.getEnumerator()
    var count = 0;
    while (e.moveNext()) {
      ++count;
    }

    return count;
  }

  fold(folder) {
    return state => {
      const enumerator = this.getEnumerator();
      var acc = state;
      while (enumerator.moveNext()) {
        acc = folder(acc, enumerator.current())
      }
      return acc;
    }
  }
}

const ofArray = array => new Seq(new ArrayEnumerator(array));
const ofObject = obj => new Seq(new ObjectEnumerator(obj));

const map = mapping => seq => seq.map(mapping);
const filter = predicate => seq => seq.filter(predicate);

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

const init = limit => init => {
  return new Seq(new InitEnumerator(init, limit));
}

module.exports = {
  ofArray,
  ofObject,
  filter,
  map,
  iter,
  fold,
  init,
}