const Worker = require('./worker')
const Option = require('./option')
const Array = require('./array')

const codeWorkersNeeded = "Workers needed"

const workersNeeded = amount => {
  return {
    code: codeWorkersNeeded,
    amount: amount,
    priority: 10,
  }
}

const idealWorkerCount = () => 3;

const checkEconomy = () => {
  const workerCount =
    Object
      .values(Game.creeps)
      .filter(creep => creep.name[0] === 'W')
      .map(creep => 1)
      .sum();
  console.log(workerCount);
  const idealCount = idealWorkerCount();

  console.log("Workers = %s", workerCount);
  if (workerCount < idealCount) {
    return [
      workersNeeded(idealCount - workerCount),
    ]
  }
  else {
    return []
  }
}

const spawnWorker =
  spawner =>
    Worker
      .spawn(spawner)
      .map(() => 1)
      .orElse(() => 0)

const spawnWorkers =
  amount =>
    // Run through each spawner and try to make a worker.
    Object
      .values(Game.spawns)
      .foldWhile(
        (acc, s) => acc + spawnWorker(s),
        acc => acc < amount
      )(0)

const handleReq = req => {
  if (req.code === codeWorkersNeeded) {
    const created = spawnWorkers(req.amount);
    console.log("Game created %s workers, needing %s", created, req.amount);
    if (created < req.amount) {
      return {
        error: "Unable to created required workers"
      }
    }
    else {
      return {
        error: "ok"
      }
    }
  }
}

const init =
  () =>
    // Firstly, we need to check our economy.
    checkEconomy()
      // Map over the missing reqs and handle them.
      .map(handleReq)
    //spawnWorkers()
    //.map(handleSpawnedWorkers)
    //.orElse()

const handleSpawners = Array.iter(spawner => {
  if (spawner.energy >= Worker.cost) {
    Worker
      .spawn(spawner);
  }
});

const handleCreeps = Array.iter(creep => {
  Worker.gather(creep);
});

module.exports.loop = function() {
  //Object
  //  .values(Game.spawns)
  //  .bind(handleSpawners);

  init()

  Object
    .values(Game.creeps)
    .bind(handleCreeps);
}
