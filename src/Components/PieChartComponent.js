import React from "react";
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#64ced2", "#7d82e4", "#FFBB28", "#ff9018"]; // Define colors for slices

// const PieChartComponent = ({ data, title, key_name_1, key_name_2 }) => {
  const PieChartComponent = ({ data, title_page}) => {

  return (
    <div className="w-full text-left graph_box">
    <h3 className="text-lg font-semibold mb-4" style={{ fontWeight: "bold", color: "#333", fontSize: 18,  }}>{title_page}</h3>
    {/* {JSON.stringify(data, null, 2)}  */}
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data.map(item => ({ 
            number_of_project: Number(item.number_of_project), 
            dist_name: item.dist_name // Ensures it's a string
          }))}
          // data={data}
          dataKey="number_of_project"
          nameKey="dist_name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label={({ name }) => name} // Ensure labels display correctly
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
