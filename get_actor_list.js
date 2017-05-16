var actorList = require('./lib/actor_list.js');
var fs = require('fs');
var async = require('async');
var underscore = require('underscore');
var util = require('util');

function init() {
    var startingRank = 1,
        endingRank = 5000;

    // Fetch all the female actors
    actorList('female', startingRank, endingRank, function(err, femaleData) {
        if (err)
            console.log(err.stack);

        if (femaleData)
        // Fetch all the female actors
            actorList('male', startingRank, endingRank, function(err, maleData) {
            if (err)
                console.log(err.stack);

            if (maleData) {
                var data = [];
                
                data = data.concat(maleData);
                data = data.concat(femaleData);

                // Write the data to file 
                // file.on('error', function(err) { console.log("Following error occured: " + err.stack) });
                fs.writeFileSync('./output/actor_links.json', JSON.stringify(data) , 'utf-8');
            }
        });
    });

}


init();
