var axios = require("axios");


var helper = {

    getHistory: function() {
        return axios.get("/api/saved");
    },

    // This function posts new searches to our database.
    postHistory: function(data) {
        return axios.post("/api/saved", { data: data });
    },
    deleteHistory: function(data) {
        console.log(data);
        return axios.delete(`/api/saved/${data.head}`);
    }
};

module.exports = helper;