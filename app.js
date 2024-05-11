var express = require("express");
var app = express();

app.set("port", process.env.PORT || 3000);

app.use(express.static("src"));
app.use(express.static("test"));
app.use(express.static("src/img"));

app.listen(app.get("port"), function(){
    console.log("Server started on port " + app.get("port"));
})
