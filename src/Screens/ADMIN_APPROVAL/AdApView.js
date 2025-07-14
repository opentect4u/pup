import React, { useEffect, useState } from 'react';
import BtnComp from '../../Components/BtnComp';
import { useNavigate } from 'react-router-dom';
import { auth_key, url } from '../../Assets/Addresses/BaseUrl';
import axios from 'axios';
import { EditOutlined, EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import { useParams } from "react-router";
import { Button, Modal, Popover, Select, Spin } from 'antd';
import TableHeader from '../../Components/TableHeader';
import TableRow from '../../Components/TableRow';
import localforage from 'localforage';
import { getCSRFToken } from '../../CommonFunction/useCSRFToken';
import { getLocalStoreTokenDts } from '../../CommonFunction/getLocalforageTokenDts';
import TableListViewFilter from '../../Components/TableListViewFilter';

function AdApView() {
  const navigate = useNavigate();
  const [tableDataList, setTableDataList] = useState([]);
  
  const params = useParams();
  const [loading, setLoading] = useState(false);
  
  const [filteredDataList, setFilteredDataList] = useState([]); //searched data
  const [searchTerm, setSearchTerm] = useState("");  //searched data

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [pageName, setPageName] = useState('');
  const [userDataLocalStore, setUserDataLocalStore] = useState([]);


  const [districtDropList, setDistrictDropList] = useState([]);
  const [blockDropList, setBlockDropList] = useState(() => []);
  const [psStnDropList, setpsStnDropList] = useState(() => []);
  const [GM_DropList, setGM_DropList] = useState(() => []);




  useEffect(() => {
    const userData = localStorage.getItem("user_dt");
    if (userData) {
    setUserDataLocalStore(JSON.parse(userData))
    } else {
    setUserDataLocalStore([])
    }

    fetchTableDataList_Fn();
    fetchDistrictdownOption();
    }, []);

    // const getCSRFToken = async () => {
    //   const res = await fetch(url + 'index.php/login/get_csrf', {
    //     credentials: "include" // allows receiving the CSRF cookie
    //   });
    //   const data = await res.json();
    //   console.log(data, 'data');
      
    //   return {
    //     name: data.csrf_token_name,
    //     value: data.csrf_token_value
    //   };
    // };

  const fetchTableDataList_Fn = async () => {
    
    // const csrf = await getCSRFToken(navigate);
    const tokenValue = await getLocalStoreTokenDts(navigate);
    
    // console.log(tokenValue, 'token_____');
    // alert('Token fetched successfully from local storage', newToken);
    
    setLoading(true);
    const formData = new FormData();
    formData.append("project_id", '0');
    formData.append("fin_year", '0');
    formData.append("dist_id", '0');
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    // const cread = {
    //   project_id: '0',
    //   fin_year: '0',
    //   dist_id: '0',
    // };
    try {
      const response = await axios.post(url + 'index.php/webApi/Admapi/adm_approv_list', formData, {
        headers: { 'auth_key': auth_key,
          'Authorization': `Bearer ` + tokenValue?.token
         },
      
      });

      if(response?.data?.status > 0) {
      setLoading(false);
      setTableDataList(response?.data?.message);
      setFilteredDataList(response?.data?.message);
      setPageName('AdApView');
      }

      if(response?.data?.status < 1) {
        setLoading(false);
        setTableDataList([]);
        setFilteredDataList([]);
      }
      

    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);

      localStorage.removeItem("user_dt");
      navigate('/')
      
    }
  };


    const fetchDistrictdownOption = async () => {
      setLoading(true);
      const tokenValue = await getLocalStoreTokenDts(navigate);
  
      const formData = new FormData();
      formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token
  
      try {
        const response = await axios.post(
          url + 'index.php/webApi/Mdapi/dist',
          formData, // Empty body
          {
            headers: {
              'auth_key': auth_key,
              'Authorization': `Bearer ` + tokenValue?.token
            },
          }
        );
  
        setDistrictDropList(response.data.message)
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error); // Handle errors properly
  
        localStorage.removeItem("user_dt");
        navigate('/')
      }
    };
  
    const fetchBlockdownOption = async (getDistrict_id) => {
  
      console.log(getDistrict_id, 'fffffffffffffffffffffffffff', 'kkk');
      
      
      const tokenValue = await getLocalStoreTokenDts(navigate);
  
      const formData = new FormData();
  
      formData.append('dist_list', getDistrict_id);
      formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token
  
      if(getDistrict_id && getDistrict_id.length > 0){
  
        console.log(getDistrict_id, 'fffffffffffffffffffffffffff', 'kkk');
      try {
        const response = await axios.post(
          // url + 'index.php/webApi/Mdapi/block',
          url + 'index.php/webApi/Mdapi/block_filter',
          formData, // Empty body
          {
            headers: {
              'auth_key': auth_key,
              'Authorization': `Bearer ` + tokenValue?.token
            },
          }
        );
        
        setBlockDropList(response.data.message)
  
      } catch (error) {
        console.error("Error fetching data:", error); // Handle errors properly
        setBlockDropList([])
        
        
        localStorage.removeItem("user_dt");
        navigate('/')
      }
      } else {
        // setBlockDropList([])
      }
  
    };

     const fetchPoliceStnOption = async (getDistrict_id) => {
        // const formData = new FormData();
        // formData.append("dist_id", district_ID);
        // formData.append("block_id", 0);
        const tokenValue = await getLocalStoreTokenDts(navigate);
    
        const formData = new FormData();
        formData.append('dist_list', getDistrict_id);
        formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token
    
        if(getDistrict_id.length > 0){
        try {
          const response = await axios.post(
            // `${url}index.php/webApi/Mdapi/get_ps`,
            `${url}index.php/webApi/Mdapi/get_ps_filter`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                'auth_key': auth_key, // Important for FormData
                'Authorization': `Bearer ` + tokenValue?.token
              },
            }
          );
          
    
          if (response?.data?.status > 0) {
            setpsStnDropList(response?.data?.message)
          }
    
          if (response?.data?.status < 1) {
            setpsStnDropList([])
          }
    
    
        } catch (error) {
          console.error("Error fetching data:", error); // Handle errors properly
    
          localStorage.removeItem("user_dt");
          navigate('/')
    
        }
        } else {
          setpsStnDropList([])
        }
    
    
      };

      const fetch_GM_Option = async (getBlock_id) => {
        // const formData = new FormData();
        // formData.append("dist_id", district_ID);
        // formData.append("block_id", block_ID);
        const tokenValue = await getLocalStoreTokenDts(navigate);
    
        console.log('formDataformDataformDataformData', getBlock_id);
    
        const formData = new FormData();
        formData.append('block_id', getBlock_id);
        formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token
    
        if(getBlock_id.length > 0){
        try {
          const response = await axios.post(
            // `${url}index.php/webApi/Mdapi/get_gp`,
            `${url}index.php/webApi/Mdapi/get_gp_filter`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                'auth_key': auth_key, // Important for FormData
                'Authorization': `Bearer ` + tokenValue?.token
              },
            }
          );
    
          console.log(response, 'formDataformDataformDataformData', formData);
          
    
          if (response?.data?.status > 0) {
            setGM_DropList(response?.data?.message)
          }
    
          if (response?.data?.status < 1) {
            setGM_DropList([])
          }
    
        } catch (error) {
          console.error("Error fetching data:", error); // Handle errors properly
          console.log('formDataformDataformDataformData', error);
          localStorage.removeItem("user_dt");
          navigate('/')
    
        }
        } else {
          setGM_DropList([])
        }
    
      };




  const handleSearch = (e) => {
    
    
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filteredData = tableDataList.filter((data) => 
      data?.scheme_name?.toLowerCase().includes(value) || 
    data?.project_id?.toString().toLowerCase().includes(value)
    );

    setFilteredDataList(filteredData);
    setCurrentPage(1); // Reset to first page after search
  };

  const totalPages = Math.ceil(filteredDataList.length / rowsPerPage);
  const currentTableData = filteredDataList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };





  const filterContent = (
  
  <TableListViewFilter
    districtData={districtDropList}
    blockDropList={blockDropList}
    psStnDropList={psStnDropList}
    GM_DropList={GM_DropList}
    fetchBlockdownOption={fetchBlockdownOption}
    fetchPoliceStnOption={fetchPoliceStnOption}
    fetch_GM_Option={fetch_GM_Option}
    getSubmitData={(value) => {
      getSubmitData(value)
    }}
    resetBtn={() => {
      fetchTableDataList_Fn()
    }}
  />
);

