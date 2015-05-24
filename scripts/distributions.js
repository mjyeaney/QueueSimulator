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
        var x = 2.0 * Math.random() - 1.0;
        var y = 2.0 * Math.random() - 1.0;
        var s = x * x + y * y;

        while (s > 1.0)
        {
            x = 2.0 * Math.random() - 1.0;
            y = 2.0 * Math.random() - 1.0;
            s = x * x + y * y;
        }

        var xGaussian = Math.sqrt(-2.0 * _log10(s) / 2) * x * sigma + mu;
        return xGaussian;
    };

    Array.prototype.Min = function(){
        var min = Number.MAX_VALUE;
        for (var j=0; j < this.length; j++){
            if (this[j] < min) min = this[j];
        }
        return min;
    };

    Array.prototype.Max = function(){
        var max = Number.MIN_VALUE;
        for (var j=0; j < this.length; j++){
            if (this[j] > max) max = this[j];
        }
        return max;
    };

    //
    // Creates a set of bins representing histrogram profile
    //
    var createHistogramBins = function(nBins, data){
        var min = data.Min();
        var max = data.Max();
        var width = Math.ceil((max - min) / nBins);
        var bins = [];

        console.log('Min: ' + min);
        console.log('Max: ' + max);
        console.log('Width: ' + width);

        for (var i = 0; i < nBins; i++)
        {
            var nCounts = 0;
            var lowerEdge = min + i * width;
            var upperEdge = min + (i + 1) * width;

            console.log('Lower edge: ' + lowerEdge);
            console.log('Upper edge: ' + upperEdge);

            for (var j = 0; j < data.length; j++)
            {
                if (data[j] >= lowerEdge && data[j] < upperEdge)
                {
                    nCounts++;
                }
            }

            bins.push(nCounts);
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
