(function(global){

    "use strict";

     var common = {

        serialize: function(obj) {
            var str = [], p;
            for(  p in obj ){
                if (obj.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
            }
            return str.join("&");
        },

        formatDate: function(time) {
            var dateObj = new Date(time),

                date  = dateObj.getDate(),
                month = dateObj.getMonth() + 1,
                year  = dateObj.getFullYear();

            return year + "-" + (month < 10 ? "0" : "") + month + "-" + (date < 10 ? "0" : "") + date
        },

        request: function(method, url, params, done) {
            var xhr = new XMLHttpRequest();

            xhr.open(method, url + "?" + this.serialize(params), true);
            xhr.onreadystatechange = function() {
                if (this.readyState !== 4) {
                    return;
                }

                done( JSON.parse(this.responseText) );
            };

            xhr.send();
        }
    };

    global.lib = global.lib || {};
    global.lib.common = common;
    
}(window));