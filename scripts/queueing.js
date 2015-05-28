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
        waitTimeHistory = [];

    var getTicks = function(){
        return tickCount;
    };

    var onTick = function(){
        // Advance logical time counter
        tickCount++;

        // Sample from arrival source
        var arrivals = Distributions.Poisson(4.0);

        // Add to queue
        for (var a = 0; a <= arrivals; a++){
            queue.push({Created: tickCount, Processed: 0});
        }

        // Sample from processing distribution
        var processed = Distributions.Poisson(4.1);

        // Remove processed items
        for (var p = 0; p <= processed; p++){
            var item = queue.shift();
            waitTimeHistory.push(tickCount - item.Created);
        }

        // Record history metrics
        queueHistory.push(queue.length);
        arrivalHistory.push(arrivals);
    };

    var reset = function(){
        tickCount = 0;
        queue.length = 0;
        arrivalHistory.length = 0;
        queueHistory.length = 0;
        waitTimeHistory.length = 0;
    };

    // Export methods
    scope.Queueing.GetTicks = getTicks;
    scope.Queueing.OnTick = onTick;
    scope.Queueing.Arrivals = arrivalHistory;
    scope.Queueing.QueueLengths = queueHistory;
    scope.Queueing.WaitTimes = waitTimeHistory;
    scope.Queueing.Reset = reset;
})(this);
