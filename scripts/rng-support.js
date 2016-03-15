//
// This module wraps the Mersenne Twister implementation and provides a 
// way to override the built-in Math.random method with a seeded version
// of an RNG.
//

(function(scope){

    // Make sure pre-req's are available
    if (!MersenneTwister){
        throw 'Unable to locate required object "MersenneTwister"';
    }

    //
    // Create namespace container
    //
    if (!scope.RngSupport){
        scope.RngSupport = {};
    }
    
    //
    // Create and start workers
    //
    var _w1 = new Worker('/scripts/rng-worker.js');
    _w1.postMessage({command:'INIT', param: 'arrival_generator'});
    
    var _w2 = new Worker('/scripts/rng-worker.js');
    _w2.postMessage({command:'INIT', param: 'processing_generator'});

    // Internal RNG member
    var _t = null;
    
    //
    // Creates a new RNG using the provided seed value
    //
    var init = function(seed){
        console.log('Initializing RNG with seed ' + seed);
        _t = new MersenneTwister(seed);
    };

    // 
    // Override the built-in method with a wrapper
    // around the above RNG instance.
    //
    Math.random = function(){ 
        return _t.random();
    };

    //
    // Export table
    //
    scope.RngSupport.Initialize = init;

})(this);
