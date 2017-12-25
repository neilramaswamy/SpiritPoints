var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/mydb';

MongoClient.connect(url, function(err, db) {
	if (err) throw err;
	var myQuery = {hobby: 'reading'};
	db.collection("customers").deleteOne(myQuery, function(err, result) {
		if (err) throw err;
		console.log("1 document deleted");
		console.log("result: " + result);
		db.close();
	})
})