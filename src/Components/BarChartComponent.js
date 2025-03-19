import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";



const BarChartComponent = ({ data, title_page, tooltip_name, title_Barchart, key_name_1, key_name_2, bar_name }) => {

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip" style={{ background: "#fff", padding: 10, border: "1px solid #ccc", borderRadius: 5 }}>
          <p style={{ color: "#333", fontSize:13}}>
            {/* {`${payload[0].name} ${payload[0].value}`} */}
            <span style={{color:"#333", fontWeight:700}}>{data[key_name_2]}</span> <br/>
            <span style={{color:"#7D82E4", fontWeight:700}}>Number Of Projects: {data[key_name_1]}</span>
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="w-full text-left graph_box">
    <h3 className="text-lg font-semibold mb-4" style={{ fontWeight: "bold", color: "#333", fontSize: 18,  }}>{title_page}</h3>
    <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
    <CartesianGrid strokeDasharray="3 3" />

    <XAxis 
    dataKey={key_name_2} 
    tick={{ angle: -90, textAnchor: "start", dy: -15, dx: 10, style: { fontSize: 12, wordWrap: "break-word" } }} 
    interval={0} 
    />

    <YAxis 
    label={{ 
    value: title_Barchart, 
    angle: -90, 
    position: "insideLeft", 
    dy: 110, dx: 0,
    style: { fontWeight: "600", fill: "#7D82E4", fontSize: 15}
    }} 
    // domain={[0, data.reduce((sum, item) => sum + parseFloat(item.key_name_1), 0)] }
    // domain={[0, 100005009.99] }
    domain={[0, Math.max(...data.map(item => item[key_name_1]))]}
    // tickCount={5}
    />
    {/* <Tooltip 
    formatter={(value) => [value, tooltip_name]} 
    /> */}
    <Tooltip content={<CustomTooltip />} />
    <Legend />
    <Bar dataKey={key_name_1} name={bar_name} fill="#8884d8" barSize={10} />
    </BarChart>
    </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
