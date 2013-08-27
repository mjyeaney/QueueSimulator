using System;

namespace QueueSimulator
{
    /// <summary>
    /// Approximates a uniform distribution.
    /// </summary>
    public static class UniformDistribution
    {
        private static Random _rng = new Random();

        /// <summary>
        /// Gets the next value in the distribution.
        /// </summary
        public static double Next(double lower, double upper)
        {
            return (lower + ((upper - lower) * _rng.NextDouble()));
        }
    }
}
