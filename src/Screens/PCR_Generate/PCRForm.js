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
  admin_approval_dt: '',
  td_pdf: '',
  agency_name: '',
  sector_name: '',
  wo_dt: '',
  wo_pdf: '',
  wo_value: '',
  compl: '',

  amt_put_to_tender: '',
  block_name: '',
  dist_name: '',
  fin_year: '',
  scheme_name: '',
};



const validationSchema = Yup.object({
  // project_id: Yup.string().required('Project ID / Approval Number is Required'),
  admin_approval_dt: Yup.string().required('Tender Invited On is Required'),
  td_pdf: Yup.string().required('Tender Notice is Required'),
  agency_name: Yup.string().required('Tender Inviting Authority is Required'),
  sector_name: Yup.string().required('Tender Matured On is Required'),
  wo_dt: Yup.string().required('Work Order Issued On is Required'),
  wo_pdf: Yup.string().required('Work Order Copy is Required'),
  wo_value: Yup.string().required('Work Order Value is Required'),
  compl: Yup.string().required('Date of Completion (As per Work Order) is Required'),

  amt_put_to_tender: Yup.string().required('Amount Put to Tender is Required'),
  block_name: Yup.string().required('Block is Required'),
  dist_name: Yup.string().required('Additional Performance Security is Required'),
  fin_year: Yup.string().required('financial Year is Required'),
  scheme_name: Yup.string().required('Date Of Refund is Required'),


});

