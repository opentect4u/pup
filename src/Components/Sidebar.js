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
import { Link } from "react-router-dom";
// import Panel from "antd/es/splitter/Panel";




function Sidebar() {
  const [current, setCurrent] = useState("home");
  const [userDataLocalStore, setUserDataLocalStore] = useState([]);


  useEffect(() => {
    const userData = localStorage.getItem("user_dt");
    if (userData) {
    setUserDataLocalStore(JSON.parse(userData))
    } else {
    setUserDataLocalStore([])
    }
  
    }, []);


    
const { Panel } = Collapse;

const items = [
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
];

const items_pcr = [
  {
    label: <Link to={"pcr"}>PCR </Link>,
    key: "PCR",
    icon: <FileFilled />,
  },
  {
    label: <Link to={"project-status"}>Project Status </Link>,
    key: "pro_status",
    icon: <ProjectOutlined />,
  },
];



// const MasterAccordion = ({ userType }) => (
//   <Collapse accordion>
    
//     <Panel header="Master" key="1" >
//       <ul>
//       {userType === "S" &&(
//         <>
//         <li>
//           <Link to={"master/add-edit-sector"}>Sector</Link>
//         </li>
//         <li>
//           <Link to={"master/add-source-fund"}>Source Of Fund</Link>
//         </li>
//         </>
//         )}
//         {userType === "S" &&(
//         <li>
//           <Link to={"master/implementing-agency"}>Implementing Agency</Link>
//         </li>
//         )}

//         {userType === "A" &&(
//         <li>
//           <Link to={"master/implementing-agency"}>Implementing Agency</Link>
//         </li>
//         )}

//         {userType === "S" &&(
//         <li>
//           <Link to={"master/account-head-list"}>Account Head List</Link>
//         </li>
//         )}
        
//         {userType === "S" &&(
//         <li>
//           <Link to={"master/depertment"}>Department</Link>
//         </li>
//         )}

//         {userType === "A" &&(
//         <li>
//           <Link to={"master/depertment"}>Department</Link>
//         </li>
//         )}

//         {userType === "S" &&(
//         <li>
//           <Link to={"master/designation"}>Designation</Link>
//         </li>
//         )}

//         {userType === "A" &&(
//         <li>
//           <Link to={"master/designation"}>Designation</Link>
//         </li>
//         )}

//         {userType === "S" &&(
//         <li>
//           <Link to={"master/project-submitted"}>Project Submitted By</Link>
//         </li>
//         )}

//         {userType === "A" &&(
//         <li>
//           <Link to={"master/project-submitted"}>Project Submitted By</Link>
//         </li>
//         )}
        
        
//       </ul>
//     </Panel>
    
//   </Collapse>
// );

const MasterAccordion = ({ userType }) => {
  const masterLinks = [
    {
      label: "Sector",
      path: "master/add-edit-sector",
      roles: ["S"],
    },
    {
      label: "Source Of Fund",
      path: "master/add-source-fund",
      roles: ["S"],
    },
    {
      label: "Implementing Agency",
      path: "master/implementing-agency",
      roles: ["S", "A"],
    },
    {
      label: "Account Head List",
      path: "master/account-head-list",
      roles: ["S"],
    },
    {
      label: "Department",
      path: "master/depertment",
      roles: ["S", "A"],
    },
    {
      label: "Designation",
      path: "master/designation",
      roles: ["S", "A"],
    },
    {
      label: "Project Submitted By",
      path: "master/project-submitted",
      roles: ["S", "A"],
    },
  ];

  const filteredLinks = masterLinks.filter(link => link.roles.includes(userType));
  if (filteredLinks.length === 0) return null;
  return (
    <Collapse accordion>
      <Panel header="Master" key="1">
        <ul>
          {filteredLinks.map(({ label, path }) => (
            <li key={path}>
              <Link to={path}>{label}</Link>
            </li>
          ))}
        </ul>
      </Panel>
    </Collapse>
  );
};

const UserAccordion = () => (
  <Collapse accordion>
    <Panel header="Manage User" key="1" >
      <ul>
        <li>
          <Link to={"user/manage-user"}>Add/Edit User</Link>
        </li>
      </ul>
    </Panel>
  </Collapse>
);

const ReportAccordion = () => (
  <Collapse accordion>
    <Panel header="Report" key="1" >
      <ul>
        <li>
          <Link to={"report/financial-report/0"}>Financial Yearwise</Link>
        </li>
        <li>
          <Link to={"report/head-accountwise-report/0"}>Head of Accountwise </Link>
        </li>
        <li>
          <Link to={"report/sector-report/0"}>Sectorwise</Link>
        </li>
        <li>
          <Link to={"report/district-report/0"}>Districtwise & Blockwise</Link>
        </li>

        <li>
          <Link to={"report/implement-report/0"}>Implementing Agencywise</Link>
        </li>
      </ul>
    </Panel>
  </Collapse>
);

const UtilizationAccordion = () => (
  <Collapse accordion>
    <Panel header="Utilization Certificate" key="1" >
      <ul>
        <li>
          <Link to={"uc_c"}>Utilization Certificate Generate </Link>
        </li>
        <li>
          <Link to={"annex"}>Add Annexure</Link>
        </li>
        <li>
          <Link to={"uc"}>Utilization Certificate</Link>
        </li>

      </ul>
    </Panel>
  </Collapse>
);


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
        href="#"
        class="flex items-center justify-center mb-6 mt-3"
      >
        <img src={LOGO} class="mr-3 sm:h-16" alt="Logo" />
      </a>
      <div className="h-full  bg-blue-900 sticky top-0 dark:bg-gray-800 customeMenu">
      {/* {JSON.stringify(userDataLocalStore.user_type , null, 2)} */}
      {(userDataLocalStore.user_type === "S") && (
        <>
        <Menu
          onClick={(e)=>onClick(e)}
          selectedKeys={[current]}
          mode="vertical"
          items={items}
        />
        <>
        <UtilizationAccordion />
        <Menu
          onClick={(e)=>onClick(e)}
          selectedKeys={[current]}
          mode="vertical"
          items={items_pcr}
        />
        <MasterAccordion userType={userDataLocalStore.user_type} />
        <UserAccordion />
        
        </>
        <ReportAccordion />
        </>
        )}


        <>
        <Menu
          onClick={(e)=>onClick(e)}
          selectedKeys={[current]}
          mode="vertical"
          // items={items}
          items={
            userDataLocalStore.user_type === "A"
            ? items.filter((item) => item.key === "ad-appr" || item.key === "TF" || item.key === "PR" || item.key === "EXP")
            : []
          }
        />

        <Menu
        onClick={(e)=>onClick(e)}
        selectedKeys={[current]}
        mode="vertical"
        // items={items}
        items={
        userDataLocalStore.user_type === "AC"
        ? items.filter((item) => item.key === "EXP")
        : []
        }
        />

        <Menu
        onClick={(e)=>onClick(e)}
        selectedKeys={[current]}
        mode="vertical"
        // items={items}
        items={
        userDataLocalStore.user_type === "F"
        ? items.filter((item) => item.key === "TF")
        : []
        }
        />

        <>
        {userDataLocalStore.user_type === "A" || userDataLocalStore.user_type === "AC" &&(
          <UtilizationAccordion />
        )}
        
        <Menu
          onClick={(e)=>onClick(e)}
          selectedKeys={[current]}
          mode="vertical"
          // items={items_pcr}
          items={
            userDataLocalStore.user_type === "A" || userDataLocalStore.user_type === "AC"
            ? items_pcr.filter((item) => item.key === "PCR")
            : []
          }
        />
        
        </>
        {userDataLocalStore.user_type === "A" || userDataLocalStore.user_type === "AC" &&(
        <ReportAccordion />
        )}

        <MasterAccordion userType={userDataLocalStore.user_type} />

        </>
      </div>
    </aside>
  );
}

export default Sidebar;
