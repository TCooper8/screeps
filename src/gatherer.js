const Array = require('./array');
const Option = require('./option');

const log = (creep, format, ...args) => {
  console.log("Creep[%s] " + format, creep.name, ...args);
}

const spawn = (spawner) => {
  console.log("Spawning creep...");
  const name = 'G' + _.random(Number.MAX_SAFE_INTEGER).toString();
  const err = spawner.spawnCreep(
    [ MOVE,
      CARRY,
    ],
    name,
  );
  if (err === OK) {
    return Option.some(name);
  }
  return Option.none;
  console.log("Spawned creep with error(%s)", err);
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
  }
}

const cost = _.sum([
  moveCost,
  carryCost,
]);

module.exports = {
  gather,
  spawn,
  cost,
};