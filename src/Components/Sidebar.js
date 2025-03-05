import React, { useState } from "react";
import LOGO from "../Assets/Images/logo.png";
import {
  CheckCircleFilled,
  DollarCircleFilled,
  FileFilled,
  HomeFilled,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link } from "react-router-dom";

const items = [
  // {
  //   label: <Link to={""}>Home </Link>,
  //   key: "home",
  //   icon: <HomeFilled />,
  // },
  {
    label: <Link to={"admin_approval"}>Administrative Approval </Link>,
    key: "ad-appr",
    icon: <CheckCircleFilled />,
  },
  {
    label: <Link to={"tender_formality"}>Tender Formalities </Link>,
    key: "TF",
    icon: <FileFilled />,
  },
  {
    label: <Link to={"pr"}>Progress Report </Link>,
    key: "PR",
    icon: <FileFilled />,
  },

  // 
  // {
  //   label: "Navigation Three - Submenu",
  //   key: "SubMenu",
  //   icon: <SettingOutlined />,
  //   children: [
  //     {
  //       type: "group",
  //       label: "Item 1",
  //       children: [
  //         { label: "Option 1", key: "setting:1" },
  //         { label: "Option 2", key: "setting:2" },
  //       ],
  //     },
  //     {
  //       type: "group",
  //       label: "Item 2",
  //       children: [
  //         { label: "Option 3", key: "setting:3" },
  //         { label: "Option 4", key: "setting:4" },
  //       ],
  //     },
  //   ],
  // },
  {
    label: <Link to={"fund_release"}>Fund Release/Receipt</Link>,
    key: "FR",
    icon: <DollarCircleFilled />,
  },
  {
    label: <Link to={"fund_expense"}>Expenditure </Link>,
    key: "EXP",
    icon: <DollarCircleFilled />,
  },
  {
    label: <Link to={"uc"}>Utilization Certificate </Link>,
    key: "UC",
    icon: <FileFilled />,
  },
];

function Sidebar() {
  const [current, setCurrent] = useState("home");

  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };
  return (
    <aside
      id="separator-sidebar"
      className=" overflow-y-auto fixed top-0 px-5 bg-blue-900 left-0 z-40 w-64 min-h-screen max-h-screen transition-transform -translate-x-full overflow-x-hidden sm:translate-x-0"
      aria-label="Sidebar"
    >
      <a
        href="https://flowbite.com"
        class="flex items-center justify-center mb-6 mt-3"
      >
        <img src={LOGO} class="mr-3 sm:h-16" alt="Logo" />
      </a>
      <div className="h-full  bg-blue-900 sticky top-0 dark:bg-gray-800 ">
        <Menu
          onClick={(e)=>onClick(e)}
          selectedKeys={[current]}
          mode="vertical"
          items={items}
        />
      </div>
    </aside>
  );
}

export default Sidebar;
