using System;

namespace QueueSimulator
{
    /// <summary>
    /// Approximates a Poisson distribution.
    /// </summary>
    public static class PoissonDistribution
    {
        private static Random _randObj = new Random();

        /// <summary>
        /// Gets the next value in the distribution.
        /// </summary>
        public static double Next(double lambda)
        {
            // Using algorithm proposed by Knuth
            // see http://en.wikipedia.org/wiki/Poisson_distribution
            int k = 0;
            double p = 1.0;
            double L = Math.Exp(-lambda);
            do
            {
                k++;
                p *= _randObj.NextDouble();
            } while (p >= L);
            return k - 1;
        }
    }
}
