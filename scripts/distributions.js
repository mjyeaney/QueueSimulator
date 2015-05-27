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
        return jStat.poisson.sample(lambda);
    };

    //
    // Creates a Gaussian-distributed random varialbe
    //
    var gaussian = function(mu, sigma){
        return jStat.normal.sample(mu, sigma);
    };

    //
    // Creates a set of bins representing histrogram profile
    //
    var createHistogramBins = function(data){
        // Initial sort to order data
        var nBins = Math.min(25, Math.ceil(Math.sqrt(data.length)));
        var localData = data.slice(0);

        // Sort the data
        localData.sort(function(x, y){
            if (x > y) return 1;
            else if (x < y) return -1; 
            else return 0;
        });

        var min = localData[0];
        var max = localData[localData.length - 1];
        var width = (max - min) / nBins;
        var bins = [];

        console.log('Min: ' + min);
        console.log('Max: ' + max);
        console.log('Bins: ' + nBins);
        console.log('Bin width: ' + width);

        for (var j = 0; j < localData.length; j++){
            var datum = localData[j];

            for (var i = 0; i < nBins; i++){
                var lowerEdge = min + (i * width);
                var upperEdge = lowerEdge + width;

                if (!bins[i]){
                    bins[i] = ['', 0];
                    //bins[i][0] = (lowerEdge + (width / 2.0)).toFixed(2);
                    bins[i][0] = lowerEdge;
                }

                if (datum >= lowerEdge && datum < upperEdge){
                    bins[i][1]++;
                    break;
                }
            }
        }
        
        console.log(bins);
        return bins;
    };

    // Export methods
    scope.Distributions.Uniform = uniform;
    scope.Distributions.Poisson = poisson;
    scope.Distributions.Gaussian = gaussian;
    scope.Distributions.Histogram = createHistogramBins;
})(this);
