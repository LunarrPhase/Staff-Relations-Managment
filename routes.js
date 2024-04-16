var express = require("express");
var router = express.Router();

router.get("/", function(req, res){
    console.log("Hello from routes.js");
    //res.sendFile(".GET_STARTED/src/index", {});
    //res.sendFile("index.html", {root: "GET_STARTED/src"})
    //express.static("./GET_STARTED/src");
});

module.exports = router;