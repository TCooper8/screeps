const printfn = (format, ...args) => {
  console.log(format, ...args);
}

const errorfn = (format, ...args) => {
  console.error("\x1b[31m" + format + "\x1b[0m", ...args);
}

module.exports = {
  printfn,
  errorfn,
}