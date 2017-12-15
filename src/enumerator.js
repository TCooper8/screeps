class Enumerator {
  constructor() {}
  moveNext() { return false }
  current() { return undefined }
  clone() { return undefined }
}

module.exports = Enumerator;