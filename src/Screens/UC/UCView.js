import React, { useEffect, useState } from 'react'
import BtnComp from '../../Components/BtnComp'
import { useNavigate } from 'react-router-dom'
import { auth_key, url, folder_certificate } from '../../Assets/Addresses/BaseUrl';
import axios from 'axios';
import { EditOutlined, FilePdfOutlined, LoadingOutlined } from '@ant-design/icons';
import { useParams } from "react-router"
import { Spin } from 'antd';

function UCView() {
  const navigate = useNavigate()
  const [tableDataList, setTableDataList] = useState([]);
  const params = useParams()
  const [OPERATION_STATUS, setOPERATION_STATUS] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [loading, setLoading] = useState(false);

  const fetchTableDataList_Fn = async () => {
    setLoading(true);
    const cread = {
        fin_year: '0',
    }
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Utilization/utlization_list', cread, 
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      console.log(response?.data, 'hhhhhhhhhhhhhhh');
      

      if(response?.data?.status > 0){
      setTableDataList(response?.data?.message)
      setOPERATION_STATUS(response.data.OPERATION_STATUS);
      setLoading(false);
      }

      if(response?.data?.status < 1){
        setLoading(false);
      }
      console.log(response.data, 'response');
      
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(()=>{
    fetchTableDataList_Fn()
  }, [])

  const totalPages = Math.ceil(tableDataList.length / rowsPerPage);
  const currentTableData = tableDataList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
          <div className="flex flex-col bg-blue-900 md:flex-row items-center justify-between p-4">
            <h2 className='text-xl font-bold text-white'>Utilization Certificate List</h2>

            <div class="w-full md:w-1/2">
                      
                        <label for="simple-search" class="sr-only">Search</label>
                        <div class="relative w-full">
                            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <input type="text" id="simple-search" class="bg-blue-950 border border-blue-900 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Search" required=""/>
                        </div>
                </div>
                <div class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                   <BtnComp bgColor={'bg-white'} color="text-blue-900" title="Add Utilization Certificate" onClick={()=>{navigate('uccrud/0')}}/>
                </div>

          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-slate-200">
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
                {currentTableData?.map((data, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-3">{data?.project_id}</td>
                    <td className="px-4 py-3">{data?.scheme_name}</td>
                    <td className="px-4 py-3">{data?.sector_name}</td>
                    <td className="px-4 py-3">{data?.fin_year}</td>
                    <td className="px-4 py-3">{data?.dist_name}</td>
                    <td className="px-4 py-3">{data?.block_name}</td>
                    {/* <td className="px-4 py-3">
                      <a href={url + folder_certificate + data?.certificate_path} target='_blank'>
                        <FilePdfOutlined style={{ fontSize: 22, color: 'red' }} />
                      </a>
                    </td> */}
                    <td className="px-4 py-3">
                      <button type="button" className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 
                      font-medium rounded-lg text-sm px-3 py-1.5"
                        // onClick={() => navigate(`/home/uc/uclistedit/${data?.approval_no}`, {
                        //   state: { ...data, operation_status: OPERATION_STATUS }
                        // })}

                        onClick={() => navigate(`/home/uc/uccrud/${data?.approval_no}`, {
                          state: { ...data, operation_status: 'edit' }
                        })}
                      >
                        <EditOutlined />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between p-4">
            <span className="text-sm text-gray-500">
              Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, tableDataList.length)} of {tableDataList.length}
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
  )
}

export default UCView;
