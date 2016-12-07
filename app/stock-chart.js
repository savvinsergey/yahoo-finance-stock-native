(function(global){

    "use strict";

    /*-------- private ---------*/

    var _period,
        _name,
        _config,
        _data = {},
        _block,
        _define = {
            name : function defineName(name){
                _name = name.toLowerCase();
                Object.defineProperty(this,'name',{
                    get: function defineNameGet(){
                        return _name;
                    },
                    set: function defineNameSet(newValue){
                        _name = newValue;
                        _period = "year";
                        _data = {};

                        _config.title.text = _name.toUpperCase() + " Stocks";

                        this.getData(false,function(){
                            this.render();
                        }.bind(this))
                    }.bind(this)
                });
            },
            period: function definePeriod(period){
                _period = period;
                Object.defineProperty(this,'period',{
                    get: function definePeriodGet(){
                        return _period;
                    },
                    set: function definePeriodSet(newValue){
                        if(["day","month","year"].indexOf(newValue) === -1) {
                            alert("ERROR: Wrong new period");
                            return;
                        }

                        _currentPeriodButtonChange(newValue);
                        _period = newValue;

                        this.getData(false,function(){
                            this.render();
                        }.bind(this))
                    }.bind(this)
                });
            }
        };

    function _prepareElement(container) {
        var template = document.querySelector("#stock-chart-tmpl").innerHTML,
            parentEl = document.querySelector(container),
            targetEl = document.createElement('div'),
            targetChart,
            buttons;

        targetEl.innerHTML = template;

        targetChart = targetEl.querySelector(".chart");
        targetChart.className = "chart-" + this.name;

        buttons = targetEl.querySelectorAll("button");
        buttons.forEach(function(button) {
            button.onclick = _switchPeriod.bind(this,arguments[0]);
            button.style.color = (button.dataset.period === _period ? "#ddd" : null);
        }.bind(this));

        parentEl.appendChild(targetEl);

        return targetChart;
    }

    function _currentPeriodButtonChange(period){
        var buttons = _block.parentNode.querySelectorAll('button');
        buttons.forEach(function (button) {
            button.style.color = (button.dataset.period === period ? "#ddd" : null);
        });
    }

    function _switchPeriod(el) {
        _currentPeriodButtonChange(el.dataset.period);
        _period = el.dataset.period;

        this.getData.call(this, false, function() {
            this.render();
        }.bind(this));
    }

    /*-------- public ---------*/

    function StockChart(params) {

        if (!params.symbol || !params.container) {
            alert("ERROR: Wrong init params");
            return;
        }

        _define.name.call(this, params.symbol);
        _define.period.call(this, params.period || "year");

        if (params.config) {
            if (!params.config.title) {
                params.config.title = {};
            }

            params.config.title.text = _name.toUpperCase() + " Stocks";
        }

        _config = params.config || {

            chart: {
                borderColor: '#C0C0C0',
                borderWidth: 1,
                borderRadius: 0
            },

            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },

            title: {
                text: _name.toUpperCase() + " Stocks"
            },

            rangeSelector: {
                enabled: false
            },

            tooltip: {
                valueDecimals: 2
            },

            series: []
        };

        _block = _prepareElement.call(this,params.container);
    }

    StockChart.prototype = {

        getData: function getData(isUpdate,done) {
            if ( _data[ _period ] && !isUpdate ) {
                if ( done && typeof done === "function" ) {
                    done();
                }
            } else {
                global.lib.api.
                    stocks.fetchData[ _period ](
                        _name,
                        function(response) {
                            if  (response) {
                                _data[ _period ] = response;
                            }

                            if (done && typeof done === "function") {
                                done();
                            }
                        }.bind(this)
                    );
            }
        },

        render : function render() {
            if ( !_data[ _period ] ) {
                return;
            }

            _config.series = [{
                name: _name,
                data: _data[ _period ]
            }];

            _block.parentNode.querySelector(".btn-group").style.display = "block";
            new Highcharts.stockChart( _block, _config );

            return this;
        }

    };

    //------------------------------//

    function Initialize(params) {
        return new StockChart(params);
    }

    global.$SCh = global.stockChart = Initialize;

}(window));