const getSubmitData = async (value)=>{
  
  const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    formData.append("dist_id", value?.dis == '' ? 0 : value?.dis);
    formData.append("block_id", value?.block == '' ? 0 : value?.block);
    formData.append("ps_id", value?.ps_id == '' ? 0 : value?.ps_id);
    formData.append("gp_id", value?.gp_id == '' ? 0 : value?.gp_id);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

        try {
      const response = await axios.post(url + 'index.php/webApi/Report/proj_dtls_dist_block_ps_gp', formData, {
        headers: { 'auth_key': auth_key,
          'Authorization': `Bearer ` + tokenValue?.token
         },
      
      });

      if(response?.data?.status > 0) {
      setLoading(false);
      setTableDataList(response?.data?.message);
      setFilteredDataList(response?.data?.message);
      // setPageName('AdApView');
      console.log(response?.data?.message, 'hhhhhhhhhh');
      
      }

      if(response?.data?.status < 1) {
        setLoading(false);
        setTableDataList([]);
        setFilteredDataList([]);
      }
      

    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);

      localStorage.removeItem("user_dt");
      navigate('/')
      
    }

}

  return (
    <section className="bg-slate-200 dark:bg-gray-900 p-3 sm:p-5">
      <div className="mx-auto max-w-screen-xl">
        <Spin
          indicator={<LoadingOutlined spin />}
          size="large"
          className="text-gray-500 dark:text-gray-400"
          spinning={loading}
        >
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col bg-blue-900 md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              <h2 className="text-xl font-bold text-white">Administrative Approval</h2>

              <div className="w-full md:w-1/2">
                <label htmlFor="simple-search" className="sr-only">Search</label>
                <div className="relative w-full">
                  <input
                    type="text"
                    id="simple-search"
                    className="bg-blue-950 border border-blue-900 text-white text-sm rounded-lg block w-full pl-10 p-2"
                    placeholder="Search by Project ID or Scheme Name"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>

              {/* <BtnComp bgColor="bg-white" color="text-blue-900" title="Filter" onClick={() => setIsFilterModalOpen(true)} /> */}
              <Popover
              content={filterContent}
              title="Filter Projects"
              trigger="click"
              placement="bottomRight"
              >
              <Button type="default" bgColor="bg-white" color="text-blue-900" className='filter_btn'>Filter</Button>
              </Popover>

              {userDataLocalStore.user_type != 'A' &&(
              <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                <BtnComp bgColor="bg-white" color="text-blue-900" title="Add Project" onClick={() => { navigate('AdApcrud/0'); }} />
              </div>
              )}
              
            </div>

            <div className="overflow-x-auto">
            
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <TableHeader curentPage={pageName} />
                
                <tbody>
                  {/* {JSON.stringify(filteredDataList[0] , null, 2)} */}
                  {currentTableData?.map((data, index) => (
                    <TableRow key={index} data={data} curentPage={pageName} navigate={navigate} fetchTableDataList_Fn={fetchTableDataList_Fn} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between p-4">
              <span className="text-sm text-gray-500">
                Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredDataList.length)} of {filteredDataList.length}
              </span>
              <div className="flex space-x-2 pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </Spin>
      </div>




    </section>
  );
}

export default AdApView;
