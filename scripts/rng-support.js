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
    _w1.postMessage({action: 'INIT', data: 'arrivals'});
    
    var _w2 = new Worker('/scripts/rng-worker.js');
    _w2.postMessage({action: 'INIT', data: 'processing'});

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
    // Creates a uniformly-distributed random variable
    //
    var uniform = function(callback){
        _w1.postMessage({
            action: 'GENERATE_UNIFORM_POOL', 
            data: {
                poolSize: 200
            }
        });
    };

    //
    // Creates a Poisson-distributed random variable.
    //
    var poisson = function(lambda){
        return jStat.poisson.sample(lambda);
    };

    //
    // Creates a Gaussian-distributed random varialbe
    //
    var gaussian = function(mu, sigma){
        return jStat.normal.sample(mu, sigma);
    };

    //
    // Creates a log-normal distributed random variable
    //
    var logNormal = function(mu, sigma){
        return jStat.lognormal.sample(mu, sigma);
    };

    //
    // Creates an exponential random variable
    //
    var exponential = function(lambda){
        return jStat.exponential.sample(lambda);
    };

    //
    // Export table
    //
    scope.RngSupport.Initialize = init;
    scope.RngSupport.Uniform = uniform;
    scope.RngSupport.Poisson = poisson;
    scope.RngSupport.Gaussian = gaussian;
    scope.RngSupport.LogNormal = logNormal;
    scope.RngSupport.Exponential = exponential;
})(this);
