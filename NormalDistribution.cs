using System;

namespace QueueSimulator
{
    /// <summary>
    /// Approximates a normal distribution.
    /// </summary>
    public static class NormalDistribution
    {
        private static Random _rng = new Random();

        /// <summary>
        /// Gets the next value in the distribution.
        /// </summary>
        public static double Next(double mu, double sigma)
        {
            double x = 2.0 * _rng.NextDouble() - 1.0;
            double y = 2.0 * _rng.NextDouble() - 1.0;
            double s = x * x + y * y;

            while (s > 1.0)
            {
                x = 2.0 * _rng.NextDouble() - 1.0;
                y = 2.0 * _rng.NextDouble() - 1.0;
                s = x * x + y * y;
            }

            double xGaussian = Math.Sqrt(-2.0 * Math.Log(s) / 2) * x * sigma + mu;
            //double yGaussian = Math.Sqrt(-2.0 * Math.Log(s) / 2) * y * sigma + mu;

            return xGaussian;
        }
    }
}
