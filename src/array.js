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
  console.log("Iterating over array len=%d", len);

  while (++i < len) {
    action(array[i]);
  }
}

const bind = binding => array => {
  return binding(array);
}

Array.prototype.map = mapping => map(mapping)(this);
Array.prototype.iter = action => iter(action)(this);
Array.prototype.bind = function(binding) {
  return bind(binding)(this);
}

module.exports = {
  map,
  iter,
}