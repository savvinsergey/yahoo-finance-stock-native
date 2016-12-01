(function(global){

    "use strict";

    var api;
    
    function _requestToYQL(params,cb) {
        var now = new Date(),
            periodInDays = ( params.type === "year" ? 365 : 30 ),
            startDate = global.lib.common.formatDate( now.getTime() - (60 * 60 * 24 * periodInDays * 1000) ),
            endDate   = global.lib.common.formatDate( now.getTime() );
        
        global.lib.common.request('GET', 'http://query.yahooapis.com/v1/public/yql',
            {
                q: 'select * from yahoo.finance.historicaldata  where ' +
                   'symbol in ("' + params.symbol + '") ' +
                   'and startDate = "' + startDate + '" ' +
                   'and endDate = "' + endDate + '"',
                format: 'json',
                env: 'store://datatables.org/alltableswithkeys'
            }, function(response) {
                var preparedData = null;

                if (response.query.count) {
                    preparedData = _parseFromYQL(response.query.results.quote).sort( _sortDataByDate );
                } else {
                    alert("Yahoo finance API nave no data for this stock");
                }

                cb(preparedData);
            });
    }

    /* JSONP */
    function _requestToChartAPI(symbol) {
        var script = document.createElement('script');
        script.src = 'http://chartapi.finance.yahoo.com/instrument/1.0/' + symbol + '/chartdata;type=close;range=1d/json';

        document.querySelector('head').appendChild(script);

        script.parentNode.removeChild(script);
    }

    function _parseFromYQL(data) {
        return data.map(function(item) {
            var date = new Date(item.Date),
                timestamp = date.getTime();

            return [ timestamp, +item.Close ];
        });
    }

    function _parseFromChartAPI(data) {
        return data.map(function(item) {
            return [ item.Timestamp * 1000, +item.close ];
        });
    }

    function _sortDataByDate(a,b) {
        if (a[0] < b[0]) {
            return -1;
        }
        if (a[0] > b[0]) {
            return 1;
        }
        return 0;
    }

    api = {
        stocks : {
            fetchData: {
                day: function day(symbol,cb) {
                    _requestToChartAPI(symbol);

                    global.finance_charts_json_callback = function(data) {
                        if (data.errorid) {
                            alert('ERROR: ' + data.message);
                            return cb(null);
                        }

                        var preparedData = _parseFromChartAPI(data.series).sort( _sortDataByDate );
                        cb( preparedData );
                    };
                },

                month: function month(symbol,cb) {
                    _requestToYQL({
                        symbol : symbol,
                        type   : "month"
                    },cb);
                },

                year: function year(symbol,cb) {
                    _requestToYQL({
                        symbol : symbol,
                        type   : "year"
                    },cb);
                }
            }
        }
    };

    global.lib = global.lib || {};
    global.lib.api = api;

}(window));