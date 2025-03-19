import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from "recharts";

const data = [
  { name: "Task 1", progress: 30 },
  { name: "Task 2", progress: 50 },
  { name: "Task 3", progress: 80 },
  { name: "Task 4", progress: 100 }
];

const ProgressBarChart = ({ data, title_page, title_Barchart, key_name_1, key_name_2, key_name_3, bar_name }) => {

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip" style={{ background: "#fff", padding: 10, border: "1px solid #ccc", borderRadius: 5 }}>
          <p style={{ color: "#333", fontSize: 13 }}>
          <strong>{data[key_name_3]}</strong> {/* Add key_name_3 */}
        </p>
          <p style={{ color: "#333", fontSize:13}}>
            {`${payload[0].name} ${payload[0].value}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full text-left graph_box">
    <h3 className="text-lg font-semibold mb-4" style={{ fontWeight: "bold", color: "#333", fontSize: 18,  }}>{title_page}</h3>
    {JSON.stringify(key_name_3, null, 2)}
{/* <ResponsiveContainer width="100%" height={300}>
  <BarChart data={data} layout="vertical" margin={{ left: 50 }}>
    <XAxis type="number" domain={[0, 100]} />
    <YAxis type="category" dataKey={key_name_2} />
    <Tooltip />
    <Bar dataKey={key_name_1} name={bar_name} fill="#8884d8" barSize={10}>
    <LabelList 
        dataKey={key_name_1} 
        position="right" 
        fill="#000" 
        formatter={(value) => `${value}%`} style={{ fontSize: 12, fontWeight:700 }} 
      />
    </Bar>
  </BarChart>
</ResponsiveContainer> */}



<ResponsiveContainer width="100%" height={400}>
  <BarChart data={data} layout="vertical" margin={{ left: -50 }}>
    <XAxis type="number" domain={[0, 100]} />
    <YAxis 
      type="category" 
      // dataKey={(entry) => `${entry[key_name_3]}\n${entry[key_name_2]}`} 
      dataKey={(entry) => `${entry[key_name_2]}`} 
      tick={{ 
        angle: 0, 
        textAnchor: "start", 
        dy: 10, 
        dx: 10, 
        style: { fontSize: 10, overflow: "visible", width:250} 
      }} 
    />
    <Tooltip content={<CustomTooltip />} />
    <Bar dataKey={key_name_1} name={bar_name} barSize={10}>
      {data.map((entry, index) => {
        const value = parseFloat(entry[key_name_1]);
        let color = "#fa6f91"; // Default Red for < 25%

        if (value >= 75) color = "#46ddb9"; // Green for >= 75%
        else if (value >= 50) color = "#8884d8"; // Yellow for 50% - 74%
        else if (value >= 25) color = "#ffb75a"; // Orange for 25% - 49%

        return <Cell key={`cell-${index}`} fill={color} />;
      })}
      <LabelList 
        dataKey={key_name_1} 
        position="right" 
        fill="#000" 
        formatter={(value) => `${value}%`} 
        style={{ fontSize: 12, fontWeight: 700 }} 
      />
    </Bar>
  </BarChart>
</ResponsiveContainer>





    
    </div>
  );
};

export default ProgressBarChart;
