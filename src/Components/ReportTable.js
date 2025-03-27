import React, { useEffect, useRef, useState } from "react";
import TDInputTemplate from "./TDInputTemplate";
import BtnComp from "./BtnComp";
import Heading from "./Heading";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Message } from "./Message";
import { BarChartOutlined, EditOutlined, EyeOutlined, FileExcelOutlined, FilePdfOutlined, LoadingOutlined, MenuOutlined, PrinterOutlined, UnorderedListOutlined } from "@ant-design/icons";
import axios from "axios";
import { auth_key, folder_admin, folder_certificate, folder_fund, folder_progresImg, folder_tender, proj_final_pic, url } from "../Assets/Addresses/BaseUrl";
import VError from "./VError";
import { Checkbox, Select, Spin } from "antd";
import { DataTable } from 'primereact/datatable';
import Column from 'antd/es/table/Column';
import { Toast } from "primereact/toast"
// import { Tooltip } from 'react-tooltip'
import { Tooltip as ReactTooltip } from "react-tooltip";
import { Dialog } from "primereact/dialog";
import { Image } from 'antd';
import { useNavigate } from 'react-router-dom'
import { useLocation, useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
// import LOGO from "../../Assets/Images/logo.png"
import { getPrintCommonHeader } from "./PrintCommonHeader";
import { PrintPageName } from "./PrintCommonHeader_PageName";
import ReportCommonDialog from "./ReportCommonDialog";
import ReportPDFViewerDialog from "./ReportPDFViewerDialog";

function ReportTable(
  {
    reportData,

    reportName,
    printYear,
    printSecoundField,
    printThirdField,

    shortColumn
  }
) {
  const [loading, setLoading] = useState(false);
  // const [editingAccountHead, setEditingAccountHead] = useState(null); // New state for editing
  // const [fundStatus, setFundStatus] = useState(() => []);
  // const [reportData, setReportData] = useState(() => []);
  const toast = useRef(null)
  // const [financialYearDropList, setFinancialYearDropList] = useState([]);
  const [detailsReport, setDetailsReport] = useState([]);
  const [final_pic, setFinal_pic] = useState([]);

  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const { showAll,
    showHeadAcc,
    showBlockName,
    showProSubBy,
    showProImpleBy,
    showAdmiApprovPdf,
    showVettedDPR,
    showScheAmt,
    showContiAmt,
    showTenderDtl,
    showProgresDtl,
    showFundDtl,
    showExpendDtl,
    showUtilizationDtl } = shortColumn


  const [visible, setVisible] = useState(false);
  // const [visibleMenu, setVisibleMenu] = useState(false);
  const [visibleTender, setVisibleTender] = useState(false);
  const [visibleProgress, setVisibleProgress] = useState(false);
  const [visibleFund, setVisibleFund] = useState(false);
  const [visibleExpend, setVisibleExpend] = useState(false);
  const [visibleUtilization, setVisibleUtilization] = useState(false);

  const [pdfUrl, setPdfUrl] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalTitleTable, setModalTitleTable] = useState("");
  const [financeYear_submit, setFinanceYear_submit] = useState("");
  // const navigate = useNavigate()
  const params = useParams();
  const [selectedYear, setSelectedYear] = useState("");
  // const [printYear, setPrintYear] = useState('');


  const openModal = (file, foldername, title) => {
    setPdfUrl(url + foldername + file);
    setModalTitle(title);
    setVisible(true);
  };



  const tenderDetails = async (file, title) => {
    setLoading(true);
    setModalTitleTable(title);

    const formData = new FormData();
    formData.append("approval_no", file);

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Report/tender_list',
        formData, // Empty body
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      if (response?.data?.status > 0) {
        console.log(formData, "yyyyyyyyyyyyyyyyyy", response.data.message); // Log the actual response data
        setVisibleTender(true);
        setDetailsReport(response.data.message)
        setLoading(false);
      }

      if (response?.data?.status < 1) {
        setDetailsReport([])
        setLoading(false);
      }


    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      setLoading(false);
    }
  }

  const progressDetails = async (file, title) => {
    setLoading(true);
    setModalTitleTable(title);

    const formData = new FormData();
    formData.append("approval_no", file);

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Report/progress_list',
        formData, // Empty body
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      if (response?.data?.status > 0) {
        console.log(response?.data?.status, "progresssssssssss", response.data.message); // Log the actual response data
        setVisibleProgress(true);
        setDetailsReport(response.data.message)
        setLoading(false);
      }

      if (response?.data?.status < 1) {
        setDetailsReport([])
        setLoading(false);
      }


    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      setLoading(false);
    }
  }

  const fundDetails = async (file, title) => {
    setLoading(true);
    setModalTitleTable(title);

    const formData = new FormData();
    formData.append("approval_no", file);

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Report/fundrelease',
        formData, // Empty body
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      if (response?.data?.status > 0) {
        console.log(response?.data?.status, "fund", response.data.message); // Log the actual response data
        setVisibleFund(true);
        setDetailsReport(response.data.message)
        setLoading(false);
      }

      if (response?.data?.status < 1) {
        setDetailsReport([])
        setLoading(false);
      }


    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      setLoading(false);
    }
  }

  const expendDetails = async (file, title) => {
    setLoading(true);
    setModalTitleTable(title);

    const formData = new FormData();
    formData.append("approval_no", file);

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Report/expenditure',
        formData, // Empty body
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      if (response?.data?.status > 0) {
        console.log(response?.data?.status, "expenditure", response.data.message); // Log the actual response data
        setVisibleExpend(true);
        setDetailsReport(response.data.message)
        setLoading(false);
      }

      if (response?.data?.status < 1) {
        setDetailsReport([])
        setLoading(false);
      }


    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      setLoading(false);
    }
  }

  const utilizationDetails = async (file, title) => {
    setLoading(true);
    setModalTitleTable(title);

    const formData = new FormData();
    formData.append("approval_no", file);

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Report/utilization',
        formData, // Empty body
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      console.log(response?.data?.final_pic, "utilization");
      if (response?.data?.status > 0) {
        setVisibleUtilization(true);
        setDetailsReport(response?.data?.message)
        setFinal_pic(response?.data?.final_pic)
        setLoading(false);
      }

      if (response?.data?.status < 1) {
        setDetailsReport([])
        setLoading(false);
      }


    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      setLoading(false);
    }
  }


  const openModalTable = (file, title, identy) => {
    // setPdfUrl(url + folder_admin + file);


    if (identy == 'tender') {
      tenderDetails(file, title)
    }
    if (identy == 'progress') {
      progressDetails(file, title)
    }

    if (identy == 'fund') {
      fundDetails(file, title)
    }

    if (identy == 'expend') {
      expendDetails(file, title)
    }

    if (identy == 'utiliz') {
      utilizationDetails(file, title)
    }




  };


  const onPageChange = (event) => {
    setCurrentPage(event.first)
    setRowsPerPage(event.rows)
  }


  const excelData_tender = detailsReport.map((item, index) => ({
    'Sl. No': index + 1, // Adding Serial Number
    'Tender Date': item.tender_date == '' ? '--' : item.tender_date,
    'Tender Inviting Authority': item.invite_auth == '' ? '--' : item.invite_auth,
    'Tender Matured': item.mat_date == '' ? '--' : item.mat_date,
    'Tender Status': item.tender_status == "M" ? 'Yes' : 'No',
    'Work Order Issued': item.wo_date == '' ? '--' : item.wo_date,
    'Work Order Value': item.wo_value == '' ? '--' : item.wo_value,
    'Tentative Date of Completion': item.comp_date_apprx == '' ? '--' : item.comp_date_apprx,
    'Amount Put to Tender': item.amt_put_to_tender == '' ? '--' : item.amt_put_to_tender,
    'DLP': item.dlp == '' ? '--' : item.dlp,
    'Additional Performance Security': item.add_per_security == '' ? '--' : item.add_per_security,
    'EMD': item.emd == '' ? '--' : item.emd,
    'Date Of Refund': item.date_of_refund == '' ? '--' : item.date_of_refund,
  }));

  const excelData_Progress = detailsReport.map((item, index) => ({
    'Sl. No': index + 1, // Adding Serial Number
    'Progress Percent': item.progress_percent == '' ? '--' : item.progress_percent + '%',
    'Address': item.address == '' ? '--' : item.address,
    'Created At': item.created_at == '' ? '--' : item.created_at,
  }));

  const excelData_Fund = detailsReport.map((item, index) => ({
    'Sl. No': index + 1, // Adding Serial Number
    'Receive Date': item.receive_date == '' ? '--' : item.receive_date + '%',
    'Received By': item.received_by == '' ? '--' : item.received_by,
    'Instalment Amount': item.instl_amt == '' ? '--' : item.instl_amt,
    'Schematic Amount': item.sch_amt == '' ? '--' : item.sch_amt,
    'Contigency Amount': item.cont_amt == '' ? '--' : item.cont_amt,
  }));

  const excelData_Expenditure = detailsReport.map((item, index) => ({
    'Sl. No': index + 1, // Adding Serial Number
    'Payment Date': item.payment_date == '' ? '--' : item.payment_date,
    'Payment To': item.payment_to == '' ? '--' : item.payment_to,
    'Schematic Amount': item.sch_amt == '' ? '--' : item.sch_amt,
    'Contigency Amount': item.cont_amt == '' ? '--' : item.cont_amt,
    'Schematic Remarks': item.sch_remark == null ? '--' : item.sch_remark,
    'Contigency Remarks': item.cont_remark == null ? '--' : item.cont_remark,
  }));

  const excelData_Utilization = detailsReport.map((item, index) => ({
    'Sl. No': index + 1, // Adding Serial Number
    'Certificate Date': item.certificate_date == '' ? '--' : item.certificate_date,
    'Issued By': item.issued_by == '' ? '--' : item.issued_by,
    'Issued To': item.issued_to == '' ? '--' : item.issued_to,
    'Remarks': item.remarks == '' ? '--' : item.remarks,
    'This Is Final Utilization Certificate?': item.is_final == "Y" ? 'Yes' : 'No',
  }));



  // const exportExcelHandler = (para) => {
  //   // alert(para)
  //   // const ws = XLSX.utils.json_to_sheet(excelData_tender);

  //   // Create a new workbook and worksheet
  //   var worksheet;

  //   const workbook = XLSX.utils.book_new();

  //   if (para == 'tender') {
  //     worksheet = XLSX.utils.json_to_sheet(excelData_tender);
  //   }

  //   if (para == 'progress') {
  //     worksheet = XLSX.utils.json_to_sheet(excelData_Progress);
  //   }
  //   if (para == 'fund') {
  //     worksheet = XLSX.utils.json_to_sheet(excelData_Fund);
  //   }
  //   if (para == 'expenditure') {
  //     worksheet = XLSX.utils.json_to_sheet(excelData_Expenditure);
  //   }
  //   if (para == 'utilization') {
  //     worksheet = XLSX.utils.json_to_sheet(excelData_Utilization);
  //   }

  //   // Append the worksheet to the workbook
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  //   // Generate a binary string representing the Excel file
  //   const excelBuffer = XLSX.write(workbook, {
  //     bookType: 'xlsx',
  //     type: 'array',
  //   });

  //   // Use file-saver to trigger a download
  //   const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

  //   if (para == 'tender') {
  //     saveAs(blob, `${PrintPageName.popup_1.replace(/\s+/g, '')}` + `${printYear}` + '.xlsx');
  //   }
  //   if (para == 'progress') {
  //     saveAs(blob, `${PrintPageName.popup_2.replace(/\s+/g, '')}` + `${printYear}` + '.xlsx');
  //   }
  //   if (para == 'fund') {
  //     saveAs(blob, `${PrintPageName.popup_3.replace(/\s+/g, '')}` + `${printYear}` + '.xlsx');
  //   }
  //   if (para == 'expenditure') {
  //     saveAs(blob, `${PrintPageName.popup_4.replace(/\s+/g, '')}` + `${printYear}` + '.xlsx');
  //   }
  //   if (para == 'utilization') {
  //     saveAs(blob, `${PrintPageName.popup_5.replace(/\s+/g, '')}` + `${printYear}` + '.xlsx');
  //   }

  // };

  const excelDataMap = {
    tender: { data: excelData_tender, filename: PrintPageName.popup_1 },
    progress: { data: excelData_Progress, filename: PrintPageName.popup_2 },
    fund: { data: excelData_Fund, filename: PrintPageName.popup_3 },
    expenditure: { data: excelData_Expenditure, filename: PrintPageName.popup_4 },
    utilization: { data: excelData_Utilization, filename: PrintPageName.popup_5 },
  };
  
  const exportExcelHandler = (para) => {
    const selectedData = excelDataMap[para];
  
    if (!selectedData) return; // Exit if no valid parameter is provided
  
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(selectedData.data);
  
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  
    saveAs(blob, `${selectedData.filename.replace(/\s+/g, '')}${printYear}.xlsx`);
  };

  //   const printWindow = window.open('', '', 'width=800,height=600');
  //   printWindow.document.write(`
  //     <html>
  //     <head>
  //       <title>Report</title>
  //       <style>
  //       .logo{text-align: center; padding: 0 0 10px 0;}
  //       .logo img{width:80px;}
  //       h3{text-align: center; font-size: 15px; font-weight: 400; padding: 0 0 7px 0; margin: 0; line-height: 15px;}
  //       h2{text-align: center; font-size: 16px; font-weight: 700; padding: 0 0 12px 0; margin: 0; line-height: 15px;}
  //       p{text-align: center; font-size: 14px; font-weight: 400; padding: 0 0 10px 0; margin: 0; line-height: 15px;}
  //         body {
  //           font-family: Arial, sans-serif;
  //           font-size: 11px;
  //         }
  //         table {
  //           border-collapse: collapse;
  //           width: 100%;
  //           font-size: 11px;
  //         }
  //         th, td {
  //           border: 1px solid black;
  //           padding: 3px;
  //           text-align: left;
  //           font-size: 11px;
  //         }
  //           /* Ensure borders appear in print */
  //         @media print {
  //           table, th, td {
  //             border: 1px solid black;
  //             font-size: 10px;
  //           }
  //           th, td {
  //           padding: 3px;
  //         }
  //           p.disclam{font-size: 10px; padding: 10px 0 5px 0; text-align: center; font-weight: 700;}
  //         }
  //       </style>
  //     </head>
  //     <body>
  //     ${getPrintCommonHeader()}
  //     <h2>${PrintPageName.Financial} Year: ${printYear}</h2>
  //   `);

  //   if (para === 'tender') {
  //     printWindow.document.write(`
  //       <table>
  //         <tr>
  //           ${Object.keys(excelData_tender[0] || {}).map((key) => `<th>${key}</th>`).join('')}
  //         </tr>
  //         ${excelData_tender.map(row => `
  //           <tr>
  //             ${Object.values(row).map(value => `<td>${value}</td>`).join('')}
  //           </tr>
  //         `).join('')}
  //       </table>
  //     `);
  //   } else if (para === 'progress') {
  //     printWindow.document.write(`
  //       <table>
  //         <tr>
  //           ${Object.keys(excelData_Progress[0] || {}).map((key) => `<th>${key}</th>`).join('')}
  //         </tr>
  //         ${excelData_Progress.map(row => `
  //           <tr>
  //             ${Object.values(row).map(value => `<td>${value}</td>`).join('')}
  //           </tr>
  //         `).join('')}
  //       </table>
  //     `);
  //   } else if (para === 'fund') {
  //     printWindow.document.write(`
  //       <table>
  //         <tr>
  //           ${Object.keys(excelData_Fund[0] || {}).map((key) => `<th>${key}</th>`).join('')}
  //         </tr>
  //         ${excelData_Fund.map(row => `
  //           <tr>
  //             ${Object.values(row).map(value => `<td>${value}</td>`).join('')}
  //           </tr>
  //         `).join('')}
  //       </table>
  //     `);
  //   } else if (para === 'expenditure') {
  //     printWindow.document.write(`
  //       <table>
  //         <tr>
  //           ${Object.keys(excelData_Expenditure[0] || {}).map((key) => `<th>${key}</th>`).join('')}
  //         </tr>
  //         ${excelData_Expenditure.map(row => `
  //           <tr>
  //             ${Object.values(row).map(value => `<td>${value}</td>`).join('')}
  //           </tr>
  //         `).join('')}
  //       </table>
  //     `);
  //   } else if (para === 'utilization') {
  //     printWindow.document.write(`
  //       <table>
  //         <tr>
  //           ${Object.keys(excelData_Utilization[0] || {}).map((key) => `<th>${key}</th>`).join('')}
  //         </tr>
  //         ${excelData_Utilization.map(row => `
  //           <tr>
  //             ${Object.values(row).map(value => `<td>${value}</td>`).join('')}
  //           </tr>
  //         `).join('')}
  //       </table>
  //     `);
  //   }

  //   printWindow.document.write(`
  //       <p class="disclam">“This document is computer generated and does not require any signature”.</p>
  //     </body>
  //     </html>
  //   `);

  //   printWindow.document.close();
  //   printWindow.print();
  // };

  // Download & Print Function End 


  const printData = (para) => {
    const dataMap = {
      tender: excelData_tender,
      progress: excelData_Progress,
      fund: excelData_Fund,
      expenditure: excelData_Expenditure,
      utilization: excelData_Utilization,
    };
  
    const selectedData = dataMap[para] || [];
  
    const generateTable = (data) => {
      if (!data.length) return '';
      return `
        <table>
          <tr>${Object.keys(data[0]).map(key => `<th>${key}</th>`).join('')}</tr>
          ${data.map(row => `<tr>${Object.values(row).map(value => `<td>${value}</td>`).join('')}</tr>`).join('')}
        </table>
      `;
    };

    const getTitle = () => {
      if (reportName === 'finance') {
        return `<h2>${PrintPageName.Financial} Year: ${printYear}</h2>`;
      } else if (reportName === 'headAcc') {
        return `<h2>${PrintPageName.HeadAcc} Year: ${printYear} Head of Account: ${printSecoundField}</h2>`;
      } else if (reportName === 'sector') {
        return `<h2>${PrintPageName.Sector} Year: ${printYear} Sector: ${printSecoundField}</h2>`;
      } else if (reportName === 'district') {
        return `<h2>${PrintPageName.District} Year: ${printYear} District: ${printSecoundField} Block: ${printThirdField}</h2>`;
      } else if (reportName === 'implementing') {
        return `<h2>${PrintPageName.Implementing} Year: ${printYear} Implementing Agency: ${printSecoundField}</h2>`;
      }
    };
  
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <html>
      <head>
        <title>Report</title>
        <style>
          .logo { text-align: center; padding-bottom: 10px; }
          .logo img { width: 80px; }
          h3, h2, p { text-align: center; margin: 0; }
          h3 { font-size: 15px; font-weight: 400; padding-bottom: 7px; }
          h2 { font-size: 16px; font-weight: 700; padding-bottom: 12px; }
          p { font-size: 14px; font-weight: 400; padding-bottom: 10px; }
          body { font-family: Arial, sans-serif; font-size: 11px; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; }
          th, td { border: 1px solid black; padding: 3px; text-align: left; }
          @media print {
            th, td { font-size: 10px; padding: 3px; }
            p.disclam { font-size: 10px; padding: 10px 0 5px; font-weight: 700; }
          }
        </style>
      </head>
      <body>
        ${getPrintCommonHeader()}
        ${getTitle()}
        ${generateTable(selectedData)}
        <p class="disclam">“This document is computer generated and does not require any signature”.</p>
      </body>
      </html>
    `);
  
    printWindow.document.close();
    printWindow.print();
  };

  const tenderColumns = [
    { header: "Sl No.", body: (rowData) => <span style={{ fontWeight: "bold" }}>{rowData?.id + 1}</span> },
    { field: "tender_date", header: "Tender Date" },
    { 
      field: "tender_notice", 
      header: "Tender Notice",
      body: (rowData) => (
        <a href="#" onClick={(e) => {
          e.preventDefault();
          openModal(rowData?.tender_notice, folder_tender, "Tender Notice PDF");
        }} style={{ cursor: "pointer" }}>
          <FilePdfOutlined style={{ fontSize: 18, color: "red" }} />
        </a>
        
      )
    },
    { field:"invite_auth",  header:"Tender Inviting Authority" },
    { field: "mat_date", header:"Tender Matured"},
    { field: "tender_status", header:"Tender Matured"},
    { 
      field: "tender_status", 
      header: "Tender Matured",
      body: (rowData) => (
        <>
        {rowData.tender_status == "M" ? 'Yes' : 'No'}
        </>
      )
    },
    { field:"wo_date", header:"Work Order Issued"},
    { 
      field: "wo_copy", 
      header: "Work Order Copy",
      body: (rowData) => (
          <a
          href="#"
          onClick={(e) => {
          e.preventDefault();
          openModal(rowData?.wo_copy, folder_tender, "Work Order Copy PDF");
          }}
          style={{ cursor: "pointer" }}
          >
          <FilePdfOutlined style={{ fontSize: 18, color: "red" }} />
          </a>
      )
    },
    { field:"wo_value", header:"Work Order Value"},
    { field:"comp_date_apprx", header:"Tentative Date of Completion"},
    { field:"amt_put_to_tender", header:"Amount Put to Tender"},
    { field:"dlp", header:"DLP"},
    { field:"add_per_security", header:"Additional Performance Security"},
    { field:"emd", header:"EMD"},
    { field:"date_of_refund", header:"Date Of Refund"},
    // ... other tender columns
  ];

  const progressColumns = [
    { header: "Sl No.", body: (rowData) => <span style={{ fontWeight: "bold" }}>{rowData?.id + 1}</span> },
    { field: "progress_percent", header: "Progress Percent",
      body:(rowData) => (
        <>
          {rowData.progress_percent + '%'}
        </>
      )
     },
    { field:"address", header:"Address"},
    { field:"created_at", header:"Created At" },
    { field: "pic_path", header:"Project Status photo",
      body:(rowData) => (
        <>
          {rowData?.pic_path.length > 0 && (
            <>
              <div className="place-content-left flex items-left gap-4">
                {JSON.parse(rowData?.pic_path)?.map((imgPath, index) => (
                  <>
                    <Image width={80} className="mr-3 lightBox_thum" src={url + folder_progresImg + imgPath} />
                  </>
                ))}
              </div>
            </>
          )}

        </>
      )
    },
    // ... other tender columns
  ];

  const fundDetailsColumns = [
    { header: "Sl No.", body: (rowData) => <span style={{ fontWeight: "bold" }}>{rowData?.id + 1}</span> },
    { field: "receive_date", header: "Receive Date"},
    { field:"received_by", header:"Received By"},
    { field:"instl_amt", header:"Instalment Amount"},
    { field:"allotment_no", header:"Allotment No", 
      body:(rowData) => (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            openModal(rowData?.allotment_no, folder_fund, "Allotment No PDF");
          }}
          style={{ cursor: "pointer" }}
        >
          <FilePdfOutlined style={{ fontSize: 18, color: "red" }} />
        </a>
      )
    },
    { field:"sch_amt", header:"Schematic Amount"},
    { field:"cont_amt", header:"Contigency Amount"},
    // ... other tender columns
  ];

  const expenditureColumns = [
    { header: "Sl No.", body: (rowData) => <span style={{ fontWeight: "bold" }}>{rowData?.id + 1}</span> },
    { field:"payment_date", header:"Payment Date"},
    { field:"payment_to", header:"Payment To"},
    { field:"sch_amt", header:"Schematic Amount"},
    { field:"cont_amt", header:"Contigency Amount"},
    { field:"sch_remark", header:"Schematic Remarks"},
    { field:"cont_remark", header:"Contigency Remarks"},
    // ... other tender columns
  ];

  const utilizationColumns = [
    { header: "Sl No.", body: (rowData) => <span style={{ fontWeight: "bold" }}>{rowData?.id + 1}</span> },
    { field:"certificate_date", header:"Certificate Date"},
    { field:"certificate_path", header:"Certificate",
      body:(rowData) => (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            openModal(rowData?.certificate_path, folder_certificate, "Certificate PDF");
          }}
          style={{ cursor: "pointer" }}
        >
          <FilePdfOutlined style={{ fontSize: 18, color: "red" }} />
        </a>
      )
    },
    { field:"issued_by", header:"Issued By"},
    { field:"issued_to", header:"Issued To"},
    { field:"remarks", header:"Remarks"},
    { field:"is_final", header:"This Is Final Utilization Certificate?",
      body:(rowData) => (
        <>
          {rowData.is_final == "Y" ? 'Yes' : 'No'}
        </>
      )
    },
    // ... other tender columns
  ];

  return (
    <>
      {/* {JSON.stringify(shortColumn, null, 2)} */}
      <DataTable
        value={reportData?.map((item, i) => [{ ...item, id: i }]).flat()}
        selectionMode="checkbox"
        tableStyle={{ minWidth: "50rem" }}
        dataKey="id"
        paginator
        rows={rowsPerPage}
        first={currentPage}
        onPage={onPageChange}
        rowsPerPageOptions={[5, 10, 20]} // Add options for number of rows per page
        tableClassName="w-full text-sm text-left rtl:text-right shadow-lg text-green-900dark:text-gray-400 table_Custome table_Custome_1st" // Apply row classes
      >
        <Column
          header="Sl No."
          body={(rowData) => (
            <span style={{ fontWeight: "bold" }}>{rowData?.id + 1}</span>
          )}
          footer={
            <span style={{ fontWeight: "bold", color: "#0694A2" }}>
              Total:
            </span>
          }
        ></Column>

        {/* <Column
          field="project_id"
          header="Project ID"
          ></Column> */}

        <Column
          field="project_id"
          header="Project ID"
        ></Column>

        <Column
          field="admin_approval_dt"
          header="Date of Administrative Approval"
        // headerStyle={{ width: '250px', textAlign: 'left', wordWrap: 'break-word'  }}
        ></Column>

        <Column
          field="scheme_name"
          header="Scheme"
          headerClassName="custom-scheme_name-header"
          bodyClassName="custom-scheme_name-body"
          headerStyle={{ width: '350em', textAlign: 'left', wordWrap: 'break-word' }}
        ></Column>


        <Column
          field="sector_name"
          header="Sector"
        ></Column>

        {showScheAmt &&
          <Column
            field="fr_sch_amt"
            header="Schematic Amount"
            footer={
              <span style={{ fontWeight: "bold", color: "#0694A2" }}>
                {reportData?.reduce((sum, item) => sum + (parseFloat(item?.fr_sch_amt) || 0), 0).toFixed(2)}
              </span>
            }
          ></Column>
        }

        {showContiAmt &&
          <Column
            field="fr_cont_amt"
            header="Contigency Amount"
            footer={
              <span style={{ fontWeight: "bold", color: "#0694A2" }}>
                {reportData?.reduce((sum, item) => sum + (parseFloat(item?.fr_cont_amt) || 0), 0).toFixed(2)}
              </span>
            }
          ></Column>
        }

        <Column
          // field="fr_cont_amt"
          header="Total"
          body={(rowData) => {
            const total =
              (parseFloat(rowData?.fr_sch_amt) || 0) + (parseFloat(rowData?.fr_cont_amt) || 0);
            return total.toFixed(2);
          }}

          footer={
            <span style={{ fontWeight: "bold", color: "#0694A2" }}>
              {reportData
                ?.reduce((sum, item) => sum + ((parseFloat(item?.fr_sch_amt) || 0) + (parseFloat(item?.fr_cont_amt) || 0)), 0)
                .toFixed(2)}
            </span>
          }

        ></Column>
        {showHeadAcc &&
          <Column
            field="account_head_name"
            header="Head Account"
          ></Column>
        }

        <Column
          field="dist_name"
          header="District"
        ></Column>

        {showBlockName &&
          <Column field="block_name" header="Block" />
        }
        {/* {showSourceOfFund &&  */}
        <Column field="source_of_fund" header="Source of Fund" />
        {/*  } */}





        {showProSubBy &&
          <Column
            field="project_submitted_by"
            header="Project Submitted by"
          ></Column>
        }




        {showProImpleBy &&
          <Column
            field="agency_name"
            header="Project Implemented by"
          ></Column>
        }

        {showAdmiApprovPdf &&
          <Column
            field="admin_approval"
            header="Administrative Approval(G.O)"
            body={(rowData) => (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  openModal(rowData?.admin_approval, folder_admin, "Administrative Approval(G.O) PDF");
                }}
                style={{ cursor: "pointer" }}
              >
                <FilePdfOutlined style={{ fontSize: 18, color: "red" }} />
              </a>
            )}

          ></Column>
        }

        {showVettedDPR &&
          <Column
            field="vetted_dpr"
            header="Vetted DPR"
            // body={(rowData) => (
            // <a href={url + folder_admin + rowData?.vetted_dpr} target='_blank'><FilePdfOutlined style={{fontSize:22, color:'red'}} /></a>
            // )}
            body={(rowData) => (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  openModal(rowData?.vetted_dpr, folder_admin, "Vetted DPR PDF");
                }}
                style={{ cursor: "pointer" }}
              >
                <FilePdfOutlined style={{ fontSize: 18, color: "red" }} />
              </a>
            )}
          ></Column>
        }

        {showTenderDtl &&
          <Column
            // field="invite_auth"
            header="Tender Details"
            body={(rowData) => (
              <button
                type="button"
                className="text-blue-700 border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5"
                onClick={(e) => {
                  e.preventDefault();
                  openModalTable(rowData?.approval_no, rowData?.project_id, 'tender');
                }}
              >
                <EyeOutlined />
              </button>
            )}
          ></Column>
        }

        {showProgresDtl &&
          <Column
            // field="invite_auth"
            header="Progress Details"
            body={(rowData) => (
              <button
                type="button"
                className="text-blue-700 border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5"
                onClick={(e) => {
                  e.preventDefault();
                  openModalTable(rowData?.approval_no, rowData?.project_id, 'progress');
                }}
              >
                <EyeOutlined />
              </button>
            )}
          ></Column>
        }

        {showFundDtl &&
          <Column
            // field="invite_auth"
            header="Fund Details"
            body={(rowData) => (
              <button
                type="button"
                className="text-blue-700 border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5"
                onClick={(e) => {
                  e.preventDefault();
                  openModalTable(rowData?.approval_no, rowData?.project_id, 'fund');
                }}
              >
                <EyeOutlined />
              </button>
            )}
          ></Column>
        }

        {showExpendDtl &&
          <Column
            // field="invite_auth"
            header="Expenditure Details"
            body={(rowData) => (
              <button
                type="button"
                className="text-blue-700 border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5"
                onClick={(e) => {
                  e.preventDefault();
                  openModalTable(rowData?.approval_no, rowData?.project_id, 'expend');
                }}
              >
                <EyeOutlined />
              </button>
            )}
          ></Column>
        }

        {showUtilizationDtl &&
          <Column
            // field="invite_auth"
            header="Utilization Certificate Details"
            body={(rowData) => (
              <button
                type="button"
                className="text-blue-700 border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5"
                onClick={(e) => {
                  e.preventDefault();
                  openModalTable(rowData?.approval_no, rowData?.project_id, 'utiliz');
                }}
              >
                <EyeOutlined />
              </button>
            )}
          ></Column>
        }

      </DataTable>


      <ReportPDFViewerDialog
        visible={visible}
        onHide={() => setVisible(false)}
        title={modalTitle}
        pdfUrl={pdfUrl}
      />

      <ReportCommonDialog
      visible={visibleTender}
      onHide={() => setVisibleTender(false)}
      title={`Tender Details (Project ID: ${modalTitleTable})`}
      data={detailsReport}
      columns={tenderColumns}
      printHandler={() => printData('tender')}
      exportHandler={() => exportExcelHandler('tender')}
      />


      <ReportCommonDialog
      visible={visibleProgress}
      onHide={() => setVisibleProgress(false)}
      title={`Progress Details (Project ID: ${modalTitleTable})`}
      data={detailsReport}
      columns={progressColumns}
      printHandler={() => printData('progress')}
      exportHandler={() => exportExcelHandler('progress')}
      />

      
      <ReportCommonDialog
      visible={visibleFund}
      onHide={() => setVisibleFund(false)}
      title={`Fund Release Details (Project ID: ${modalTitleTable})`}
      data={detailsReport}
      columns={fundDetailsColumns}
      printHandler={() => printData('fund')}
      exportHandler={() => exportExcelHandler('fund')}
      />

      <ReportCommonDialog
      visible={visibleExpend}
      onHide={() => setVisibleExpend(false)}
      title={`Expenditure Details (Project ID: ${modalTitleTable})`}
      data={detailsReport}
      columns={expenditureColumns}
      printHandler={() => printData('expenditure')}
      exportHandler={() => exportExcelHandler('expenditure')}
      />

      <ReportCommonDialog
      visible={visibleUtilization}
      onHide={() => setVisibleUtilization(false)}
      title={`Utilization Certificate Details (Project ID: ${modalTitleTable})`}
      data={detailsReport}
      final_pic={final_pic}
      columns={utilizationColumns}
      printHandler={() => printData('utilization')}
      exportHandler={() => exportExcelHandler('utilization')}
      />
    </>
  );
}

export default ReportTable;