function PCRForm() {
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

  const loadFormEditData = async (approval_no) => {
    
    // setOperation_status('edit');
    // setSl_no(sl_no)

    console.log(approval_no, 'responsedata', sl_no);
    setLoading(true); // Set loading state

    const formData = new FormData();

    formData.append("approval_no", approval_no);

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Utilization/projCompCertiReq',
        formData,
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      console.log(response.data.message.agency_name, 'responsedataTenderffffffffffff');
      
      if (response?.data.status > 0) {
        setLoading(false);
        setGetMsgData(response?.data?.message)
        setValues({
          admin_approval_dt: response?.data?.message[0]?.admin_approval_dt,
          agency_name: response?.data?.message[0]?.agency_name,
          amt_put_to_tender: response?.data?.message[0]?.amt_put_to_tender,
          block_name: response?.data?.message[0]?.block_name,
          dist_name: response?.data?.message[0]?.dist_name,
          fin_year: response?.data?.message[0]?.fin_year,
          scheme_name: response?.data?.message[0]?.scheme_name,
          sector_name: response?.data?.message[0]?.sector_name,
          // wo_dt: response.data.message.wo_date,
          // wo_value: response.data.message.wo_value,
          // compl: response.data.message.comp_date_apprx,
          // td_pdf: response.data.message.tender_notice,
          // wo_pdf: response.data.message.wo_copy,
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
      // loadFormEditData(1, 1)
  
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
    formData.append("tender_date", formik.values.admin_approval_dt);
    formData.append("tender_notice", formik.values.td_pdf); // Ensure this is a file if applicable
    formData.append("invite_auth", formik.values.agency_name);
    formData.append("mat_date", formik.values.sector_name);
    formData.append("wo_date", formik.values.wo_dt);
    formData.append("wo_copy", formik.values.wo_pdf);
    formData.append("wo_value", formik.values.wo_value);
    formData.append("comp_date_apprx", formik.values.compl);

    formData.append("amt_put_to_tender", formik.values.amt_put_to_tender);
    formData.append("tender_status", radioType);
    formData.append("block_name", formik.values.block_name);
    formData.append("dist_nameurity", formik.values.dist_name);
    formData.append("fin_year", formik.values.fin_year);
    formData.append("date_of_refund", formik.values.scheme_name);
    

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
      // fundAddedList(approvalNo)
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

    
    formData.append("tender_date", formik.values.admin_approval_dt);
    formData.append("tender_notice", formik.values.td_pdf);  //////////
    formData.append("invite_auth", formik.values.agency_name);
    formData.append("mat_date", formik.values.sector_name);
    formData.append("wo_date", formik.values.wo_dt);
    formData.append("wo_copy", formik.values.wo_pdf);
    formData.append("wo_value", formik.values.wo_value);
    formData.append("comp_date_apprx", formik.values.compl);

    formData.append("tender_status", radioType);
    formData.append("amt_put_to_tender", formik.values.amt_put_to_tender);
    formData.append("block_name", formik.values.block_name);
    formData.append("dist_nameurity", formik.values.dist_name);
    formData.append("fin_year", formik.values.fin_year);
    formData.append("date_of_refund", formik.values.scheme_name);

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
      // loadFormEditData(params?.id, sl_no)
      // navigate(`/home/tender_formality`);
      // fundAddedList(params?.id)

      formik.resetForm();
    } catch (error) {
      // setLoading(false);
      Message("error", "Error Submitting Form:");
      console.error("Error submitting form:", error);
    }

  };
  

  const onSubmit = (values) => {
    
    
    // if(errorpdf_1.length < 1 && errorpdf_2.length < 1){
    //   if(params?.id > 0){
    //     updateFormData()
    //   } else {
    //     saveFormData()
    //   }
    // }
    updateFormData()
    
  };

  const formik = useFormik({
      // initialValues:formValues,
      // initialValues,
      initialValues: formValues,
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
      // loadFormData(params?.id)
      // fundAddedList(params?.id)
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

  // const handleFileChange_pdf_1 = (event) => {

  //   const file = event.target.files[0]; // Get the selected file

  //   if (file) {
  //     const fileSizeMB = file.size / (1024 * 1024); // Convert bytes to MB
  //     const fileType = file.type; // Get file MIME type

  //     // Check if file is a PDF
  //     if (fileType !== "application/pdf") {
  //       setErrorpdf_1("Only PDF files are allowed.");
  //       return;
  //     }

  //     // Check if file size exceeds 20MB
  //     if (fileSizeMB > 2) {
  //       setErrorpdf_1("File size should not exceed 2MB.");
  //       return;
  //     }

  //     setErrorpdf_1("");
  //     console.log("File is valid:", file.name);
  //     formik.setFieldValue("td_pdf", file);
  //     setFilePreview_1(URL.createObjectURL(file)); // Create a preview URL
  //     // Proceed with file upload or further processing
  //   }
  // };

  // const handleFileChange_pdf_2 = (event) => {

  //   const file = event.target.files[0]; // Get the selected file

  //   if (file) {
  //     const fileSizeMB = file.size / (1024 * 1024); // Convert bytes to MB
  //     const fileType = file.type; // Get file MIME type

  //     // Check if file is a PDF
  //     if (fileType !== "application/pdf") {
  //       setErrorpdf_2("Only PDF files are allowed.");
  //       return;
  //     }

  //     // Check if file size exceeds 20MB
  //     if (fileSizeMB > 2) {
  //       setErrorpdf_2("File size should not exceed 2MB.");
  //       return;
  //     }

  //     setErrorpdf_2("");
  //     console.log("File is valid:", file.name);
  //     formik.setFieldValue("wo_pdf", file);
  //     setFilePreview_2(URL.createObjectURL(file)); // Create a preview URL
  //     // Proceed with file upload or further processing
  //   }
  // };
    
  

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
                

             
              <>
              <label for="fin_yr" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Project ID / Approval Number</label>
              <Select
              placeholder="Choose Project ID"
              onChange={(value) => {
              loadFormData(value)
              // fundAddedList(value)
              setApprovalNo(value)
              setShowForm(true)
              loadFormEditData(value)
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

           
              

              </div>


              

              
              

            </div>

          
        </Spin>

       

        {showForm  &&(
        <>
      <Heading title={'PCR Project Details'} button={'N'}/>
        <form onSubmit={formik.handleSubmit}>
          <div class="grid gap-4 sm:grid-cols-12 sm:gap-6">

          

            <div class="sm:col-span-4">
              <TDInputTemplate
                type="date"
                placeholder="Admin Approval Date"
                label="Admin Approval Date"
                name="admin_approval_dt"
                formControlName={formik.values.admin_approval_dt}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.admin_approval_dt && formik.touched.admin_approval_dt && (
                <VError title={formik.errors.admin_approval_dt} />
              )}
            </div>
          
           
            
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Agency Name"
                type="text"
                label="Agency Name"
                name="agency_name"
                formControlName={formik.values.agency_name}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.agency_name && formik.touched.agency_name && (
                <VError title={formik.errors.agency_name} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Amount Put to Tender..."
                type="number"
                label="Amount Put to Tender"
                name="amt_put_to_tender"
                formControlName={formik.values.amt_put_to_tender}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.amt_put_to_tender && formik.touched.amt_put_to_tender && (
                <VError title={formik.errors.amt_put_to_tender} />
              )}
            </div>



          <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Block..."
                type="text"
                label="Block"
                name="block_name"
                formControlName={formik.values.block_name}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.block_name && formik.touched.block_name && (
                <VError title={formik.errors.block_name} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="District..."
                type="text"
                label="District"
                name="dist_name"
                formControlName={formik.values.dist_name}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.dist_name && formik.touched.dist_name && (
                <VError title={formik.errors.dist_name} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Financial Year..."
                type="text"
                label="Financial Year"
                name="fin_year"
                formControlName={formik.values.fin_year}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.fin_year && formik.touched.fin_year && (
                <VError title={formik.errors.fin_year} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Scheme Name..."
                type="text"
                label="Scheme Name"
                name="scheme_name"
                formControlName={formik.values.scheme_name}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.scheme_name && formik.touched.scheme_name && (
                <VError title={formik.errors.scheme_name} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Sector Name"
                type="text"
                label="Sector Name"
                name="sector_name"
                formControlName={formik.values.sector_name}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.sector_name && formik.touched.sector_name && (
                <VError title={formik.errors.sector_name} />
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
                placeholder="Date of Completion (As per Work Order)"
                type="date"
                label="Date of Completion (As per Work Order)"
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
        {params.id < 1 &&(
          <BtnComp title={'Reset'} type="reset" 
        onClick={() => { 
          formik.resetForm();
        }}
        width={'w-1/6'} bgColor={'bg-white'} color="text-blue-900" border={'border-2 border-blue-900'} />
        )}
        
        {/* <button type="submit">Search</button> */}
        <BtnComp type={'submit'} title={'Update'} onClick={() => { }} width={'w-1/6'} bgColor={'bg-blue-900'} />
         </div>
          </div>

        </form>
        </>
        )}


      </div>
    </section>
  )
}

export default PCRForm
