import React, { useEffect, useRef, useState } from "react";
import TDInputTemplate from "../../Components/TDInputTemplate";
import BtnComp from "../../Components/BtnComp";
import Heading from "../../Components/Heading";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Message } from "../../Components/Message";
import { BarChartOutlined, EditOutlined, EyeOutlined, FileExcelOutlined, FilePdfOutlined, LoadingOutlined, MenuOutlined, PrinterOutlined, UnorderedListOutlined } from "@ant-design/icons";
import axios from "axios";
import { auth_key, folder_admin, folder_certificate, folder_fund, folder_progresImg, folder_tender, proj_final_pic, url } from "../../Assets/Addresses/BaseUrl";
import VError from "../../Components/VError";
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
import { PrintPageName } from "../../Components/PrintCommonHeader_PageName";
import { getPrintCommonHeader } from "../../Components/PrintCommonHeader";
import ReportTable from "../../Components/ReportTable";
import { getLocalStoreTokenDts } from "../../CommonFunction/getLocalforageTokenDts";


const initialValues = {
  fin_yr: '',
  head_acc: '',
  block: '',
};



const validationSchema = Yup.object({
  fin_yr: Yup.string().required('Financial Year is Required'),
  head_acc: Yup.string().required('District is Required'),
  block: Yup.string().required('Block is Required'),
});


