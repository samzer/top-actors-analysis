var imdb = require('../index');

imdb('nm0186844', function(err, data) {
  if(err)
    console.log(err.stack);

  if(data)
   console.log(data);
});
