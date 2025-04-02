import React, { useEffect, useState } from 'react';
import BtnComp from '../../Components/BtnComp';
import { useNavigate } from 'react-router-dom';
import { auth_key, url } from '../../Assets/Addresses/BaseUrl';
import axios from 'axios';
import { EditOutlined, EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import { useParams } from "react-router";
import { Spin } from 'antd';
import TableHeader from '../../Components/TableHeader';
import TableRow from '../../Components/TableRow';

function AdApView() {
  const navigate = useNavigate();
  const [tableDataList, setTableDataList] = useState([]);
  
  const params = useParams();
  const [loading, setLoading] = useState(false);
  
  const [filteredDataList, setFilteredDataList] = useState([]); //searched data
  const [searchTerm, setSearchTerm] = useState("");  //searched data

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [pageName, setPageName] = useState('');

  const fetchTableDataList_Fn = async () => {
    setLoading(true);
    const cread = {
      project_id: '0',
      fin_year: '0',
      dist_id: '0',
    };
    try {
      const response = await axios.post(url + 'index.php/webApi/Admapi/adm_approv_list', cread, {
        headers: { 'auth_key': auth_key },
      });

      if(response?.data?.status > 0) {
      setLoading(false);
      console.log("Response Data Table:", response?.data?.status);
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
    }
  };

  useEffect(() => {
    console.log(params, 'params');
    fetchTableDataList_Fn();
  }, []);

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

              <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                <BtnComp bgColor="bg-white" color="text-blue-900" title="Add Project" onClick={() => { navigate('AdApcrud/0'); }} />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <TableHeader curentPage={pageName} />
                
                <tbody>
                  {currentTableData?.map((data, index) => (
                    <TableRow key={index} data={data} curentPage={pageName} navigate={navigate} />
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
