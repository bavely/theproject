//Require Express and Use it.
var express = require('express');
var app = express();
//Require BodyParser.
var bodyParser = require("body-parser");
//Require Morgan to show logger.
var logger = require("morgan");
//Require Mongoose to build MongoDB schema.
var mongoose = require("mongoose");
//Require My Model.
var News = require("./models/News.js");
// Sets an initial port. I'll use this later in my listener
var PORT = process.env.PORT || 3000;
//Require socket.io and http for it.
var http = require('http').Server(app);
var io = require('socket.io')(http);
//Using morgan.
app.use(logger("dev"));
//Using bodyParser and express.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(express.static("public"));
//Initiate mongodb and use it.
mongoose.connect("mongodb://heroku_nxlnjpth:g97du67pdnjfbauk74cmpu4cd7@ds117913.mlab.com:17913/heroku_nxlnjpth");
var db = mongoose.connection;

db.on("error", function(err) {
    console.log("Mongoose Error: ", err);
});

db.once("open", function() {
    console.log("Mongoose connection successful.");
});

//Initiate socket.io.
io.on('connection', function(socket) {
    console.log('a user connected');
});

//HTML Route
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

//---------------------------------API Routes------------------------------//
app.get("/api/saved", function(req, res) {
    News.find({})
        .exec(function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                res.json(doc);
            }
        });
});


app.post("/api/saved", function(req, res) {
    console.log("req.body.data");
    var dataTosave = new News(req.body.data);
    dataTosave.save(function(err) {
        if (err) return handleError(err);
        console.log("Saved!!");
    });

});

app.delete("/api/saved/:head", function(req, res) {
    var newsTodelete = req.params;
    console.log(req.params.head);
    News.remove({ head: newsTodelete.head }, function(err) {
        if (err) return handleError(err);
        console.log("// removed!!!");
    });
});

//-------------------------End of API Routes-----------------------------------//

//Port Listening.
http.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});