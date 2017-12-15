const Enumerator = require("./enumerator");
const ArrayEnumerator = require('./array-enumerator');

class KeyValue {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }

  toString() {
    return "(" + this.key + "," + this.value.toString() + ")";
  }
}

class ObjectEnumerator extends Enumerator {
  constructor(obj) {
    super();
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

module.exports = ObjectEnumerator;