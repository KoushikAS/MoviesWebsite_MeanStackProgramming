var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var MongoClient = require('mongodb').MongoClient;
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false })
// Connect to the db

MongoClient.connect("mongodb://127.0.0.1/mydb", function(err, db) {
 if(!err) {
    console.log("We are connected");

app.use(express.static('public')); //making public directory as static directory
app.use(bodyParser.json());
app.get('/', function (req, res) {
   console.log("Got a GET request for the homepage");
   res.send('<h1>Welcome to MSRIT</h1>');
})
/*JS client side files has to be placed under a folder by name 'public' */

app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

app.get('/insert.html', function (req, res) {
    res.sendFile( __dirname + "/" + "insert.html" );
})
/* to access the posted data from client using request body (POST) or request params(GET) */
//-----------------------POST METHOD-------------------------------------------------
app.post('/process_post', function (req, res) {
    /* Handling the AngularJS post request*/
    console.log(req.body);
	res.setHeader('Content-Type', 'text/html');
    /*response has to be in the form of a JSON*/
    req.body.serverMessage = "NodeJS replying to angular"
        /*adding a new field to send it to the angular Client */
		console.log("Sent data are (POST): film ID :"+req.body.id+" film Name="+req.body.name+" film Ratings :"+req.body.rate+" film Genre="+req.body.genre);
		// Submit to the DB
  	var id = req.body.id;
    var name = req.body.name;
    var rate = req.body.rate;
    var genre = req.body.genre;

	db.collection('film').insert({id:id,name:name,rate:rate,genre:genre});
    res.end("film Inserted-->"+JSON.stringify(req.body));
    /*Sending the respone back to the angular Client */
});

//--------------------------GET METHOD-------------------------------
app.get('/process_get', function (req, res) {
// Submit to the DB
  var newEmp = req.query;
	var id = req.query['id'];
    var name = req.query['name'];
	db.collection('film').insert({id:id,name:name});
    console.log("Sent data are (GET): id :"+id+" and film name :"+name);
  	res.end("film Inserted-->"+JSON.stringify(newEmp));
})

//--------------UPDATE------------------------------------------
app.get('/update.html', function (req, res) {
    res.sendFile( __dirname + "/" + "update.html" );
})

app.get("/update", function(req, res) {
	var name1=req.query.name;
  var field=req.query.field;
  var value=req.query.value;
  var query = {};
  query[field] = value;

	db.collection('film', function (err, data) {
        data.update({"name":name1},{$set:query},{multi:true},
            function(err, result){
				if (err) {
					console.log("Failed to update data.");
			} else {
				res.send(result);
				console.log("film Updated")
			}
        });
    });
})
//--------------SEARCH------------------------------------------
app.get('/search.html', function (req, res) {
   res.sendFile( __dirname + "/" + "search.html" );
})

app.get("/search", function(req, res) {
	//var idnum=parseInt(req.query.id)  // if id is an integer

  var field=req.query.field;
  var value=req.query.value;
  var query = {};
  query[field] = value;

    db.collection('film').find(query).toArray(function(err, docs) {
    if (err) {
      console.log(err.message+ "Failed to get data.");
    } else {
      res.status(200).json(docs);
    }
  });
  });
  // --------------To find "Single Document"-------------------
	/*var idnum=parseInt(req.query.id)
    db.collection('film').find({'id':idnum}).nextObject(function(err, doc) {
    if (err) {
      console.log(err.message+ "Failed to get data");
    } else {
      res.status(200).json(doc);
    }
  })
}); */

//--------------DELETE------------------------------------------
app.get('/delete.html', function (req, res) {
   res.sendFile( __dirname + "/" + "delete.html" );
})

app.get("/delete", function(req, res) {

    var field=req.query.field;
    var value=req.query.value;
    var query = {};
    query[field] = value;

	db.collection('film', function (err, data) {
        data.remove(query, function(err, result){
				if (err) {
					console.log("Failed to remove data.");
			} else {
				res.send(result);
				console.log("film Deleted")
			}
        });
    });

  });
app.get('/display', function (req, res) {

 db.collection('film').find().sort({id:1}).toArray(
 		function(err , i){
        if (err) return console.log(err)
        res.render('disp.ejs',{films: i})
     })
//---------------------// sort({id:-1}) for descending order -----------//
})
app.get('/about', function (req, res) {
   console.log("Got a GET request for /about");
   res.send('MSRIT, Dept. of CSE');
})

var server = app.listen(5000, function () {
var host = server.address().address
  var port = server.address().port
console.log("Example app listening at http://%s:%s", host, port)
})
}
else
{   db.close();  }

});
