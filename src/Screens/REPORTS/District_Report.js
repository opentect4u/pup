import React, { useEffect, useRef, useState } from "react";
import TDInputTemplate from "../../Components/TDInputTemplate";
import BtnComp from "../../Components/BtnComp";
import Heading from "../../Components/Heading";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Message } from "../../Components/Message";
import { BarChartOutlined, EditOutlined, EyeOutlined, FilePdfOutlined, LoadingOutlined, MenuOutlined, UnorderedListOutlined } from "@ant-design/icons";
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
  const [editingAccountHead, setEditingAccountHead] = useState(null); // New state for editing
  const [fundStatus, setFundStatus] = useState(() => []);
  const [reportData, setReportData] = useState(() => []);
  const toast = useRef(null)
  const [financialYearDropList, setFinancialYearDropList] = useState([]);
  const [detailsReport, setDetailsReport] = useState([]);
  const [final_pic, setFinal_pic] = useState([]);

  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  

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

  const [showBlockName, setShowBlockName] = useState(false);
  const [showSourceOfFund, setShowSourceOfFund] = useState(false);
  const [showProjectSubmit, setShowProjectSubmit] = useState(false);
  const [showProjectImplemented, setShowProjectImplemented] = useState(false);

  const location = useLocation();
  const secoundValue = location.state?.secoundValue || "";
  const thirdValue = location.state?.thirdValue || "";

  const [showAll, setShowAll] = useState(false);

  const [visible, setVisible] = useState(false);
  const [visibleMenu, setVisibleMenu] = useState(false);
  const [visibleTender, setVisibleTender] = useState(false);
  const [visibleProgress, setVisibleProgress] = useState(false);
  const [visibleFund, setVisibleFund] = useState(false);
  const [visibleExpend, setVisibleExpend] = useState(false);
  const [visibleUtilization, setVisibleUtilization] = useState(false);

  const [pdfUrl, setPdfUrl] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalTitleTable, setModalTitleTable] = useState("");
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

  const openModal = (file, foldername,  title) => {
    setPdfUrl(url + foldername + file);
    setModalTitle(title);
    setVisible(true);
  };

  const openModal_Menu = (title) => {
    setModalTitle(title);
    setVisibleMenu(true);
  };


  const tenderDetails = async (file, title)=>{
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

      if(response?.data?.status > 0){
      console.log(formData, "yyyyyyyyyyyyyyyyyy", response.data.message); // Log the actual response data
      setVisibleTender(true);
      setDetailsReport(response.data.message)
      setLoading(false);
      }

      if(response?.data?.status < 1){
        setDetailsReport([])
        setLoading(false);
      }


    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      setLoading(false);
    }
  }

  const progressDetails = async (file, title)=>{
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

      if(response?.data?.status > 0){
      console.log(response?.data?.status, "progresssssssssss", response.data.message); // Log the actual response data
      setVisibleProgress(true);
      setDetailsReport(response.data.message)
      setLoading(false);
      }

      if(response?.data?.status < 1){
        setDetailsReport([])
        setLoading(false);
      }

      
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      setLoading(false);
    }
  }

  const fundDetails = async (file, title)=>{
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

      if(response?.data?.status > 0){
      console.log(response?.data?.status, "fund", response.data.message); // Log the actual response data
      setVisibleFund(true);
      setDetailsReport(response.data.message)
      setLoading(false);
      }

      if(response?.data?.status < 1){
        setDetailsReport([])
        setLoading(false);
      }

      
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      setLoading(false);
    }
  }

  const expendDetails = async (file, title)=>{
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

      if(response?.data?.status > 0){
      console.log(response?.data?.status, "expenditure", response.data.message); // Log the actual response data
      setVisibleExpend(true);
      setDetailsReport(response.data.message)
      setLoading(false);
      }

      if(response?.data?.status < 1){
        setDetailsReport([])
        setLoading(false);
      }

      
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      setLoading(false);
    }
  }

  const utilizationDetails = async (file, title)=>{
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

      if(response?.data?.status > 0){
      console.log(response?.data?.status, "utilization", response.data.final_pic); // Log the actual response data
      setVisibleUtilization(true);
      setDetailsReport(response?.data?.message)
      setFinal_pic(response?.data?.final_pic)
      setLoading(false);
      }

      if(response?.data?.status < 1){
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
    

    if(identy == 'tender'){
      tenderDetails(file, title)
    }
    if(identy == 'progress'){
      progressDetails(file, title)
    }

    if(identy == 'fund'){
      fundDetails(file, title)
    }

    if(identy == 'expend'){
      expendDetails(file, title)
    }

    if(identy == 'utiliz'){
      utilizationDetails(file, title)
    }
    
    

    
  };
  



  const fetchFinancialYeardownOption = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Mdapi/fin_year',
        {}, // Empty body
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      // console.log("Response Data:", response.data.message); // Log the actual response data
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
    }
  };

  const fetchHeadAccountdownOption = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Mdapi/dist',
        {}, // Empty body
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      console.log("Response Data:", response.data.message); // Log the actual response data
      setHeadAccountDropList(response.data.message)

      if (params?.id > 0) {
        setSecoundField_submit(secoundValue)
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error); // Handle errors properly
    }
  };

  const fetchBlockdownOption = async () => {
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Mdapi/block',
        { dist_id: district_ID }, // Empty body
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      console.log("Response Data__Block:", response.data.message); // Log the actual response data
      setBlockDropList(response.data.message)

      if (params?.id > 0) {
        setThirdField_submit(thirdValue)
      }

    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
    }
  };

  const fundAddedList = async () => {
    setLoading(true); // Set loading state
    
    
    const formData = new FormData();
    formData.append("approval_no", 2);

    try {
      const response = await axios.post(
        `${url}index.php/webApi/Fund/get_added_fund_list`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'auth_key': auth_key // Important for FormData
          },
        }
      );

      console.log("approvalNoapprovalNoapprovalNoapprovalNo", response?.data);

      if(response.data.status > 0){
        setFundStatus(response?.data?.message)
        // setFolderName(response.data.folder_name)
        setLoading(false);
        // setShowForm(true);
      }

      if(response.data.status < 1){
        setFundStatus([])
        setLoading(false);
        // setShowForm(false);
      }
      // setLoading(false);
      // Message("success", "Updated successfully.");
      // navigate(`/home/fund_release`);
    } catch (error) {
      setLoading(false);
      Message("error", "Error Submitting Form:");
      console.error("Error submitting form:", error);
    }

  };

  useEffect(() => {
    fetchBlockdownOption()
  }, [district_ID])


  const fetchBlockdownOption_viewChange = async (districtID) => {
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Mdapi/block',
        { dist_id: districtID }, 
        {
          headers: { 'auth_key': auth_key },
        }
      );
  
      console.log("Response Data__Block:", response.data.message);
      setBlockDropList(response.data.message);
  
      // If thirdValue (block_id) exists, pre-select it
      if (thirdValue) {
        formik.setFieldValue("block", thirdValue);
      }
    } catch (error) {
      console.error("Error fetching blocks:", error);
    }
  };

  useEffect(() => {
    if (thirdValue) {
      // formik.setFieldValue("block", thirdValue);
      fetchBlockdownOption_viewChange(secoundValue);
    }
  }, [thirdValue]); // Runs when thirdValue changes



  useEffect(()=>{
    fundAddedList()
    fetchFinancialYeardownOption()
    fetchHeadAccountdownOption()
    }, [])


