class Option { }

class None extends Option {
  constructor() {
    super()
  }
}

class Some extends Option {
  constructor(value) {
    super();
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