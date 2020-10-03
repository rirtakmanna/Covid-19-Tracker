import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elecments: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const LineGraph = ({ casesType = "cases", mode, currentDetail }) => {
  const [data, setData] = useState({});
  const bgColor =
    mode === "light" ? "rgba(178, 34, 34, 0.5)" : "rgba(15, 82, 186, 0.5)";

  const borColor = mode === "light" ? "#B22222" : "#0F52BA";

  const buildChartData = (data, casesType) => {
    let chartData = [];
    let lastDataPoint;
    for (let date in data.cases) {
      if (lastDataPoint) {
        let newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }
    return chartData;
  };

  useEffect(() => {
    const fetchDataIndia = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/india?lastdays=60")
        .then((response) => response.json())
        .then((data) => {
          // console.log(data.timeline);
          let chartData = buildChartData(data.timeline, casesType);
          setData(chartData);
        });
    };

    const fetchDataCounties = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=60")
        .then((response) => response.json())
        .then((data) => {
          // some stuf
          // console.log(data);
          let chartData = buildChartData(data, casesType);
          setData(chartData);
        });
    };

    currentDetail === "india" ? fetchDataIndia() : fetchDataCounties();
  }, [currentDetail, casesType]);

  return (
    <div className='line-graph'>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: bgColor,
                borderColor: borColor,
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
};

export default LineGraph;
