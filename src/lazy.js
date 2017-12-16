module.exports = func => {
  let value = undefined;
  return () => {
    if (!value) {
      value = func();
    }

    return value;
  }
}