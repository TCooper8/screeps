const worker = require('./worker')

module.exports.loop = function() {
  const spawns = Object.keys(Game.spawns);
  _.each(Game.spawns, (spawn) => {
    if (spawn.energy >= worker.cost) {
      worker.spawn(spawn);
    }

    _.each(spawn.creeps, (creep) => {
      console.log("Running worker");
      worker.gather(creep);
    });
  });
}
