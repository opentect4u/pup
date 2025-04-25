import React, { useEffect, useState } from 'react';
import BtnComp from '../../Components/BtnComp';
import { useNavigate } from 'react-router-dom';
import { auth_key, url } from '../../Assets/Addresses/BaseUrl';
import axios from 'axios';
import { EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import TableHeader from '../../Components/TableHeader';
import TableRow from '../../Components/TableRow';
// import TableHeader from './TableHeader';
// import TableRow from './TableRow';

function FundRelView() {
  const navigate = useNavigate();
  const [tableDataList, setTableDataList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [pageName, setPageName] = useState('');

  const fetchTableDataList_Fn = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Fund/fund_list',
        { fin_year: '0' },
        { headers: { 'auth_key': auth_key } }
      );

      if (response?.data?.status > 0) {
        setTableDataList(response?.data?.message);
        setFilteredData(response?.data?.message);
        setPageName('FundRelView');
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

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredData(
      tableDataList.filter(
        (item) =>
          item?.project_id?.toString().toLowerCase().includes(query) ||
          item?.scheme_name?.toLowerCase().includes(query)
      )
    );
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentTableData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <section className="bg-slate-200 dark:bg-gray-900 p-3 sm:p-5">
      <div className="mx-auto max-w-screen-xl">
        <Spin indicator={<LoadingOutlined spin />} size="large" spinning={loading}>
          <div className="bg-white dark:bg-gray-800 shadow-md sm:rounded-lg overflow-hidden">
          <div className="flex flex-col bg-blue-900 md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              <h2 className='text-xl font-semibold text-white'>Fund List</h2>
              <div className="w-full md:w-1/2">
              <input
                type="text"
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
            <div className="overflow-x-auto">
            {/* {JSON.stringify(currentTableData, null, 2)} */}
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <TableHeader curentPage={pageName} />
                <tbody>
                  {currentTableData.map((data, index) => (
                    <TableRow key={index} data={data} curentPage={pageName} navigate={navigate} fetchTableDataList_Fn={fetchTableDataList_Fn}/>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between p-4">
              <span className="text-sm text-gray-500">
                Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length}
              </span>
              <div className="flex space-x-2">
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
