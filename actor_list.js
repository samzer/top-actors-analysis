var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var underscore = require('underscore')

module.exports = function(gender, start, end, cb) {
    var urlList = [];

    for (var i = start; i < end; i += 50) {
        urlList.push({
            url: 'http://www.imdb.com/search/name?gender=' + gender + '&start=' + i,
            rank: i
        })
    }

    async.map(urlList, function(urlObject, callback) {
        request(urlObject.url, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var $ = cheerio.load(body.replace(/(\r\n|\n|\r)/gm, "").replace(/ +(?= )/g, '')),
                    actorList = [],
                    rank = urlObject.rank;

                $ = cheerio.load(body);

                $("tr > td.name > a").each(function(i, element) {
                    var name = "",
                        link = "";

                    name = element.children[0].data;
                    link = element.attribs.href

                    actorList.push({
                        name: name,
                        link: link,
                        rank: rank
                    });

                    rank += 1;
                });

                callback(null, actorList);
            } else {
                callback(new Error('IMDB Failed to respond, or responded with error code'), null);
            }
        })
    }, function(err, results) {
        var output = [];

        output = underscore.flatten(results);

        cb(err, output);
    });


}
