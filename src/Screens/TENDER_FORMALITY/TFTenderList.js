import React, { useEffect, useState } from 'react'
import BtnComp from '../../Components/BtnComp'
import { useNavigate } from 'react-router-dom'
import { auth_key, url } from '../../Assets/Addresses/BaseUrl';
import axios from 'axios';
import { EditOutlined, FilePdfOutlined, LoadingOutlined } from '@ant-design/icons';
import { useParams } from "react-router"
import { Spin } from 'antd';



function TFTenderList() {
  const navigate = useNavigate()
  const [tableDataList, setTableDataList] = useState(() => []);
  const [folderName, setFolderName] = useState('');
  const params = useParams()
  const [OPERATION_STATUS, setOPERATION_STATUS] = useState('');
  const [loading, setLoading] = useState(false)

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const fetchTableDataList_Fn = async () => {
    setLoading(true);
    const cread = {
        fin_year: '0',
    }
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Tender/tender_list', cread, // Empty body
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      console.log("Response Data Table:", response.data); // Log the actual response data
      setTableDataList(response.data.message)
      setFolderName(response.data.folder_name)
      setOPERATION_STATUS(response.data.OPERATION_STATUS);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error); // Handle errors properly

    }
  };

  useEffect(()=>{
    console.log(params, 'paramsparamsparamsparams');
    
    fetchTableDataList_Fn()
  }, [])

  const totalPages = Math.ceil(tableDataList.length / rowsPerPage);
  const currentTableData = tableDataList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  }


  return (
    <section class="bg-slate-200 dark:bg-gray-900 p-3 sm:p-5">
    <div class="mx-auto max-w-screen-xl  ">
    <Spin
						indicator={<LoadingOutlined spin />}
						size="large"
						className="text-gray-500 dark:text-gray-400"
						spinning={loading}
					>
        <div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div class="flex flex-col bg-blue-900 md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <h2 className='text-xl font-bold text-white'>Tender List</h2>
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
                   {/* <BtnComp bgColor={'bg-white'} color="text-blue-900" title="Add Document" onClick={()=>{navigate('AdApcrud/0')}}/> */}
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-slate-200 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-4 py-3">Sl.No.</th>
                            <th scope="col" class="px-4 py-3">Tender Inviting Authority </th>
                            <th scope="col" class="px-4 py-3">Tender Date</th>
                            <th scope="col" class="px-4 py-3">Tender Matured On</th>
                            <th scope="col" class="px-4 py-3">Tender Notice</th>
                            <th scope="col" class="px-4 py-3">Work Order Copy</th>
                            <th scope="col" class="px-4 py-3">Work Order Value</th>
                            {/* <th scope="col" class="px-4 py-3">Head Account</th>
                            <th scope="col" class="px-4 py-3">Total Amount</th> */}
                            <th scope="col" class="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    
                    {currentTableData?.map((data, index) => ( 
                    <>
                    <tr class="border-b dark:border-gray-700">
                    <td scope="row" class="px-4 py-3">{data?.sl_no}</td>  
                    <td scope="row" class="px-4 py-3">{data?.invite_auth}</td> 
                    <td scope="row" class="px-4 py-3">{data?.tender_date}</td>
                    <td scope="row" class="px-4 py-3">{data?.mat_date}</td>
                    <td scope="row" class="px-4 py-3"><a href={url + folderName + data?.tender_notice} target='_blank'>
                        <FilePdfOutlined style={{fontSize:22, color:'red'}} /></a></td>
                    <td scope="row" class="px-4 py-3"><a href={url + folderName + data?.wo_copy} target='_blank'>
                        <FilePdfOutlined style={{fontSize:22, color:'red'}} /></a></td>
                    <td scope="row" class="px-4 py-3">{data?.wo_value}</td>
                    <td scope="row" class="px-4 py-3">
                        <button type="button" class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 
                        focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center 
                        me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 
                        dark:focus:ring-blue-800"
                        onClick={() => {
                        navigate(`/home/tender_formality/tfcrud/${data?.approval_no}`, {
                        state: {
                        ...data, // Spread existing rowData
                        operation_status: OPERATION_STATUS, // Explicitly include approval_status
                        sl_no: data?.sl_no
                        },
                        });

                        }}
                        > <EditOutlined /> </button>
                    </td>
                    </tr>
                    </>
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

export default TFTenderList
