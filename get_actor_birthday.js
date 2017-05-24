var fs = require('fs');
var util = require('util');
var imdb = require('./index');
var underscore = require('underscore');
var async = require('async');

function init() {
    var data = JSON.parse(fs.readFileSync('./output/actor_links.json', 'utf8')),
        output = [];

    console.log("The number of actors in the file: " + data.length);
    getActorBirthday(data, output);
}


function getActorBirthday(data, output, cb, index, endingIndex) {
    var d = data.splice(0, 100);

    if (d.length === 0) {
    	console.log("Writing the birthday data data to the file");
        file = fs.createWriteStream('./output/actor_birthday_data.csv');
        output.forEach(function(e) {
            var values = underscore.values(e);

            values = values.join(",");
            values = values + "\n";

            file.write(values);
        });

        file.end();
    } else {
        async.map(d, function(dataObject, callback) {

            imdb(dataObject.link, function(err, d) {
                if (err)
                    console.log(err.stack);

                if (d)
                    callback(null, {
                        name: dataObject.name,
                        rank: dataObject.rank,
                        gender: dataObject.gender,
                        birthday: d.birthday
                    });
            });

        }, function(err, result) {
            if (err)
                console.log(err.stack);

            if (result) {
                output = output.concat(result);
                getActorBirthday(data, output);
            }
        });
    }
}

init();
