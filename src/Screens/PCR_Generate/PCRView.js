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
import { getPrintCommonHeader_PCR } from '../../Components/PrintCommonHeader_PCR';
import { toWords } from 'number-to-words';
import { Message } from '../../Components/Message';


// const initialValues = {
//   admin_appr_pdf: '',
// };

// const validationSchema = Yup.object({
//   admin_appr_pdf: Yup.string().required('Administrative Approval(G.O) is Required'),
// });

function PCRView() {
  const navigate = useNavigate();
  const [tableDataList, setTableDataList] = useState([]);
  const [folderName, setFolderName] = useState('');
  const params = useParams();
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState('');
  const [pageName, setPageName] = useState('');
  const [printOutDataState, setPrintOutDataState] = useState([]);
  const [userDataLocalStore, setUserDataLocalStore] = useState([]);
  const [PDFfolder_name, setPDFfolder_name] = useState('');


  const fetchTableDataList_Fn = async () => {
    setLoading(true);
    const cread = {
        fin_year: '0',
    };
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Utilization/projCompCertilist', cread,
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      if (response?.data?.status > 0) {

        setTableDataList(response?.data?.message);
        setPDFfolder_name(response?.data?.folder_name)
        // setFolderName(response.data.folder_name);
        setPageName('PCRView');
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


  

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };


  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [errorpdf_1, setErrorpdf_1] = useState("");

  const [fileStates, setFileStates] = useState({});

 

    useEffect(() => {
    const userData = localStorage.getItem("user_dt");
    if (userData) {
    setUserDataLocalStore(JSON.parse(userData))
    } else {
    setUserDataLocalStore([])
    }
  
    }, []);

  const handleFileChange_pdf_1 = (event, approval_no) => {
    const selectedFile = event.target.files[0];
  
    if (selectedFile) {
      const fileSizeMB = selectedFile.size / (1024 * 1024);
      const fileType = selectedFile.type;
  
      let error = "";
      let preview = null;
  
      // Validate file type
      if (fileType !== "application/pdf") {
        error = "Only PDF files are allowed.";
      } else if (fileSizeMB > 2) {
        error = "File size should not exceed 2MB.";
      } else {
        preview = URL.createObjectURL(selectedFile);
      }


  
      setFileStates(prev => ({
        ...prev,
        [approval_no]: {
          file: error ? null : selectedFile,
          preview,
          error
        }
      }));
    }
  };

  const handleUpload = async (approval_no) => {
    setLoading(true);
    const rowData = fileStates[approval_no];
  
    if (!rowData || !rowData.file) {
      return alert("No file selected!");
    }
    
    const formData = new FormData();
    formData.append("approval_no", approval_no);
    formData.append("pcr_certificate", rowData.file);
    formData.append("upload_by", userDataLocalStore.user_id);

    try {
          const response = await axios.post(
            `${url}index.php/webApi/Utilization/pcrUpload`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                'auth_key': auth_key // Important for FormData
              },
            }
          );
          setLoading(false);
          Message("success", "Upload PDF successfully.");
          fetchTableDataList_Fn()

        } catch (error) {
          setLoading(false);
          Message("error", "Not Uploading PDF");
          console.error("Error submitting form:", error);
        }
    
  };


  

  const printData = async (approval_no) => {

    setLoading(true); // Set loading state
    
        const formData = new FormData();
    
        formData.append("approval_no", approval_no);
    
        try {
          const response = await axios.post(
            url + 'index.php/webApi/Utilization/projCompCertiSingledata',
            formData,
            {
              headers: {
                'auth_key': auth_key,
              },
            }
          );
          
          if (response?.data.status > 0) {
            setLoading(false);
            setPrintOutDataState(response?.data?.message)
            printData_out(response?.data?.message)
    
          }
    
          if (response?.data.status < 1) {
            setLoading(false);
            setPrintOutDataState([])
          }
    
        } catch (error) {
          setLoading(false);
          console.error("Error fetching data:", error); // Handle errors properly
        }

    
};

