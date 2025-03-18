import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Task 1", progress: 30 },
  { name: "Task 2", progress: 50 },
  { name: "Task 3", progress: 80 },
  { name: "Task 4", progress: 100 }
];

const ProgressBarChart = ({ data, title_page, title_Barchart, key_name_1, key_name_2, bar_name }) => {
  return (
    <div className="w-full text-left graph_box">
    <h3 className="text-lg font-semibold mb-4" style={{ fontWeight: "bold", color: "#333", fontSize: 18,  }}>{title_page}</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ left: 50 }}>
        <XAxis type="number" domain={[0, 100]} />
        <YAxis type="category" dataKey={key_name_2} />
        <Tooltip />
        {/* <Bar dataKey={key_name_1} fill="#82ca9d" /> */}
        <Bar dataKey={key_name_1} name={bar_name} fill="#8884d8" barSize={40} />
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
};

export default ProgressBarChart;
