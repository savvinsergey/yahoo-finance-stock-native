(function(global){

    "use strict";

    var api;
    
    function _requestToYQL(params,done) {
        var now = new Date(),
            periodInDays = ( params.type === "year" ? 365 : 30 ),
            startDate = global.lib.common.formatDate( now.getTime() - (60 * 60 * 24 * periodInDays * 1000) ),
            endDate   = global.lib.common.formatDate( now.getTime() ),

            yqlUrl = 'http://query.yahooapis.com/v1/public/yql',
            requestParams = {
                q: 'select * from yahoo.finance.historicaldata  where ' +
                   'symbol in ("' + params.symbol + '") ' +
                   'and startDate = "' + startDate + '" ' +
                   'and endDate = "' + endDate + '"',
                format: 'json',
                env: 'store://datatables.org/alltableswithkeys'
            };
        
        global.lib.common.request('GET', yqlUrl, requestParams, function(response) {
            var preparedData = null;

            if (!response) {
                alert("Yahoo finance API server returned empty/wrong data or server unavailable");
                return done(null);
            }

            if (response.query.count) {
                preparedData = _parseFromYQL(response.query.results.quote).sort( _sortDataByDate );
            } else {
                alert("Yahoo finance API nave no data for this stock");
            }

            done(preparedData);
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
                day: function stocksFetchDataDay(symbol,done) {
                    _requestToChartAPI(symbol);

                    global.finance_charts_json_callback = function finance_charts_json_callback(data) {
                        var preparedData;
                        if (data.errorid) {
                            alert('ERROR: ' + data.message);
                            return done(null);
                        }

                        preparedData = _parseFromChartAPI(data.series).sort( _sortDataByDate );
                        done( preparedData );
                    };
                },

                month: function stocksFetchDataMonth(symbol,done) {
                    _requestToYQL({
                        symbol : symbol,
                        type   : "month"
                    },done);
                },

                year: function stocksFetchDataYear(symbol,done) {
                    _requestToYQL({
                        symbol : symbol,
                        type   : "year"
                    },done);
                }
            }
        }
    };

    global.lib = global.lib || {};
    global.lib.api = api;

}(window));