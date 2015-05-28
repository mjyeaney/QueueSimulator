//
// Main controller module for Qsim.
//

$(function(){
    // Initialize queue lib (??)
    var initData = [],
        binData = [],
        hTimer = null;
    
    // Draw basic charts (initial)
    var e1 = $('#arrivalsGraph'),
        c1 = _createGraph(e1, 'line', 'Arrivals', initData);
    
    var e2 = $('#arrivalsHistogram'),
        c2 = _createGraph(e2, 'column', 'Arrival Histogram', binData);

    var e3 = $('#queueLengthGraph'),
        c3 = _createGraph(e3, 'line', 'Queue Length', initData);
    
    var e4 = $('#queueLengthHistogram'),
        c4 = _createGraph(e4, 'column', 'Queue Length - Histogram', binData);

    var e5 = $('#waitTimesGraph'),
        c5 = _createGraph(e5, 'line', 'Wait Times', initData);

    var e6 = $('#waitTimesHistogram'),
        c6 = _createGraph(e6, 'column', 'Wait Times - Histogram', binData);
    
    var e7 = $('#utilizationGraph'),
        c7 = _createGraph(e7, 'line', 'Utilization', initData);

    var e8 = $('#utilizationHistogram'),
        c8 = _createGraph(e8, 'column', 'Utilization - Histogram', binData);

    // Start run when user clicks 'run' button
    $('#btnRun').click(function(){
        if (hTimer == null){
            hTimer = window.setInterval(function(){
                //initData.push(Distributions.Poisson(2.5));
                //initData.push(Distributions.LogNormal(1, 1.25));
                //initData.push(Distributions.Exponential(2.5));
                initData.push(Distributions.Gaussian(0, 1));

                // Compute new histogram/frequency data
                binData = Distributions.Histogram(initData);

                // update chart data display
                c1.highcharts().series[0].setData(initData);
                c2.highcharts().series[0].setData(binData);
                c2.highcharts().series[1].setData(binData);
                c3.highcharts().series[0].setData(initData);
                c4.highcharts().series[0].setData(binData);
                c4.highcharts().series[1].setData(binData);
                c5.highcharts().series[0].setData(initData);
                c6.highcharts().series[0].setData(binData);
                c6.highcharts().series[1].setData(binData);
                c7.highcharts().series[0].setData(initData);
                c8.highcharts().series[0].setData(binData);
                c8.highcharts().series[1].setData(binData);

                // Stop after 'n' points
                if (initData.length > 500){
                    window.clearInterval(hTimer);
                }
            }, 50);
        }
    });

    // Stop run when user clicks 'reset'
    $('#btnReset').click(function(){
        window.clearInterval(hTimer);
        hTimer = null;
        initData = [];
        binData = [];
    });

    // Helper method to setup chart display
    function _createGraph(elm, type, titleText, initData){
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
                type: 'linear'
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
        if (type === 'line'){
            options.series[0].color = 'rgba(64, 64, 64, .85)';
        }
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
