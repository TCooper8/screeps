// This module will handle the behavior for a given room.

const Seq = require("./seq");
const Array = require('./array');
const Worker = require('./worker');

const economyState = 0

const countWorkers = room => screeps => {
}

const creepsInRoom =
  room =>
    Seq.filter(creep => creep.room.name === room.name)

const isWorker = creep => creep.name[0] === 'W'
const isGatherer = creep => creep.name[0] === 'G'

const availableWorkerSlots =
  room =>
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

        results.iter(obj => console.log(obj.type));
        return results.toArray()
      })
      .fold((acc, array) => Array.append(acc, array))([])
;

const moveWorkersToSlots = (workers, slots) => {
  console.log("Moving workers...");
  let slotCount = slots.count();
  const workerCount = workers.count();

  console.log("Slots", slotCount);

  workers.tap(worker => console.log(worker.name)).iter(Worker.gather)
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

const roomState = room => {
  const creeps = Seq.ofObject(Game.creeps).map(pair => pair.value);
  const roomCreeps = creepsInRoom(room)(creeps).cache();
  const workers = Seq.filter(isWorker)(roomCreeps);
  const gatherers = Seq.filter(isGatherer)(roomCreeps);

  console.log("Workers = ", workers.toArray().length)

  // Now, we can establish what work needs to be done.

  // How many slots for workers are there?
  const workerSlots = Seq.ofArray(availableWorkerSlots(room));
  const workerSlotsCount = workerSlots.count();
  const workerCount = workers.count()

  if (workerCount < workerSlotsCount) {
    // We need to create that many workers.
    const workersSpawned = createWorkers(room)(workerSlotsCount - workerCount);
    console.log("Spawned", workersSpawned, "workers");
  }

  // Move workers to where they need to be.
  moveWorkersToSlots(workers, workerSlots)
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