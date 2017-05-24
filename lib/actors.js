var request = require('requestretry');
var cheerio = require('cheerio');

module.exports = function(id, cb) {

    console.log("Hitting the url - http://www.imdb.com/name/" + id + '/');
    request({
        url: 'http://www.imdb.com/name/' + id + '/',
        timeout: 20000,

        maxAttempts: 5, // (default) try 5 times
        retryDelay: 5000, // (default) wait for 5s before trying again
        retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors

    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("Got the response");
            var $ = cheerio.load(body.replace(/(\r\n|\n|\r)/gm, "").replace(/ +(?= )/g, ''));
            var name = body.match(/<span class="itemprop" itemprop="name">(.+)<\/span>/i)[1];

            var moviesList = [];
            var tvList = [];
            var birthday = "";
            $ = cheerio.load(body);

            $("div.filmo-row").each(function(i, element) {
                if (element.attribs.id.split("-", 2)[0] == "actor" || element.attribs.id.split("-", 2)[0] == "actress") {
                    var movie = element.children[0].next.next.next.children[0].children[0].data;
                    var nextWord = element.children[0].next.next.next.children[0].children[0].parent.parent.next.data;
                    if (!(nextWord.length > 1)) {
                        moviesList.push(movie);
                    } else {
                        tvList.push(movie);
                    }
                }
            });

            $("time").each(function(i, element) {
                if (i === 0)
                    birthday = element.attribs.datetime;
            });

            cb(null, {
                name: name || "N/A",
                moviesList: moviesList || "N/A",
                tvList: tvList || "N/A",
                birthday: birthday
            });
        } else {
            cb(new Error('IMDB Failed to respond, or responded with error code'), null);
        }
    });
}
