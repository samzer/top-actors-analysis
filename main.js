var actorList = require('./actor_list.js');

function init() {
    var maleActorList = [],
        femaleActorList = [];

    // Fetch all the female actors
        actorList('female', 1, 500, function(err, data) {
            if (err)
                console.log(err.stack);

            if (data)
            console.log(data);
        })

}

init();
