using System;
using System.Collections.Generic;
using System.Linq;

namespace QueueSimulator
{
    public class Histogram
    {
        public class HistogramData
        {
            public HistogramData()
            {
                YValues = new List<double>();
                XValues = new List<string>();
            }
            public List<double> YValues { get; set; }
            public List<string> XValues { get; set; }
        }

        public static HistogramData Create(double[] data, int nBins)
        {
            double min = data.Min();
            double max = data.Max();
            double width = Math.Ceiling((max - min) / nBins);
            HistogramData histogramData = new HistogramData();

            for (var i = 0; i < nBins; i++)
            {
                var nCounts = 0;
                var lowerEdge = min + i * width;
                var upperEdge = min + (i + 1) * width;

                for (var j = 0; j < data.Length; j++)
                {
                    if (data[j] >= lowerEdge && data[j] < upperEdge)
                    {
                        nCounts++;
                    }
                }

                if (nCounts > 0)
                {
                    histogramData.XValues.Add(String.Format("{0}-{1}", lowerEdge, upperEdge));
                    histogramData.YValues.Add(nCounts);
                }
            }
            
            return histogramData;
        }
    }
}
