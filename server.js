var express = require("express");
var app = express();

const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL || "postgres://eli:password@localhost:5432/walmart";
console.log("Connecting to database to... " + connectionString);
const pool  = new Pool({connectionString: connectionString});

app.set("port", (process.env.PORT || 5000));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + "/public"))

app.get("/", function(req, res) {
	res.send("hi");
});

app.get("/getProductNames", function(req, res) {
	getProductNames(req, res);
})

app.get("/getProduct", function(req, res) {
	getProduct(req, res);
})

app.get("/getWalmartProduct", function(req, res) {
	res.send("This will return a Walmart Product");
})

app.post("/logIn", function(req, res) {
	logIn(req, res);
})

app.listen(app.get("port"), function(){
	console.log("Now listening for connection on port: " + app.get("port"));
});


/*
* DB function calls
*/
function getProduct(request, response) {
	var id = request.query.id;
	getProductFromDb(id, function(error, result) {

		if (error || result == null || result.length != 1) {
			response.status(500).json({success: false, data: error});
		} 
		else {
			var person = result[0];
			response.status(200).json(result[0]);
		}
	});		
}

function getProductFromDb(id, callback) {
	console.log("Getting person from DB with id: " + id);
	var sql = "SELECT name, price, description FROM products WHERE id = $1::int";

	var params = [id];

	pool.query(sql, params, function(err, result) {
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		console.log("Found result: " + JSON.stringify(result.rows));
		callback(null, result.rows);
	});

}

function logIn(request, response) {
	response.send("This will return if success on login");
}


function getProductNames(request, response) {
	getProductNamesFromDb(function(error, result) {

		if (error || result == null) {
			response.status(500).json({success: false, data: error});
		} 
		else {
			response.status(200).json(result);
		}
	});		
}

function getProductNamesFromDb(callback) {
	var sql = "SELECT name, id FROM products";

	pool.query(sql, function(err, result) {
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		console.log("Found result: " + JSON.stringify(result.rows));
		callback(null, result.rows);
	});

}
