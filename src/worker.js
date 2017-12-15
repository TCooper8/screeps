const moveCost = 50
const workCost = 100
const carryCost = 50

const spawn = (spawner) => {
  console.log("Spawning creep...");
  const err = spawner.spawnCreep(
    [ MOVE,
      WORK,
      CARRY,
    ],
    _.random(Number.MAX_SAFE_INTEGER).toString(),
  );
  console.log("Spawned creep with error(%s)", err);
}

const returnResource = creep => {
  const spawner = _.min(Game.spawns, spawn => {
    return spawn.energy
  })

  if (spawner.energy < spawner.energyCapacity) {
    const err = creep.moveTo(spawner);
    console.log("Creep[%s] moving to spawner(%s)", creep.name, spawner.name);
  }
  else {
    const err = creep.drop(RESOURCE_ENERGY);
    console.log("Creep[%s] dropped energy error(%s)", creep.name, err);
  }
};

const gather = (creep) => {
  if(creep.carry.energy < creep.carryCapacity) {
    var sources = creep.room.find(FIND_SOURCES);
    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[0]);
    }
  }
  else {
    returnResource(creep);
  }
  //else if(Game.spawns['Spawn1'].energy < Game.spawns['Spawn1'].energyCapacity) {
    //if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    //  creep.moveTo(Game.spawns['Spawn1']);
    //}
  //}
}

const cost = _.sum([
  moveCost,
  workCost,
  carryCost,
])

const worker = {
  spawn,
  cost,
  gather,
}

module.exports = worker;
