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
        utilizationHistory = [];

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

    };

    //
    // Advances the system logical clock by one event-tick, updating
    // all internal state to reflect this new tick.
    //
    var onTick = function(){
        // Advance logical time counter
        tickCount++;

        // Sample from arrival source
        var arrivals = Distributions.Poisson(6.4);

        // Add to queue
        for (var a = 0; a <= arrivals; a++){
            queue.push({Created: tickCount, Processed: 0});
        }

        // Sample from processing distribution
        var processed = Distributions.Poisson(6.5);

        // Remove processed items
        for (var p = 0; p <= processed; p++){
            var item = queue.shift();
            if (item){
                waitTimeHistory.push(tickCount - item.Created);
            }
        }

        // Compute system utilization
        var utilization = 0.0; 
        utilization = Math.min(100.0, 100.0 * (arrivals / processed)); 

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
        for (var p = 0; p <= processed; p++){
            var item = queue.shift();
            if (item){
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
    };

    // Export methods
    scope.Queueing.GetTicks = getTicks;
    scope.Queueing.OnTick = onTick;
    scope.Queueing.Drain = drain;
    scope.Queueing.GetWorkItemCount = getWorkItemCount;
    scope.Queueing.Arrivals = arrivalHistory;
    scope.Queueing.QueueLengths = queueHistory;
    scope.Queueing.WaitTimes = waitTimeHistory;
    scope.Queueing.Utilization = utilizationHistory;
    scope.Queueing.Reset = reset;
})(this);
