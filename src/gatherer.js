const Array = require('./array');
const Option = require('./option');

const moveCost = 50
const workCost = 100
const carryCost = 50

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

const returnResource = creep => {
  var err = null;
  const spawner = _.min(Game.spawns, spawn => {
    return spawn.energy
  })

  if (spawner.energy < spawner.energyCapacity) {
    err = creep.transfer(spawner, RESOURCE_ENERGY);
    if (err === ERR_NOT_IN_RANGE) {
      err = creep.moveTo(spawner);
      console.log("Creep[%s] moving to spawner(%s)", creep.name, spawner.name);
    }
    else {
      console.log("Creep[%s] unhandled error(%s)", creep.name, err);
    }
  }
  else {
    console.log("Gatherer moving to controller");
    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
      const err = creep.moveTo(creep.room.controller);
      console.log("Move to controller error %d", err);
    }
  }
};

const findResource =
  creep =>
    findDroppedResources(creep)
    .map(target => {
      if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
        return creep.moveTo(target);
      }
    })
    .map(err => log(creep, "Error %s", err))
    .orElse(() => log(creep, "No target found"))

const gather = creep => {
  if (creep.carry.energy < creep.carryCapacity) {
    findResource(creep);
  }
  else {
    returnResource(creep);
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