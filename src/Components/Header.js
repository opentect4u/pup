import React, { useEffect, useState } from "react";
import { Avatar, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import DialogBox from "./DialogBox";
function Header() {
    const navigate = useNavigate()
    const [visible,setVisible] = useState(false)
    const [flag,setFlag] = useState(1)
    const [userDataLocalStore, setUserDataLocalStore] = useState([]);


    useEffect(() => {
      const userData = localStorage.getItem("user_dt");
      if (userData) {
      setUserDataLocalStore(JSON.parse(userData))
      } else {
        navigate("/");
      setUserDataLocalStore([])
      }
    
      }, []);

  const items = [
   
    {
      key: "1",
      label: (
        
        <p onClick={() => {
          navigate("user-profile/profile");
        }}
        style={{ cursor: "pointer" }}>
        Profile
      </p>
      ),
    },
    {
      key: "2",
      label: (
        <p onClick={() => {
            navigate("user-profile/change-password");
          }}
          style={{ cursor: "pointer" }}>
          Change Password
        </p>
      ),
    },
    {
      key: "3",
      label: (
        <p onClick = {() => {
         setVisible(true)
        }}
        >
          Sign Out
        </p>
      ),
    },
  ];


  const logoutFn = ()=>{
    localStorage.removeItem("user_dt");
navigate('/')
// alert('loooooooo')

  }

  return (
    <header className="sticky sm:ml-64 top-0 z-50 bg-white dark:bg-gray-800">
      <nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div class="flex flex-wrap justify-end items-center mx-auto max-w-screen-xl">
          <div class="flex items-center justify-end lg:order-2">
            <Dropdown menu={{ items }} placement="bottomLeft" arrow>
              <Avatar className="cursor-pointer" size={40} icon={<UserOutlined />} />
            </Dropdown>
            <button
              data-collapse-toggle="mobile-menu-2"
              type="button"
              class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded="false"
            >
              <span class="sr-only">Open main menu</span>
              <svg
                class="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <svg
                class="hidden w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>
      <DialogBox flag={flag}  isModalOpen={visible} handleOk={()=>{
        logoutFn()
      }} handleCancel={()=>setVisible(false)}/>
    </header>
  );
}

export default Header;
