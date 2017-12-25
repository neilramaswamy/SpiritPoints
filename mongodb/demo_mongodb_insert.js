var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url, function(err, db) {
	if (err) throw err;
	myObj = [
		{name: "John", hobby: "sports"},
		{name: "Mark", hobby: "reading"},
		{name: "Tim", hobby: "Tennis"},
		{name: "Ryan", hobby: "coding"}
	];
	db.collection("customers").insertMany(myObj, function(err, res) {
			if (err) throw err;
			console.log("Number of docs inserted: " + res.insertedCount);
			db.close();
		});
});