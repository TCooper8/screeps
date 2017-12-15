const map = mapping => array => {
  var results = mapping.constructor.call(array.length);
  var i = 0;
  var len = array.length;

  while (++i < len) {
    results[i] = mapping(array[i]);
  }

  return results;
}

const iter = action => array => {
  var i = 0,
      len = array.length;

  while (++i < len) {
    action(array[i]);
  }
}

Array.prototype.map = map;
Array.prototype.iter = iter;

module.exports = {
  map,
  iter,
}