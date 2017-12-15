const Worker = require('./worker')
const Option = require('./option')
const Array = require('./array')

const handleSpawners = Array.iter(spawner => {
  console.log("Spawner %s", spawner.name);
  if (spawn.energy >= worker.cost) {
    worker.spawn(spawn);
  }
});

const handleCreeps = Array.iter(creep => {
  Worker.gather(creep);
});

module.exports.loop = function() {
  Object
    .values(Game.spawns)
    .bind(handleSpawners);

  Object
    .values(Game.creeps)
    .bind(handleCreeps);
}
