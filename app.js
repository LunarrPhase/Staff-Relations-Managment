var express = require("express");
var app = express();

app.set("port", process.env.PORT || 3000);

app.use(express.static("GET_STARTED/src"));
app.use(express.static("GET_STARTED/test"));
app.use(express.static("GET_STARTED//src/img"));

app.listen(app.get("port"), function(){
    console.log("Server started on port " + app.get("port"));
});