var request = require('request');
var cheerio = require('cheerio');

module.exports = function(gender, start, cb) {
    request('http://www.imdb.com/search/name?gender=' + gender +  '&start=' + start, function (error, response, body) {
	if (!error && response.statusCode == 200) {
	    var $ = cheerio.load(body.replace(/(\r\n|\n|\r)/gm,"").replace(/ +(?= )/g,'')),
		actorList = [];
	    
	    $ = cheerio.load(body);

	    $("tr > td.name > a").each(function(i, element) {
		var name = "",
		    link = "";
		
		name = element.children[0].data;
		link = element.attribs.href

		actorList.push({
		    name : name,
		    link : link
		});
	    });

	    cb(null, actorList);
	} else {
	    cb(new Error('IMDB Failed to respond, or responded with error code'), null);
	}
    });
}
