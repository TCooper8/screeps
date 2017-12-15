class Option { }

class None extends Option {
  constructor() {}
}

class Some extends Option {
  constructor(value) {
    this.value = value;
  }
}

const none = new None();
const some = value => new Some(value);

const OptionModule = {
  none,
  some,
}

module.exports = {
  Option: OptionModule,
}