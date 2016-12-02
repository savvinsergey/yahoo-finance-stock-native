document.addEventListener('DOMContentLoaded', function() {

    window.app = (function(){

        "use strict";

        return {
            stocks : {
                stockCharts: [],
                addChart: function addChart() {
                    var stockChart,
                        symbol = document.querySelector("[name='stock-symbol']").value,
                        addStockButton = document.querySelector(".add-stock");

                    stockChart = $SCh({
                        container : '.charts-container',
                        symbol    : symbol
                    });

                    this.stockCharts.push(stockChart);

                    addStockButton.innerText = "Loading...........";
                    stockChart.getData(false,function(){
                        stockChart.render();
                        addStockButton.innerText = "Add stock chart";
                    });
                }
            }
        }

    }());

});
