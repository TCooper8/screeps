// This module will handle the behavior for a given room.

const Seq = require("./seq");
const Array = require('./array');

const economyState = 0

const countWorkers = room => screeps => {
}

const creepsInRoom =
  room =>
    Seq.filter(creep => creep.room.name === room.name)

const isWorker = creep => creep.name[0] === 'W'
const isGatherer = creep => creep.name[0] === 'G'

const roomState = room => {
  const creeps = Seq.ofObject(Game.creeps).map(pair => pair.value);
  const roomCreeps = creepsInRoom(room)(creeps).cache();
  const workers = Seq.filter(isWorker)(roomCreeps);
  const gatherers = Seq.filter(isGatherer)(roomCreeps);

  const sources = room.find(FIND_SOURCES_ACTIVE);

  const sourcePositions =
    Seq
      .ofArray(sources)
      .map(source => {
        // Look at all the cells near this source.
        const objects = room.lookAtArea(
          source.pos.y - 1,
          source.pos.x - 1,
          source.pos.y + 1,
          source.pos.x + 1,
          true,
        )
        return
          Seq
            .ofArray(objects)
            .filter(obj => obj.type === "terrain")
            .filter(obj => obj.terrain !== "wall")
            .toArray()
      })
      .fold((count, array) => count + array.length)(0);

  console.log("Worker position = ", sourcePositions);
  console.log("Workers = ", workers.toArray().length)

  // Now, we can establish what work needs to be done.

  // How many slots for workers are there?
}

// We need to figure out what state the room is in.
const resolveState = room => {
  const state = roomState(room);
}

const update = room => {
  resolveState(room);
}

module.exports = {
  update,
}