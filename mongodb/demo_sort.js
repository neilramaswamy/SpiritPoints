var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/mydb';

MongoClient.connect(url, function(err, db) {
	if (err) throw err;
	var mySort = {name: -1};
	db.collection("customers").find().sort(mySort).toArray(function (err, result) {
		if (err) throw err;
		console.log(result);
		db.close();
	})
})