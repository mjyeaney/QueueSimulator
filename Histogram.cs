using System;
using System.Linq;

namespace QueueSimulator
{
    public class Histogram
    {
        public static double[] Create(double[] data, int nBins)
        {
            double min = data.Min();
            double max = data.Max();
            double width = Math.Ceiling((max - min) / nBins);
            double[] histogram = new double[nBins];

            for (var i = 0; i < nBins; i++)
            {
                var nCounts = 0;
                for (var j = 0; j < data.Length; j++)
                {
                    if ((data[j] >= min + i * width) && (data[j] < min + (i + 1) * width))
                    {
                        nCounts++;
                    }
                }
                histogram[i] = nCounts;
            }
            return histogram;
        }
    }
}
