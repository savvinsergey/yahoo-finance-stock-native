(function(global){

    "use strict";

    /*-------- private ---------*/

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
        buttons.forEach(function(button){
            button.onclick = _switchPeriod.bind(this,arguments[0]);
            button.style.color = (button.dataset.period === this.period ? "#ddd" : null);
        }.bind(this));

        parentEl.appendChild(targetEl);

        return targetChart;
    }

    function _switchPeriod(el){
        var buttons = el.parentNode.querySelectorAll('button');
        buttons.forEach(function(button){
            button.style.color = (button.dataset.period === el.dataset.period ? "#ddd" : null);
        });

        this.period = el.dataset.period;

        _getData.call(this,function(){
            this.render();
        }.bind(this));
    }

    function _getData(cb){
        if (!!this.data[this.period]) {
            cb();
        } else {
            global.lib.api.stocks.fetchData[this.period](
                this.name,
                function(response){
                    if (response) {
                        this.data[this.period] = response;
                    }
                    cb();
                }.bind(this)
            );
        }
    }

    /*-------- public ---------*/

    function StockChart(container,params,cb){
        this.chart = null;
        this.block = null;

        this.data = {};
        this.name = params.symbol.toLowerCase();
        this.period = params.period;

        this.config = {

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
                text: this.name.toUpperCase() + " Stocks"
            },

            rangeSelector: {
                enabled: false
            },

            series: []
        };

        _getData.call(this,function(){
            this.render(container,cb);
        }.bind(this));
    }

    StockChart.prototype = {

        render : function(container,cb){

            if (!this.data[this.period]) {
                return;
            }

            if (container) {
                this.block = _prepareElement.call(this,container);
            }

            this.config.series = [{
                name: this.name,
                data: this.data[this.period],
                tooltip: {
                    valueDecimals: 2
                }
            }];

            this.chart = new Highcharts.stockChart(this.block,this.config);

            if (cb) {
                cb();
            }

            return this;
        }
    };

    var Initialize = function(container,params,cb){
        return new StockChart(container,params,cb);
    };

    global.$SCh = global.stockChart = Initialize;

}(window));