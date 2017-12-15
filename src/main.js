const worker = require('./worker')

module.exports.loop = function() {
  const spawns = Object.keys(Game.spawns);
  _.each(Game.spawns, (spawn) => {
    if (spawn.energy >= worker.cost) {
      worker.spawn(spawn);
    }
  });
  console.log("loop");
}
