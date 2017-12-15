const map = mapping => array => {
  var results = array.constructor(array.length);
  var i = -1;
  var len = array.length;

  while (++i < len) {
    results[i] = mapping(array[i]);
  }

  return results;
}

const iter = action => array => {
  var i = -1,
      len = array.length;

  while (++i < len) {
    action(array[i]);
  }
}

const bind = binding => array => {
  return binding(array);
}

const sum = array => {
  var i = -1,
      length = array.length,
      sum = 0;

  while (++i < length) {
    sum += array[i];
  }

  return sum;
}

const filter = predicate => array => {
  var result = [];
  var i = -1,
      length = array.length;

  while (++i < length) {
    if (predicate(array[i])) {
      result.push(array[i]);
    }
  }

  return result;
}

const foldWhile = (folder, predicate) => state => array => {
  var acc = state;
  var i = -1,
      length = array.length;

  while (++i < length) {
    if (!predicate(acc)) {
      return acc;
    }
    acc = folder(acc, array[i])
  }

  return acc;
}

const append = arrayA => arrayB => {
  var lengthA = arrayA.length,
      lengthB = arrayB.length,
      length = lengthA + lengthB,
      acc = arrayA.slice(0),
      i = lengthA,
      j = -1;

  while (++j < lengthB) {
    acc[i] = arrayB[j];
    ++i;
  }

  return acc;
}

Array.prototype.map = function(mapping) { return map(mapping)(this) };
Array.prototype.iter = function(action) { return iter(action)(this) };
Array.prototype.bind = function(binding) { return bind(binding)(this) }
Array.prototype.sum = function() { return sum(this) }
Array.prototype.filter = function(predicate) { return filter(predicate)(this) }
Array.prototype.foldWhile = function(folder, predicate) {
  return state => foldWhile(folder, predicate)(state)(this);
}
Array.prototype.append = function(arrayB) {
  return append(this)(arrayB);
}

module.exports = {
  map,
  iter,
}