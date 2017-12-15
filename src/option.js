class Option { }

class None extends Option {
  constructor() {}
}

const none = None();

const OptionModule = {
  none,
}

module.exports = {
  Option: OptionModule,
}