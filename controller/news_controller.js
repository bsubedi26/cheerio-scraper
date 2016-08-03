// Required modules
var request = require('request');
var cheerio = require('cheerio');
var mongojs = require('mongojs');
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
// MongoDB configuriation
var databaseUrl = "mongodb://heroku_v95f79xg:15i2m30hcoadhps27cqh1060tg@ds139725.mlab.com:39725/heroku_v95f79xg";
var collections = ["data"];

// use mongojs to hook the database to the db variable 
var db = mongojs(databaseUrl, collections);

// this makes sure that any errors are logged if mongodb runs into an issue
db.on('error', function(err) {
  console.log('Database Error:', err);
});
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
  // request options to get initial data for the index page
db.data.findOne({}, function(err,data) {
  if (data === null) {

  var options = {
    url: 'http://www.archdaily.com/architecture-news',
    headers: {
      'User-Agent': 'request'
    }
  };
  //main request to retrieve data and store into mongodb
  request(options, function(error, response, html) {
  if (error) throw error;
  var results = [];
  var $ = cheerio.load(html);
    $(".mpost").each(function(i, element) {
        var title = $(this).find(".title").text().trim()
        var date = $(this).find(".date-publication").text().trim()
        var imgURL = $(this).find("source").attr('srcset')
        var paragraphs = $(this).find('p').text().trim()
        var link = $(this).find(".title").attr('href')
        var fullLink = "http://www.archdaily.com" + link
        // console.log(fullLink)
        //not storing image URLs that are undefined
        if (imgURL !== undefined) {
          var obj = {
            title: title,
            date: date,
            imgURL: imgURL,
            paragraphs: paragraphs,
            link: fullLink
          }
          results.push(obj)
        }//close if statement
    })//close $ each statement

          db.data.insert(results, function(err,data) {
            if (err) throw err;
          })
  })//close request
}
})
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//Routes to export, which will be used in the server.js file
module.exports = function(app) {

	app.get('/', function(req,res) {

	  db.data.find({}, function(err,data) {
	    if (err) throw err;
	    // console.log(data)
	    res.render('index', {
	      results: data
	    }) 
	} )
	})

	app.post('/comment', function (req,res) {
	  // add the comments to the db using the object id
	  var id = req.body._id
	  var comment = req.body.comment
	  // console.log(req.body)
	  db.data.update({"_id": mongojs.ObjectId(id)}, {$push: {"comment": comment} } , function(err, data) {
	    if (err) throw err;
	    db.data.find({"_id": mongojs.ObjectId(id)}, function(err,data) {
	      if (err) throw err;
	      // console.log(data)
	      //send comments back to front end
	      res.json(data)
	    })
	  })
	})

	app.post('/comment_delete', function (req,res) {
	  // delete the comments by searching the db using the object id
	  var id = req.body._id
	  var comment = req.body.comment
	  // console.log(req.body)
	  db.data.update({"_id": mongojs.ObjectId(id)}, {$pull: {"comment": comment} } , function(err, data) {
	    if (err) throw err;
	    db.data.find({"_id": mongojs.ObjectId(id)}, function(err,data) {
	      if (err) throw err;
	      // console.log(data)
	      //send comments back to front end
	      res.json(data)
	    })
	  })

	})

	// Get comments for specific articles based on :id in the URL
	app.get('/comment/:id', function(req,res) {
	  var id = req.params.id
	  // console.log(id)
	  db.data.find({"_id": id}, function(err,data) {
	    if (err) throw err;
	    // console.log(data)
	  })
	})
}