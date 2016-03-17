/* global RngSupport */

//
// This module implements the basic queued system definition.
// This is the core system we will monitor externally, and use to
// drive our visualization dashboard.
//
// Also supported is an option to apply QoS strategies in order to 
// minimize head-of-line blocking effects. This is handled by dynamically
// switching the queue reader strategy from FIFO to LIFO (and back again) 
// if the system has passed a given metric threshold.
//
// Things still on the to-do list: 
// - Much more logging needed...visualize all the things!
// - Add tests.
//

(function(scope){
    // make sure namespace exsists
    if (!scope.Queueing){
        scope.Queueing = {};
    }

    // Make sure pre-req's are available
    if (!scope.RngSupport){
        throw 'Unable to load namespace "RngSupport"';
    }

    // Primary system data collections
    var queue = [],
        tickCount = 0,
        isDraining = false;

    // Tracking collections
    var arrivalHistory = [],
        queueHistory = [],
        waitTimeHistory = [],
        processingTimes = [],
        utilizationHistory = [],
        loadShedHistory = [];

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
        // rng seed value
        RngSupport.Initialize(params.randomSeed);

        // arrival rate
        options.arrivalRate = params.arrivalRate;
        options.arrivalDistribution = params.arrivalDistribution;
        options.simulationTime = params.simulationTime;

        // processing rate
        options.processingRate = params.processingRate;
        options.processingDistribution = params.processingDistribution;
        options.serverCount = params.serverCount;

        // enable drain off
        options.enableDrainOff = params.enableDrainOff;

        // Apply QoS policy
        options.enableQos = params.enableQos;
        options.enableLoadShed = params.enableLoadShed;
        
        // Timeout
        options.taskTimeout = params.taskTimeout;
        
        // Expose these options externally
        scope.Queueing.Options = options;
    };
    
    //
    // Returns a random variable sample value based on 
    // a specified type.
    //
    var sampleDistributionAsync = function(distribution, rate, callback){
        switch (distribution){
            case 'Poisson':
                RngSupport.Poisson(rate, callback);
                break;
            
            case 'Constant':
                callback(rate);
                break;
                
            case 'Gaussian':
                // Note we're discretizing this sequence via midpoint rounding  
                Math.round(RngSupport.Gaussian(rate, 1.0, callback));
                break;
        }
    };

    //
    // Advances the system logical clock by one event-tick, updating
    // all internal state to reflect this new tick.
    //
    var onTick = function(callback){
        // TODO: Move these out to the simulation config
        var qosDepthLimit = 30,
            qosMaxLifetime = 30,
            arrivals = 0,
            finalRate = 0.0,
            processed = 0,
            getWorkItem = null,
            utilization = 0.0,
            shedItems = 0;

        // Advance logical time counter
        tickCount++;

        // Sample from arrival source
        sampleDistributionAsync(options.arrivalDistribution, options.arrivalRate, function(err, arrivals){
            
            // Add whole arrivals to input queue
            for (var a = 0; a < arrivals; a++){
                queue.push({Created: tickCount, Processed: 0});
            }
            
            // Sample from processing distribution, and decide 
            // how many items to process.
            finalRate = options.processingRate * options.serverCount;
            sampleDistributionAsync(options.processingDistribution, finalRate, function(err, processed){

                // Helper to get work item
                getWorkItem = function(){
                    if (options.enableQos){
                        //
                        // NOTE: This can be simulated via linked-list structure, either 
                        // in memory or vai storage structure.
                        //
                        if (queue.length > qosDepthLimit){
                            return queue.pop();
                        } else {
                            return queue.shift();
                        }
                    } else {
                        return queue.shift();
                    }
                };

                // Remove processed items
                for (var p = 0; p < processed; p++){
                    // Get item to work on
                    var item = getWorkItem();

                    // Kill items that are too old
                    if (options.enableLoadShed){
                        shedItems = 0;
                        while (item){
                            var waitTime = tickCount - item.Created;
                            if (waitTime > qosMaxLifetime){
                                shedItems++;
                                item = queue.shift();
                            } else {
                                break;
                            }
                        }
                    }

                    loadShedHistory.push(shedItems);

                    if (item) {
                        waitTimeHistory.push(tickCount - item.Created);
                    }
                }
                
                // Record how many items we processed this time tick
                processingTimes.push(processed / options.serverCount);

                // Compute system utilization
                // (While utilization can never be > 100%,
                // it can be useful to see exactly *how* overscheduled a specific 
                // server(s) is/are.
                utilization = Math.min(100.0, 100.0 * (arrivals / processed));

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
                
                // Invoke continuation
                if (callback) {
                    callback();
                }
            });
        });
    };

    //
    // Resets and clears all internal system state.
    //
    var reset = function(){
        tickCount = 0;
        queue.length = 0;
        isDraining = false;
        arrivalHistory.length = 0;
        queueHistory.length = 0;
        waitTimeHistory.length = 0;
        utilizationHistory.length = 0;
        processingTimes.length = 0;
        loadShedHistory.length = 0;
    };
    
    //
    // Toggle method to enabled drain-off behavior
    //
    var enableDrainOff = function(){
        isDraining = true;  
    };

    // Export methods
    scope.Queueing.Options = {};
    scope.Queueing.Initialize = initialize;
    scope.Queueing.GetTicks = getTicks;
    scope.Queueing.OnTick = onTick;
    scope.Queueing.GetWorkItemCount = getWorkItemCount;
    scope.Queueing.Arrivals = arrivalHistory;
    scope.Queueing.QueueLengths = queueHistory;
    scope.Queueing.WaitTimes = waitTimeHistory;
    scope.Queueing.Utilization = utilizationHistory;
    scope.Queueing.ProcessingTimes = processingTimes;
    scope.Queueing.LoadShedCounts = loadShedHistory;
    scope.Queueing.Reset = reset;
    scope.Queueing.EnableDrainOff = enableDrainOff;
})(this);
