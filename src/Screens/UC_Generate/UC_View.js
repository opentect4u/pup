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


// const initialValues = {
//   admin_appr_pdf: '',
// };

// const validationSchema = Yup.object({
//   admin_appr_pdf: Yup.string().required('Administrative Approval(G.O) is Required'),
// });

function UC_View() {
  const navigate = useNavigate();
  const [tableDataList, setTableDataList] = useState([]);
  const [folderName, setFolderName] = useState('');
  const params = useParams();
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState('');
  const [pageName, setPageName] = useState('');
  const [printOutDataState, setPrintOutDataState] = useState([]);
  const [userDataLocalStore, setUserDataLocalStore] = useState([]);
  const [PDFfolder_name, setPDFfolder_name] = useState('');
  const [scematicContiTotal, setScematicContiTotal] = useState('');
  const [printFund_dtls, setPrintFund_dtls] = useState([]);

  const fetchTableDataList_Fn = async () => {
    setLoading(true);

    const cread = {
        fin_year: '0',
    };
    
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Utilization/certificatlist', cread,
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      console.log(response, 'projCompCertilist');
      if (response?.data?.status > 0) {
        
        setTableDataList(response?.data?.message);
        setPDFfolder_name(response?.data?.folder_name)
        // setFolderName(response.data.folder_name);
        // setPageName('UC_View');
        setPageName('UC_Generate');
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
    
    console.log(rowData.file, 'rowDatafile', approval_no);
    
    const formData = new FormData();
    formData.append("approval_no", approval_no);
    formData.append("pcr_certificate", rowData.file);
    formData.append("upload_by", userDataLocalStore.user_id);

    console.log(formData, 'formDataformData');
    
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
          console.log(response, 'formDataformData');
          
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
    
        const formData = new FormData();
    
        formData.append("approval_no", approval_no);
        formData.append("sl_no", sl_no);
    
        try {
          const response = await axios.post(
            url + 'index.php/webApi/Utilization/getcertificateData',
            formData,
            {
              headers: {
                'auth_key': auth_key,
              },
            }
          );
          
          if (response?.data.status > 0) {
            setLoading(false);
            setPrintOutDataState(response?.data?.message);
            setPrintFund_dtls(response?.data?.fund_dtls);
            setScematicContiTotal(Number(response?.data?.message?.expen_sch_amt || 0) + Number(response?.data?.message?.expen_cont_amt || 0))
            console.log(response?.data?.message, 'projCompCertiSingledataxxxxxxxxxxxxx', response?.data?.fund_dtls);
            printData_out(response?.data?.message, response?.data?.fund_dtls)
    
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

  const generateTableRows = (schemeList) => {
    let total = 0;
    const rows = schemeList.map((item, index) => {
      const amount = parseFloat(item.exp_amt) || 0;
      total += amount;
      return `
        <tr>
          <th class="0_slot border_bottom_none">${index === 0 ? '1' : ''}</th> 
          <th class="1stTd_sub border_bottom_none">${item.exp_letter_dt}:</th>
          <td class="2ndTh_sub border_bottom_none">${amount.toFixed(2)}</td>
        </tr>`;
    });

    // Add total row after the loop
    rows.push(`
      <tr>
        <th class="border_bottom_none"></th>
        <th class="border_bottom_none" style="text-align: right;">Total</th>
        <td class="border__">${total.toFixed(2)}</td>
      </tr>
    `);

    return {
      tableHTML: rows.join(""),
      total,
    };
  };

  const { tableHTML, total: expAmtTotal } = generateTableRows(fund_dtls);
  const expAmtWords = toWords(expAmtTotal);
  const capitalizedExpAmtWords =
    expAmtWords.charAt(0).toUpperCase() + expAmtWords.slice(1);

  const printWindow = window.open("", "_blank", "width=800,height=600");
  printWindow.document.write(`
    <html>
    <head>
      <title>GFR 19-A(Projrct ID: ${printOutData?.project_id})</title>
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
          padding-bottom: 7px; margin: 0 0 8px 0;
        }
        .1stTd{width:70%; vertical-align: top;}
        .2ndTh{width:30%; vertical-align: top;}

        table.subTable th.0_sl_sub{width:5%; border-right: #333 solid 1px;}
        table.subTable th.1stTd_sub{width:65%; border-right: #333 solid 1px;}
        table.subTable td.2ndTh_sub{width:30%; border-right: #333 solid 1px;}
        
        .details-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .details-table th{
          border: none;
          padding: 5px 5px 5px 5px;
          text-align: left; vertical-align: top; width:70%;
        }

        .details-table td {
          border: none;
          padding: 5px 5px 5px 5px;
          text-align: left; vertical-align:top; width:30%;
        }

        

        .sub_table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 0;
        }
        .sub_table th, .sub_table td {
          border: none;
          padding: 0;
          text-align: left;
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

          table.subTable {
            border-collapse: collapse;
            width: 100%;
            font-size: 11px;
          }
          table.subTable th{
            border: none;
            padding: 3px;
            text-align: left;
            font-size: 11px; width: auto;
          }

          table.subTable td {
            border: none;
            padding: 3px;
            text-align: left;
            font-size: 11px; width: auto;
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
        .details-table th{
          border: none;
          padding: 5px;
          text-align: left; vertical-align: top; width:70%;
        }

        .border__{border: #333 solid 1px !important;}
        .border_bottom_none{border-left:#333 solid 1px !important; border-right:#333 solid 1px !important;}
        .border_bottom{border-left:#333 solid 1px !important; border-right:#333 solid 1px !important; border-bottom:#333 solid 1px !important;}
        .border_All{border:#333 solid 1px !important;}

        .details-table td {
          border: none;
          padding: 5px; width:30%;
          text-align: left; vertical-align: top;
        }

          table.subTable {
            border-collapse: collapse;
            width: 100%;
            font-size: 11px;
          }
          table.subTable th{
            border:none;
            padding: 5px;
            text-align: left;
            font-size: 11px; width: auto;
          }

          table.subTable td {
            border:none;
            padding: 5px;
            text-align: left;
            font-size: 11px; width: auto;
          }

            p.disclam{font-size: 10px; padding: 10px 0 5px 0; text-align: center; font-weight: 700;}
            .header {
          border-bottom: #000 solid 2px;
          display: inline-block;
          width: 100%;
          padding-bottom: 7px; margin: 0 0 8px 0;
          }
          .1stTd{width:70%; vertical-align: top;}
          .2ndTh{width:30%; vertical-align: top;}

          table.subTable th.0_sl_sub{width:5%; border-right: #333 solid 1px;}
          table.subTable th.1stTd_sub{width:65%; border-right: #333 solid 1px;}
          table.subTable td.2ndTh_sub{width:30%; border-right: #333 solid 1px;}

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
        ${getPrintCommonHeader_UC()}
        <table class="details-table">
          <tr>
          <th class="1stTd">
          <table class="subTable">
          <tr>
          <th class="0_sl_sub border__">Sl No</th>
          <th class="1stTd_sub border__">Letter No. and Date </th>
          <td class="2ndTh_sub border__">Amount (Rs.) </td>
          </tr>

          ${tableHTML}

          <tr>
          <th class="border_bottom_none" style="height: 120px;">2</th>
          <th class="border_bottom_none">Total Amount Received Rs.${Number(printOutData?.recv_sche_amt || 0) + Number(printOutData?.recv_cont_amt || 0)}/- </br>
          Scheme Amount Rs.${printOutData?.recv_sche_amt} </br>
          Contigency Rs.${printOutData?.recv_cont_amt}</th>
          <td class="border_bottom_none"></td>
          </tr>

          <tr>
          <th class="0_slot border_bottom" style="height: 120px;">3</th>
          <th class="1stTd_sub border_bottom">Projrct ID: ${printOutData?.project_id}  </br> Project Name: ${printOutData?.scheme_name}</th>
          <td class="2ndTh_sub border_bottom"></td>
          </tr>

          
          
        </table>
          </th>
          <td class="2ndTh">
<p class="r_text">Certified that out of Rs.${Number(printOutData?.tot_exp_amt || 0)}/- 
(Rupees. ${toWords(Number(printOutData?.tot_exp_amt || 0)).charAt(0).toUpperCase() + toWords(Number(printOutData?.tot_exp_amt || 0)).slice(1)} only)
..... of Grants-in-ald/Fund sanctioned during the year ${printOutData?.fin_year} 
In favour of Accounts... Officer Paschimanchal. Unnayan Parshad Under this Ministry/ Department letter No. 
given in the margin and Rs. ${Number(printOutData?.margin_bal || 0)} on account of unspent balance of the previous year, 
a sum of Rs.${Number(printOutData?.tot_exp_amt || 0)} 
(Rupees. ${toWords(Number(printOutData?.tot_exp_amt || 0)).charAt(0).toUpperCase() + toWords(Number(printOutData?.expen_sch_amt || 0) + Number(printOutData?.expen_cont_amt || 0)).slice(1)}
only) has been utilized for the purpose of ${printOutData?.scheme_name} PROJECT CODE ${printOutData?.project_id} for which it was 
sanctioned and that the balance of Rs.0 remaining unutilized at the end of the year has been 
surrendered to Government (vide No. ${printOutData?.vide_no} Dated ${printOutData?.vide_dt}) will be adjusted towards the 
grants-in-ald/fund payable during the next year ${printOutData?.next_year}</p>
          </td>
          </tr>
          
        </table>

        <div class="footer">
         <p>Certified that I have satisfied myself that the conditions on which the grants-in-aid was sanctioned have been 
         duly fulfilled/are being fulfilled and that I have exercised that following checks to see that the money was 
         actually utilized for the purpose for which it was sanctioned. Kinds of checks exercised. </p>

         <p>1. Records of MB (Measurement Books) </br>
            2. Technical evaluation of Bills by Engineers </br>
            3. Arithmetic Accuracy of bills by Accounts wing </br>
            4. Records of Cash book</p>
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
              <h2 className='text-xl font-bold text-white'>Utilization Certificate List Generate </h2>
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
                <BtnComp bgColor="bg-white" color="text-blue-900" title="Generate Utilization Certificate" onClick={() => {
                  navigate('uc-add/0', {
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

export default UC_View;
