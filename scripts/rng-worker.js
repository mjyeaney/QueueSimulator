/*
    Web worker implementation for rng partitioning. We do this since
    our current stat library uses the intrinsic Math.random() function, 
    and we need to isolate side-effects from each variable.
*/

// If needed, pull in scripts/libs
// importScripts(/* Path to script */);

// Capture our current global scope
var scope = this;

//
// Initialize worker
//
var init = function(name){
    scope.name = name;
    
    console.log('Initialized:')
    console.log('scope.name = ' + scope.name);
};

//
// Test method for getting a basic uniform random value
//
var generateUniformPool = function(params){
    var pool = [],
        j = 0;
        
    console.log('Generating uniform pool of size ' + params.poolSize);
    
    for (j = 0; j < params.poolSize; j++){
        pool.push(Math.random());
    }
    
    postMessage(pool);
};

//
// Dispatch incoming messages
//
onmessage = function(e) {
    console.log('Worker message received: ');
    console.log(e);

    var command = e.data;

    switch (command.action){
        case 'INIT':
            init(command.data);
            break;
            
        case 'GENERATE_UNIFORM_POOL':
            generateUniformPool(command.data);
            break;
    }
};