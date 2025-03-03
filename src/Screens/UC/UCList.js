import React, { useEffect, useState } from 'react'
import BtnComp from '../../Components/BtnComp'
import { useNavigate } from 'react-router-dom'
import { auth_key, url, folder_certificate } from '../../Assets/Addresses/BaseUrl';
import axios from 'axios';
import { EditOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useParams } from "react-router"



function UCList() {
  const navigate = useNavigate()
  const [tableDataList, setTableDataList] = useState(() => []);
  const params = useParams()
  const [OPERATION_STATUS, setOPERATION_STATUS] = useState('');

  const fetchTableDataList_Fn = async () => {

    const cread = {
        fin_year: '0',
    }
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Utilization/utlization_list', cread, // Empty body
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      console.log("Response Data Table:", response.data); // Log the actual response data
      setTableDataList(response.data.message)
      setOPERATION_STATUS(response.data.OPERATION_STATUS);
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly

    }
  };

  useEffect(()=>{
    console.log(params, 'paramsparamsparamsparams');
    
    fetchTableDataList_Fn()
  }, [])


  return (
    <section class="bg-slate-200 dark:bg-gray-900 p-3 sm:p-5">
    <div class="mx-auto max-w-screen-xl  ">
       
        <div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div class="flex flex-col bg-blue-900 md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
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
                   {/* <BtnComp bgColor={'bg-white'} color="text-blue-900" title="Add Document" onClick={()=>{navigate('AdApcrud/0')}}/> */}
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-slate-200 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            {/* <th scope="col" class="px-4 py-3">Sl.No.</th> */}
                            <th scope="col" class="px-4 py-3">Issued By </th>
                            <th scope="col" class="px-4 py-3">Issued To</th>
                            <th scope="col" class="px-4 py-3">Certificate Date</th>
                            <th scope="col" class="px-4 py-3">Utilization Certificate</th>
                            <th scope="col" class="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    
                    {tableDataList?.map((data, index) => ( 
                    <>
                    <tr class="border-b dark:border-gray-700">
                    {/* <td scope="row" class="px-4 py-3">{data?.sl_no}</td>   */}
                    <td scope="row" class="px-4 py-3">{data?.issued_by}</td> 
                    <td scope="row" class="px-4 py-3">{data?.issued_to}</td> 
                    <td scope="row" class="px-4 py-3">{data?.certificate_date}</td> 
                    <td scope="row" class="px-4 py-3"><a href={url + folder_certificate + data?.certificate_path} target='_blank'>
                        <FilePdfOutlined style={{fontSize:22, color:'red'}} /></a></td>

                    <td scope="row" class="px-4 py-3">
                        <button type="button" class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 
                        focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center 
                        me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 
                        dark:focus:ring-blue-800"
                        onClick={() => {
                        navigate(`/home/uc/uclistedit/${data?.approval_no}`, {
                        state: {
                        ...data, // Spread existing rowData
                        operation_status: OPERATION_STATUS, // Explicitly include approval_status
                        certificate_no: data?.certificate_no
                        },
                        });

                        }}
                        > <EditOutlined /> </button></td>
                    </tr>
                    </>
                    ))}

                       
                       
                    </tbody>
                </table>
            </div>
            <nav class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4" aria-label="Table navigation">
                <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                    Showing
                    <span class="font-semibold text-gray-900 dark:text-white">1-10</span>
                    of
                    <span class="font-semibold text-gray-900 dark:text-white">1000</span>
                </span>
                <ul class="inline-flex items-stretch -space-x-px">
                    <li>
                        <a href="#" class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                            <span class="sr-only">Previous</span>
                            <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
                    </li>
                    <li>
                        <a href="#" aria-current="page" class="flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">...</a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">100</a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                            <span class="sr-only">Next</span>
                            <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                            </svg>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
    </section>
  )
}

export default UCList
