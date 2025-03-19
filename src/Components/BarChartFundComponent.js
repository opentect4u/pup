import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";



const BarChartFundComponent = ({ data, title_page, tooltip_name, title_Barchart, key_name_1, key_name_2, key_name_3, key_name_4,  bar_name }) => {

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip" style={{ background: "#fff", padding: 10, border: "1px solid #ccc", borderRadius: 5 }}>
          <p style={{ color: "#333", fontSize: 13 }}>
          <strong>{data[key_name_2]}</strong> <br/> {/* Add key_name_3 */}
          <strong>{data[key_name_4]}</strong>
        </p>
          <p style={{ color: "#333", fontSize:13}}>
            {/* {`${payload[0].name} ${payload[0].value}`} */}
            <span style={{color:"#46ddb9"}}>Release Fund: {data[key_name_1]}</span> <br/>
            <span style={{color:"#fa6f91"}}>Expenditure: {data[key_name_3]}</span>
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
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        barCategoryGap={0} // Removes space between grouped bars
        barGap={0} // Reduces space between bars 
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis 
            dataKey={key_name_2}
            tick={{ angle: -90, textAnchor: "start", dy: -15, dx: 15, style: { fontSize: 12, wordWrap: "break-word" } }} 
            interval={0} 
          />

          <YAxis 
            label={{ 
              value: title_Barchart, 
              angle: -90, 
              position: "insideLeft", 
              dy: 110, dx: 0,
              style: { fontWeight: "600", fill: "#7D82E4", fontSize: 15 }
            }} 
            domain={[0, Math.max(...data.map(item => Math.max(parseFloat(item.fund_release), parseFloat(item.fund_expense))))]}
            // domain={[0, Math.max(...data.map(item => item[fund_release]))]}
          />

          {/* <Tooltip formatter={(value) => [value, tooltip_name]} /> */}
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {/* Two bars: One for fund_release, another for fund_expense */}
          <Bar dataKey={key_name_1} name="Fund Released" fill="#46ddb9" barSize={10} />
          <Bar dataKey={key_name_3} name="Fund Expensed" fill="#fa6f91" barSize={10} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartFundComponent;
