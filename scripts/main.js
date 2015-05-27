//
// Main controller module for Qsim.
//

$(function(){
    // Initialize queue lib (??)
    var initData = [];//_getRandomData(300);
    var bins = [];//Distributions.Histogram(initData);
    
    // Draw basic charts (initial)
    var e1 = $('#arrivalsGraph');
    var c1 = _setupChartDisplay(e1, 'line', 'Arrivals', initData);
    
    var e2 = $('#arrivalsHistogram');
    var c2 = _setupChartDisplay(e2, 'column', 'Arrival Histogram', bins);

    var e3 = $('#queueLengthGraph');
    var c3 = _setupChartDisplay(e3, 'line', 'Queue Length', initData);
    
    var e4 = $('#queueLengthHistogram');
    var c4 = _setupChartDisplay(e4, 'column', 'Queue Length - Histogram', bins);

    var e5 = $('#waitTimesGraph');
    var c5 = _setupChartDisplay(e5, 'line', 'Wait Times', initData);

    var e6 = $('#waitTimesHistogram');
    var c6 = _setupChartDisplay(e6, 'column', 'Wait Times - Histogram', bins);
    
    var e7 = $('#utilizationGraph');
    var c7 = _setupChartDisplay(e7, 'line', 'Utilization', initData);

    var e8 = $('#utilizationHistogram');
    var c8 = _setupChartDisplay(e8, 'column', 'Utilization - Histogram', bins);

    // Setup chart refresh on update callbacks
    var hTimer = window.setInterval(function(){
        //initData.push(Distributions.Poisson(2.5));
        //initData.push(Distributions.LogNormal(1, 0.75));
        initData.push(Distributions.Exponential(2.5));
        //initData.push(Distributions.Gaussian(0, 1));
        bins = Distributions.Histogram(initData);

        // update chart data display
        c1.highcharts().series[0].setData(initData);
        c2.highcharts().series[0].setData(bins);
        c2.highcharts().series[1].setData(bins);
        c3.highcharts().series[0].setData(initData);
        c4.highcharts().series[0].setData(bins);
        c4.highcharts().series[1].setData(bins);
        c5.highcharts().series[0].setData(initData);
        c6.highcharts().series[0].setData(bins);
        c6.highcharts().series[1].setData(bins);
        c7.highcharts().series[0].setData(initData);
        c8.highcharts().series[0].setData(bins);
        c8.highcharts().series[1].setData(bins);

        // Stop after 'n' points
        if (initData.length > 500){
            window.clearInterval(hTimer);
        }
    }, 50);
    
    // Helper method to setup chart display
    function _setupChartDisplay(elm, type, titleText, initData){
        var options = {
            chart: {
                animation: false
            },
            credits: {
                enabled: false
            },
            title: {
                text: titleText,
                align: 'center'
            },
            plotOptions: {
                column: {
                    shadow: false
                },
                spline: {
                    shadow: false,
                    marker: {
                        radius: 1
                    }
                },
                series: {
                    enableMouseTracking: false
                }
            },
            xAxis: {
                gridLineWidth: 1,
                type: 'linear',
                endOnTick: true
            },
            yAxis: {
                title: {
                    text: '' 
                },
                endOnTick: true
            },
            legend: {
                enabled: false 
            },
            series: [{
                type: type,
                animation: false,
                name: titleText,
                pointPadding: 0,
                groupPadding: 0,
                data: initData
            }]
        };
        if (type === 'column'){
            options.xAxis.type = 'category';
            options.series.push({
                type: 'spline',
                animation: false,
                name: 'Curve Fit',
                data: initData,
                //visible: false,
                color: 'rgba(128, 32, 32, .85)'
            });
        }
        return elm.highcharts(options);
    };
});
