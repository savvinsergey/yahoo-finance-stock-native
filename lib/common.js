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

            params = this.serialize(params);
            url += (method === 'GET' ? "?" + params : '');
            params = method === 'POST' ? params : null;

            xhr.open(method, url, true);
            xhr.timeout = 10000;
            xhr.onreadystatechange = function onreadystatechange() {
                var parsedData = null;
                if (this.readyState !== 4) {
                    return;
                }

                try {
                    if (this.status === 200) {
                        parsedData = JSON.parse(this.responseText);
                    }
                } catch(e) {
                    console.warn('Response obj from Yahoo finance API: ', this);
                }

                done( parsedData );
            };

            xhr.send( params );
        }
    };

    global.lib = global.lib || {};
    global.lib.common = common;
    
}(window));