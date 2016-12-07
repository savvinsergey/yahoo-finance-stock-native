(function(global){

    "use strict";

     var common = {

        serialize: function commonSerialize(obj) {
            var str = [], p;
            for(  p in obj ){
                if (obj.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
            }
            return str.join("&");
        },

        formatDate: function commonFormatDate(time) {
            var dateObj = new Date(time),

                date  = dateObj.getDate(),
                month = dateObj.getMonth() + 1,
                year  = dateObj.getFullYear();

            return year + "-" + (month < 10 ? "0" : "") + month + "-" + (date < 10 ? "0" : "") + date
        },

        request: function commonRequest(method, url, params, done) {
            var xhr = new XMLHttpRequest();

            xhr.open(method, url + "?" + this.serialize(params), true);
            xhr.timeout = 5000;
            xhr.onreadystatechange = function() {
                var parsedData = null;
                if (this.readyState !== 4) {
                    return;
                }

                try {
                    parsedData = JSON.parse(this.responseText);
                } catch(e) {}

                done( parsedData );
            };

            xhr.send();
        }
    };

    global.lib = global.lib || {};
    global.lib.common = common;
    
}(window));