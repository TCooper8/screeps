const worker = require('./worker')
const {
  Option,
} = require('./option')

module.exports.loop = function() {
  const spawns = Object.keys(Game.spawns);
  _.each(Game.spawns, (spawn) => {
    if (spawn.energy >= worker.cost) {
      worker.spawn(spawn);
    }
  });

  _.each(Game.creeps, (creep) => {
    console.log("Running worker");
    worker.gather(creep);
  });
}