const printData_out = (printOutData) => {
  const printWindow = window.open("", "_blank", "width=800,height=600");
  printWindow.document.write(`
    <html>
    <head>
      <title>Completion Certificate (Contractor Name:${printOutData.contractor_name_dtls})</title>
      <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
          }
        .container {
          max-width: 800px;
          margin: auto;
          padding:15px;
          border: none;
        }
        .header {
          border-bottom: #000 solid 2px;
          display: inline-block;
          width: 100%;
          padding-bottom: 7px; margin: 0 0 15px 0;
        }
        .1stTd{width:30%;}
        .2ndTh{width:70%;}

        .1stTd_sign{width:50%; text-align: center;}
        .2ndTh_sign{width:50%; text-align: center;}

        .1stTd_sub{width:40%;}
        .2ndTh_sub{width:60%;}
        
        .details-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .details-table th, .details-table td {
          border: none;
          padding: 5px 5px 5px 5px;
          text-align: left;
        }

        .details-table_sign {
          width: 100%;
          border-collapse: collapse;
          margin-top: 30px; margin-bottom: 30px;
          border: none;
        }
        .details-table_sign th, .details-table_sign td {
          border: none;
          padding: 5px 5px 5px 5px;
          text-align: center;
        }

        .sub_table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 0;
          border: none;
        }
        
        .sub_table tbody td {
          border: none;
          padding: 0 !important;
          text-align: left;
          width: 40%;
        }

        .sub_table tbody td {
          border: none;
          padding: 0 !important;
          text-align: left;
          width: 60%;
        }

        .footer {
          margin-top: 30px;
          text-align: center;
          font-weight: bold;
        }
          span.bold{font-weight: 700;}

        .logo{text-align: center; padding: 0 0 10px 0;}
        .logo img{width:80px;}
        h3{text-align: center; font-size: 14px; font-weight: 700; padding: 0 0 5px 0; margin: 0; line-height: 15px;}
        h2{text-align: center; font-size: 14px; font-weight: 700; padding: 0 0 5px 0; margin: 0; line-height: 15px;}
        p{text-align: center; font-size: 12px; font-weight: 400; padding: 0 0 5px 0; margin: 0; line-height: 15px;}
        p span.left{float:left;}
        p span.right{float:right;}
        h3.comple_title{text-align: center; font-size: 14px; font-weight: 600; padding: 0 0 5px 0; margin:0; line-height: 15px; text-decoration: underline;}
        p.comple_text{text-align: justify; font-size: 12px; font-weight: 400; padding: 0 0 15px 0; margin: 0; line-height: 15px;}
        p.comple_text_sub{text-align: left; font-size: 12px; font-weight: 400; padding: 0 0 8px 0; margin: 0; line-height: 15px;}
        
          table {
            border-collapse: collapse;
            width: 100%;
            font-size: 11px;
          }
          th, td {
            border: 1px solid black;
            padding: 3px;
            text-align: left;
            font-size: 11px;
          }
            /* Ensure borders appear in print */
          @media print {
            table, th, td {
              border: 1px solid black;
              font-size: 10px;
            }
            th, td {
            padding: 3px;
          }
            p.disclam{font-size: 10px; padding: 10px 0 5px 0; text-align: center; font-weight: 700;}
            .header {
          border-bottom: #000 solid 2px;
          display: inline-block;
          width: 100%;
          padding-bottom: 7px;
          }
          .1stTd{width:30%;}
          .2ndTh{width:70%;}

          .1stTd_sign{width:50%; text-align: center;}
          .2ndTh_sign{width:50%; text-align: center;}

          
          .1stTd_sub{width:40%;}
          .2ndTh_sub{width:60%;}
          span.bold{font-weight: 700;}

          .sub_table {
          border: none;
          width: 100%;
          border-collapse: collapse;
          margin-top: 0;
        }
        .sub_table tbody td {
          border: none;
          padding: 0 !important;
          text-align: left;
          width: 40%;
        }

        .sub_table tbody td {
          border: none;
          padding: 0 !important;
          text-align: left;
          width: 60%;
        }
        h3.comple_title{text-align: center; font-size: 14px; font-weight: 600; padding: 0 0 5px 0; margin:0; line-height: 15px; text-decoration: underline;}
        p.comple_text{text-align: justify; font-size: 12px; font-weight: 400; padding: 0 0 15px 0; margin: 0; line-height: 15px;}
        p.comple_text_sub{text-align: left; font-size: 12px; font-weight: 400; padding: 0 0 8px 0; margin: 0; line-height: 15px;}
          }
      </style>
    </head>
    <body>
      <div class="container">
        ${getPrintCommonHeader_PCR()}
        <h3 class="comple_title">COMPLETION CERTIFICATE</h3>
        <p class="comple_text">This is to certify that <strong>${printOutData.contractor_name_dtls}</strong> is a working contract of this office. The Contractor 
        was entrusted with the following work which has been completed in all respect during financial year ${printOutData.fin_year}.
        </p>
        <p class="comple_text_sub">The following information are given regarding the above noted work:-</p>
        <table class="details-table">
          <tr><th class="1stTd">1. Name of Work:</th><td class="2ndTh">
          <table class="sub_table">
          <tr><th>${printOutData.scheme_name}</th></tr>
        </table>
        </td></tr>
          <tr><th>2. e-NIT No.:</th><td> 
          <table class="sub_table">
          <tr><th><span class="bold">${printOutData.e_nit_no}</span></th></tr>
        </table>
          </td></tr>
          <tr><th>3. Work Order Details:</th><td>
          <table class="sub_table">
          <tr><th>${printOutData.work_order_dtl}, Dated: ${printOutData.work_order_dt}</th></tr>
        </table>
          </td></tr>
          <tr><th>4. Amount Put to Tender:</th><td><table class="sub_table">
          <tr><th class="1stTd_sub"><span class="bold">₹ ${printOutData.amt_put_totender}</span></th>
          <td class="2ndTh_sub">
          Rupees ${toWords(printOutData.amt_put_totender).charAt(0).toUpperCase() + toWords(printOutData.amt_put_totender).slice(1)} Only
          </td></tr>
        </table>
        </td></tr>
          <tr><th>5. Tendered Amount:</th><td><table class="sub_table">
          <tr><th class="1stTd_sub">₹ ${printOutData.work_order_value}</th><td class="2ndTh_sub">
          Rupees ${toWords(printOutData.work_order_value).charAt(0).toUpperCase() + toWords(printOutData.work_order_value).slice(1)} Only
          </td></tr>
        </table></td></tr>
          <tr><th>6. Stipulated Date of Completion:</th><td>
          <table class="sub_table">
          <tr><th>${printOutData.stipulated_dt_comp}</th></tr>
        </table>
        </td></tr>
          <tr><th>7. Actual Date of Completion (Extend):</th><td>
          <table class="sub_table">
          <tr><th><span class="bold">${printOutData.actual_dt_com}</span></th></tr>
        </table>
          </td></tr>
          <tr><th>8. Gross Value of Work Done (1R/A & Final Bill):</th><td><table class="sub_table">
          <tr><th class="1stTd_sub"><span class="bold">₹ ${printOutData.gross_value}</span></th><td class="2ndTh_sub">
          Rupees ${toWords(printOutData.gross_value).charAt(0).toUpperCase() + toWords(printOutData.gross_value).slice(1)} Only
          </td></tr>
        </table></td></tr>
          <tr><th>9. Final Bill Value (As per contract rate applicable):</th><td><table class="sub_table">
          <tr><th class="1stTd_sub">₹ ${printOutData.final_value}</th><td class="2ndTh_sub">
          Rupees ${toWords(printOutData.final_value).charAt(0).toUpperCase() + toWords(printOutData.final_value).slice(1)} Only
          </td></tr>
        </table></td></tr>
          <tr><th>10. Remarks:</th><td>
          <table class="sub_table">
          <tr><th><span class="bold">${printOutData.remarks}</span></th></tr>
        </table>
        </td></tr>
        </table>
        <div class="footer">
          “We wish every success to the contractor.”
        </div>
        <table class="details-table_sign">
          <tr><th class="1stTd_sign">Assistant Engineer </br> 
          Paschimanchal Unnayan Parshad </br>
          Purulia</th><td class="2ndTh_sign">
          Executive Engineer </br> 
          Paschimanchal Unnayan Parshad </br>
          Bankura
          </td></tr>
        </table>

      </div>
      <script>
        window.print();
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
  // printWindow.print();
};


const download = (page, pdfName)=>{
  alert('down')
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
          {/* {JSON.stringify(printOutDataState, null, 2)} ////
          {JSON.stringify(currentTableData, null, 2)}  */}
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col bg-blue-900 md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              <h2 className='text-xl font-bold text-white'>PCR</h2>
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
                <BtnComp bgColor="bg-white" color="text-blue-900" title="Add PCR" onClick={() => {
                  navigate('pcr-add/0', {
                    state: { operation_status: 'add' },
                  });
                }} />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              
              <TableHeader curentPage={pageName} />
                
                <tbody>
                  {currentTableData.map((data, index) => (
                     <TableRow 
                    //  data={data} 
                    //  curentPage={pageName} 
                    //  navigate={navigate} 
                    //  handleFileChange_pdf_1={handleFileChange_pdf_1} 
                    //  handleChange={handleChange} 
                    //  handleUpload={handleUpload} 
                    //  printData={printData} 
                    //  download={download} 
                    //  filePreview={filePreview}
                    //  errorpdf_1={errorpdf_1}
                    key={data.approval_no}
  index={index}
  data={data}
  curentPage={pageName}
  navigate={navigate}
  handleFileChange_pdf_1={handleFileChange_pdf_1}
  handleChange={handleChange}
  handleUpload={handleUpload}
  printData={printData}
  download={download}
  filePreview={fileStates[data.approval_no]?.preview}
  errorpdf_1={fileStates[data.approval_no]?.error}
  PDFfolder_name={PDFfolder_name}
                     />
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

export default PCRView;
