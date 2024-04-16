var express = require("express");
var path = require("path");
var routes = require("./routes");


var app = express();
app.set("port", process.env.PORT || 3000);

//app.use(routes);
app.use(express.static("GET_STARTED/src"));

app.listen(app.get("port"), function(){
    console.log("Server started on port " + app.get("port"));
});