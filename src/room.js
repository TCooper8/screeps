// This module will handle the behavior for a given room.

const Seq = require("./seq");
const Array = require('./array');
const Worker = require('./worker');
const Gatherer = require('./gatherer');
const Lazy = require('./lazy');
const {
  printfn,
  errorfn,
} = require('./log');

const economyState = 0

const countWorkers = room => screeps => {
}

const creepsInRoom =
  room =>
    Seq.filter(creep => creep.room.name === room.name)

const isWorker = creep => creep.name[0] === 'W'
const isGatherer = creep => creep.name[0] === 'G'

const availableWorkerSlots =
  room => {
    const seq = 
      Seq
        .ofArray(room.find(FIND_SOURCES_ACTIVE))
        .map(source => {
          // Look at all the cells near this source.
          const objects = room.lookAtArea(
            source.pos.y - 1,
            source.pos.x - 1,
            source.pos.y + 1,
            source.pos.x + 1,
            true,
          )
          const results =
            Seq
              .ofArray(objects)
              .filter(obj => obj.type === "terrain")
              .filter(obj => obj.terrain !== "wall")

          return results.toArray()
        })
        .fold((acc, array) => acc.append(array))([])
    return Seq.ofArray(seq);
  }

const moveWorkersToSlots = (workers, slots) => {
  printfn("Moving", workers.count(), "workers");
  Seq
    .tap(worker => console.log("Moving", worker.name))
    .iter(Worker.gather)
}

const createWorkers = room => nWorkers =>
  // Go through any available spawners and create workers.
  Seq
    .ofObject(Game.spawns)
    .map(pair => pair.value)
    .filter(spawner => spawner.room.name === room.name)
    .map(Worker.spawn)
    .map(() => 1)
    .sum()
;

const createGatherers = room => nWorkers =>
  // Go through any available spawners and create workers.
  Seq
    .ofObject(Game.spawns)
    .map(pair => pair.value)
    .filter(spawner => spawner.room.name === room.name)
    .map(Gatherer.spawn)
    .map(() => 1)
    .sum()
;

class RoomInfo {
  constructor(room) {
    this.room = room;
    this.creeps = Lazy(() => {
      const creeps = Seq.ofObject(Game.creeps).map(pair => pair.value).cache();
      return creepsInRoom(room)(creeps);
    })
    this.workers = Lazy(() =>
      Seq.filter(isWorker)(this.creeps())
    )
    this.workerCount = Lazy(() =>
      this.workers().count()
    )
    this.gatherers = Lazy(() =>
      Seq.filter(isGatherer)(this.creeps())
    )
    this.gathererCount = Lazy(() =>
      this.gatherers().count()
    )
    this.workerSlots = Lazy(() =>
      availableWorkerSlots(this.room)
    )
  }
}

// This will handle the case of an empty room.
const handleInitState = roomInfo => {
  printfn("WorkerCount =", roomInfo.workerCount())
  const workerCount = roomInfo.workerCount();
  const gathererCount = roomInfo.gathererCount();

  if (!(workerCount <= 1 || gathererCount <= 1)) {
    return;
  }

  // Need at least 1 worker, and 1 gatherer.
  if (workerCount === 0) {
    printfn("Creating 1 worker");
    const created = createWorkers(roomInfo.room)(1);
    if (created !== 1) {
      errorfn("Failed to create required workers");
    }
  }

  if (gathererCount === 0) {
    printfn("Creating 1 gatherer");
    const created = createGatherers(roomInfo.room)(1);
    if (created !== 1) {
      errorfn("Failed to created required gatherers");
    }
  }
}

const roomState = room => {
  //const creeps = Seq.ofObject(Game.creeps).map(pair => pair.value);
  //const roomCreeps = creepsInRoom(room)(creeps);
  //const workers = Seq.filter(isWorker)(roomCreeps);
  //const gatherers = Seq.filter(isGatherer)(roomCreeps);

  const roomInfo = new RoomInfo(room);
  handleInitState(roomInfo);

  //console.log("Workers = ", workers.toArray().length)

  //// Now, we can establish what work needs to be done.

  //// How many slots for workers are there?
  //const workerSlots = availableWorkerSlots(room);
  //const workerSlotsCount = workerSlots.count();
  //const workerCount = workers.count()

  //// We need at least 1 worker and 1 gatherer running at all times.
  //if (workerCount === 0) {

  //}

  //if (workerCount < workerSlotsCount) {
  //  // We need to create that many workers.
  //  const workersSpawned = createWorkers(room)(workerSlotsCount - workerCount);
  //  console.log("Spawned", workersSpawned, "workers");
  //}

  //// Move workers to where they need to be.
  moveWorkersToSlots(roomInfo.workers(), roomInfo.workerSlots());
}

// We need to figure out what state the room is in.
const resolveState = room => {
  const state = roomState(room);
}

const update = room => {
  console.log("Updating room %s", room.name)
  resolveState(room);
}

module.exports = {
  update,
}