const onPageChange = (event) => {
    setCurrentPage(event.first)
    setRowsPerPage(event.rows)
  }

  const showReport = async (params)=>{
    setLoading(true);
    const formData = new FormData();
  
    // Append each field to FormData
    formData.append("fin_year", params > 0 ? params : formik.values.fin_yr);
    formData.append("account_head_id", 0);
    formData.append("sector_id", 0);
    formData.append("dist_id", secoundValue.length > 0 ? secoundValue : formik.values.head_acc);
    formData.append("block_id", thirdField_submit.length > 0 ? thirdValue : formik.values.block);
    formData.append("impl_agency", 0);
//     sector_id:0,
// dist_id:0,
// block_id:0,
// impl_agency:0
    console.log(formik.values.head_acc, 'formData______________', formik.values.block);
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
            'auth_key': auth_key // Important for FormData
          },
        }
      );

      console.log(response?.data?.message, 'xxxxxxxxxxxxxxxx', formData);
      
      if(response?.data?.status > 0){
        setLoading(false);
        setReportData(response?.data?.message)
        // setShowForm(true);
      }

      if(response?.data?.status < 1){
        setLoading(false);
        setReportData([])
      }
    } catch (error) {
      setLoading(false);
      Message("error", "Error Submitting Form:");
      console.error("Error submitting form:", error);
    }
    

  }

    useEffect(()=>{
      // console.log(params?.id.length, 'locaaaaaaaaaaaaaaaaa');
      
      if(params?.id > 0){
        showReport(params?.id)
      }
    }, [])

  const onSubmit = (values) => {
      // console.log(values, 'credcredcredcredcred', formik.values.scheme_name);
      showReport()
      
    };
  
    const formik = useFormik({
      // initialValues:formValues,
      // initialValues,

      initialValues: { fin_yr: selectedYear, head_acc: secoundField_submit || secoundValue, block: thirdField_submit || thirdValue },

      onSubmit,
      validationSchema,
      enableReinitialize: true,
      validateOnMount: true,
    });

    const handleShowAllChange = () => {
      const newValue = !showAll;
      setShowAll(newValue);
      setShowBlockName(newValue);
      setShowSourceOfFund(newValue);
      setShowProjectSubmit(newValue);
      setShowProjectImplemented(newValue);


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
                placeholder="Choose Financial Year"
                value={formik.values.fin_yr || undefined} // Ensure default empty state
                onChange={(value) => {
                  formik.setFieldValue("fin_yr", value)
                  // console.log(value, 'ggggggggggggggggggg');
                }}
                onBlur={formik.handleBlur}
                style={{ width: "100%" }}
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
                placeholder="Choose Block"
                // value={formik.values.block || undefined} // Ensure default empty state
                value={blockDropList_Load[0]?.block_name ? blockDropList_Load[0]?.block_name : formik.values.block || undefined}
                onChange={(value) => {
                  formik.setFieldValue("block", value)
                  // setDistrict_ID(value)
                  console.log(value, 'blockblockblock');
                }}
                onBlur={formik.handleBlur}
                style={{ width: "100%" }}
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
{reportData.length > 0 &&(
  <div className="grid gap-4 sm:grid-cols-12 sm:gap-6 mb-3">
          <div className="sm:col-span-12 ml-auto">
          <a href="#" onClick={(e) => {
          e.preventDefault();
          openModal_Menu('Select Column');
          }}
          style={{ cursor: "pointer", background:"#3EB8BD", paddingLeft:8, paddingRight:8, paddingTop:5, paddingBottom:5, borderRadius:5}}
          >
          <UnorderedListOutlined style={{ fontSize: 20, color: "#fff", fontWeight:700 }} />
          </a>
          </div>
          </div>
          )}

           <div className="table_cus">

           

            

          <DataTable
          value={reportData?.map((item, i) => [{ ...item, id: i }]).flat()}
          selectionMode="checkbox"
          tableStyle={{ minWidth: "50rem" }}
          dataKey="id"
          paginator
          rows={rowsPerPage }
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
          headerStyle={{ width: '350em', textAlign: 'left', wordWrap: 'break-word'  }}
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

          <Dialog
        header={modalTitle}
        visible={visibleMenu}
        style={{ width: "70vw", maxWidth: "800px" }}
        onHide={() => setVisibleMenu(false)}
        dismissableMask={true}
      >
        {reportData.length > 0 &&(
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

          <Dialog
        header={modalTitle}
        visible={visible}
        style={{ width: "70vw", maxWidth: "800px" }}
        onHide={() => setVisible(false)}
        dismissableMask={true}
      >
        {pdfUrl && (
          <iframe
            src={pdfUrl}
            width="100%"
            height="500px"
            title={modalTitle}
          ></iframe>
        )}
      </Dialog>

      <Dialog
        header={'Tender Details '+'(Project ID: '+modalTitleTable+')'}
        // header='modalTitle'
        visible={visibleTender}
        style={{ width: "100vw", maxWidth: "1200px" }}
        onHide={() => setVisibleTender(false)}
        dismissableMask={true}
      >
        <DataTable
          value={detailsReport?.map((item, i) => [{ ...item, id: i }]).flat()}
          selectionMode="checkbox"
          tableStyle={{ minWidth: "50rem" }}
          dataKey="id"
          tableClassName="w-full text-sm text-left rtl:text-right shadow-lg text-green-900dark:text-gray-400 table_Custome table_Custome_1st" // Apply row classes
          >
          <Column
          header="Sl No."
          body={(rowData) => (
          <span style={{ fontWeight: "bold" }}>{rowData?.id + 1}</span>
          )}
          // footer={
          //   <span style={{ fontWeight: "bold", color: "#0694A2" }}>
          //   Total: 
          //   </span>
          //   }
          ></Column>

          <Column
          field="tender_date"
          header="Tender Date"
          ></Column>

          <Column
          field="tender_notice"
          header="Tender Notice"
          body={(rowData) => (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openModal(rowData?.tender_notice, folder_tender, "Tender Notice PDF");
              }}
              style={{ cursor: "pointer" }}
            >
              <FilePdfOutlined style={{ fontSize: 18, color: "red" }} />
            </a>
          )}
          ></Column>

          <Column
          field="invite_auth"
          header="Tender Inviting Authority"
          ></Column>

          <Column
          field="mat_date"
          header="Tender Matured"
          ></Column>

          <Column
          field="tender_status"
          header="Tender Status"
          body={(rowData) => (
            <>
            {rowData.tender_status == "M" ? 'Yes' : 'No'}
            </>
          )}
          ></Column>

          <Column
          field="wo_date"
          header="Work Order Issued"
          ></Column>

          <Column
          field="wo_copy"
          header="Work Order Copy"
          body={(rowData) => (
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
          )}
          ></Column>

          <Column
          field="wo_value"
          header="Work Order Value"
          ></Column>

          <Column
          field="comp_date_apprx"
          header="Tentative Date of Completion"
          ></Column>

          <Column
          field="amt_put_to_tender"
          header="Amount Put to Tender"
          ></Column>

<Column
          field="dlp"
          header="DLP"
          ></Column>

<Column
          field="add_per_security"
          header="Additional Performance Security"
          ></Column>

<Column
          field="emd"
          header="EMD"
          ></Column>

<Column
          field="date_of_refund"
          header="Date Of Refund"
          ></Column>
          

          </DataTable>
        
      </Dialog>

      <Dialog
        header={'Pregress Details '+'(Project ID: '+modalTitleTable+')'}
        // header='modalTitle'
        visible={visibleProgress}
        style={{ width: "100vw", maxWidth: "1200px" }}
        onHide={() => setVisibleProgress(false)}
        dismissableMask={true}
      >
        <DataTable
          value={detailsReport?.map((item, i) => [{ ...item, id: i }]).flat()}
          selectionMode="checkbox"
          tableStyle={{ minWidth: "50rem" }}
          dataKey="id"
          tableClassName="w-full text-sm text-left rtl:text-right shadow-lg text-green-900dark:text-gray-400 table_Custome table_Custome_1st" // Apply row classes
          >
          <Column
          header="Sl No."
          body={(rowData) => (
          <span style={{ fontWeight: "bold" }}>{rowData?.id + 1}</span>
          )}

          ></Column>

          <Column
          // field="progress_percent"
          header="Progress Percent"
          body={(rowData) => (
            <>
            {rowData.progress_percent + '%'}
            </>
          )}
          ></Column>

          <Column
          field="address"
          header="Address"
          ></Column>

          <Column
          field="created_at"
          header="Created At"
          ></Column>

          <Column
          field="pic_path"
          header="Project Status photo"
          body={(rowData) => (
            <>
            {rowData?.pic_path.length > 0 && (
              <>
              <div className="place-content-left flex items-left gap-4">
              {/* {JSON.stringify(rowData?.pic_path, null, 2)} */}
              {/* {rowData?.pic_path?.map((imgPath, index) => ( */}
              {JSON.parse(rowData?.pic_path)?.map((imgPath, index) => (  
              <>
              <Image width={80} className="mr-3 lightBox_thum" src={url + folder_progresImg + imgPath} />
              </>
              ))}
              </div>
              </>
            )}
            
            </>
          )}
          ></Column>

          
          

          </DataTable>
        
      </Dialog>

      <Dialog
        header={'Fund Release Details '+'(Project ID: '+modalTitleTable+')'}
        // header='modalTitle'
        visible={visibleFund}
        style={{ width: "100vw", maxWidth: "1200px" }}
        onHide={() => setVisibleFund(false)}
        dismissableMask={true}
      >
        <DataTable
          value={detailsReport?.map((item, i) => [{ ...item, id: i }]).flat()}
          selectionMode="checkbox"
          tableStyle={{ minWidth: "50rem" }}
          dataKey="id"
          tableClassName="w-full text-sm text-left rtl:text-right shadow-lg text-green-900dark:text-gray-400 table_Custome table_Custome_1st" // Apply row classes
          >
          <Column
          header="Sl No."
          body={(rowData) => (
          <span style={{ fontWeight: "bold" }}>{rowData?.id + 1}</span>
          )}
          ></Column>

          <Column
          field="receive_date"
          header="Receive Date"
          ></Column>

          <Column
          field="received_by"
          header="Received By"
          ></Column>

          <Column
          field="instl_amt"
          header="Instalment Amount"
          ></Column>

          <Column
          // field="receive_no"
          header="Allotment No"
          body={(rowData) => (
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
          )}
          ></Column>

          <Column
          field="sch_amt"
          header="Schematic Amount"
          ></Column>

          <Column
          field="cont_amt"
          header="Contigency Amount"
          ></Column>
          

          

          
          

          </DataTable>
        
      </Dialog>

      <Dialog
        header={'Expenditure Details '+'(Project ID: '+modalTitleTable+')'}
        // header='modalTitle'
        visible={visibleExpend}
        style={{ width: "100vw", maxWidth: "1200px" }}
        onHide={() => setVisibleExpend(false)}
        dismissableMask={true}
      >
        <DataTable
          value={detailsReport?.map((item, i) => [{ ...item, id: i }]).flat()}
          selectionMode="checkbox"
          tableStyle={{ minWidth: "50rem" }}
          dataKey="id"
          tableClassName="w-full text-sm text-left rtl:text-right shadow-lg text-green-900dark:text-gray-400 table_Custome table_Custome_1st" // Apply row classes
          >
          <Column
          header="Sl No."
          body={(rowData) => (
          <span style={{ fontWeight: "bold" }}>{rowData?.id + 1}</span>
          )}
          ></Column>

          <Column
          field="payment_date"
          header="Payment Date"
          ></Column>

          <Column
          field="payment_to"
          header="Payment To"
          ></Column>

          <Column
          field="sch_amt"
          header="Schematic Amount"
          ></Column>

          <Column
          field="cont_amt"
          header="Contigency Amount"
          ></Column>

          <Column
          field="sch_remark"
          header="Schematic Remarks"
          ></Column>

          <Column
          field="cont_remark"
          header="Contigency Remarks"
          ></Column>

          </DataTable>
        
      </Dialog>

      <Dialog
        header={'Utilization Certificate Details '+'(Project ID: '+modalTitleTable+')'}
        // header='modalTitle'
        visible={visibleUtilization}
        style={{ width: "100vw", maxWidth: "1200px" }}
        onHide={() => setVisibleUtilization(false)}
        dismissableMask={true}
      >
        <DataTable
          value={detailsReport?.map((item, i) => [{ ...item, id: i }]).flat()}
          selectionMode="checkbox"
          tableStyle={{ minWidth: "50rem" }}
          dataKey="id"
          tableClassName="w-full text-sm text-left rtl:text-right shadow-lg text-green-900dark:text-gray-400 table_Custome table_Custome_1st" // Apply row classes
          >
          <Column
          header="Sl No."
          body={(rowData) => (
          <span style={{ fontWeight: "bold" }}>{rowData?.id + 1}</span>
          )}
          ></Column>

          <Column
          field="certificate_date"
          header="Certificate Date"
          ></Column>

          <Column
          // field="certificate_path"
          header="Certificate"
          body={(rowData) => (
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
          )}
          ></Column>

          <Column
          field="issued_by"
          header="Issued By"
          ></Column>

          <Column
          field="issued_to"
          header="Issued To"
          ></Column>

          <Column
          field="remarks"
          header="Remarks"
          ></Column>

          <Column
          // field="is_final"
          header="This Is Final Utilization Certificate?"
          body={(rowData) => (
            <>
            {rowData.is_final == "Y" ? 'Yes' : 'No'}
            </>
          )}
          ></Column>

          </DataTable>

          {final_pic.length > 0 &&(
          <div class="w-full p-4 text-left bg-white border border-gray-200 rounded-lg shadow-sm sm:p-0 dark:bg-gray-800 dark:border-gray-700 mt-5 mb-5 shadow-xl">
        <div class="flex flex-col justify-between p-4 leading-normal">
        <h5 class="mb-2 text-sm font-bold text-gray-900 dark:text-white">Utilization Certificate Final Photo</h5>

        <div className="place-content-left flex items-left gap-4">
        {/* {JSON.stringify(final_pic[0]?.final_pic , null, 2)} */}
        <Image width={80} className="mr-3" src={url + proj_final_pic + final_pic[0]?.final_pic} />
        {/* {JSON.parse(final_pic?.pic_path)?.map((imgPath, index) => (
        <>
        <Image width={80} className="mr-3 lightBox_thum" src={url + folderName + imgPath} />
        </>
        ))} */}
        </div>
        </div>
        </div>
        )}
        
      </Dialog>




           </div>
                      </>
                    {/* )} */}
           
                     </Spin>
          {/* </div> */}

          
        </div>
      </div>
    </section>
  );
}

export default District_Report;
