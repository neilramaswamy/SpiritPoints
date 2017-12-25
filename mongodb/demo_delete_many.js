var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/mydb';

MongoClient.connect(url, function(err, db) {
	if (err) throw err;
	var myQuery = {hobby: "Tennis"};
	db.collection("customers").deleteMany(myQuery, function(err, obj) {
		if (err) throw err;
		console.log("# of documents deleted: " + obj.result.n);
		db.close();
	})
})