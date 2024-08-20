"use client";
import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { useParams } from "next/navigation";

interface GraphDataItem {
  createdAt: string;
  correct: number;
  wrong: number;
  userId?: { name: string }; // Add userId with its type if it's optional
}
const Page = () => {
  const { userId } = useParams<{ userId: string }>();
  const [graphData, setGraphData] = useState<GraphDataItem[]>([]); // Initialize as an empty array

  const processData = (data: GraphDataItem[]) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = months[date.getMonth()]; // Get full month name
      const year = date.getFullYear().toString().slice(-2); // Get last 2 digits of the year
      return `${day}-${month}-${year}`;
    };

    const correctData: number[] = [];
    const wrongData: number[] = [];
    const xAxisData: string[] = [];

    data.forEach((item) => {
      const formattedDate = formatDate(item.createdAt); // Use createdAt here

      if (!xAxisData.includes(formattedDate)) {
        xAxisData.push(formattedDate);
        correctData.push(0);
        wrongData.push(0);
      }

      const index = xAxisData.indexOf(formattedDate);
      correctData[index] += item.correct;
      wrongData[index] += item.wrong;
    });

    return {
      xAxisData,
      correctData,
      wrongData,
    };
  };

  const getOption = () => {
    const { xAxisData, correctData, wrongData } = processData(graphData);

    return {
      title: {
        text: `${graphData[0]?.userId?.name || "No Data"} data`,
        left: "center",
        top: "5%",
        subtextGap: 20,
        textStyle: {
          fontSize: 20,
          fontWeight: "bold",
          color: "#333",
        },
        subtextStyle: {
          fontSize: 14,
          color: "#666",
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        data: ["correct", "wrong"],
        bottom: "10%", // Positioning the legend a bit higher
        left: "center",
        padding: [0, 0, 0, 0],
        itemWidth: 20,
        itemHeight: 10,
        textStyle: {
          fontSize: 12,
          color: "#333",
        },
      },
      xAxis: {
        type: "category",
        data: xAxisData,
        axisLabel: {
          rotate: 45,
          fontSize: 12,
          color: "#333",
        },
        axisLine: {
          lineStyle: {
            color: "#999",
          },
        },
        boundaryGap: true, // Ensure there's space around the axis labels
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: "{value} units",
        },
        axisLine: {
          lineStyle: {
            color: "#999",
          },
        },
        splitLine: {
          lineStyle: {
            type: "dashed",
            color: "#ddd",
          },
        },
      },
      dataZoom: [
        {
          type: "slider",
          start: 0,
          end: 80,
          height: 20,
          bottom: "5%", // Adjusting the position of the slider
          backgroundColor: "#f5f5f5",
          fillerColor: "rgba(64,158,255,0.2)",
          borderColor: "#ccc",
        },
        {
          type: "inside",
          start: 0,
          end: 50,
        },
      ],
      series: [
        {
          name: "correct",
          type: "bar",
          data: correctData,
          itemStyle: {
            color: "#2ecc71",
            barBorderRadius: 0,
          },
          barWidth: "15%", // Reduced bar width
          label: {
            show: true,
            position: "top",
            formatter: "{c}",
            color: "#000",
          },
          emphasis: {
            itemStyle: {
              color: "#27ae60",
            },
          },
        },
        {
          name: "wrong",
          type: "bar",
          data: wrongData,
          itemStyle: {
            color: "#e74c3c",
            barBorderRadius: 0,
          },
          barWidth: "15%", // Reduced bar width
          label: {
            show: true,
            position: "top",
            formatter: "{c}",
            color: "#000",
          },
          emphasis: {
            itemStyle: {
              color: "#c0392b",
            },
          },
        },
      ],
      grid: {
        top: "15%",
        left: "3%",
        right: "3%",
        bottom: "30%", // Increased bottom margin to accommodate labels and slider
      },
      barCategoryGap: "40%", // Increased gap between bar groups
      animation: true,
      animationDuration: 1500,
      animationEasing: "bounceOut",
    };
  };

  const getGraphData = async () => {
    try {
      const req = await fetch(`/api/admin/statistics/graph/${userId}`, {
        credentials: "include",
      });
      const result = await req.json();
      const data = result.quizzData; // Access the quizzData array from the result

      if (!Array.isArray(data)) {
        throw new Error("Data is not an array");
      }

      // Update state with the prepared data
      setGraphData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGraphData();
  }, []);

  return (
    <section className="max-w-[90%] m-auto w-full h-full mt-5">
      <div className="w-[100%] m-auto mb-5 flex gap-2 sm:flex-wrap flex-wrap md:flex-wrap lg:flex-nowrap mt-10">
        <div style={{ height: 600, width: "100%" }}>
          {graphData.length > 0 ? (
            <ReactECharts
              option={getOption()}
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <div className="text-center">No data available</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Page;
