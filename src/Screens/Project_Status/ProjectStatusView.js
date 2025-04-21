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
import Radiobtn from '../../Components/Radiobtn';


// var date_ofCompletion = new Date('2025-04-08');

const options = [
	{
		label: "Project Completed & PCR Generated",
		value: "3",
	},
	{
		label: "Project Not Completed",
		value: "1",
	},
	{
		label: "Project Completed PCR not yet Generated",
		value: "2", 
	}
	
]


function ProjectStatusView() {
  const navigate = useNavigate()
  const [tableDataList, setTableDataList] = useState([]);
  const [folderName, setFolderName] = useState('');
  const params = useParams();
  const [OPERATION_STATUS, setOPERATION_STATUS] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [pageName, setPageName] = useState('');
  const [radioType, setRadioType] = useState('')
  const [projectNotCompleted, setProjectNotCompleted] = useState(false)

  const fetchTableDataList_Fn = async () => {
    setLoading(true);
    const cread = { fin_year: '0' };
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Tender/prog_ls', 
        cread, 
        { headers: { 'auth_key': auth_key } }
      );

      console.log("prog_ls response:", response.data);

      if (response?.data?.status > 0) {
        setTableDataList(response.data.message);
        setFolderName(response.data.folder_name);
        setOPERATION_STATUS(response.data.OPERATION_STATUS);
        setPageName('ProjectStatusView');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  
  const fetchTableDataList_BYRADIO = async (radioType) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("report_type", radioType);
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Report/projetc_status_list', 
        formData, 
        { headers: { 'auth_key': auth_key } }
      );

      console.log(formData, "prog_ls response:", response.data.message);

      if (response?.data?.status > 0) {
        setTableDataList(response.data.message);
        setFolderName(response.data.folder_name);
        setOPERATION_STATUS(response.data.OPERATION_STATUS);
        setPageName('ProjectStatusView');
      }

      if (response?.data?.status < 1) {
        setTableDataList([]);
        setFolderName('');
        setOPERATION_STATUS('');
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

  // useEffect(() => {
  //   fetchTableDataList_BYRADIO(radioType);
  //   console.log('fetchTableDataList_BYRADIO', radioType);
    
  // }, [radioType]);

  // Filter table data based on search query
  const filteredTableData = tableDataList.filter((data) =>
    data.project_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    data.scheme_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTableData.length / rowsPerPage);
  const currentTableData = filteredTableData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const onChange = (e) => {
    if(e === '1'){
      setProjectNotCompleted(true)
    } else if(e === '2'){
      setProjectNotCompleted(true)
    } else {
      setProjectNotCompleted(false)
    }
    setRadioType(e)
    fetchTableDataList_BYRADIO(e)
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
              <h2 className='text-xl font-bold text-white'>Progress Status</h2>
              {/* <div className="w-full md:w-1/2">
                <label htmlFor="search-input" className="sr-only">Search</label>
                <div className="relative w-full">
                
                  <input 
                    type="text" 
                    id="search-input" 
                    className="bg-blue-950 border border-blue-900 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2"
                    placeholder="Search by Project ID or Scheme Name" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div> */}


              <div className="w-full md:w-1/5">
                <div className="relative w-full">
                <input 
                    type="text" 
                    id="search-input" 
                    className="bg-blue-950 border border-blue-900 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-3 p-2"
                    placeholder="Search by Project ID" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full md:w-auto flex flex-col md:flex-row items-stretch md:items-center justify-end projectStatus">
              <Radiobtn
          data={options}
          val={radioType}
          onChangeVal={(value) => {
          onChange(value)
          }}
          />
              </div>

            </div>
            {/* {JSON.stringify(currentTableData, null, 2)} */}

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <TableHeader curentPage={pageName} projectNotCompleted={projectNotCompleted} />
                
                <tbody>
                  {currentTableData.map((data, index) => (
                    <TableRow key={index} data={data} curentPage={pageName} navigate={navigate} projectNotCompleted={projectNotCompleted} />
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between p-4">
              <span className="text-sm text-gray-500">
                Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredTableData.length)} of {filteredTableData.length}
              </span>
              <div className="flex space-x-2">
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

export default ProjectStatusView;
