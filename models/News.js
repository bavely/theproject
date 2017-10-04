var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NewsSchema = new Schema({
    head: {
        type: String
    },
    img: {
        type: String
    },
    paragraph: {
        type: String
    },
    date: {
        type: String
    },
    newsDesk: {
        type: String
    },
    url: {
        type: String
    }
});

var News = mongoose.model("News", NewsSchema);
module.exports = News;