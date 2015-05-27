//
// Main controller module for Qsim.
//

$(function(){
    // Initialize queue lib (??)
    var initData = _getRandomData(1000);
    var bins = Distributions.Histogram(initData);
    
    // TODO: Setup basic parameter UI and callbacks

    // Draw basic charts (initial)
    var c1 = $('#arrivalsGraph');
    _setupChartDisplay(c1, 'line', 'Arrivals', initData);
    
    var c2 = $('#arrivalsHistogram');
    _setupChartDisplay(c2, 'column', 'Arrival Histogram', bins);

    var c3 = $('#queueLengthGraph');
    _setupChartDisplay(c3, 'line', 'Queue Length', initData);
    
    var c4 = $('#queueLengthHistogram');
    _setupChartDisplay(c4, 'column', 'Queue Length - Histogram', bins);

    var c5 = $('#waitTimesGraph');
    _setupChartDisplay(c5, 'line', 'Wait Times', initData);

    var c6 = $('#waitTimesHistogram');
    _setupChartDisplay(c6, 'column', 'Wait Times - Histogram', bins);
    
    var c7 = $('#utilizationGraph');
    _setupChartDisplay(c7, 'line', 'Utilization', initData);

    var c8 = $('#utilizationHistogram');
    _setupChartDisplay(c8, 'column', 'Utilization - Histogram', bins);

    // TODO: Setup chart refresh on update callbacks
    
    // Generate some random sample data
    function _getRandomData(size){
        var data = [];
        for (var j = 0; j < size; j++){
            //data.push(Distributions.Poisson(2.5));
            //data.push(Distributions.Gaussian(0, 1));
            data.push(Distributions.LogNormal(1, .75));
        }
        return data;
    };

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
                }
            },
            xAxis: {
                gridLineWidth: 1,
                type: 'linear',
                endOnTick: true,
                tickmarkPlacement: 'on'
            },
            yAxis: {
                title: {
                    text: '' 
                },
                endOnTick: true
            },
            legend: {
                enabled: true
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
                visible: false,
                color: 'rgba(128, 32, 32, .85)'
            });
        }
        return elm.highcharts(options);
    };
});
