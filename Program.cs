using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
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
            List<int> arrivalRates = new List<int>();
            List<double> waitTimes = new List<double>();
            List<int> queueLengths = new List<int>();
            List<double> utilization = new List<double>();

            bool allowArrivals = true;
            Queue<Customer> queue = new Queue<Customer>();
            int durationInSecs = 2 * 60 * 60; // hrs * minutes/hr * seconds/min ....this is a 2 hour simulation
            int arrivalRate = 4;
            int serviceRate = 5;

            // main simulation loop
            // runs for duration; OR until queue is empty.
            for (var j = 0; j < durationInSecs; j++)
            {
                var currentArrivalRate = arrivalRate;

                if (allowArrivals)
                {
                    // after 5 minutes, spike 1 mintue
                    if (j > 900 && j < 960)
                    {
                        currentArrivalRate = 7;
                    }

                    // after 15 minutes, spike another 1 mintue
                    if (j > 1200 && j < 1260)
                    {
                        currentArrivalRate = 7;
                    }

                    // after 15 minutes, spike another 1 mintue
                    if (j > 2100 && j < 2160)
                    {
                        currentArrivalRate = 7;
                    }
                }
                else
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
                }
                
                // record metrics
                arrivalRates.Add(currentArrivalRate);
                queueLengths.Add(queue.Count);

                // Service arrivals
                for (var m = 0; m < serviceRate; m++)
                {
                    if (queue.Count == 0)
                    {
                        break;
                    }
                    var customer = queue.Dequeue();
                    waitTimes.Add(j - customer.EntryTime);
                }

                // compute utilizaton
                var u = (double)currentArrivalRate / (double)serviceRate;
                utilization.Add(u * 100);

                // if the queue is not empty, and we're done, 
                // extend the run to allow the system to drain load
                if ((j == (durationInSecs - 1)) && (queue.Count > 0))
                {
                    durationInSecs += 60;
                    allowArrivals = false;
                }
            }

            #region Chart / Report Generation

            /////////////////////////////////////////////////////////////
            //
            // Wait time
            //
            Chart c1 = new Chart();
            var s1 = new Series("Wait Time");
            s1.YValueType = ChartValueType.Double;
            s1.ChartType = SeriesChartType.FastLine;
            s1.Points.DataBindY(waitTimes);

            var chartArea1 = new ChartArea();
            chartArea1.AxisX.MajorGrid.LineColor = Color.LightGray;
            chartArea1.AxisY.MajorGrid.LineColor = Color.LightGray;
            chartArea1.AxisX.LabelStyle.Font = new Font("Consolas", 8);
            chartArea1.AxisY.LabelStyle.Font = new Font("Consolas", 8);

            c1.Size = new Size(400, 300);
            c1.Titles.Add("Wait Time");
            c1.ChartAreas.Add(chartArea1);
            c1.Series.Add(s1);
            c1.Invalidate();
            c1.SaveImage("waitTimes.png", ChartImageFormat.Png);

            /////////////////////////////////////////////////////////////
            //
            // Queue length
            //
            Chart c2 = new Chart();
            var s2 = new Series("Queue Length");
            s2.YValueType = ChartValueType.UInt32;
            s2.ChartType = SeriesChartType.FastLine;
            s2.Points.DataBindY(queueLengths);

            var chartArea2 = new ChartArea();
            chartArea2.AxisX.MajorGrid.LineColor = Color.LightGray;
            chartArea2.AxisY.MajorGrid.LineColor = Color.LightGray;
            chartArea2.AxisX.LabelStyle.Font = new Font("Consolas", 8);
            chartArea2.AxisY.LabelStyle.Font = new Font("Consolas", 8);

            c2.Size = new Size(400, 300);
            c2.Titles.Add("Queue Length");
            c2.ChartAreas.Add(chartArea2);
            c2.Series.Add(s2);
            c2.Invalidate();
            c2.SaveImage("queueLength.png", ChartImageFormat.Png);

            /////////////////////////////////////////////////////////////
            //
            // Arrival Rates
            //
            Chart c3 = new Chart();
            var s3 = new Series("Arrival Rate");
            s3.YValueType = ChartValueType.UInt32;
            s3.ChartType = SeriesChartType.FastLine;
            s3.Points.DataBindY(arrivalRates);

            var s5a = new Series("Upper Limit");
            s5a.YValueType = ChartValueType.UInt32;
            s5a.ChartType = SeriesChartType.FastLine;
            s5a.Color = Color.Red;
            s5a.Points.DataBindY(Enumerable.Repeat(serviceRate, utilization.Count).ToList());

            var chartArea3 = new ChartArea();
            chartArea3.AxisX.MajorGrid.LineColor = Color.LightGray;
            chartArea3.AxisY.MajorGrid.LineColor = Color.LightGray;
            chartArea3.AxisX.LabelStyle.Font = new Font("Consolas", 8);
            chartArea3.AxisY.LabelStyle.Font = new Font("Consolas", 8);

            c3.Size = new Size(400, 300);
            c3.Titles.Add("Arrival Rate");
            c3.ChartAreas.Add(chartArea3);
            c3.Series.Add(s3);
            c3.Series.Add(s5a);
            c3.Invalidate();
            c3.SaveImage("arrivalRate.png", ChartImageFormat.Png);

            /////////////////////////////////////////////////////////////
            //
            // Utilization
            //
            Chart c4 = new Chart();
            var s4 = new Series("Utilization");
            s4.YValueType = ChartValueType.UInt32;
            s4.ChartType = SeriesChartType.FastLine;
            s4.Points.DataBindY(utilization);

            var s5 = new Series("Upper Limit");
            s5.YValueType = ChartValueType.UInt32;
            s5.ChartType = SeriesChartType.FastLine;
            s5.Color = Color.Red;
            s5.Points.DataBindY(Enumerable.Repeat(100.0, utilization.Count).ToList());

            var chartArea4 = new ChartArea();
            chartArea4.AxisX.MajorGrid.LineColor = Color.LightGray;
            chartArea4.AxisY.MajorGrid.LineColor = Color.LightGray;
            chartArea4.AxisX.LabelStyle.Font = new Font("Consolas", 8);
            chartArea4.AxisY.LabelStyle.Font = new Font("Consolas", 8);

            c4.Size = new Size(400, 300);
            c4.Titles.Add("Utilization");
            c4.ChartAreas.Add(chartArea4);
            c4.Series.Add(s4);
            c4.Series.Add(s5);
            c4.Invalidate();
            c4.SaveImage("utilization.png", ChartImageFormat.Png);

            #endregion Chart / Report Generation
        }
    }
}
