using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Windows.Forms.DataVisualization.Charting;

namespace QueueSimulator
{
    class Program
    {
        class Customer
        {
            public int EntryTime { get; set; }
        }

        static void Main(string[] args)
        {
            List<double> arrivalRates = new List<double>();
            List<double> waitTimes = new List<double>();
            List<double> queueLengths = new List<double>();
            List<double> utilization = new List<double>();

            bool allowArrivals = true;
            Queue<Customer> queue = new Queue<Customer>();
            int totalCustomers = 0;
            int baseDuration = 2 * 60 * 60; // hrs * minutes/hr * seconds/min 
            int durationInSecs = baseDuration;
            double arrivalRate = 7.95;
            double serviceRate = 8.0;

            // main simulation loop
            // runs for duration; OR until queue is empty.
            for (var j = 0; j < durationInSecs; j++)
            {
                // Sample an arrival rate
                var currentArrivalRate = (int)Math.Round(PoissonDistribution.Next(arrivalRate));
                var currentServiceRate = (int)serviceRate;

                // Obey cool-down periods
                if (!allowArrivals)
                {
                    currentArrivalRate = 0;
                }

                // Queue arrivals
                for (var z = 0; z < currentArrivalRate; z++)
                {
                    var customer = new Customer();
                    var localTime = j;
                    customer.EntryTime = localTime;
                    queue.Enqueue(customer);
                    totalCustomers++;
                }
                
                // Service arrivals
                for (var m = 0; m < currentServiceRate; m++)
                {
                    if (queue.Count == 0)
                    {
                        break;
                    }
                    var customer = queue.Dequeue();
                    waitTimes.Add(j - customer.EntryTime);
                }

                // record metrics
                arrivalRates.Add(currentArrivalRate);
                queueLengths.Add(queue.Count);

                // compute utilizaton
                var u = (double)currentArrivalRate / (double)currentServiceRate;
                utilization.Add(u * 100.0);

                // if the queue is not empty, and we're done, 
                // extend the run to allow the system to drain load
                if ((j == (durationInSecs - 1)) && (queue.Count > 0))
                {
                    durationInSecs += 60;
                    allowArrivals = false;
                }
            }

            // generate report
            var meanQueueLength = queueLengths.Average();
            var meanWaitTime = waitTimes.Average();
            var meanUtilization = utilization.Average();
            var templateText = File.ReadAllText("report.html");
            templateText = templateText.Replace("{{SIMULATION_TIME}}", baseDuration.ToString());
            templateText = templateText.Replace("{{TOTAL_DURATION}}", durationInSecs.ToString());
            templateText = templateText.Replace("{{RECOVERY_DURATION}}", (durationInSecs - baseDuration).ToString());
            templateText = templateText.Replace("{{ARRIVAL_RATE}}", arrivalRate.ToString());
            templateText = templateText.Replace("{{SERVICE_RATE}}", serviceRate.ToString());
            templateText = templateText.Replace("{{TOTAL_CUSTOMERS}}", totalCustomers.ToString());
            templateText = templateText.Replace("{{MEAN_QUEUE_LENGTH}}", meanQueueLength.ToString());
            templateText = templateText.Replace("{{MEAN_WAIT_TIME}}", meanWaitTime.ToString());
            templateText = templateText.Replace("{{MEAN_UTILIZATION}}", meanUtilization.ToString());
            File.WriteAllText("report.html", templateText, Encoding.UTF8);

            // generate plots
            createPlot(waitTimes, false, 0.0, "Wait Times", "waitTimes.png");
            createPlot(arrivalRates, true, serviceRate, "Arrival Rate", "arrivalRate.png");
            createPlot(queueLengths, false, 0.0, "Queue Length", "queueLength.png");
            createPlot(utilization, true, 100.0, "Utilization", "utilization.png");

            // generate histograms
            createHistogram(waitTimes, "Wait Time - Histogram", "waitTimesHist.png");
            createHistogram(arrivalRates, "Arrival Rate - Histogram", "arrivalRateHist.png");
            createHistogram(queueLengths, "Queue Length - Histogram", "queueLengthHist.png");            
            createHistogram(utilization, "Utilization - Histogram", "utilizationHist.png");
        }

        private static void createHistogram(List<double> data, string title, string imageName)
        {
            var binCount = 30;
            var histData = Histogram.Create(data.ToArray(), binCount);

            Chart c1 = new Chart();
            var s1 = new Series(title);
            s1.YValueType = ChartValueType.Double;
            s1.ChartType = SeriesChartType.Column;
            s1.Points.DataBindXY(histData.XValues.ToArray(), histData.YValues.ToArray());

            var chartArea1 = new ChartArea();
            chartArea1.AxisX.MajorGrid.LineColor = Color.LightGray;
            chartArea1.AxisY.MajorGrid.LineColor = Color.LightGray;
            chartArea1.AxisX.LabelStyle.Font = new Font("Consolas", 8);
            chartArea1.AxisY.LabelStyle.Font = new Font("Consolas", 8);

            c1.Size = new Size(400, 300);
            c1.Titles.Add(title);
            c1.ChartAreas.Add(chartArea1);
            c1.Series.Add(s1);
            c1.Invalidate();
            c1.SaveImage(imageName, ChartImageFormat.Png);
        }

        private static void createPlot(List<double> data, bool hasUpperLimit, double upperLimit, string title, string imageName)
        {
            Chart c = new Chart();
            var s = new Series(title);
            s.YValueType = ChartValueType.Double;
            s.ChartType = SeriesChartType.FastLine;
            s.Points.DataBindY(data);

            var s2 = (Series)null;
            if (hasUpperLimit)
            {
                s2 = new Series("Upper Limit");
                s2.YValueType = ChartValueType.UInt32;
                s2.ChartType = SeriesChartType.FastLine;
                s2.Color = Color.Red;
                s2.Points.DataBindY(Enumerable.Repeat(upperLimit, data.Count).ToList());
            }

            var a = new ChartArea();
            a.AxisX.MajorGrid.LineColor = Color.LightGray;
            a.AxisY.MajorGrid.LineColor = Color.LightGray;
            a.AxisX.LabelStyle.Font = new Font("Consolas", 8);
            a.AxisY.LabelStyle.Font = new Font("Consolas", 8);

            c.Size = new Size(400, 300);
            c.Titles.Add(title);
            c.ChartAreas.Add(a);
            c.Series.Add(s);
            if (hasUpperLimit) c.Series.Add(s2);
            c.Invalidate();
            c.SaveImage(imageName, ChartImageFormat.Png);
        }
    }
}
