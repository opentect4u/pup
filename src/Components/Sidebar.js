import React, { useEffect, useState } from "react";
import LOGO from "../Assets/Images/logo.png";
import {
  CheckCircleFilled,
  DollarCircleFilled,
  FileFilled,
  HomeFilled,
  ProjectOutlined,
} from "@ant-design/icons";
import { Collapse, Menu } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { menus } from "./NavRouting";
import localforage from 'localforage';

function Sidebar() {
  const [current, setCurrent] = useState("home");
  const navigate = useNavigate();
  const path = useLocation();
  const [userDataLocalStore, setUserDataLocalStore] = useState([]);
  const [expairyTime, setExpairyTime] = useState(null);

  const userData = JSON.parse(localStorage.getItem("user_dt") || "{}");
  const userType = userData.user_type || null;

  useEffect(() => {
    const userData = localStorage.getItem("user_dt");
    if (userData) {
      setUserDataLocalStore(JSON.parse(userData));
    } else {
      setUserDataLocalStore([])
    }
  }, []);

  //   useEffect(() => {
  //     checkPermission();
  //   }, [path]);

  //     const checkPermission = () =>{
  //           // const userType = localStorage.getItem("user_type");
  //           const userData = JSON.parse(localStorage.getItem("user_dt"));
  //           const userType = userData ? userData.user_type : null;
  //           console.log(userType);
  //           const pathName = path.pathname;
  //           console.log(pathName)
  //           const hasPermission = menus.filter((menu) => menu.roles.includes(userType) && pathName==menu.path);
  //           console.log(hasPermission);
  //           if(hasPermission.length > 0){
  // console.log(hasPermission, 'hasPermission', 'yes');
  //           }
  //           else{
  //             // localStorage.clear();
  //             // navigate("/");
  //             console.log(hasPermission, 'hasPermission');

  //           }
  //     }


  useEffect(() => {
  checkPermission();
    

// const expiryString = "2025-07-07 14:16:15";
// const expiryDate = new Date(expiryString.replace(" ", "T")); 


  // Get a value
  localforage.getItem('tokenDetails').then((value) => {
  console.log('Stored value:', value);
  setExpairyTime(new Date(value?.expires_at.replace(" ", "T")));

  checkExpairyTime(new Date(value?.expires_at.replace(" ", "T")), new Date());
  }).catch((err) => {
  console.error('Read error:', err);
  });

  const currentDate = new Date()


  
  }, [path]);

  const checkExpairyTime = (expairyTime, currentDate) => {

  if (currentDate > expairyTime) {
  // Logout logic here
  localStorage.removeItem("user_dt");
  navigate('/')

  localforage.removeItem('token')
  .then(() => {
  // console.log('User removed!');
  })
  .catch((err) => {
  // console.error('Error removing user:', err);
  });

  }

  }

  const checkPermission = () => {

    if (!userType) {
      console.log("No user type found");
      navigate("/");
      return;
    }

    const pathName = path.pathname;

    const hasPermission = menus.some(
      (menu) =>
        menu.roles.includes(userType) &&
        pathName.startsWith(menu.path)
    );

    if (hasPermission) {
    } else {

      if (userType === 'S') {
        navigate("/home/admin_approval");
      }
      if (userType === 'A') {
        navigate("/home/admin_approval");
      }
      if (userType === 'AC') {
        navigate("/home/fund_expense");
      }
      if (userType === 'F') {
        navigate("/home/tender_formality");
      }
    }
  };

  const { Panel } = Collapse;

  const items = [
    {
      label: <Link to={"admin_approval"}>Administrative Approval</Link>,
      key: "ad-appr",
      icon: <CheckCircleFilled />,
    },
    {
      label: <Link to={"tender_formality"}>Tender Formalities</Link>,
      key: "TF",
      icon: <FileFilled />,
    },
    {
      label: <Link to={"pr"}>Progress Report</Link>,
      key: "PR",
      icon: <FileFilled />,
    },
    {
      label: <Link to={"fund_release"}>Fund Release/Receipt</Link>,
      key: "FR",
      icon: <DollarCircleFilled />,
    },
    {
      label: <Link to={"fund_expense"}>Expenditure</Link>,
      key: "EXP",
      icon: <DollarCircleFilled />,
    },
    // {
    //   label: <Link to={"pcr"}>PCR</Link>,
    //   key: "PCR",
    //   icon: <FileFilled />,
    // },
    // {
    //   label: <Link to={"project-status"}>Project Status</Link>,
    //   key: "pro_status",
    //   icon: <ProjectOutlined />,
    // },
  ];


  const filteredItems = userType === 'AC'
  ? items.filter(item => item.key === 'EXP')
  : userType === 'A'
  ? items.filter(item => item.key === 'ad-appr' || item.key === 'TF' || item.key === 'PR' || item.key === 'EXP')
  : userType === 'F'
  ? items.filter(item => item.key === 'TF' || item.key === 'PR')
  : items;


  const PCR_Project_Status = [
    {
      label: <Link to={"pcr"}>PCR</Link>,
      key: "PCR",
      icon: <FileFilled />,
    },
    {
      label: <Link to={"project-status"}>Project Status</Link>,
      key: "pro_status",
      icon: <ProjectOutlined />,
    },
  ];


  const filteredMenu_2 = userType === 'A'
  ? PCR_Project_Status.filter(item => item.key === 'PCR')
  : userType === 'AC'
  ? PCR_Project_Status.filter(item => item.key === 'PCR')
  : userType === 'F'
  ? PCR_Project_Status.filter(item => null)
  : PCR_Project_Status;

  const MasterAccordion = () => (
    <Collapse accordion>
      <Panel header="Master" key="1">
        <ul>
          <li><Link to={"master/add-edit-sector"}>Sector</Link></li>
          <li><Link to={"master/add-source-fund"}>Source Of Fund</Link></li>
          <li><Link to={"master/implementing-agency"}>Implementing Agency</Link></li>
          <li><Link to={"master/account-head-list"}>Account Head List</Link></li>
          <li><Link to={"master/depertment"}>Department</Link></li>
          <li><Link to={"master/designation"}>Designation</Link></li>
          <li><Link to={"master/project-submitted"}>Project Submitted By</Link></li>
        </ul>
      </Panel>
    </Collapse>
  );

  const UserAccordion = () => (
    <Collapse accordion>
      <Panel header="Manage User" key="1">
        <ul>
          <li><Link to={"user/manage-user"}>Add/Edit User</Link></li>
        </ul>
      </Panel>
    </Collapse>
  );

  const ReportAccordion = () => (
    <Collapse accordion>
      <Panel header="Report" key="1">
        <ul>
          <li><Link to={"report/financial-report/0"}>Financial Yearwise</Link></li>
          <li><Link to={"report/head-accountwise-report/0"}>Head of Accountwise</Link></li>
          <li><Link to={"report/sector-report/0"}>Sectorwise</Link></li>
          <li><Link to={"report/district-report/0"}>Districtwise & Blockwise</Link></li>
          <li><Link to={"report/implement-report/0"}>Implementing Agencywise</Link></li>
        </ul>
      </Panel>
    </Collapse>
  );


  const UtilizationAccordion = () => (
    <Collapse accordion>
      <Panel header="Utilization Certificate" key="1">
        <ul>
          <li><Link to={"uc_c"}>Utilization Certificate Generate</Link></li>
          <li><Link to={"uc"}>Utilization Certificate</Link></li>
        </ul>
      </Panel>
    </Collapse>
  );

  const onClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <aside
      id="separator-sidebar"
      className="overflow-y-auto fixed top-0 px-5 bg-blue-900 left-0 z-40 w-64 min-h-screen max-h-screen transition-transform -translate-x-full overflow-x-hidden sm:translate-x-0"
      aria-label="Sidebar"
    >
      <a href="#" className="flex items-center justify-center mb-6 mt-3">
        <img src={LOGO} className="mr-3 sm:h-16" alt="Logo" />
      </a>
      <div className="h-full bg-blue-900 sticky top-0 dark:bg-gray-800 customeMenu">

        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="vertical"
          items={filteredItems}
        />

        {userType === 'S' ? (
          <UtilizationAccordion />
        ) : userType === 'A' ? (
          <UtilizationAccordion />
        ) : userType === 'AC' ? (
          <UtilizationAccordion />
        ) : null}
        

        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="vertical"
          items={filteredMenu_2}
        />

        {/* <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="vertical"
          items={items_pcr}
        /> */}

        {userType === 'S' ? (
          <MasterAccordion />
        ) : userType === 'A' ? (
          <MasterAccordion />
        ) : null}



        {userType === 'S' ? (
          <UserAccordion />
        ) : null}

        {userType === 'S' ? (
          <ReportAccordion />
        ) : userType === 'A' ? (
          <ReportAccordion />
        ) : userType === 'AC' ? (
          <ReportAccordion />
        ) : null}

      </div>
    </aside>
  );
}

export default Sidebar;
