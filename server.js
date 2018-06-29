var express = require("express");

var app = express();

app.set("port", (process.env.PORT || 5000));

app.get("/", function(req, res) {
	res.send("hi");
});

app.listen(app.get("port"), function(){
	console.log("Now listening for connection on port: " + app.get("port"));
});