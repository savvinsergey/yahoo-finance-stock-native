document.addEventListener('DOMContentLoaded', function() {

    window.app = (function(){

        "use strict";

        return {
            stocks : {
                charts: [],
                addChart: function stocksAddChart() {
                    var chart,
                        symbol = document.querySelector("[name='stock-symbol']").value,
                        addStockButton = document.querySelector(".add-stock");

                    chart = $SCh({
                        container : '.charts-container',
                        symbol    : symbol
                    });

                    this.charts.push(stockChart);

                    addStockButton.innerText = "Loading...........";
                    stockChart.getData(false,function(){
                        chart.render();
                        addStockButton.innerText = "Add stock chart";
                    });
                }
            }
        }

    }());

});
