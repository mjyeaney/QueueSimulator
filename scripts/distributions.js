//
// This modules contains various distribution methods
// for use by queue simulation routines.
//

(function(scope){
    // Define namespace
    if (!scope.Distributions){
        scope.Distributions = {};
    }

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

        // TODO: Need to replace the below call to Math.log with a base-10 log
        var xGaussian = Math.sqrt(-2.0 * Math.log(s) / 2) * x * sigma + mu;
        return xGaussian;
    };

    // Export methods
    scope.Distributions.Uniform = uniform;
    scope.Distributions.Poisson = poisson;
    scope.Distributions.Gaussian = gaussian;
})(this);
