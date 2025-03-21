import React, { useEffect, useState } from 'react'
import BtnComp from '../../Components/BtnComp'
import { useNavigate } from 'react-router-dom'
import { auth_key, url } from '../../Assets/Addresses/BaseUrl';
import axios from 'axios';
import { EditOutlined, EyeOutlined, FilePdfOutlined, LoadingOutlined } from '@ant-design/icons';
import { useParams } from "react-router"
import { Spin } from 'antd';

function TFView() {
  const navigate = useNavigate();
  const [tableDataList, setTableDataList] = useState([]);
  const [folderName, setFolderName] = useState('');
  const params = useParams();
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTableDataList_Fn = async () => {
    setLoading(true);
    const cread = {
        fin_year: '0',
    };
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Tender/tender_list', cread,
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      if (response?.data?.status > 0) {
        setTableDataList(response.data.message);
        setFolderName(response.data.folder_name);
      } else {
        setTableDataList([]);
        setFolderName('');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTableDataList_Fn();
  }, []);

  // **Search Filter Logic**
  const filteredTableData = tableDataList.filter((data) =>
    data.project_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    data.scheme_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTableData.length / rowsPerPage);
  const currentTableData = filteredTableData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

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
              <h2 className='text-xl font-bold text-white'>Tender List</h2>
              <div className="w-full md:w-1/2">
                <label htmlFor="simple-search" className="sr-only">Search</label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="simple-search"
                    className="bg-blue-950 border border-blue-900 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Search by Project ID or Scheme Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                <BtnComp bgColor="bg-white" color="text-blue-900" title="Add Tender" onClick={() => {
                  navigate('tfcrud/0', {
                    state: { operation_status: 'add' },
                  });
                }} />
              </div>
            </div>
            
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
                      <td scope="row" className="px-4 py-3">
                        <button type="button" className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 
                          focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center 
                          me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 
                          dark:focus:ring-blue-800"
                          onClick={() => {
                            navigate(`/home/tender_formality/tfcrud/${data?.approval_no}`, {
                              state: { ...data, operation_status: 'edit' },
                            });
                          }}
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
                Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredTableData.length)} of {filteredTableData.length}
              </span>
              <div className="flex space-x-2 pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button key={index} className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => handlePageChange(index + 1)}>
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

export default TFView;
