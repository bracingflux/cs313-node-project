var express = require("express");
var app = express();

var request = require('request');
var session = require('express-session');
var bcrypt = require('bcrypt');

const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL || "postgres://eli:password@localhost:5432/walmart";
const pool  = new Pool({connectionString: connectionString});
var bodyParser = require('body-parser');


app.set("port", (process.env.PORT || 5000));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + "/public"))
app.use(bodyParser.json()); // support json encoded bodies
app.use(session({
		secret: 'walmart-app',
		resave: false,
		saveUninitialized: true
	}));

app.get('/', (req, res) => res.sendFile(__dirname+'/public/product.html'))



app.get("/getProductNames", function(req, res) {
	getProductNames(req, res);
})

app.get("/getProduct", function(req, res) {
	getProduct(req, res);
})

app.get("/userSession", function(req, res) {
	if(!req.session.currentUser){
		res.json({"username": "-1"});
	}
	else {
		res.json({"username": req.session.currentUser, "userId": req.session.userId});
	}
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

app.post("/addWishList", function(req, res) {
	addToWishList(req, res);
})

app.post("/deleteWishListItem", function(req, res) {
	deleteWishItem(req, res);
})

app.post("/signUp", function(req, res) {
	signUp(req, res);
})

app.get("/signOut", function(req, res) {
	signOut(req, res);
})

app.listen(app.get("port"), function(){
	console.log("Now listening for connection on port: " + app.get("port"));
});


function nextprevPage(req, res) {
	var queryString = req.query.queryString;
	var pageIndex = req.query.pageIndex;
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
    	if (!error /*&& result.length >= 1*/) {
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

function callDatabase(url, params, callback) {
	pool.query(url, params, function(err, result) {
		if (err) {
			console.log("Error in db query: ");
			console.log(err);
			callback(err, null);
		}
		else {
			callback(null, result);
		}
	});
}

function logIn(request, response) {
	var username = request.body.uname;
	var password = request.body.psw;
	
	var sql = "SELECT id, username, display_name, password FROM users WHERE username = $1::varchar(100)";

	var params = [username];

	callDatabase(sql, params, function(error, result) {
		if (error || result.rows == null || result.rows.length != 1) {
			response.status(401).json({success: false});
		} 
		else {
			var hash = result.rows[0].password;
			bcrypt.compare(password, hash, function(err, res) {
			    if (err) {
			    	console.log("There was a problem hashing password.");
			    }
			    else {
			    	if (res == true) {
			    		request.session.currentUser = result.rows[0].display_name;
			    		request.session.userId = result.rows[0].id;
			    		response.status(200).json(result.rows[0]);
			    	}
			    	else {
			    		response.status(401).json({success: false});
			    	}
			    }
			});
		}
	})
}

function signUp(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	var displayName = request.body.displayName;
	bcrypt.hash(password, 10, function(err, hash) {
		var params = [username, hash, displayName];
		var sql = "INSERT INTO users (username, password, display_name) VALUES ($1::varchar(100), $2::varchar(100), $3::varchar(100)) RETURNING id;";
		callDatabase(sql, params, function(error, result) {
			if (error || result == null /*|| result.length != 1*/) {
				response.status(500).json({success: false, data: error});
			} 
			else {
	    		request.session.currentUser = displayName;
	    		request.session.userId = result.rows[0].id;
				response.status(200).json({"username": username, "userId": result.rows[0].id});
			}
		})
	});	
	// response.status(200).send("It was successful!");
}

function signOut(request, response) {
	if (request.session.currentUser && request.session.userId) {
		request.session.destroy(function(err) {
			if (err) {
				console.log("Error signing out user.");
				console.log(err);
				response.status(500).send("-1");
			}
			else {
				response.status(200).send("Success");
			}
		})
	}
}

function getWishList(request, response) {
	var productIds = "";
	var userId = parseInt(request.body.uId);
	var params = [userId];
	var sql = "SELECT product_id FROM wishlist WHERE user_id = $1::int;";
	callDatabase(sql, params, function(error, result) {
		if (error || result == null) {
			response.status(500).json({success: false, data: error});
		} 
		else {
			if (result.rowCount == 0) {
				response.status(404).send("-1");
				return;
			}
			for (var i = 0; i < result.rows.length; ++i) {
				var j = (i + 1);
				if (j != result.rows.length) {
					productIds = productIds.concat(result.rows[i].product_id + ",");
				}
				else {
					productIds = productIds.concat(result.rows[i].product_id);
				}
			}

			var url  = "http://api.walmartlabs.com/v1/items?ids=" + productIds + "&apiKey=nsgjenyj5zedvuz746ugac4k&lsPublisherId=eliandrew"
		    performRequest(url, function(error, result2) {
		    	if (!error) {
		    		response.status(200).send(result2);
		    	}
		    	else {
		    		console.log("Failure to retrieve items..");
					response.status(500).json({success: false, data: error});
		    	}
		    })
		}
	})
}

function addToWishList(req, res) {
	var userId = parseInt(req.body.userId);
	var productId = parseInt(req.body.pId);
	var params = [userId, productId];
	var sql = "INSERT INTO wishlist (user_id, product_id) VALUES ($1::int, $2::int);";
	callDatabase(sql, params, function(error, result) {
		if (error || result == null) {
			res.status(500).json({success: false, data: error});
		} 
		else {
			res.status(200).json({success: true});
		}
	})
}

function deleteWishItem(req, res) {
	var productId = parseInt(req.body.pId);
	var userId = parseInt(req.body.userId);
	var params = [productId, userId];
	var sql = "DELETE FROM wishlist WHERE product_id = $1::int AND user_id = $2::int;";

	callDatabase(sql, params, function(error, result) {
		if (error || result == null) {
			res.status(500).json({success: false, data: error});
		} 
		else {
			res.status(200).json({success: true});
		}
	})
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
