// This module will handle the behavior for a given room.

const Seq = require("./seq");

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

  console.log("Workers = ", workers.toArray().length)
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