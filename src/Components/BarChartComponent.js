import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";



const BarChartComponent = ({ data, title_page, title_Barchart, key_name_1, key_name_2, bar_name }) => {
  return (
    <div className="w-full text-left graph_box">
    <h3 className="text-lg font-semibold mb-4" style={{ fontWeight: "bold", color: "#333", fontSize: 18,  }}>{title_page}</h3>
    <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis 
    dataKey={key_name_2}  
    // tick={{ angle: -90, textAnchor: "start" }} 
    tick={{ angle: -90, textAnchor: "start", dy: -15, dx: -35, style: { fontSize: 13 } }} 
    position="insideLeft"
    />
    <YAxis 
    label={{ 
    // value: title_Barchart, 
    angle: -90, 
    position: "insideLeft", 
    dy: 110, 
    style: { fontWeight: "bold", fill: "#8A8A8A", fontSize: 18,  }
    }} 
    domain={[0, data.reduce((sum, item) => sum + parseFloat(item.key_name_1), 0)]}
    // tickCount={5}
    />
    <Tooltip />
    <Legend />
    <Bar dataKey={key_name_1} name={bar_name} fill="#8884d8" barSize={40} />
    </BarChart>
    </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
