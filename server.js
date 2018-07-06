var express = require("express");
var app = express();

var request = require('request');

const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL || "postgres://eli:password@localhost:5432/walmart";
const pool  = new Pool({connectionString: connectionString});
var bodyParser = require('body-parser');


app.set("port", (process.env.PORT || 5000));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + "/public"))
app.use(bodyParser.json()); // support json encoded bodies

app.get("/", function(req, res) {
	res.send("hi");
});

app.get("/getProductNames", function(req, res) {
	getProductNames(req, res);
})

app.get("/getProduct", function(req, res) {
	getProduct(req, res);
})

app.get("/nextPage", nextprevPage)

app.get("/previousPage", nextprevPage)

app.get("/getWalmartProduct", loadProduct)

app.get("/getWalmartProductById", productById)

app.post("/logIn", function(req, res) {
	logIn(req, res);
})

app.post("/getWishList", function(req, res) {
	getWishList(req, res);
})

app.post("/signUp", function(req, res) {
	signUp(req, res);
})

app.put("/modifyPassword", function(req, res) {
	modifyPassword(req, res);
})

app.listen(app.get("port"), function(){
	console.log("Now listening for connection on port: " + app.get("port"));
});


function nextprevPage(req, res) {
	var queryString = req.query.queryString;
	var pageIndex = req.query.pageIndex;
	// var newIndex = parseInt(pageIndex) + 40;
	// console.log("Inside server.js: queryString " + queryString + " pageIndex " + newIndex);
    var url = "http://api.walmartlabs.com/v1/search?apiKey=nsgjenyj5zedvuz746ugac4k&lsPublisherId=eliandrew&numItems=21&query=" + queryString + "&start=" + pageIndex;

    performRequest(url, function(error, result) {
    	if (!error && result.length >= 1) {
    		res.status(200);
    		res.send(result);
    	}
    	else {
			res.status(500).json({success: false, data: error});
    	}
    })
}

function productById(req, res) {
	var itemId = req.query.itemId;
	var url = "http://api.walmartlabs.com/v1/items/" + itemId + "?apiKey=nsgjenyj5zedvuz746ugac4k&lsPublisherId=eliandrew&format=json"

    performRequest(url, function(error, result) {
    	if (!error && result.length >= 1) {
    		res.status(200);
    		res.send(result);
    	}
    	else {
			res.status(500).json({success: false, data: error});
    	}
    })
}

function loadProduct(req, res) {
	var name = req.query.name;
    var url = "http://api.walmartlabs.com/v1/search?apiKey=nsgjenyj5zedvuz746ugac4k&lsPublisherId=eliandrew&numItems=21&query=" + name;     /*http://api.walmartlabs.com/v1/search?apiKey=nsgjenyj5zedvuz746ugac4k&lsPublisherId=eliandrew&query=*/         

    performRequest(url, function(error, result) {
    	if (!error && result.length >= 1) {
    		res.status(200);
    		res.send(result);
    	}
    	else {
			res.status(500).json({success: false, data: error});
    	}
    })
}

function performRequest(url, callback) {
	request(url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
		callback(null, body);
	  }
	});
}


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
	var sql = "SELECT name, price, description FROM products WHERE id = $1::int";

	var params = [id];

	pool.query(sql, params, function(err, result) {
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		callback(null, result.rows);
	});

}

function logIn(request, response) {
	var userId = 2;
	// var username = request.body.username;	
	response.send("This will return success on login. Here is the userId: " + userId);
}

function signUp(request, response) {
	var userId = 2;
	// var username = request.body.username;	
	response.send("This will return successful signup. Here is the username: " + userId);
}

function modifyPassword(request, response) {
	var username = request.body.username;	
	response.send("This will return successful on updating password. Here is the username: " + username);
}

function getWishList(request, response) {
	var userId = 2;
	// var userId = request.body.userId;	
	response.send("This will return success when user's wish list is queried and returned. Here is the username: " + userId);
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

		callback(null, result.rows);
	});

}
