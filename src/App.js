import logo from "./logo.svg";
import "./App.css";
import { Outlet } from "react-router-dom";
import { ConfigProvider } from "antd";
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css"

function App() {
  return (
    // <div>
    //   <div className='bg-slate-500 text-white font-bold'>Manku Khaichilo</div>
    //   <div className='bg-red-950 text-amber-200'>Haa</div>
    // </div>
	<PrimeReactProvider>
    <ConfigProvider
      theme={{
        components: {
          Steps: {
            colorPrimary: "#22543d",
          },
          Button: {
            defaultBg: "#7fbf9f",
            defaultBorderColor:'#7fbf9f',
            colorBgContainer: "#7fbf9f",
            colorBgBase: "#7fbf9f",
            defaultActiveColor: "#7fbf9f",
          },
        
          Menu: {
            itemBg: "#3EB8BD",
            subMenuItemBg: "#3EB8BD",
            popupBg: "#3EB8BD",
            itemColor: "#fff",
            itemSelectedBg: "#ffffff",
            itemMarginInline: 15,
            itemHoverBg: "#ffffff",
            itemSelectedColor: "#3EB8BD",
            itemHoverColor: "#3EB8BD",
            colorPrimaryBorder: "#A31E21",
            horizontalItemSelectedColor: "#FBEC21",
            itemMarginInline: 4,
          },
          Segmented: {
            itemActiveBg: "#A31E21",
            itemColor: "#A31E21",
            itemSelectedColor: "white",
            itemSelectedBg: "#A31E21",
          },
          FloatButton: {
            borderRadiusLG: 20,
            borderRadiusSM: 20,
            colorPrimary: "#eb8d00",
            colorPrimaryHover: "#eb8d00",
            margin: 30,
          },
         
          Descriptions: {
            titleColor: "#A31E21",
            colorTextLabel: "#A31E21",
            colorText: "#A31E21",
            colorSplit: "#A31E21",
            labelBg: "#F1F5F9",
          },
          Tabs: {
            inkBarColor: "#DA4167",
            itemColor: "#DA4167",
            itemSelectedColor: "#DA4167",
            itemHoverColor: "#DA4167",
            itemActiveColor: "#DA4167",
          },
          Dropdown: {
            colorBgElevated: "white",
            colorText: "#3EB8BD",
            colorTextHover: "#fff",
            controlItemBgHover: "#436B6C",
            controlItemColorHover: "white",
          },
          Radio: {
            colorPrimary: "#DA4167",
            buttonColor: "#A31E21",
            colorBorder: "#A31E21",
          },
          Popconfirm: {
            colorWarning: "#A31E21",
          },
          // Badge: {
          // 	statusSize: 20,
          // },
          Modal: {
            titleFontSize: 25,
            titleColor: "#7fbf9f",
          },
          DatePicker: {
            colorPrimary: "#0694a2",
            cellActiveWithRangeBg: "#CCFBF177",
          },
        },
      }}
    >
      <Outlet />
    </ConfigProvider>
	</PrimeReactProvider>
  );
}

export default App;
