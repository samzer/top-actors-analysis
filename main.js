var actorList = require('./actor_list.js');

actorList('female', 1, function(err, data) {
  if(err)
    console.log(err.stack);

  if(data)
    console.log(data);
});
