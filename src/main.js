const worker = require('./worker')
const Option = require('./option')
const Array = require('./array')

const handleSpawners = Array.iter(spawner => {
  if (spawn.energy >= worker.cost) {
    worker.spawn(spawn);
  }
});

module.exports.loop = function() {
  const spawns = Object.keys(Game.spawns);
  handleSpawners(Object.values(Game.spawns));
  //_.each(Game.spawns, (spawn) => {
  //});

  _.each(Game.creeps, (creep) => {
    console.log("Running worker");
    worker.gather(creep);
  });
}
