const Array = require('./array');
const Option = require('./option');

const log = (creep, format, ...args) => {
  console.log("Creep[%s] " + format, creep.name, ...args);
}

const findDroppedResources =
  creep =>
    Option.fromNull(
      creep.pos.findClosestByPath(
        FIND_DROPPED_RESOURCES,
      )
    );

const findResource =
  creep =>
    findDroppedResources(creep)
    .map(target => creep.moveTo(target))
    .map(err => log(creep, "Error %s", err))
    .orElse(() => log(creep, "No target found"))

const gather = creep => {
  if (creep.carry.energy < creep.carryCapacity) {
    findResource(creep);
    //Option
    //  .fromNull(creep.pos.findClosestByPath(
    //    FIND_DROPPED_RESOURCES,
    //  ))
    //  .map(target => 
  }
}

module.exports = {
  gather,
};