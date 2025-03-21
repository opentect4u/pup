import React, { useEffect, useState } from 'react';
import BtnComp from '../../Components/BtnComp';
import { useNavigate } from 'react-router-dom';
import { auth_key, url } from '../../Assets/Addresses/BaseUrl';
import axios from 'axios';
import { EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import { useParams } from "react-router";
import { Spin } from 'antd';

function FundRelView() {
  const navigate = useNavigate();
  const [tableDataList, setTableDataList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [folderName, setFolderName] = useState('');
  const params = useParams();
  const [OPERATION_STATUS, setOPERATION_STATUS] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const fetchTableDataList_Fn = async () => {
    setLoading(true);
    const cread = { fin_year: '0' };

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Fund/fund_list',
        cread,
        { headers: { 'auth_key': auth_key } }
      );

      console.log("Response Data Table:____", response?.data);

      if (response?.data?.status > 0) {
        setTableDataList(response?.data?.message);
        setFilteredData(response?.data?.message);
        setFolderName(response?.data?.folder_name);
        setOPERATION_STATUS(response?.data?.OPERATION_STATUS);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableDataList_Fn();
  }, []);

  // Handle search input change
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    
    const filtered = tableDataList.filter(
      (item) =>
        item?.project_id?.toString().toLowerCase().includes(query)||
        item?.scheme_name?.toLowerCase().includes(query)
    );
    
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentTableData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <section className="bg-slate-200 dark:bg-gray-900 p-3 sm:p-5">
      <div className="mx-auto max-w-screen-xl">
        <Spin indicator={<LoadingOutlined spin />} size="large" spinning={loading}>
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col bg-blue-900 md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              <h2 className='text-xl font-semibold text-white'>Fund List </h2>
              <div className="w-full md:w-1/2">
                <input
                  type="text"
                  id="simple-search"
                  className="bg-blue-950 border border-blue-900 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-3 p-2"
                  placeholder="Search by Project ID or Scheme Name"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                <BtnComp bgColor={'bg-white'} color="text-blue-900" title="Add Fund" onClick={() => navigate('frcrud/0')} />
              </div>
            </div>
            {/* {JSON.stringify(currentTableData, null, 2)} */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-slate-200 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3">Project ID</th>
                    <th className="px-4 py-3">Schematic Name</th>
                    <th className="px-4 py-3">Sector Name</th>
                    <th className="px-4 py-3">Financial Year</th>
                    <th className="px-4 py-3">District</th>
                    <th className="px-4 py-3">Block</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTableData.map((data, index) => (
                    <tr key={index} className="border-b dark:border-gray-700">
                      <td className="px-4 py-3">{data?.project_id}</td>
                      <td className="px-4 py-3">{data?.scheme_name}</td>
                      <td className="px-4 py-3">{data?.sector_name}</td>
                      <td className="px-4 py-3">{data?.fin_year}</td>
                      <td className="px-4 py-3">{data?.dist_name}</td>
                      <td className="px-4 py-3">{data?.block_name}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 
                            focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5"
                          onClick={() => navigate(`/home/fund_release/frcrud/${data?.approval_no}`, {
                            state: {
                              ...data,
                              operation_status: 'edit',
                            },
                          })}
                        >
                          <EyeOutlined />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between p-4">
              <span className="text-sm text-gray-500">
                Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length}
              </span>
              <div className="flex space-x-2 pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setCurrentPage(index + 1)}
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

export default FundRelView;
