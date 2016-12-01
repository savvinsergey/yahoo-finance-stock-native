document.addEventListener('DOMContentLoaded', function() {

    window.app = (function(){

        "use strict";

        return {
            stocks : {
                stockCharts: [],
                addChart: function addChart() {
                    var period = "year",
                        symbol = document.querySelector("[name='stock-symbol']").value,
                        addStockButton = document.querySelector(".add-stock");

                    addStockButton.innerText = "Loading...........";
                    this.stockCharts.push(
                        $SCh('.charts-container',{
                            symbol : symbol,
                            period : period
                        }, function() {
                            addStockButton.innerText = "Add stock chart";
                        })
                    );
                }
            }
        }

    }());

});
