var fs = require('fs');
var util = require('util');
var imdb = require('./index');
var underscore = require('underscore');

function init() {
    var data = JSON.parse(fs.readFileSync('./output/actor_links.json', 'utf8')),
        output = [];

    console.log("The number of actors in the file: " + data.length);
    getActorBirthday(data, output, 9998, data.length);
}

function getActorBirthday(data, result, index, endingIndex) {
    if (index === endingIndex) {
    	console.log("Writing the birthday data to the file");

        file = fs.createWriteStream('./output/actor_birthday_data.csv');
        result.forEach(function(e) {
            var values = underscore.values(e);

            values = values.join(",");
            values = values + "\n";

            file.write(values);
        });

        file.end();
    } else {
    	console.log("Fetching data for actor: " + data[index].name + " ranked: " + data[index].rank);
        imdb(data[index].link, function(err, d) {
            if (err)
                console.log(err.stack);

            if (d)
                result.push({
                    name: data[index].name,
                    rank: data[index].rank,
                    gender: data[index].gender,
                    birthday: d.birthday
                });
            index = index + 1
            getActorBirthday(data, result, index, endingIndex)
        });
    }
}

init();
