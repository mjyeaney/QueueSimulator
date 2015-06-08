//
// This module implements the basic queued system definition.
// This is the core system we will monitor externally, and use to
// drive our visualization dashboard.
//

(function(scope){
    // make sure namespace exsists
    if (!scope.Queueing){
        scope.Queueing = {};
    }

    // Primary system data collections
    var queue = [],
        tickCount = 0;

    // Tracking collections
    var arrivalHistory = [],
        queueHistory = [],
        waitTimeHistory = [],
        processingTimes = [],
        utilizationHistory = [];

    // System behavior params
    var options = {};

    // 
    // Returns the internal world-event tick counter.
    //
    var getTicks = function(){
        return tickCount;
    };

    //
    // Returns the current work items currently enqueued.
    //
    var getWorkItemCount = function(){
        return queue.length;
    };

    //
    // Initializes the queueing model using the specified 
    // parameters.
    //
    var initialize = function(params){
        // arrival rate
        options.arrivalRate = params.arrivalRate;
        options.simulationTime = params.simulationTime;

        // processing rate
        options.processingRate = params.processingRate;
        options.serverCount = params.serverCount;

        // enable drain off
        options.enableDrainOff = params.enableDrainOff;
        
        // TODO: timeout?
        // TODO: number of servers?
        
        // Expose these options externally
        scope.Queueing.Options = options;
    };

    //
    // Advances the system logical clock by one event-tick, updating
    // all internal state to reflect this new tick.
    //
    var onTick = function(){
        // Advance logical time counter
        tickCount++;

        // Sample from arrival source
        var arrivals = Distributions.Poisson(options.arrivalRate);

        // Add to queue
        for (var a = 0; a < arrivals; a++){
            queue.push({Created: tickCount, Processed: 0});
        }

        // Sample from processing distribution
        var finalRate = options.processingRate * options.serverCount;
        var processed = Distributions.Poisson(finalRate);

        // Remove processed items
        for (var p = 0; p < processed; p++){
            var item = queue.shift();
            if (item){
                processingTimes.push(processed / options.serverCount);
                waitTimeHistory.push(tickCount - item.Created);
            }
        }

        // Compute system utilization
        // (While utilization can never be > 100%,
        // it can be useful to see exactly *how* overscheduled a specific 
        // server(s) is/are.
        var utilization = 0.0; 
        utilization = 100.0 * (arrivals / processed);

        // Special cases for utilization
        if ((processed === 0) && (arrivals === 0)) {
            utilization = 0.0;
        } else if (processed === 0) {
            utilization = 100.0;
        }

        // Record history metrics
        utilizationHistory.push(utilization);
        queueHistory.push(queue.length);
        arrivalHistory.push(arrivals);
    };

    //
    // Drains off any remaining work; that is, continues processing 
    // without any new arrivals into the system.
    //
    var drain = function(){
        // Advance logical time counter
        tickCount++;

        // Sample from processing distribution
        var processed = Distributions.Poisson(4.1);

        // Remove processed items
        for (var p = 0; p < processed; p++){
            var item = queue.shift();
            if (item){
                processingTimes.push(processed / options.serverCount);
                waitTimeHistory.push(tickCount - item.Created);
            }
        }

        // Record history metrics
        queueHistory.push(queue.length);
        arrivalHistory.push(0);
        utilizationHistory.push(0);
    };

    //
    // Resets and clears all internal system state.
    //
    var reset = function(){
        tickCount = 0;
        queue.length = 0;
        arrivalHistory.length = 0;
        queueHistory.length = 0;
        waitTimeHistory.length = 0;
        utilizationHistory.length = 0;
        processingTimes.length = 0;
    };

    // Export methods
    scope.Queueing.Options = {};
    scope.Queueing.Initialize = initialize;
    scope.Queueing.GetTicks = getTicks;
    scope.Queueing.OnTick = onTick;
    scope.Queueing.Drain = drain;
    scope.Queueing.GetWorkItemCount = getWorkItemCount;
    scope.Queueing.Arrivals = arrivalHistory;
    scope.Queueing.QueueLengths = queueHistory;
    scope.Queueing.WaitTimes = waitTimeHistory;
    scope.Queueing.Utilization = utilizationHistory;
    scope.Queueing.ProcessingTimes = processingTimes;
    scope.Queueing.Reset = reset;
})(this);
