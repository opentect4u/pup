import React, { useEffect, useState } from 'react'
import BtnComp from '../../Components/BtnComp'
import { useNavigate } from 'react-router-dom'
import { auth_key, url } from '../../Assets/Addresses/BaseUrl';
import axios from 'axios';
import { EditOutlined, EyeOutlined, FilePdfOutlined, LoadingOutlined } from '@ant-design/icons';
import { useParams } from "react-router"
import { Spin } from 'antd';
import TableHeader from '../../Components/TableHeader';
import TableRow from '../../Components/TableRow';

function FundExpView() {
  const navigate = useNavigate();
  const [tableDataList, setTableDataList] = useState([]);
  const [folderName, setFolderName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [OPERATION_STATUS, setOPERATION_STATUS] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [pageName, setPageName] = useState('');

  const fetchTableDataList_Fn = async () => {
    setLoading(true);
    const cread = { fin_year: '0' };

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Expense/expense_list',
        cread,
        { headers: { 'auth_key': auth_key } }
      );

      if (response?.data?.status > 0) {
        setTableDataList(response.data.message);
        setFolderName(response.data.folder_name);
        setOPERATION_STATUS(response.data.OPERATION_STATUS);
        setPageName('FundExpView');
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

  // Filtered data based on search input
  const filteredData = tableDataList.filter(
    (data) =>
      data.project_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      data.scheme_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentTableData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <section className="bg-slate-200 dark:bg-gray-900 p-3 sm:p-5">
      <div className="mx-auto max-w-screen-xl">
        <Spin indicator={<LoadingOutlined spin />} size="large" spinning={loading}>
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col bg-blue-900 md:flex-row items-center justify-between p-4">
              <h2 className="text-xl font-bold text-white">Expenditure List</h2>
              <div class="w-full md:w-1/2">
                <input
                  type="text"
                  className="bg-blue-950 border border-blue-900 text-white text-sm rounded-lg focus:ring-primary-500 block w-full pl-10 p-2"
                  placeholder="Search by Project ID or Scheme Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
             <div class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                                <BtnComp bgColor={'bg-white'} color="text-blue-900" title="Add Expenditure" onClick={()=>{navigate('fecrud/0')}}/>
                             </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <TableHeader curentPage={pageName} />
                
                <tbody>
                  {currentTableData.map((data, index) => (
                    <TableRow key={index} data={data} curentPage={pageName} navigate={navigate} />
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

export default FundExpView;
