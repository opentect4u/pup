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
import { getPrintCommonHeader_UC } from '../../Components/PrintCommonHeader_UC';
import { getPrintCommonHeader_Annexure } from '../../Components/PrintCommonHeader_Annexure';
import { getLocalStoreTokenDts } from '../../CommonFunction/getLocalforageTokenDts';


// const initialValues = {
//   admin_appr_pdf: '',
// };

// const validationSchema = Yup.object({
//   admin_appr_pdf: Yup.string().required('Administrative Approval(G.O) is Required'),
// });

function Annex_View() {
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
  const [scematicContiTotal, setScematicContiTotal] = useState('');
  const [printFund_dtls, setPrintFund_dtls] = useState([]);

  const fetchTableDataList_Fn = async () => {
    setLoading(true);
    // approval_no,sl_no
    const tokenValue = await getLocalStoreTokenDts(navigate);
    const formData = new FormData();

    formData.append("sl_no", 0);
    formData.append("approval_no", 0);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token
    
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Utilization/GetannextureData', formData,
        {
          headers: {
            'auth_key': auth_key,
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );

      if (response?.data?.status > 0) {
        
        setTableDataList(response?.data?.message);
        setPDFfolder_name(response?.data?.folder_name)
        // setFolderName(response.data.folder_name);
        // setPageName('Annex_View');
        setPageName('annexure');
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
    data.admin_approval_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
    data.scheme.toLowerCase().includes(searchQuery.toLowerCase())
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
    const tokenValue = await getLocalStoreTokenDts(navigate);
    const rowData = fileStates[approval_no];
  
    if (!rowData || !rowData.file) {
      return alert("No file selected!");
    }
    
    
    const formData = new FormData();
    formData.append("approval_no", approval_no);
    formData.append("pcr_certificate", rowData.file);
    formData.append("upload_by", userDataLocalStore.user_id);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    
    try {
          const response = await axios.post(
            `${url}index.php/webApi/Utilization/pcrUpload`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                'auth_key': auth_key, // Important for FormData
                'Authorization': `Bearer ` + tokenValue?.token
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


  

  const printData = async (approval_no, sl_no) => {

    setLoading(true); // Set loading state
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();

    formData.append("approval_no", approval_no);
    formData.append("sl_no", sl_no);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token
    
        try {
          const response = await axios.post(
            url + 'index.php/webApi/Utilization/GetannextureData',
            formData,
            {
              headers: {
                'auth_key': auth_key,
                'Authorization': `Bearer ` + tokenValue?.token
              },
            }
          );
          
          if (response?.data.status > 0) {
            setLoading(false);
            setPrintOutDataState(response?.data?.message[0]);
            // setPrintFund_dtls(response?.data?.fund_dtls);
            // setScematicContiTotal(Number(response?.data?.message?.expen_sch_amt || 0) + Number(response?.data?.message?.expen_cont_amt || 0))
            printData_out(response?.data?.message[0], response?.data?.fund_dtls)
    
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

const printData_out = (printOutData, fund_dtls) => {
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };


  const printWindow = window.open("", "_blank", "width=800,height=600");
  printWindow.document.write(`
    <html>
    <head>
      <title>Annexure 1 (Administrative Approval No.: ${printOutData?.admin_approval_no})</title>
      <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            margin:0;
            padding:0;
          }
        .container {
          max-width: 100%;
          margin:0 auto;
          padding:15px;
          border: none;
        }
        .header {
          border-bottom: #000 solid 2px;
          display: inline-block;
          width: 100%;
          padding-bottom: 7px; margin: 0 0 8px 0;
        }

          table {
            border-collapse: collapse;
            width: 100%;
            font-size: 11px;
          }
          th, td {
            border: none;
            padding: 3px;
            text-align: left;
            font-size: 11px;
          }
       
        
        .details-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .details-table th{
          border:#333 solid 1px;
          padding: 5px 5px 5px 5px;
          text-align: left; vertical-align: top; width:70%;
        }

        .details-table td {
          border:#333 solid 1px;
          padding: 5px 5px 5px 5px;
          text-align: left; vertical-align:top; width:30%;
        }


        
        span.bold{font-weight: 700;}

        .logo{text-align: center; padding: 0 0 10px 0;}
        .logo img{width:80px;}
        h3{text-align: center; font-size: 14px; font-weight: 700; padding: 0 0 5px 0; margin: 0; line-height: 15px;}
        h2{text-align: center; font-size: 14px; font-weight: 700; padding: 0 0 5px 0; margin: 0; line-height: 15px;}
        p{text-align: left; font-size: 12px; font-weight: 400; padding: 0 0 5px 0; margin: 0; line-height: 15px;}
        p span.left{float:left;}
        p span.right{float:right;}
        h3.comple_title{text-align: center; font-size: 14px; font-weight: 600; padding: 0 0 5px 0; margin:0; line-height: 15px; text-decoration: underline;}
        p.comple_text{text-align: justify; font-size: 12px; font-weight: 400; padding: 0 0 15px 0; margin: 0; line-height: 15px;}
        p.comple_text_sub{text-align: left; font-size: 12px; font-weight: 400; padding: 0 0 8px 0; margin: 0; line-height: 15px;}
        p.r_text{text-align: left; font-size: 12px; font-weight: 400; padding: 0 0 0 0; margin: 0; line-height: 18px;}
 
        .details-table_sign {
          width: 100%;
          border-collapse: collapse;
          font-weight:400;
          margin-top:60px; margin-bottom: 30px;
          border: none;
        }
        .details-table_sign th, .details-table_sign td {
          border: none;
          padding: 5px 5px 5px 5px;
          text-align: center; font-weight:400;
        }

         .footer {
          margin-top: 30px;
          text-align: left;
          font-weight: 400;
        }

        .border__{border: #333 solid 1px !important;}
        .border_bottom_none{border-left:#333 solid 1px !important; border-right:#333 solid 1px !important;}
        .border_bottom{border-left:#333 solid 1px !important; border-right:#333 solid 1px !important; border-bottom:#333 solid 1px !important;}
        .border_All{border:#333 solid 1px !important;}

            /* Ensure borders appear in print */
          @media print {
            table, th, td {
              border: none;
              font-size: 10px;
            }
            th, td {
            padding: 3px;
          }
            
          p.r_text{text-align: left; font-size: 12px; font-weight: 400; padding: 0 0 0 0; margin: 0; line-height: 18px;}

        .details-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .details-table td{
          border:#333 solid 1px;
          padding: 5px;
          text-align: left; vertical-align: top; width:70%;
        }

        .details-table td {
          border:#333 solid 1px;
          padding: 5px; width:30%;
          text-align: left; vertical-align: top;
        }

            p.disclam{font-size: 10px; padding: 10px 0 5px 0; text-align: center; font-weight: 700;}
            .header {
          border-bottom: #000 solid 2px;
          display: inline-block;
          width: 100%;
          padding-bottom: 7px; margin: 0 0 8px 0;
          }
          

           .footer {
          margin-top: 30px;
          text-align: left;
          font-weight: 400;
        }
          span.bold{font-weight: 700;}
          
        h3.comple_title{text-align: center; font-size: 14px; font-weight: 600; padding: 0 0 5px 0; margin:0; line-height: 15px; text-decoration: underline;}
        p.comple_text{text-align: justify; font-size: 12px; font-weight: 400; padding: 0 0 15px 0; margin: 0; line-height: 15px;}
        p.comple_text_sub{text-align: left; font-size: 12px; font-weight: 400; padding: 0 0 8px 0; margin: 0; line-height: 15px;}
          }
      </style>
    </head>
    <body>
      <div class="container">
        ${getPrintCommonHeader_Annexure()}
        <table class="details-table">
          <tr>
          <td>Sl No</td>
          <td>District</td>
          <td>Administrative Approval No.</td>
		  <td>Administrative Approval Date</td>
		<td>Administrative Approval Amount</td>
			  <td>Tender Amount(in Rs.)</td>
			  <td>Allotment No. & Date of Fund Received</td>
			  <td>Fund Received Amounte</td>
			  <td>Payment Made(in Rs.)</td>
			  <td>Claim(in Rs.)</td>
			  <td>Contigency(in Rs.)</td>
			  <td>Net Claim(in Rs.)</td>
			  <td>Present Physical Progress</td>
			  <td>Remarks</td>
          </tr>
          <tr>
            <td>${printOutData?.sl_no}</td>
            <td>${printOutData?.district}</td>
            <td>${printOutData?.admin_approval_no}</td>
            <td>${formatDate(printOutData?.adm_approval_dt)}</td>
            <td>${printOutData?.admin_approval_amt}</td>
            <td>${printOutData?.tender_amt}</td>
            <td>${printOutData?.fund_recv_allot_no}</td>
            <td>${printOutData?.fund_recv_amt}</td>
            <td>${printOutData?.payment_made}</td>
            <td>${printOutData?.claim}</td>
            <td>${printOutData?.contingency}</td>
            <td>${printOutData?.net_claim}</td>
            <td>${printOutData?.physical_progress}%</td>
            <td>${printOutData?.remarks}</td>
          </tr>

          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>Total</td>
            <td>${printOutData?.net_claim}</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          
        </table>

        <table class="details-table_sign">
          <tr><th class="1stTd_sign">Account Officer </br> 
          Paschimanchal Unnayan Parshad</th><td class="2ndTh_sign">
          Executive Engineer </br> 
          Paschimanchal Unnayan Parshad
          </td></tr>
        </table>
        
        
        
      <script>
        window.print();
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
  // printWindow.print();
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
          {/* {JSON.stringify(printOutDataState, null, 2)} ////
          {JSON.stringify(currentTableData, null, 2)}  */}
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col bg-blue-900 md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              <h2 className='text-xl font-bold text-white'>Annexure List</h2>
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
                    placeholder="Search by Administrative Approval No. or Scheme Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                <BtnComp bgColor="bg-white" color="text-blue-900" title="Add Annexure" onClick={() => {
                  navigate('annex-add/0', {
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
  // download={download}
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

export default Annex_View;
