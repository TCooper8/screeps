class Option { }

class None extends Option {
  constructor() {
    super()
  }

  isNone() { return true }
  isSome() { return false }
  map(mapping) { return this }
  bind(binding) { return this }
}

class Some extends Option {
  constructor(value) {
    super();
    this.value = value;
  }

  isNone() { return false }
  isSome() { return true }
  map(mapping) { return new Some(mapping(this.value)) }
  bind(binding) { return binding(this.value) }
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