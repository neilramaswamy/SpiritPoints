var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url, function(err, db) {
	if (err) throw err;
	myObj = [
		{_id: 154, name:"Chocolate"},
		{_id: 155, name:"Vanilla"},
		{_id: 156, name:"Rainbow"}
	];
	db.collection("flavors").insertMany(myObj, function(err, res) {
		if (err) throw err;
		console.log(res);
		db.close();
	});
});