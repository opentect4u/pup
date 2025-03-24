import React, { useEffect, useRef, useState } from 'react'
import TDInputTemplate from '../../Components/TDInputTemplate'
import BtnComp from '../../Components/BtnComp'
import Heading from '../../Components/Heading'
import * as Yup from 'yup';
import { useFormik } from "formik";
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import VError from '../../Components/VError';
import axios from 'axios';
import { auth_key, url, folder_tender } from '../../Assets/Addresses/BaseUrl';
import { Message } from '../../Components/Message';
import { EditOutlined, FilePdfOutlined, LoadingOutlined } from '@ant-design/icons';
import { Select, Spin } from 'antd';
import { DataTable } from 'primereact/datatable';
import Column from 'antd/es/table/Column';
import { Toast } from "primereact/toast"
import Radiobtn from '../../Components/Radiobtn';


const options = [
	{
		label: "Yes",
		value: "M",
	},
	{
		label: "No",
		value: "N",
	}
	
	
]

const initialValues = {
  project_id: '',
  td_dt: '',
  td_pdf: '',
  tia: '',
  td_mt_dt: '',
  wo_dt: '',
  wo_pdf: '',
  wo_value: '',
  compl: '',

  amt_put_tender: '',
  dlp: '',
  add_per_sec: '',
  emd: '',
  date_refund: '',
};



const validationSchema = Yup.object({
  // project_id: Yup.string().required('Project ID / Approval Number is Required'),
  td_dt: Yup.string().required('Tender Invited On is Required'),
  td_pdf: Yup.string().required('Tender Notice is Required'),
  tia: Yup.string().required('Tender Inviting Authority is Required'),
  td_mt_dt: Yup.string().required('Tender Matured On is Required'),
  wo_dt: Yup.string().required('Work Order Issued On is Required'),
  wo_pdf: Yup.string().required('Work Order Copy is Required'),
  wo_value: Yup.string().required('Work Order Value is Required'),
  compl: Yup.string().required('Tentative Date of Completion is Required'),

  amt_put_tender: Yup.string().required('Amount Put to Tender is Required'),
  dlp: Yup.string().required('DLP is Required'),
  add_per_sec: Yup.string().required('Additional Performance Security is Required'),
  emd: Yup.string().required('EMD is Required'),
  date_refund: Yup.string().required('Date Of Refund is Required'),


});