function District_Report() {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(() => []);
  const toast = useRef(null)
  const [financialYearDropList, setFinancialYearDropList] = useState([]);
  

  const [showAll, setShowAll] = useState(false);
  const [showBlockName, setShowBlockName] = useState(false);
  const [showHeadAcc, setShowHeadAcc] = useState(false);
  const [showProSubBy, setShowProSubBy] = useState(false);
  const [showProImpleBy, setShowProImpleBy] = useState(false);
  const [showAdmiApprovPdf, setAdmiApprovPdf] = useState(false);
  const [showVettedDPR, setVettedDPR] = useState(false);
  const [showScheAmt, setScheAmt] = useState(false);
  const [showContiAmt, setContiAmt] = useState(false);
  const [showTenderDtl, setTenderDtl] = useState(false);
  const [showProgresDtl, setProgresDtl] = useState(false);
  const [showFundDtl, setFundDtl] = useState(false);
  const [showExpendDtl, setExpendDtl] = useState(false);
  const [showUtilizationDtl, setUtilizationDtl] = useState(false);


  const location = useLocation();
  const secoundValue = location.state?.secoundValue || "";
  const thirdValue = location.state?.thirdValue || "";


  const [visibleMenu, setVisibleMenu] = useState(false);

  const [modalTitle, setModalTitle] = useState("");
  const [financeYear_submit, setFinanceYear_submit] = useState("");
  const [secoundField_submit, setSecoundField_submit] = useState("");
  const [thirdField_submit, setThirdField_submit] = useState("");

  const navigate = useNavigate()
  const params = useParams();
  const [selectedYear, setSelectedYear] = useState("");
  const [headAccountDropList, setHeadAccountDropList] = useState([]);

  // const [districtDropList, setDistrictDropList] = useState([]);
  const [district_ID, setDistrict_ID] = useState([]);

  const [blockDropList, setBlockDropList] = useState(() => []);
  const [blockDropList_Load, setBlockDropList_Load] = useState(() => []);

  const [printYear, setPrintYear] = useState('');
  const [printSecoundField, setPrintSecoundField] = useState('');
  const [printThirdField, setPrintThirdField] = useState('');


  const openModal_Menu = (title) => {
    setModalTitle(title);
    setVisibleMenu(true);
  };


  const fetchFinancialYeardownOption = async () => {
    setLoading(true);
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Mdapi/fin_year',
        formData, // Empty body
        {
          headers: {
            'auth_key': auth_key,
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );

      setFinancialYearDropList(response.data.message)

      if (params?.id > 0) {
        setSelectedYear(params?.id); // Set first year as default (modify if needed)

        // setSecoundField_submit(secoundValue)
        // setThirdField_submit(thirdValue)

      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      setLoading(false);
      
      localStorage.removeItem("user_dt");
      navigate('/')
    }
  };

  const fetchHeadAccountdownOption = async () => {
    setLoading(true);
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Mdapi/dist',
        formData, // Empty body
        {
          headers: {
            'auth_key': auth_key,
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );

      setHeadAccountDropList(response.data.message)

      if (params?.id > 0) {
        setSecoundField_submit(secoundValue)
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error); // Handle errors properly
      
      localStorage.removeItem("user_dt");
      navigate('/')
    }
  };

  const fetchBlockdownOption = async () => {

    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    formData.append('dist_id', district_ID);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Mdapi/block',
        // { dist_id: district_ID }, // Empty body
        formData,
        {
          headers: {
            'auth_key': auth_key,
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );

      setBlockDropList(response.data.message)

      if (params?.id > 0) {
        setThirdField_submit(thirdValue)
      }

    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      
      localStorage.removeItem("user_dt");
      navigate('/')
    }
  };


  useEffect(() => {
    fetchBlockdownOption()
  }, [district_ID])


  const fetchBlockdownOption_viewChange = async (districtID) => {
  const tokenValue = await getLocalStoreTokenDts(navigate);

  const formData = new FormData();
  formData.append('dist_id', districtID);
  formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Mdapi/block',
        // { dist_id: districtID }, 
        formData,
        {
          headers: { 'auth_key': auth_key },
        }
      );
  
      setBlockDropList(response.data.message);
  
      // If thirdValue (block_id) exists, pre-select it
      if (thirdValue) {
        formik.setFieldValue("block", thirdValue);
      }
    } catch (error) {
      console.error("Error fetching blocks:", error);
      
      localStorage.removeItem("user_dt");
      navigate('/')
    }
  };

  useEffect(() => {
    if (thirdValue) {
      fetchBlockdownOption_viewChange(secoundValue);
    }
  }, [thirdValue]); // Runs when thirdValue changes



  useEffect(()=>{
    // fundAddedList()
    fetchFinancialYeardownOption()
    fetchHeadAccountdownOption()
    }, [])




  const showReport = async (params)=>{
    setLoading(true);
    const tokenValue = await getLocalStoreTokenDts(navigate);
    const formData = new FormData();
  
    // Append each field to FormData
    formData.append("fin_year", params > 0 ? params : formik.values.fin_yr);
    formData.append("account_head_id", 0);
    formData.append("sector_id", 0);
    // formData.append("dist_id", secoundValue.length > 0 ? secoundValue : formik.values.head_acc);
    // formData.append("block_id", thirdField_submit.length > 0 ? thirdValue : formik.values.block);
    formData.append("dist_id", formik.values.head_acc);
    formData.append("block_id", formik.values.block);
    formData.append("impl_agency", 0);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token
//     sector_id:0,
// dist_id:0,
// block_id:0,
// impl_agency:0
    setFinanceYear_submit(formik.values.fin_yr)
    setSecoundField_submit(formik.values.head_acc)
    setThirdField_submit(formik.values.block)


    try {
      const response = await axios.post(
        `${url}index.php/webApi/Report/proj_dtl_finawith`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'auth_key': auth_key,
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );

      
      if(response?.data?.status > 0){
        setLoading(false);
        setReportData(response?.data?.message)
        setPrintYear(response?.data?.fin_year_name)
        setPrintSecoundField(response?.data?.dist_name)
        setPrintThirdField(response?.data?.block_name)
        // setShowForm(true);
      }

      if(response?.data?.status < 1){
        setLoading(false);
        setReportData([])
        setPrintYear('')
        setPrintSecoundField('')
        setPrintThirdField('')
      }
    } catch (error) {
      setLoading(false);
      Message("error", "Error Submitting Form:");
      console.error("Error submitting form:", error);
      
      localStorage.removeItem("user_dt");
      navigate('/')
    }
    

  }

    useEffect(()=>{
      if(params?.id > 0){
        showReport(params?.id)
      }
    }, [])

  const onSubmit = (values) => {
      showReport()
    };
  
    const formik = useFormik({
      initialValues: { fin_yr: financeYear_submit || selectedYear, head_acc: secoundField_submit || secoundValue, block: thirdField_submit || thirdValue },

      onSubmit,
      validationSchema,
      enableReinitialize: true,
      validateOnMount: true,
    });

    const handleShowAllChange = () => {
      const newValue = !showAll;
      setShowAll(newValue);
      setShowBlockName(newValue);
      setShowHeadAcc(newValue);
      setShowProSubBy(newValue);
      setShowProImpleBy(newValue);
      setAdmiApprovPdf(newValue);
      setVettedDPR(newValue);
      setScheAmt(newValue);
      setContiAmt(newValue);
      setTenderDtl(newValue);
      setProgresDtl(newValue);
      setFundDtl(newValue);
      setExpendDtl(newValue);
      setUtilizationDtl(newValue);
    };
  
      // Download & Print Function Start 
      
        const excelData_land = reportData.map((item, index) => ({
          'Sl. No': index + 1, // Adding Serial Number
          'Project ID': item.project_id == '' ? '--' : item.project_id,
          'Date of Administrative Approval': item.admin_approval_dt == '' ? '--' : item.admin_approval_dt,
          'Scheme': item.scheme_name == '' ? '--' : item.scheme_name,
          'Sector': item.sector_name == '' ? '--' : item.sector_name,
          'Schematic Amount': item.fr_sch_amt == '' ? '--' : item.fr_sch_amt,
          'Contigency Amount': item.fr_cont_amt == '' ? '--' : item.fr_cont_amt,
          'Total Amount': ((parseFloat(item.fr_sch_amt) || 0) + (parseFloat(item.fr_cont_amt) || 0)).toFixed(2),
          'Head Account': item.account_head_name == '' ? '--' : item.account_head_name,
          'District': item.dist_name == '' ? '--' : item.dist_name,
          'Block': item.block_name == '' ? '--' : item.block_name,
          'Source of Fund': item.source_of_fund == '' ? '--' : item.source_of_fund,
          'Project Submitted by': item.project_submitted_by == '' ? '--' : item.project_submitted_by,
          'Project Implemented by': item.agency_name == '' ? '--' : item.agency_name,
        }));
        excelData_land.push({
          'Sl. No': 'Total',
          'Project ID': '',
          'Date of Administrative Approval': '',
          'Scheme': '',
          'Sector': '',
          'Schematic Amount': reportData.reduce((sum, item) => sum + (parseFloat(item?.fr_sch_amt) || 0), 0).toFixed(2),
          'Contigency Amount': reportData.reduce((sum, item) => sum + (parseFloat(item?.fr_cont_amt) || 0), 0).toFixed(2),
          'Total Amount': reportData.reduce((sum, item) => sum + ((parseFloat(item?.fr_sch_amt) || 0) + (parseFloat(item?.fr_cont_amt) || 0)), 0).toFixed(2),
          'Head Account': '',
          'District': '',
          'Block': '',
          'Source of Fund': '',
          'Project Submitted by': '',
          'Project Implemented by': '',
        });
    
        const exportExcelHandler = (para) => {
          // alert(para)
          // const ws = XLSX.utils.json_to_sheet(excelData_tender);
      
          // Create a new workbook and worksheet
          var worksheet;
      
          const workbook = XLSX.utils.book_new();
          if (para == 'land') {
            worksheet = XLSX.utils.json_to_sheet(excelData_land);
          }
      
          // Append the worksheet to the workbook
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      
          // Generate a binary string representing the Excel file
          const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
          });
      
          // Use file-saver to trigger a download
          const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      
          if (para == 'land') {
            saveAs(blob, `${PrintPageName.Financial.replace(/\s+/g, '')}` + `${printYear}` + '.xlsx');
          }
      
        };
      
      
        const printData = (para) => {
          const printWindow = window.open('', '', 'width=800,height=600');
          printWindow.document.write(`
            <html>
            <head>
              <title>Report</title>
              <style>
              .logo{text-align: center; padding: 0 0 10px 0;}
              .logo img{width:80px;}
              h3{text-align: center; font-size: 15px; font-weight: 400; padding: 0 0 7px 0; margin: 0; line-height: 15px;}
              h2{text-align: center; font-size: 16px; font-weight: 700; padding: 0 0 12px 0; margin: 0; line-height: 15px;}
              p{text-align: center; font-size: 14px; font-weight: 400; padding: 0 0 10px 0; margin: 0; line-height: 15px;}
                body {
                  font-family: Arial, sans-serif;
                  font-size: 11px;
                }
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
                }
              </style>
            </head>
            <body>
            ${getPrintCommonHeader()}
            <h2>${PrintPageName.District} Year: ${printYear} District: ${printSecoundField} Block: ${printThirdField}</h2>
          `);
      
          if (para === 'land') {
            printWindow.document.write(`
              <table>
                <tr>
                  ${Object.keys(excelData_land[0] || {}).map((key) => `<th>${key}</th>`).join('')}
                </tr>
                ${excelData_land.map(row => `
                  <tr>
                    ${Object.values(row).map(value => `<td>${value}</td>`).join('')}
                  </tr>
                `).join('')}
              </table>
            `);
          }
      
          printWindow.document.write(`
              <p class="disclam">“This document is computer generated and does not require any signature”.</p>
            </body>
            </html>
          `);
      
          printWindow.document.close();
          printWindow.print();
        };
      
        // Download & Print Function End
  

  return (
    <section className="bg-white p-5 dark:bg-gray-900">
      <div className="py-5 mx-auto w-full lg:py-5">
        <div className="grid grid-cols-1 gap-4">
          {/* <div className="col-span-1"> */}
          {/* <Heading title={editingAccountHead ? "Edit Account Head" : "Add Account Head"} button="N" /> */}
            <Heading title={"District Wise  Report"} button="N" />

            <form onSubmit={formik.handleSubmit}>
          <div class="grid gap-4 sm:grid-cols-12 sm:gap-6">

          <div class="sm:col-span-4">
              <label for="fin_yr" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Financial Year</label>
              <Select
              showSearch
                placeholder="Choose Financial Year"
                value={formik.values.fin_yr || undefined} // Ensure default empty state
                onChange={(value) => {
                  formik.setFieldValue("fin_yr", value)
                }}
                onBlur={formik.handleBlur}
                style={{ width: "100%" }}
                optionFilterProp="children"
                filterOption={(input, option) => // Search
                option?.children?.toLowerCase().includes(input.toLowerCase()) // Search
                } // Search
              >
                <Select.Option value="" disabled> Choose Financial Year </Select.Option>
                {financialYearDropList?.map(data => (
                  <Select.Option key={data.sl_no} value={data.sl_no}>
                    {data.fin_year}
                  </Select.Option>
                ))}
              </Select>

              {formik.errors.fin_yr && formik.touched.fin_yr && (
                <VError title={formik.errors.fin_yr} />
              )}
            </div>

            <div class="sm:col-span-4">
              

              <label for="head_acc" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">District</label>
    

              <Select
              showSearch
                placeholder="Choose District"
                value={formik.values.head_acc || undefined} // Ensure default empty state
                onChange={(value) => {
                  formik.setFieldValue("head_acc", value)
                  setDistrict_ID(value)
                  formik.setFieldValue("block", "");
                  setBlockDropList([]);
                  setBlockDropList_Load([]);
                  
                }}
                onBlur={formik.handleBlur}
                style={{ width: "100%" }}
                optionFilterProp="children"
                filterOption={(input, option) => // Search
                option?.children?.toLowerCase().includes(input.toLowerCase()) // Search
                } // Search
              >
                <Select.Option value="" disabled> Choose District </Select.Option>
                {headAccountDropList?.map(data => (
                  <Select.Option key={data.dist_code} value={data.dist_code}>
                    {data.dist_name}
                  </Select.Option>
                ))}
              </Select>

              {formik.errors.head_acc && formik.touched.head_acc && (
                <VError title={formik.errors.head_acc} />
              )}
            </div>

            <div class="sm:col-span-4">


              <label for="block" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Block</label>
              <Select
              showSearch
                placeholder="Choose Block"
                // value={formik.values.block || undefined} // Ensure default empty state
                value={blockDropList_Load[0]?.block_name ? blockDropList_Load[0]?.block_name : formik.values.block || undefined}
                onChange={(value) => {
                  formik.setFieldValue("block", value)
                  // setDistrict_ID(value)
                }}
                onBlur={formik.handleBlur}
                style={{ width: "100%" }}
                optionFilterProp="children"
                filterOption={(input, option) => // Search
                option?.children?.toLowerCase().includes(input.toLowerCase()) // Search
                } // Search
              >
                <Select.Option value="" disabled> Choose Block </Select.Option>
                {blockDropList.map(data => (
                  <Select.Option key={data.block_id} value={data.block_id}>
                    {data.block_name}
                  </Select.Option>
                ))}
              </Select>
              {/* {JSON.stringify(blockDropList_Load[0]?.block_name, null, 2)} */}
              {formik.errors.block && formik.touched.block && (
                <VError title={formik.errors.block} />
              )}
            </div>

            <div className="sm:col-span-12 flex justify-left gap-4 mt-0">
            <BtnComp type={'submit'} title={'Submit'} onClick={() => { }} width={'w-1/6'} bgColor={'bg-blue-900'} />
            <BtnComp title={'Reset'} type="reset" 
            onClick={() => { 
            formik.resetForm();
            }}
            width={'w-1/6'} bgColor={'bg-white'} color="text-blue-900" border={'border-2 border-blue-900'} />

          

          <button type="button" class="text-blue-700 bg-blue-900 hover:text-white border border-blue-700 hover:bg-blue-800 
              font-medium rounded-lg text-sm px-3 py-1.8 text-center 
              me-0 mb-0 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 
              dark:focus:ring-blue-800 ml-auto"
              onClick={() => { navigate(`/home/report/district-report-graph/${financeYear_submit == "" ? params?.id : financeYear_submit}`, {
                state: {
                // ...data, // Spread existing rowData

                // secoundValue: secoundField_submit == "" ? secoundField_submit : secoundValue || secoundField_submit,
                // thirdValue_graph: thirdField_submit == "" ? thirdField_submit : thirdValue || thirdField_submit, // Explicitly include approval_status
                secoundValue: secoundField_submit > 0 ? secoundField_submit : '',
                thirdValue: thirdField_submit > 0 ? thirdField_submit : '',

                },
                }) }} 
              > <BarChartOutlined /> Graphical View</button>
            
             
            </div>
          </div>

        </form>

        {/* {JSON.stringify(thirdValue, null, 2)} /// {JSON.stringify(thirdField_submit, null, 2)} */}

        <Spin
                      indicator={<LoadingOutlined spin />}
                      size="large"
                      className="text-gray-500 dark:text-gray-400"
                      spinning={loading}
                    >
                      {/*  */}
                      <>
                        <Toast ref={toast} />
                        {reportData.length > 0 && (
          
                          <>
          
                            <div className="grid gap-4 sm:grid-cols-12 sm:gap-6 mb-3">
                              <div className="sm:col-span-12 ml-auto">
                              <button onClick={()=>{printData('land')}} className="downloadXL"><PrinterOutlined /> Print</button>
                                <button onClick={()=>{exportExcelHandler('land')}} className="downloadXL"><FileExcelOutlined /> Download</button>
                                <a href="#" onClick={(e) => {
                                  e.preventDefault();
                                  openModal_Menu('Select Column');
                                }}
                                  style={{ cursor: "pointer", background: "#3EB8BD", paddingLeft: 8, paddingRight: 8, paddingTop: 5, paddingBottom: 5, borderRadius: 5 }}
                                >
                                  <UnorderedListOutlined style={{ fontSize: 20, color: "#fff", fontWeight: 700 }} />
                                </a>
                              </div>
                            </div>
                          </>
                        )}
          
                        <div className="table_cus">
          
          
          
                          {/* {JSON.stringify(reportData, null, 2)} */}
          
                          <ReportTable reportData={reportData}
                          reportName = {'district'}
                          printYear = {printYear}
                          printSecoundField = {printSecoundField}
                          printThirdField = {printThirdField}
                  shortColumn={{
                    showAll,
                    showBlockName,
                    showHeadAcc,
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
                    showUtilizationDtl
                  }} />
          
          
                        </div>
                      </>
                      {/* )} */}
          
                    </Spin>

                    <Dialog
                            header={modalTitle}
                            visible={visibleMenu}
                            style={{ width: "70vw", maxWidth: "800px" }}
                            onHide={() => setVisibleMenu(false)}
                            dismissableMask={true}
                          >
                            {reportData.length > 0 && (
                              <div className="mb-4 checkBox">
          
          
                                <Checkbox
                                  checked={showAll}
                                  onChange={handleShowAllChange}
                                > Show All
                                </Checkbox>
          
                                <Checkbox
                                  checked={showHeadAcc}
                                  onChange={(e) => setShowHeadAcc(e.target.checked)}
                                > Show Head Of Account
                                </Checkbox>
          
                                <Checkbox
                                  checked={showProSubBy}
                                  onChange={(e) => setShowProSubBy(e.target.checked)}
                                > Show Project Submitted by
                                </Checkbox>
          
                                <Checkbox
                                  checked={showProImpleBy}
                                  onChange={(e) => setShowProImpleBy(e.target.checked)}
                                > Show Project Implemented by
                                </Checkbox>
          
                                <Checkbox
                                  checked={showAdmiApprovPdf}
                                  onChange={(e) => setAdmiApprovPdf(e.target.checked)}
                                > Show Administrative Approval(G.O)
                                </Checkbox>
          
                                <Checkbox
                                  checked={showVettedDPR}
                                  onChange={(e) => setVettedDPR(e.target.checked)}
                                > Show Vetted DPR
                                </Checkbox>
          
          
                                <Checkbox
                                  checked={showScheAmt}
                                  onChange={(e) => setScheAmt(e.target.checked)}
                                > Show Schematic Amount
                                </Checkbox>
          
                                <Checkbox
                                  checked={showContiAmt}
                                  onChange={(e) => setContiAmt(e.target.checked)}
                                > Show Contigency Amount
                                </Checkbox>
          
                                <Checkbox
                                  checked={showTenderDtl}
                                  onChange={(e) => setTenderDtl(e.target.checked)}
                                > Show Tender Details
                                </Checkbox>
          
          
                                <Checkbox
                                  checked={showProgresDtl}
                                  onChange={(e) => setProgresDtl(e.target.checked)}
                                > Show Progress Details
                                </Checkbox>
          
                                <Checkbox
                                  checked={showFundDtl}
                                  onChange={(e) => setFundDtl(e.target.checked)}
                                > Show Fund Details
                                </Checkbox>
          
          
                                <Checkbox
                                  checked={showExpendDtl}
                                  onChange={(e) => setExpendDtl(e.target.checked)}
                                > Show Expenditure Details
                                </Checkbox>
          
                                <Checkbox
                                  checked={showUtilizationDtl}
                                  onChange={(e) => setUtilizationDtl(e.target.checked)}
                                > Show Utilization Certificate Details
                                </Checkbox>
          
                              </div>
                            )}
                          </Dialog>
          {/* </div> */}

          
        </div>
      </div>
    </section>
  );
}

export default District_Report;
