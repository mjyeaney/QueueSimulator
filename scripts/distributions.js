//
// This modules contains various distribution methods
// for use by queue simulation routines.
//

(function(scope){
    // Define namespace
    if (!scope.Distributions){
        scope.Distributions = {};
    }

    var _log10 = function(n){
        return Math.log(n) / Math.LN10;
    };

    //
    // Creates a uniformly-distributed random variable
    //
    var uniform = function(){
        return Math.random();
    };

    //
    // Creates a Poisson-distributed random variable.
    //
    var poisson = function(lambda){
        // Using algorithm proposed by Knuth
        // see http://en.wikipedia.org/wiki/Poisson_distribution
        var k = 0;
        var p = 1.0;
        var L = Math.exp(-lambda);
        do
        {
            k++;
            p *= Math.random();
        } while (p >= L);
        return k - 1;
    };

    //
    // Creates a Gaussian-distributed random varialbe
    //
    var gaussian = function(mu, sigma){
        // Using a rough-implementation of the Box-Muller method
        // http://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
        var u = Math.random();
        var v = Math.random();

        z1 = Math.sqrt(-2 * Math.log(u)) * Math.sin(2 * Math.PI * v);
        z2 = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);

        x1 = (mu + z1) * sigma;
        x2 = (mu + z2) * sigma;

        return x2;
    };

    //
    // Creates a set of bins representing histrogram profile
    //
    var createHistogramBins = function(data){
        // Initial sort to order data
        var nBins = Math.ceil(Math.sqrt(data.length));
        var localData = data.slice(0);
        localData.sort();
        
        var min = localData[0];
        var max = localData[localData.length - 1];
        var width = Math.ceil((max - min) / nBins);
        var bins = [];

        for (var j = 0; j < localData.length; j++){
            var datum = localData[j];

            for (var i = 0; i < nBins; i++){
                var lowerEdge = min + i * width;
                var upperEdge = min + (i + 1) * width;

                if (datum >= lowerEdge && datum < upperEdge){
                    if (!bins[i]){
                        bins[i] = 0;
                    }
                    bins[i]++;
                }
            }
        }
        
        return bins;
    };

    // Export methods
    scope.Distributions.Uniform = uniform;
    scope.Distributions.Poisson = poisson;
    scope.Distributions.Gaussian = gaussian;
    scope.Distributions.Histogram = createHistogramBins;
})(this);
