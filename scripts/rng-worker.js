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
    console.log('Before init: scope.name = ' + scope.name);
    scope.name = name;
    console.log('After init: scope.name = ' + scope.name);
};

//
// Dispatch incoming messages
//
onmessage = function(e) {
    console.log('Message received from main script');
    console.log(e);

    switch (e.data.command){
        case 'INIT':
            init(e.data.param);
            break;
    }
    
//   var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
//   console.log('Posting message back to main script');
//   postMessage(workerResult);
};