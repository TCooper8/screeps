class Option { }

class None extends Option {
  constructor() {}
}

const none = None();

const Option = {
  none,
}

module.exports = {
  Option,
}