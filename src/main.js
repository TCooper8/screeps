const Worker = require('./worker')
const Gatherer = require('./gatherer')
const Option = require('./option')
const Array = require('./array')

const codeWorkersNeeded = "Workers needed"
const codeGatherersNeeded = "Gatherers needed"

const workersNeeded = amount => {
  return {
    code: codeWorkersNeeded,
    amount: amount,
    priority: 10,
  }
}

const gatherersNeeded = amount => {
  return {
    code: codeGatherersNeeded,
    amount: amount,
    priority: 8,
  }
}

const idealWorkerCount = () => 3;
const idealGathererCount = () => 2;

const checkWorkers = () => {
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

const checkGatherers = () => {
  const count =
    Object
      .values(Game.creeps)
      .filter(creep => creep.name[0] === 'G')
      .map(creep => 1)
      .sum();
  const idealCount = idealGathererCount();

  if (count < idealCount) {
    return [
      gatherersNeeded(idealCount - count),
    ]
  }
  else {
    return []
  }
}

const checkEconomy = () =>
  _.sortBy(
    checkWorkers()
      .append(checkGatherers()),
    req => req.priority,
  )

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

const spawnGatherer =
  spawner =>
    Gatherer
      .spawn(spawner)
      .map(() => 1)
      .orElse(() => 0)

const spawnGatherers =
  amount =>
    // Run through each spawner and try to make a worker.
    Object
      .values(Game.spawns)
      .foldWhile(
        (acc, s) => acc + spawnGatherer(s),
        acc => acc < amount
      )(0)

const handleReq = req => {
  console.log("Req %s", req.code);
  if (req.code === codeWorkersNeeded) {
    const created = spawnWorkers(req.amount);
    console.log("Spawned %s workers", created);
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
  else if (req.code === codeGatherersNeeded) {
    const created = spawnGatherers(req.amount);
    console.log("Spawned %s gatherers", created);
    console.log("Game created %s gatherers, needing %s", created, req.amount);
    if (created < req.amount) {
      return {
        error: "Unable to created required gatherers"
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
  if (creep.name[0] === 'W')
    Worker.gather(creep);
  else if (creep.name[0] === 'G')
    Gatherer.gather(creep);
});

module.exports.loop = function() {
  if (!!Memory.creeps)
    Object
      .keys(Memory.creeps)
      .filter(name => !Game.creeps[name])
      .map(name => delete Memory.creeps[name]);

  init()

  Object
    .values(Game.creeps)
    .filter(creep => !creep.spawning)
    .bind(handleCreeps);
}