function TFForm() {
  const params = useParams();
  const [formValues, setValues] = useState(initialValues);
  const location = useLocation();
  // const operation_status = location.state?.operation_status || "add";
  // const sl_no = location.state?.sl_no || "";
  const navigate = useNavigate()
  const [filePreview_1, setFilePreview_1] = useState(null);
  const [filePreview_2, setFilePreview_2] = useState(null);
  const [loading, setLoading] = useState(false)
  // const [projectId, setProjectId] = useState([]);

  const [projectId, setProjectId] = useState([]);
  // const [getStatusData, setGetStatusData] = useState([]);
  const [getMsgData, setGetMsgData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [approvalNo, setApprovalNo] = useState('');
  const [fundStatus, setFundStatus] = useState(() => []);
  const toast = useRef(null)
  const [radioType, setRadioType] = useState("M")
  const [userDataLocalStore, setUserDataLocalStore] = useState([]);
  const [operation_status, setOperation_status] = useState('');
  const [sl_no, setSl_no] = useState('');
  const [errorpdf_1, setErrorpdf_1] = useState("");
  const [errorpdf_2, setErrorpdf_2] = useState("");

  useEffect(()=>{
    console.log(operation_status, 'loadFormData', sl_no, 'kkkk', params?.id);
    
  }, [])


  const fundAddedList = async (approvalNo_Para) => {
    setLoading(true); // Set loading state
    console.log(approvalNo, 'approvalNoapprovalNoapprovalNoapprovalNo');
    
    
    const formData = new FormData();
    formData.append("approval_no", approvalNo_Para);

    try {
      const response = await axios.post(
        `${url}index.php/webApi/Tender/tender_list_proj`,
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
        setLoading(false);
      }

      if(response.data.status < 1){
        setFundStatus([])
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      Message("error", "Error Submitting Form:");
      console.error("Error submitting form:", error);
    }

  };

  const fetchProjectId = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Admapi/get_approval_no',
        {}, // Empty body
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      if(response?.data?.status > 0){
      // fundAddedList()
      console.log("Response Data:", response?.data?.status); // Log the actual response data
      setProjectId(response.data.message)
      setLoading(false);
      }

      if(response?.data?.status < 1){
        setLoading(false);
      }
      
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      setLoading(false);
    }
  };

  const loadFormData = async (project_id) => {
    // console.log(project_id, 'responsedata');
    setLoading(true); // Set loading state

    const formData = new FormData();

    formData.append("approval_no", project_id);

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Tender/progress_list',
        formData,
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      console.log(response?.data, 'responsedata');
      
      if (response?.data.status > 0) {
        setLoading(false);
        setGetMsgData(response?.data?.message)
        
        // setGetStatusData(response?.data?.prog_img)
        // setFolderProgres(response?.data?.folder_name)

      }

      if (response?.data.status < 1) {
        setLoading(false);
        // setGetStatusData([])
        setGetMsgData([])
        // setShowForm(false);
      }

    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error); // Handle errors properly
    }

  };

  const loadFormEditData = async (approval_no, sl_no) => {

    setOperation_status('edit');
    setSl_no(sl_no)

    console.log(approval_no, 'responsedata', sl_no);
    setLoading(true); // Set loading state

    const formData = new FormData();

    formData.append("approval_no", approval_no);
    formData.append("sl_no", sl_no);

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Tender/tender_single_data',
        formData,
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      console.log(response?.data?.message, 'responsedataTender');
      
      if (response?.data.status > 0) {
        setLoading(false);
        // setGetMsgData(response?.data?.message)
        setValues({
          td_dt: response?.data?.message?.tender_date,
          tia: response.data.message.invite_auth,
          amt_put_tender: response.data.message.amt_put_to_tender,
          options:  setRadioType(response.data.message.tender_status),
          dlp: response.data.message.dlp,
          add_per_sec: response.data.message.add_per_security,
          emd: response.data.message.emd,
          date_refund: response.data.message.date_of_refund,
          td_mt_dt: response.data.message.mat_date,
          wo_dt: response.data.message.wo_date,
          wo_value: response.data.message.wo_value,
          compl: response.data.message.comp_date_apprx,
          td_pdf: response.data.message.tender_notice,
          wo_pdf: response.data.message.wo_copy,
        })
      }

      if (response?.data.status < 1) {
        setLoading(false);
        setGetMsgData([])
      }

    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error); // Handle errors properly
    }

  };

    useEffect(()=>{

      fetchProjectId()
  
    }, [])


    const onChange = (e) => {
      setRadioType(e)
    }

  const saveFormData = async () => {
    setLoading(true); // Set loading state
  
    const formData = new FormData();

    // Append each field to FormData
    // formData.append("approval_no", params?.id);
    formData.append("approval_no", approvalNo);
    formData.append("tender_date", formik.values.td_dt);
    formData.append("tender_notice", formik.values.td_pdf); // Ensure this is a file if applicable
    formData.append("invite_auth", formik.values.tia);
    formData.append("mat_date", formik.values.td_mt_dt);
    formData.append("wo_date", formik.values.wo_dt);
    formData.append("wo_copy", formik.values.wo_pdf);
    formData.append("wo_value", formik.values.wo_value);
    formData.append("comp_date_apprx", formik.values.compl);

    formData.append("amt_put_to_tender", formik.values.amt_put_tender);
    formData.append("tender_status", radioType);
    formData.append("dlp", formik.values.dlp);
    formData.append("add_per_security", formik.values.add_per_sec);
    formData.append("emd", formik.values.emd);
    formData.append("date_of_refund", formik.values.date_refund);
    

    formData.append("created_by", userDataLocalStore.user_id);


  
    console.log(formik.values.block, "FormData:", formData);

    try {
      const response = await axios.post(
        `${url}index.php/webApi/Tender/tend_add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'auth_key': auth_key // Important for FormData
          },
        }
      );
  
      setLoading(false);
      formik.resetForm();
      fundAddedList(approvalNo)
      Message("success", "Updated successfully.");
      
    } catch (error) {
      // setLoading(false);
      Message("error", "Error Submitting Form:");
      console.error("Error submitting form:", error);
    }

  };

  const updateFormData = async () => {
    // setLoading(true); // Set loading state

  
    const formData = new FormData();

    
    formData.append("tender_date", formik.values.td_dt);
    formData.append("tender_notice", formik.values.td_pdf);  //////////
    formData.append("invite_auth", formik.values.tia);
    formData.append("mat_date", formik.values.td_mt_dt);
    formData.append("wo_date", formik.values.wo_dt);
    formData.append("wo_copy", formik.values.wo_pdf);
    formData.append("wo_value", formik.values.wo_value);
    formData.append("comp_date_apprx", formik.values.compl);

    formData.append("tender_status", radioType);
    formData.append("amt_put_to_tender", formik.values.amt_put_tender);
    formData.append("dlp", formik.values.dlp);
    formData.append("add_per_security", formik.values.add_per_sec);
    formData.append("emd", formik.values.emd);
    formData.append("date_of_refund", formik.values.date_refund);

    formData.append("approval_no", params?.id);
    formData.append("sl_no", sl_no);
    formData.append("modified_by", userDataLocalStore.user_id);

  
    console.log("formDataformData", formData);

    try {
      const response = await axios.post(
        `${url}index.php/webApi/Tender/tend_edit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'auth_key': auth_key // Important for FormData
          },
        }
      );
      console.log(response, 'response');
      
      // setLoading(false);
      Message("success", "Updated successfully.");
      loadFormEditData(params?.id, sl_no)
      // navigate(`/home/tender_formality`);
      fundAddedList(params?.id)

      formik.resetForm();
    } catch (error) {
      // setLoading(false);
      Message("error", "Error Submitting Form:");
      console.error("Error submitting form:", error);
    }

  };
  

  const onSubmit = (values) => {
    
    
    if(errorpdf_1.length < 1 && errorpdf_2.length < 1){
      if(params?.id > 0){
        updateFormData()
      } else {
        saveFormData()
      }
    }
    
  };

  const formik = useFormik({
      // initialValues:formValues,
      // initialValues,
      initialValues: +params.id > 0 ? formValues : initialValues,
      onSubmit,
      validationSchema,
      enableReinitialize: true,
      validateOnMount: true,
    });

  useEffect(()=>{
    // if(operation_status == 'edit'){
      
    // }
    if(params?.id > 0){
      // loadFormEditData(params?.id, sl_no)
      loadFormData(params?.id)
      fundAddedList(params?.id)
      setApprovalNo(params?.id)
      setShowForm(true);
    }

    const userData = localStorage.getItem("user_dt");
    if (userData) {
    setUserDataLocalStore(JSON.parse(userData))
    } else {
    setUserDataLocalStore([])
    }

  }, [])

  const handleFileChange_pdf_1 = (event) => {

    const file = event.target.files[0]; // Get the selected file

    if (file) {
      const fileSizeMB = file.size / (1024 * 1024); // Convert bytes to MB
      const fileType = file.type; // Get file MIME type

      // Check if file is a PDF
      if (fileType !== "application/pdf") {
        setErrorpdf_1("Only PDF files are allowed.");
        return;
      }

      // Check if file size exceeds 20MB
      if (fileSizeMB > 20) {
        setErrorpdf_1("File size should not exceed 20MB.");
        return;
      }

      setErrorpdf_1("");
      console.log("File is valid:", file.name);
      formik.setFieldValue("td_pdf", file);
      setFilePreview_1(URL.createObjectURL(file)); // Create a preview URL
      // Proceed with file upload or further processing
    }
  };

  const handleFileChange_pdf_2 = (event) => {

    const file = event.target.files[0]; // Get the selected file

    if (file) {
      const fileSizeMB = file.size / (1024 * 1024); // Convert bytes to MB
      const fileType = file.type; // Get file MIME type

      // Check if file is a PDF
      if (fileType !== "application/pdf") {
        setErrorpdf_2("Only PDF files are allowed.");
        return;
      }

      // Check if file size exceeds 20MB
      if (fileSizeMB > 20) {
        setErrorpdf_2("File size should not exceed 20MB.");
        return;
      }

      setErrorpdf_2("");
      console.log("File is valid:", file.name);
      formik.setFieldValue("wo_pdf", file);
      setFilePreview_2(URL.createObjectURL(file)); // Create a preview URL
      // Proceed with file upload or further processing
    }
  };
    
  

  return (
    <section class="bg-white p-5 dark:bg-gray-900">
      <div class="py-5 mx-auto w-full lg:py-5">


      <Heading title={'Project Details'} button={'Y'} />
        <Spin
          indicator={<LoadingOutlined spin />}
          size="large"
          className="text-gray-500 dark:text-gray-400"
          spinning={loading}
        >

          
            <div class="grid gap-4 sm:grid-cols-12 sm:gap-6 mb-5">

              <div class="sm:col-span-4">
                

              {params?.id < 1 &&(
              <>
              <label for="fin_yr" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Project ID / Approval Number</label>
              <Select
              placeholder="Choose Project ID"
              onChange={(value) => {
              loadFormData(value)
              fundAddedList(value)
              setApprovalNo(value)
              setShowForm(true)
              }}
              style={{ width: "100%" }}
              >
              <Select.Option value="" disabled> Choose Project ID </Select.Option>
              {projectId.map(data => (
              <Select.Option key={data.approval_no} value={data.approval_no}>
              {data.project_id} - {data.approval_no}
              </Select.Option>
              ))}
              </Select>
              </>

              )}
              {params?.id > 0 &&(
              <>
              {projectId.map((data) => (
              <div key={data.approval_no}>
              {data.approval_no === params?.id && (
              <>
              <TDInputTemplate
              type="text"
              label="Project ID / Approval Number"
              formControlName={data.project_id +'-'+ data.approval_no}
              mode={1}
              disabled={true}
              />
              </>
              )}
              </div>
              ))}

              </>
              )}

              </div>


              <div className="sm:col-span-12 text-blue-900 text-md font-bold mt-3 -mb-2">
                {/* Progress Details */}
              </div>

              <div class="sm:col-span-4">
                <TDInputTemplate
                  type="date"
                  label="Date of administrative approval"
                  formControlName={getMsgData[0]?.admin_approval_dt ? getMsgData[0]?.admin_approval_dt : '0000-00-00'}
                  mode={1}
                  disabled={true}
                />
                

              </div>

              <div class="sm:col-span-4">
                <TDInputTemplate
                  type="text"
                  label="Enter scheme name"
                  formControlName={getMsgData[0]?.scheme_name ? getMsgData[0]?.scheme_name : 'No Data'}
                  mode={1}
                  disabled={true}
                />

              </div>
              <div class="sm:col-span-4">


                

                <TDInputTemplate
                  type="text"
                  label="Enter Sector name"
                  formControlName={getMsgData[0]?.sector_name ? getMsgData[0]?.sector_name : 'No Data'}
                  mode={1}
                  disabled={true}
                />

                {/* sectorDropList */}
                {/* {JSON.stringify(sectorDropList, null, 2)} */}


              </div>
              <div class="sm:col-span-4">
                

                <TDInputTemplate
                  type="text"
                  label="Financial Year"
                  formControlName={getMsgData[0]?.fin_year ? getMsgData[0]?.fin_year : '0000-00'}
                  mode={1}
                  disabled={true}
                />

              </div>

              <div class="sm:col-span-4">
                <TDInputTemplate
                  type="text"
                  label="Project implemented By"
                  formControlName={getMsgData[0]?.agency_name ? getMsgData[0]?.agency_name : 'No Data'}
                  mode={1}
                  disabled={true}
                />
              </div>

              <div class="sm:col-span-4">

                
                <TDInputTemplate
                  type="text"
                  label="District"
                  formControlName={getMsgData[0]?.dist_name ? getMsgData[0]?.dist_name : 'No Data'}
                  mode={1}
                  disabled={true}
                />

              </div>
              <div class="sm:col-span-4">
                
                <TDInputTemplate
                  type="text"
                  label="Block"
                  formControlName={getMsgData[0]?.block_name ? getMsgData[0]?.block_name : 'No Data'}
                  mode={1}
                  disabled={true}
                />

              </div>

              <div class="sm:col-span-4">
                

              <TDInputTemplate
                  type="date"
                  label="Work Order Issued On"
                  formControlName={getMsgData[1]?.wo_date ? getMsgData[1]?.wo_date : '0000-00'}
                  mode={1}
                  disabled={true}
              />

              </div>
              

            </div>

          
        </Spin>

        <Spin
						indicator={<LoadingOutlined spin />}
						size="large"
						className="text-gray-500 dark:text-gray-400"
						spinning={loading}
					>
{/* {JSON.stringify(fundStatus, null, 2)} //// {JSON.stringify(operation_status, null, 2)} */}


        {fundStatus?.length > 0 &&(
          <>
          <Heading title={"Tender Formality History"} button={'N'}/>
          <Toast ref={toast} />
          <DataTable
          value={fundStatus?.map((item, i) => [{ ...item, id: i }]).flat()}
          // selectionMode="checkbox"
          tableStyle={{ minWidth: "50rem" }}
          dataKey="id"
          tableClassName="w-full text-sm text-left rtl:text-right shadow-lg text-green-900dark:text-gray-400 table_Custome table_Custome_1st" // Apply row classes
          >


          <Column
          field="sl_no"
          header="Sl.No."
          body={(rowData, { rowIndex }) => rowIndex + 1}
          footer={
            <span style={{ fontWeight: "bold", color: "#0694A2" }}>
            Total: 
            </span>
            }
          ></Column>

          <Column
          field="tender_date"
          header="Tender Invited On"
          ></Column>

          <Column
          // field="instl_amt"
          header="Tender Notice"
          body={(rowData) => (
          <a href={url + folder_tender + rowData?.tender_notice} target='_blank'><FilePdfOutlined style={{fontSize:22, color:'red'}} /></a>
          )}
          ></Column>

          <Column
          field="invite_auth"
          header="Tender Inviting Authority"
          ></Column>

          <Column
          field="amt_put_to_tender"
          header="Amount Put to Tender"
          ></Column>

          <Column
          field="tender_status"
          header="Tender Status"
          ></Column>

<Column
          field="dlp"
          header="DLP"
          ></Column>

<Column
          field="emd"
          header="EMD"
          ></Column>

<Column
          field="date_of_refund"
          header="Date Of Refund"
          ></Column>





          <Column
          field="mat_date"
          header="Tender Matured On"
          ></Column>

          <Column
          field="wo_date"
          header="Work Order Issued On"
          ></Column>

          <Column
          // field="instl_amt"
          header="Work Order Copy"
          body={(rowData) => (
          <a href={url + folder_tender + rowData?.wo_copy} target='_blank'><FilePdfOutlined style={{fontSize:22, color:'red'}} /></a>
          )}
          ></Column>


          <Column
          field="wo_value"
          header="Work Order Value/Tender Value"
          footer={
            <span style={{ fontWeight: "bold", color: "#0694A2" }}>
            {fundStatus?.reduce((sum, item) => sum + (parseFloat(item?.wo_value) || 0), 0).toFixed(2)}
            </span>
            }
          ></Column>

          <Column
          field="comp_date_apprx"
          header="Tentative Date of Completion"
          ></Column>

          <Column
          field="comp_date_apprx"
          header="Action"
          body={(rowData) => (
            <a onClick={() => { loadFormEditData(params?.id, rowData.sl_no)}}><EditOutlined style={{fontSize:22}} /></a>
            )}
          ></Column>

          

          </DataTable>
          </>
        )}
        </Spin>

        {showForm  &&(
        <>
      <Heading title={'Tender Formality Details'} button={'N'}/>
        <form onSubmit={formik.handleSubmit}>
          <div class="grid gap-4 sm:grid-cols-12 sm:gap-6">

          

            <div class="sm:col-span-4">
              <TDInputTemplate
                type="date"
                placeholder="Tender Invited On"
                label="Tender Invited On"
                name="td_dt"
                formControlName={formik.values.td_dt}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.td_dt && formik.touched.td_dt && (
                <VError title={formik.errors.td_dt} />
              )}
            </div>
          
           
            <div class="sm:col-span-4" style={{position:'relative'}}>
              
              <TDInputTemplate
              type="file"
              name="td_pdf"
              placeholder="Tender Notice"
              label="Tender Notice"
              // handleChange={(event) => {
              //   const file = event.currentTarget.files[0];
              //   if (file) {
              //   formik.setFieldValue("td_pdf", file);
              //   setFilePreview_1(URL.createObjectURL(file)); // Create a preview URL
              //   }
              // }}
              handleChange={(event) => {
                handleFileChange_pdf_1(event)
              }}
              handleBlur={formik.handleBlur}
              mode={1}
              />

            {filePreview_1 && (
            <a href={filePreview_1} target="_blank" rel="noopener noreferrer" style={{position:'absolute', top:37, right:10}}>
            <FilePdfOutlined style={{ fontSize: 22, color: "red" }} />
            </a>
            )}

            {formValues.td_pdf.length > 0 &&(
            <>
            {filePreview_1 === null && (
            <a href={url + folder_tender + formValues.td_pdf} target='_blank' style={{position:'absolute', top:37, right:10}}>
            <FilePdfOutlined style={{fontSize:22, color:'red'}} /></a>
            )}
            </>
            )}

              

              {formik.errors.td_pdf && formik.touched.td_pdf && (
                <VError title={formik.errors.td_pdf} />
              )}
              {errorpdf_1 && <p style={{ color: "red", fontSize:12 }}>{errorpdf_1}</p>}

            </div>
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Tender Inviting Authority"
                type="text"
                label="Tender Inviting Authority"
                name="tia"
                formControlName={formik.values.tia}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.tia && formik.touched.tia && (
                <VError title={formik.errors.tia} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Amount Put to Tender..."
                type="number"
                label="Amount Put to Tender"
                name="amt_put_tender"
                formControlName={formik.values.amt_put_tender}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.amt_put_tender && formik.touched.amt_put_tender && (
                <VError title={formik.errors.amt_put_tender} />
              )}
            </div>

            <div class="sm:col-span-4">
            <label className="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Before Tender Matured</label>
            <Radiobtn
						data={options}
						val={radioType}
						onChangeVal={(value) => {
							onChange(value)
						}}
					/>
          </div>

          <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="DLP..."
                type="number"
                label="DLP"
                name="dlp"
                formControlName={formik.values.dlp}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.dlp && formik.touched.dlp && (
                <VError title={formik.errors.dlp} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Additional Performance Security..."
                type="number"
                label="Additional Performance Security"
                name="add_per_sec"
                formControlName={formik.values.add_per_sec}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.add_per_sec && formik.touched.add_per_sec && (
                <VError title={formik.errors.add_per_sec} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="EMD..."
                type="number"
                label="EMD"
                name="emd"
                formControlName={formik.values.emd}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.emd && formik.touched.emd && (
                <VError title={formik.errors.emd} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Date Of Refund..."
                type="date"
                label="Date Of Refund"
                name="date_refund"
                formControlName={formik.values.date_refund}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.date_refund && formik.touched.date_refund && (
                <VError title={formik.errors.date_refund} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Tender Matured On"
                type="date"
                label="Tender Matured On"
                name="td_mt_dt"
                formControlName={formik.values.td_mt_dt}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.td_mt_dt && formik.touched.td_mt_dt && (
                <VError title={formik.errors.td_mt_dt} />
              )}
            </div>
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Work Order Issued On"
                type="date"
                label="Work Order Issued On"
                name="wo_dt"
                formControlName={formik.values.wo_dt}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.wo_dt && formik.touched.wo_dt && (
                <VError title={formik.errors.wo_dt} />
              )}
            </div>
           
            <div class="sm:col-span-4" style={{position:'relative'}}>

              <TDInputTemplate
              type="file"
              name="wo_pdf"
              placeholder="Work Order Copy"
              label="Work Order Copy"
              // handleChange={(event) => {
              //   const file = event.currentTarget.files[0];
              //   if (file) {
              //   formik.setFieldValue("wo_pdf", file);
              //   setFilePreview_2(URL.createObjectURL(file)); // Create a preview URL
              //   }
              // }}
              handleChange={(event) => {
                handleFileChange_pdf_2(event)
              }}

              handleBlur={formik.handleBlur}
              mode={1}
              />

            {filePreview_2 && (
            <a href={filePreview_2} target="_blank" rel="noopener noreferrer" style={{position:'absolute', top:37, right:10}}>
            <FilePdfOutlined style={{ fontSize: 22, color: "red" }} />
            </a>
            )}

            {formValues.wo_pdf.length > 0 &&(
            <>
            {filePreview_2 === null && (
            <a href={url + folder_tender + formValues.wo_pdf} target='_blank' style={{position:'absolute', top:37, right:10}}>
            <FilePdfOutlined style={{fontSize:22, color:'red'}} /></a>
            )}
            </>
            )}

              {formik.errors.wo_pdf && formik.touched.wo_pdf && (
                <VError title={formik.errors.wo_pdf} />
              )}
              {errorpdf_2 && <p style={{ color: "red", fontSize:12 }}>{errorpdf_2}</p>}

            </div>
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Type Work Order Value..."
                type="number"
                label="Work Order Value"
                name="wo_value"
                formControlName={formik.values.wo_value}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.wo_value && formik.touched.wo_value && (
                <VError title={formik.errors.wo_value} />
              )}
            </div>
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Tentative Date of Completion"
                type="date"
                label="Tentative Date of Completion"
                name="compl"
                formControlName={formik.values.compl}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.compl && formik.touched.compl && (
                <VError title={formik.errors.compl} />
              )}
            </div>
        <div className="sm:col-span-12 flex justify-center gap-4 mt-4">
        {operation_status !=  'edit'&&(
          <BtnComp title={operation_status ==  'edit' ? 'Reload' : 'Reset'} type="reset" 
        onClick={() => { 
          formik.resetForm();
        }}
        width={'w-1/6'} bgColor={'bg-white'} color="text-blue-900" border={'border-2 border-blue-900'} />
        )}
        
        {/* <button type="submit">Search</button> */}
        <BtnComp type={'submit'} title={operation_status ==  'edit' ? 'Update' : 'Submit'} onClick={() => { }} width={'w-1/6'} bgColor={'bg-blue-900'} />
         </div>
          </div>

        </form>
        </>
        )}


      </div>
    </section>
  )
}

export default TFForm
