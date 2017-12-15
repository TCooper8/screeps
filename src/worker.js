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
    Number.MAX_SAFE_INTEGER.toString(),
  );
  console.log("Spawned creep with error(%s)", err);
}

const cost = _.sum([
  moveCost,
  workCost,
  carryCost,
])

const worker = {
  spawn,
  cost,
}

module.exports = worker;
