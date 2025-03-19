import React from "react";
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#64ced2", "#7d82e4", "#FFBB28", "#ff9018"]; // Define colors for slices

// const PieChartComponent = ({ data, title, key_name_1, key_name_2 }) => {
  const PieChartComponent = ({ data, title_page}) => {

    const CustomTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        return (
          <div className="custom-tooltip" style={{ background: "#fff", padding: 10, border: "1px solid #ccc", borderRadius: 5 }}>
            <p style={{ color: "#333", fontSize:13}}>
              {`${payload[0].name} (Number Of Project : ${payload[0].value})`}
            </p>
          </div>
        );
      }
      return null;
    };

  return (
    <div className="w-full text-left graph_box">
    <h3 className="text-lg font-semibold mb-4" style={{ fontWeight: "bold", color: "#333", fontSize: 18,  }}>{title_page}</h3>
    {/* {JSON.stringify(data, null, 2)}  */}
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        {/* <Pie
          data={data.map(item => ({ 
            number_of_project: Number(item.number_of_project), 
            // dist_name: item.dist_name + ': '+ Number(item.number_of_project) // Ensures it's a string
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
        </Pie> */}
        <Pie
  data={data.map(item => ({ 
    number_of_project: Number(item.number_of_project), 
    dist_name: item.dist_name // Keeping original name key
  }))}
  dataKey="number_of_project"
  nameKey="dist_name"
  cx="50%"
  cy="50%"
  outerRadius={100}
  fill="#8884d8"
  label={({ name, value }) => `${name}: ${value}`} // Show only the number of projects
>
  {data.map((entry, index) => (
    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
  ))}
</Pie>
        {/* <Tooltip /> */}
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
