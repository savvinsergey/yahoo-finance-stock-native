document.addEventListener('DOMContentLoaded', function() {

    window.app = (function(){

        "use strict";

        return {
            stocks : {
                stockCharts: [],
                addChart: function addChart(){
                    var period = "year",
                        symbol = document.querySelector("[name='stock-symbol']").value;


                    document.querySelector(".add-stock").innerText = "Loading...........";
                    this.stockCharts.push(
                        $SCh('.charts-container',{
                            symbol : symbol,
                            period : period
                        }, function(){
                            document.querySelector(".add-stock").innerText = "Add stock chart";
                        })
                    );
                }
            }
        }

    }());

});
