module.exports = {
    dateFormat: function (data) {
        var date = "";
        if (data !== null) {
            var dataAt = JSON.stringify(data);
            var day = dataAt.substring(1, 11);
            var time = dataAt.substring(12, 20);
            date = day + " " + time;
        } else {
            date = "null";
        }
        return date;
    }
}