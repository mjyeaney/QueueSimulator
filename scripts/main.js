//
// Main controller module for Qsim.
//

$(function(){
    // Initialize queue lib (??)
    var hTimer = null;
    
    // Draw basic charts (initial)
    var e1 = $('#arrivalsGraph'),
        c1 = _createGraph(e1, 'line', 'Arrivals', []);
    
    var e2 = $('#arrivalsHistogram'),
        c2 = _createGraph(e2, 'column', 'Arrival Histogram', []);

    var e3 = $('#queueLengthGraph'),
        c3 = _createGraph(e3, 'line', 'Queue Length', []);
    
    var e4 = $('#queueLengthHistogram'),
        c4 = _createGraph(e4, 'column', 'Queue Length - Histogram', []);

    var e5 = $('#waitTimesGraph'),
        c5 = _createGraph(e5, 'line', 'Wait Times', []);

    var e6 = $('#waitTimesHistogram'),
        c6 = _createGraph(e6, 'column', 'Wait Times - Histogram', []);
    
    var e7 = $('#utilizationGraph'),
        c7 = _createGraph(e7, 'line', 'Utilization', []);

    var e8 = $('#utilizationHistogram'),
        c8 = _createGraph(e8, 'column', 'Utilization - Histogram', []);

    // Start run when user clicks 'run' button
    $('#btnRun').click(function(){
        if (hTimer == null){
            _bindFormToModel();
            $('#results').removeClass('inactive').addClass('active');
            $(this).text('Stop');
            hTimer = window.setInterval(function(){
                if (Queueing.GetTicks() <= Queueing.Options.simulationTime){
                    // Advance world time/state
                    Queueing.OnTick();

                    // update graphs
                    _updateGraphData();
                } else {
                    Queueing.Drain();
                    _updateGraphData();
                    _updateSummaryStats();
                    if (Queueing.GetWorkItemCount() === 0){
                        $('#btnRun').text('Run Model');
                        window.clearInterval(hTimer);
                    }
                }
            }, 50);
        } else {
            $(this).text('Run Model');
            window.clearInterval(hTimer);
            hTimer = null;
        }
    });

    // Stop run when user clicks 'reset'
    $('#btnReset').click(function(){
        $('#results').removeClass('active').addClass('inactive');
        $('#btnRun').text('Run Model');
        window.clearInterval(hTimer);
        hTimer = null;
        Queueing.Reset();
        _updateGraphData();
        _clearSummaryStats();
    });

    // Now that the graphs have had a chance to measure, 
    // hide them and setup the initial document mode.
    $('#results').addClass('inactive');

    // Some more functional array extensions
    Array.prototype.Avg = function(){
        var sum = 0.0;
        for (var i = 0; i < this.length; i++){
            sum += this[i];
        }
        return sum / this.length;
    };

    // Binds parameter input form to model
    function _bindFormToModel(){
        var params = {};
        params.simulationTime = parseInt($('#txtSimulationTime').val());
        params.arrivalRate = parseFloat($('#txtArrivalRate').val());
        params.serverCount = parseInt($('#txtServerCount').val());
        params.processingRate = parseFloat($('#txtProcessingRate').val());
        params.enableDrainOff = true;
        Queueing.Initialize(params);
    };

    // Helper to rebind charts to new data sources
    function _updateGraphData(){
        // update chart data display
        c1.highcharts().series[0].setData(Queueing.Arrivals);
        var arrivalHist = Distributions.Histogram(Queueing.Arrivals);
        c2.highcharts().series[0].setData(arrivalHist);
        //c2.highcharts().series[1].setData(arrivalHist);

        c3.highcharts().series[0].setData(Queueing.QueueLengths);
        var queueLengthHist = Distributions.Histogram(Queueing.QueueLengths);
        c4.highcharts().series[0].setData(queueLengthHist);
        //c4.highcharts().series[1].setData(queueLengthHist);

        c5.highcharts().series[0].setData(Queueing.WaitTimes);
        var waitTimeHist = Distributions.Histogram(Queueing.WaitTimes);
        c6.highcharts().series[0].setData(waitTimeHist);
        //c6.highcharts().series[1].setData(waitTimeHist);

        c7.highcharts().series[0].setData(Queueing.Utilization);
        var utilizationHist = Distributions.Histogram(Queueing.Utilization);
        c8.highcharts().series[0].setData(utilizationHist);
        //c8.highcharts().series[1].setData(utilizationHist);
    };

    // Updates the summary statistics 
    function _updateSummaryStats(){
        $('#txtTasksCompleted').text(Queueing.Arrivals.length);
        $('#txtAvgQueueLength').text(Queueing.QueueLengths.Avg().toFixed(2));
        $('#txtAvgWaitTime').text(Queueing.WaitTimes.Avg().toFixed(2));
        $('#txtAvgUtilization').text(Queueing.Utilization.Avg().toFixed(2));
    };

    // Clears summary stats
    function _clearSummaryStats(){
        $('#txtTasksCompleted').text('');
        $('#txtAvgQueueLength').text('');
        $('#txtAvgWaitTime').text('');
        $('#txtAvgUtilization').text('');
    };

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
            options.series[0].color = 'rgba(96, 128, 164, 1.0)';
        }
        if (type === 'column'){
            options.xAxis.type = 'category';
            options.series[0].color = 'rgba(96, 128, 164, 1.0)';
            /*
            options.series.push({
                type: 'spline',
                animation: false,
                name: 'Curve Fit',
                data: initData,
                //visible: false,
                color: 'rgba(128, 32, 32, .85)'
            });
            */
        }
        return elm.highcharts(options);
    };
});
