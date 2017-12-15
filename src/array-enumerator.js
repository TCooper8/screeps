const Enumerator = require("./enumerator");

class ArrayEnumerator extends Enumerator {
  constructor(array) {
    super();
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

module.exports = ArrayEnumerator;