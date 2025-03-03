import React, { useEffect, useState } from 'react'
import BtnComp from '../../Components/BtnComp'
import { useNavigate } from 'react-router-dom'
import { auth_key, url, folder_certificate } from '../../Assets/Addresses/BaseUrl';
import axios from 'axios';
import { EditOutlined, FilePdfOutlined, LoadingOutlined } from '@ant-design/icons';
import { useParams } from "react-router"
import { Spin } from 'antd';

function UCList() {
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
      setTableDataList(response.data.message)
      setOPERATION_STATUS(response.data.OPERATION_STATUS);
      setLoading(false);
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
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-slate-200">
                <tr>
                  <th className="px-4 py-3">Issued By</th>
                  <th className="px-4 py-3">Issued To</th>
                  <th className="px-4 py-3">Certificate Date</th>
                  <th className="px-4 py-3">Utilization Certificate</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTableData.map((data, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-3">{data?.issued_by}</td>
                    <td className="px-4 py-3">{data?.issued_to}</td>
                    <td className="px-4 py-3">{data?.certificate_date}</td>
                    <td className="px-4 py-3">
                      <a href={url + folder_certificate + data?.certificate_path} target='_blank'>
                        <FilePdfOutlined style={{ fontSize: 22, color: 'red' }} />
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <button type="button" className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 
                      font-medium rounded-lg text-sm px-3 py-1.5"
                        onClick={() => navigate(`/home/uc/uclistedit/${data?.approval_no}`, {
                          state: { ...data, operation_status: OPERATION_STATUS }
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

export default UCList;
