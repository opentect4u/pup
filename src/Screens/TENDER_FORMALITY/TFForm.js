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
import { getLocalStoreTokenDts } from '../../CommonFunction/getLocalforageTokenDts';


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
  td_ID: '',
  call_no:'',
  tenderCancel_reason: '',
  agency: '',
  asstEng: '',
  td_dt: '',
  td_pdf: '',
  tia: '',
  td_mt_dt: '',
  wo_dt: '',
  wo_pdf: '',
  wo_value: '',
  compl: '',
  
  amt_put_tender: '',
  e_nit_no: '',
  dlp: '',
  add_per_sec: '',
  emd: '',
  date_refund: '',
};

const tenderStatus = [
	{
		label: "Matured Tender",
		value: "M",
	},
	{
		label: "Cancelled Tender",
		value: "C",
	}
	
	
]


// const validationSchema = Yup.object({
//   td_ID: Yup.string().required('Tender ID is Required'),
//   asstEng: Yup.string().required('Asst. Engineer is Required'),
//   td_dt: Yup.string().required('Tender Invited On is Required'),
//   td_pdf: Yup.string().required('Tender Notice is Required'),
//   tia: Yup.string().required('Tender Inviting Authority is Required'),
//   td_mt_dt: Yup.string().required('Tender Matured On is Required'),
//   wo_dt: Yup.string()
//   .required('Work Order Issued On is Required')
//   .test(
//     'wo_dt-before-compl',
//     'Work Order Issued On must be before Date of Completion',
//     function (value) {
//       const { compl } = this.parent;
//       if (!value || !compl) return true; // Skip validation if one is missing
//       const woDate = new Date(value);
//       const complDate = new Date(compl);
//       return woDate < complDate; // wo_dt must be strictly less than compl
//     }
//   ),

//   wo_pdf: Yup.string().required('Work Order Copy is Required'),
//   wo_value: Yup.number().required('Work Order Value is Required'),
//   compl: Yup.string().required('Date of Completion (As per Work Order) is Required'),
//   amt_put_tender: Yup.string().required('Amount Put to Tender is Required'),
//   e_nit_no: Yup.string().required('e-NIT No is Required'),
//   dlp: Yup.string().required('DLP is Required'),
//   // add_per_sec: Yup.string().required('Additional Performance Security is Required'),
//   add_per_sec: Yup.string(),
//   emd: Yup.string().required('EMD/Security Deposit is Required'),
//   // date_refund: Yup.string().required('Date Of Refund is Required'),
//   date_refund: Yup.string(),
// });






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
  const [projectIncomplete, setProjectIncomplete] = useState(false);
  const [editFlagStatus, setEditFlagStatus] = useState("");
  const [asstEngListData, setAsstEngListData] = useState([]);
  const [maturedData, setMaturedData] = useState("M")
  const [tenderCallNo, setTenderCallNo] = useState([]);
  const [agencyList, setAgencyList] = useState([]);
  const [agencyDetails, setAgencyDetails] = useState([]);
  const [useSchematicAmt, setUseSchematicAmt] = useState(0);


  const validationSchema = (maturedData) =>
  Yup.object({
    td_ID: Yup.string().required('Tender ID is Required'),

    agency: Yup.string().when([], {
      is: () => maturedData === 'M',
      then: (schema) => schema.required('Agency is Required'),
      otherwise: (schema) => schema.notRequired(),
    }),

    asstEng: Yup.string().when([], {
      is: () => maturedData === 'M',
      then: (schema) => schema.required('Asst. Engineer is Required'),
      otherwise: (schema) => schema.notRequired(),
    }),

    call_no: Yup.string().required('Tender Call No. is Required'),

    tenderCancel_reason: Yup.string().when([], {
      is: () => maturedData === 'C',
      then: (schema) => schema.required('Remarks is Required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    
    td_dt: Yup.string().when([], {
      is: () => maturedData === 'M',
      then: (schema) => schema.required('Tender Invited On is Required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    td_pdf: Yup.string().when([], {
      is: () => maturedData === 'M',
      then: (schema) => schema.required('Tender Notice is Required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    tia: Yup.string().when([], {
      is: () => maturedData === 'M',
      then: (schema) => schema.required('Tender Inviting Authority is Required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    td_mt_dt: Yup.string().when([], {
      is: () => maturedData === 'M',
      then: (schema) => schema.required('Tender Matured On is Required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    wo_dt: Yup.string()
      .when([], {
        is: () => maturedData === 'M',
        then: (schema) => schema.required('Work Order Issued On is Required'),
        otherwise: (schema) => schema.notRequired(),
      })
      .test(
        'wo_dt-before-compl',
        'Work Order Issued On must be before Date of Completion',
        function (value) {
          const { compl } = this.parent;
          if (!value || !compl) return true;
          const woDate = new Date(value);
          const complDate = new Date(compl);
          return woDate < complDate;
        }
      ),
    wo_pdf: Yup.string().when([], {
      is: () => maturedData === 'M',
      then: (schema) => schema.required('Work Order Copy is Required'),
      otherwise: (schema) => schema.notRequired(),
    }),

    // wo_value: Yup.number().when([], {
    //   is: () => maturedData === 'M',
    //   then: (schema) => schema.required('Work Order Value is Required'),
    //   otherwise: (schema) => schema.notRequired(),
    // }),

    wo_value: Yup.number()
    .when([], {
    is: () => maturedData === 'M',
    then: (schema) =>
    schema
    .required('Work Order Value is Required')
    .moreThan(0, 'Work Order Value must be greater than 0')
    .max(`${useSchematicAmt}`, `Work Order Value must be less than or equal to ${useSchematicAmt}`),
    otherwise: (schema) => schema.notRequired(),
    }),

    compl: Yup.string().when([], {
      is: () => maturedData === 'M',
      then: (schema) => schema.required('Date of Completion (As per Work Order) is Required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    amt_put_tender: Yup.string().when([], {
      is: () => maturedData === 'M',
      then: (schema) => schema.required('Amount Put to Tender is Required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    e_nit_no: Yup.string().when([], {
      is: () => maturedData === 'M',
      then: (schema) => schema.required('e-NIT No is Required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    dlp: Yup.string().when([], {
      is: () => maturedData === 'M',
      then: (schema) => schema.required('DLP is Required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    add_per_sec: Yup.string(), // Optional always
    emd: Yup.string().when([], {
      is: () => maturedData === 'M',
      then: (schema) => schema.required('EMD/Security Deposit is Required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    date_refund: Yup.string(), // Optional always
  });


  const fundAddedList = async (approvalNo_Para) => {
    setLoading(true); // Set loading state
    const tokenValue = await getLocalStoreTokenDts(navigate);
    
    const formData = new FormData();
    formData.append("approval_no", approvalNo_Para);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    try {
      const response = await axios.post(
        `${url}index.php/webApi/Tender/tender_list_proj`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'auth_key': auth_key, // Important for FormData
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );

      console.log(response?.data?.message, 'cccccccccccccc');
      
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
      
      localStorage.removeItem("user_dt");
      navigate('/')
    }

  };

  const fetchProjectId = async () => {
    setLoading(true);
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Admapi/get_approval_no',
        formData, // Empty body
        {
          headers: {
            'auth_key': auth_key,
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );

      if(response?.data?.status > 0){
      // fundAddedList()
      setProjectId(response.data.message)
      setLoading(false);
      }

      if(response?.data?.status < 1){
        setLoading(false);
      }
      
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      setLoading(false);
      
      localStorage.removeItem("user_dt");
      navigate('/')
    }
  };

    const fetchAgencyList = async () => {
    setLoading(true);
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    formData.append("agency_id", '0');
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    try {
      const response = await axios.post(`${url}index.php/webApi/Mdapi/agencyList`, formData, {
        headers: { 
          auth_key,
          'Authorization': `Bearer ` + tokenValue?.token
        },
      });

      console.log(response?.data?.message, 'response');
      if (response?.data?.status > 0) {
        
        
        setAgencyList(response?.data?.message);
      } else {
        setAgencyList([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      
      localStorage.removeItem("user_dt");
      navigate('/')
    } finally {
      setLoading(false);
    }
  };

  const loadFormData = async (project_id) => {
    setLoading(true); // Set loading state
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();

    formData.append("approval_no", project_id);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Tender/progress_list',
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
        setGetMsgData(response?.data?.message)
        setUseSchematicAmt(response?.data?.message[0]?.sch_amt);
        setProjectIncomplete(false)
      }

      if (response?.data.status < 1) {
        setLoading(false);
        // setGetStatusData([])
        setGetMsgData([])
        setProjectIncomplete(true)
      }

    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error); // Handle errors properly
      
      localStorage.removeItem("user_dt");
      navigate('/')
    }

  };

  const loadFormEditData = async (approval_no, sl_no) => {

    setOperation_status('edit');
    setSl_no(sl_no)

    setLoading(true); // Set loading state
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();

    formData.append("approval_no", approval_no);
    formData.append("sl_no", sl_no);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Tender/tender_single_data',
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
        // setGetMsgData(response?.data?.message)
        console.log(response?.data?.message?.call_id, '');
        
        setValues({
          td_dt: response?.data?.message?.tender_date != null ? response?.data?.message?.tender_date : '',
          tia: response.data.message.invite_auth != null ? response?.data?.message?.invite_auth : '',
          amt_put_tender: response.data.message.amt_put_to_tender != null ? response?.data?.message?.amt_put_to_tender : '',
          e_nit_no: response.data.message.e_nit_no != null ? response?.data?.message?.e_nit_no : '',
          options:  setRadioType(response.data.message.tender_status),
          dlp: response.data.message.dlp != null ? response?.data?.message?.dlp : '',
          add_per_sec: response.data.message.add_per_security != null ? response?.data?.message?.add_per_security : '',
          emd: response.data.message.emd != null ? response?.data?.message?.emd : '',
          date_refund: response.data.message.date_of_refund != null ? response?.data?.message?.date_of_refund : '',
          td_mt_dt: response.data.message.mat_date != null ? response?.data?.message?.mat_date : '',
          wo_dt: response.data.message.wo_date != null ? response?.data?.message?.wo_date : '',
          wo_value: response.data.message.wo_value != null ? response?.data?.message?.wo_value : '',
          compl: response.data.message.comp_date_apprx != null ? response?.data?.message?.comp_date_apprx : '',
          td_pdf: response.data.message.tender_notice != null ? response?.data?.message?.tender_notice : '',
          wo_pdf: response.data.message.wo_copy != null ? response?.data?.message?.wo_copy : '',

          td_ID: response.data.message.tender_id != null ? response?.data?.message?.tender_id : '',
          asstEng: response.data.message.assistant_eng_id != null ? response?.data?.message?.assistant_eng_id : '',
          agency: response.data.message.agency_id != null ? response?.data?.message?.agency_id : '',

          call_no: response.data.message.call_id != null ? response?.data?.message?.call_id : '',
          tend_status: setMaturedData(response?.data?.message?.tend_status),
        })

        generateAgencyDetails(response?.data?.message?.agency_id)

        setEditFlagStatus(response?.data?.message?.edit_flag)
        
      }

      if (response?.data.status < 1) {
        setLoading(false);
        setGetMsgData([])
        
      }

    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error); // Handle errors properly
      
      localStorage.removeItem("user_dt");
      navigate('/')
    }

  };

    const fetchAsstEngList = async () => {
    setLoading(true);
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Tender/assist_eng_list',
        formData, // Empty body
        {
          headers: {
            'auth_key': auth_key,
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );

      console.log(response.data.message, 'cccccccccccccccc', response);
      

      setAsstEngListData(response.data.message)
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error); // Handle errors properly

      localStorage.removeItem("user_dt");
      navigate('/')
    }
  };


  const fetchTenderCallNo = async () => {
    setLoading(true);
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Mdapi/get_call',
        formData, // Empty body
        {
          headers: {
            'auth_key': auth_key,
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );

      // console.log(response.data.message, 'responsereyyyyyysponseresponse');

      if(response?.data?.status > 0){
      // fundAddedList()
      
      
      setTenderCallNo(response.data.message)
      setLoading(false);
      }

      if(response?.data?.status < 1){
        setLoading(false);
      }
      
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      setLoading(false);
      
      localStorage.removeItem("user_dt");
      navigate('/')
    }
  };


    useEffect(()=>{

      fetchProjectId()
      fetchAsstEngList()
      fetchTenderCallNo()
      fetchAgencyList()
  
    }, [])


    const onChange = (e) => {
      setRadioType(e)
    }

    const tenderStatusFunc = (e) => {
      console.log(e, 'tenderStatusFunc');
      setFilePreview_2(null)
      setFilePreview_1(null)
      formik.resetForm();
      setMaturedData(e)
    }

  const saveFormData = async () => {
    setLoading(true); // Set loading state

    const tokenValue = await getLocalStoreTokenDts(navigate);

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
    formData.append("tender_status", radioType); // May be it will be remove
    formData.append("dlp", formik.values.dlp);
    formData.append("add_per_security", formik.values.add_per_sec);
    formData.append("emd", formik.values.emd);
    formData.append("date_of_refund", formik.values.date_refund);
    formData.append("e_nit_no", formik.values.e_nit_no);
    
    formData.append("tender_id", formik.values.td_ID);
    formData.append("assistant_eng_id", formik.values.asstEng);
    formData.append("agency_id", formik.values.agency);

    formData.append("tend_status", maturedData);
    formData.append("call_id", formik.values.call_no);
    formData.append("remarks", formik.values.tenderCancel_reason);

    formData.append("created_by", userDataLocalStore.user_id);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token


    try {
      const response = await axios.post(
        `${url}index.php/webApi/Tender/tend_add`,
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
      formik.resetForm();
      fundAddedList(approvalNo)
      Message("success", "Updated successfully.");
      
    } catch (error) {
      // setLoading(false);
      Message("error", "Error Submitting Form:");
      console.error("Error submitting form:", error);
      
      localStorage.removeItem("user_dt");
      navigate('/')
    }

  };

  const updateFormData = async () => {
    // setLoading(true); // Set loading state
  const tokenValue = await getLocalStoreTokenDts(navigate);
  
    const formData = new FormData();

    formData.append("tender_date", formik.values.td_dt);
    // formData.append("tender_ID", formik.values.td_ID);
    formData.append("tender_notice", formik.values.td_pdf);  //////////
    formData.append("invite_auth", formik.values.tia);
    formData.append("mat_date", formik.values.td_mt_dt);
    formData.append("wo_date", formik.values.wo_dt);
    formData.append("wo_copy", formik.values.wo_pdf);
    formData.append("wo_value", formik.values.wo_value);
    formData.append("comp_date_apprx", formik.values.compl);

    formData.append("tender_status", radioType);
    formData.append("amt_put_to_tender", formik.values.amt_put_tender);
    formData.append("e_nit_no", formik.values.e_nit_no);
    formData.append("dlp", formik.values.dlp);
    formData.append("add_per_security", formik.values.add_per_sec);
    formData.append("emd", formik.values.emd);
    formData.append("date_of_refund", formik.values.date_refund);

    formData.append("tender_id", formik.values.td_ID);
    formData.append("assistant_eng_id", formik.values.asstEng);
    formData.append("agency_id", formik.values.agency);

    formData.append("approval_no", params?.id);
    formData.append("sl_no", sl_no);
    formData.append("modified_by", userDataLocalStore.user_id);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    // console.log(formData, 'formDataformDataformData', 'updateFormData');

    try {
      const response = await axios.post(
        `${url}index.php/webApi/Tender/tend_edit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'auth_key': auth_key, // Important for FormData
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );
      
      // setLoading(false);
      Message("success", "Updated successfully.");
      setValues(initialValues)
      // loadFormEditData(params?.id, sl_no)
      // navigate(`/home/tender_formality`);
      fundAddedList(params?.id)
      setAgencyDetails([])
      formik.resetForm();
    } catch (error) {
      // setLoading(false);
      Message("error", "Error Submitting Form:");
      console.error("Error submitting form:", error);
      
      localStorage.removeItem("user_dt");
      navigate('/')
    }

  };
  

  const onSubmit = (values) => {
    console.log(values, 'valuesvaluesvalues');
    
    
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
      // validationSchema,
      validationSchema: validationSchema(maturedData),
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
      if (fileSizeMB > 2) {
        setErrorpdf_1("File size should not exceed 2MB.");
        return;
      }

      setErrorpdf_1("");
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
      if (fileSizeMB > 2) {
        setErrorpdf_2("File size should not exceed 2MB.");
        return;
      }

      setErrorpdf_2("");
      formik.setFieldValue("wo_pdf", file);
      setFilePreview_2(URL.createObjectURL(file)); // Create a preview URL
      // Proceed with file upload or further processing
    }
  };
    
const generateAgencyDetails = async (agency_id) => {
    setLoading(true);
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    formData.append("agency_id", agency_id);
    formData.append("created_by", userDataLocalStore.user_id);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token
    
        try {
    
          const response = await axios.post( `${url}index.php/webApi/Mdapi/agencyList`, 
          formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                'auth_key': auth_key,
                'Authorization': `Bearer ` + tokenValue?.token
              },
            }
          );

          
          
  
          if(response?.data?.status > 0) {
            console.log(response, 'responseresponseresponse', response?.data?.message[0]?.agency_name);
            setAgencyDetails(response?.data?.message[0])
            setLoading(false);
          }
  
          if(response?.data?.status < 1) {
          setLoading(false);
          // Message("error", response?.data?.message);
          }

          } catch (error) {
          setLoading(false);
          Message("error", "Error Submitting Form:");
          console.error("Error submitting form:", error);

          localStorage.removeItem("user_dt");
          navigate('/')
          }

  };

    // useEffect(() => {
    //   if (getMsgData[0] && Array.isArray(fundStatus)) {
    //     const total = fundStatus.reduce(
    //       (sum, item) => sum + (parseFloat(item?.sch_amt) || 0),
    //       0
    //     );
    //     console.log(total.toFixed(2), 'hhhhhhhhhhhhhhhh', getMsgData[0].sch_amt);
        
    //     setUseSchematicAmt(total.toFixed(2)); // toFixed returns a string
    //   }
  
    //   // if (fundStatus && Array.isArray(fundStatus)) {
    //   //   const total = fundStatus.reduce(
    //   //     (sum, item) => sum + (parseFloat(item?.cont_amt) || 0),
    //   //     0
    //   //   );
    //   //   setUseContigencyAmt(total.toFixed(2)); // toFixed returns a string
    //   // }
  
    // }, [getMsgData[0]]);

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
              <label for="fin_yr" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Project ID</label>
              <Select
              showSearch // Search
              placeholder="Choose Project ID"
              onChange={(value) => {
              formik.setFieldValue("approval_no", value)
              loadFormData(value)
              fundAddedList(value)
              setApprovalNo(value)
              setShowForm(true)
              }}
              onBlur={formik.handleBlur}
              style={{ width: "100%" }}
              optionFilterProp="children"
              filterOption={(input, option) => // Search
              option?.children?.toLowerCase().includes(input.toLowerCase()) // Search
              } // Search
              >
              <Select.Option value="" disabled> Choose Project ID </Select.Option>
              {projectId.map(data => (
              <Select.Option key={data.approval_no} value={data.approval_no}>
              {data.project_id}
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
              label="Project ID"
              formControlName={data.project_id}
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


              {/* {getMsgData.length}
              {JSON.stringify(projectIncomplete, null, 2)} */}

              {/* {JSON.stringify(getMsgData[0], null, 2)}
              {useSchematicAmt} */}

            {projectIncomplete &&(
            <div class="sm:col-span-12">
            <div class="p-4 mb-0 text-sm text-yellow-800 border-2 border-yellow-500 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
            <span class="font-bold"><svg class="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg></span>The project details are incomplete and lack key information, making the scope and objectives unclear.
            </div>
            </div>
            )}

            <div className="sm:col-span-12 text-blue-900 text-md font-bold mt-0 -mb-0">
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
                  label="scheme name"
                  formControlName={getMsgData[0]?.scheme_name ? getMsgData[0]?.scheme_name : 'No Data'}
                  mode={1}
                  disabled={true}
                />
              </div>

              <div class="sm:col-span-4">
                <TDInputTemplate
                  type="text"
                  label="Scheme Amount"
                  formControlName={getMsgData[0]?.scheme_name ? getMsgData[0]?.sch_amt : 'No Data'}
                  mode={1}
                  disabled={true}
                />
              </div>


              <div class="sm:col-span-4">
                <TDInputTemplate
                  type="text"
                  label="Sector name"
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

              {/* <div class="sm:col-span-4">
                

              <TDInputTemplate
                  type="date"
                  label="Work Order Issued On"
                  formControlName={getMsgData[1]?.wo_date ? getMsgData[1]?.wo_date : '0000-00'}
                  mode={1}
                  disabled={true}
              />

              </div> */}
              

            </div>


           

          
        </Spin>



        <Spin
						indicator={<LoadingOutlined spin />}
						size="large"
						className="text-gray-500 dark:text-gray-400"
						spinning={loading}
					>
{/* {JSON.stringify(fundStatus, null, 2)} */}


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
          field="call_id"
          header="Tender Call No."
          // body={(rowData, { rowIndex }) => rowIndex + 1}
          body={(rowData) => (
              rowData?.call_id == null ? '--' : 'Call '+rowData?.call_id
              
            )}
          
          ></Column>

          <Column
          field="tender_id"
          header="Tender ID"
          // body={(rowData, { rowIndex }) => rowIndex + 1}
          body={(rowData) => (
              rowData?.tender_id == null ? '--' : rowData?.tender_id
            )}
          
          ></Column>

          <Column
          field="tend_status"
          header="Tender Status"
          // body={(rowData, { rowIndex }) => rowIndex + 1}
          body={(rowData) => (
              rowData?.tend_status == 'M' ? 'Matured' : 'Cancelled'
            )}
          
          ></Column>

          <Column
          field="agency_name"
          header="Agency Name"
          // body={(rowData, { rowIndex }) => rowIndex + 1}
          body={(rowData) => (
              rowData?.agency_name === null ? '--' : rowData?.agency_name
            )}
          
          ></Column>

          <Column
          field="assistant_eng_name"
          header="Asst. Engineer"
          // body={(rowData, { rowIndex }) => rowIndex + 1}
          body={(rowData) => (
              rowData?.assistant_eng_name === null ? '--' : rowData?.assistant_eng_name
            )}
          
          ></Column>

          <Column
          field="tender_date"
          header="Tender Invited On"
          ></Column>

          <Column
          // field="instl_amt"
          header="Tender Notice"
          body={(rowData) => (
            <>
            {rowData?.tend_status == 'M' ?(
          <a href={url + folder_tender + rowData?.tender_notice} target='_blank'><FilePdfOutlined style={{fontSize:22, color:'red'}} /></a>
            ) : (
              '--'
            )}
          </>
          )}
          ></Column>

          <Column
          field="invite_auth"
          header="Tender Inviting Authority"
          ></Column>

          <Column
          field="e_nit_no"
          header="e-NIT No"
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
          header="EMD/Security Deposit"
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
            <>
            {rowData?.tend_status == 'M' ?(
          <a href={url + folder_tender + rowData?.wo_copy} target='_blank'><FilePdfOutlined style={{fontSize:22, color:'red'}} /></a>
            ) : (
              '--'
            )}
          </>
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
          header="Date of Completion (As per Work Order)"
          ></Column>

{params.id > 0 &&(
  <Column
          field="comp_date_apprx"
          header="Action"
          body={(rowData) => (
            <>
            {/* rowData?.tend_status == 'M' ? 'Matured' : 'Cancelled' */}
            {rowData?.tend_status == 'M' &&(
              <a onClick={() => { loadFormEditData(params?.id, rowData.sl_no)}}><EditOutlined style={{fontSize:22}} /></a>
            )}
            </>
            )}
          ></Column>
)}
          

          

          </DataTable>
          </>
        )}
        </Spin>
        {showForm  &&(
        <>
      
        <form onSubmit={formik.handleSubmit}>

          <div class="grid gap-4 sm:grid-cols-12 sm:gap-6 hoSection pb-5">
              
              <div className="sm:col-span-12 text-black text-md font-bold -mb-2 titleSection">
                Tender Status
              </div>

              <div class="sm:col-span-4">
              <label for="fin_yr" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Tender Call No.
                <span className="mandator_txt"> *</span>
              </label>

              <Select
              placeholder="Choose Head Account"
              value={formik.values.call_no || undefined} // Ensure default empty state
              onChange={(value) => {
              formik.setFieldValue("call_no", value)
              }}
              name="call_no"
              onBlur={formik.handleBlur}
              style={{ width: "100%" }}
              >
              <Select.Option value=""> Choose Tender Call No. </Select.Option>
              {tenderCallNo?.map(data => (
              <Select.Option key={data.call_id} value={data.call_id}>
              {data.call_name}
              </Select.Option>
              ))}
              </Select>

                {formik.errors.call_no && formik.touched.call_no && (
                  <VError title={formik.errors.call_no} />
                )}

              </div>

                <div class="sm:col-span-4">
              <TDInputTemplate
                type="text"
                placeholder="Tender ID"
                label={<>Tender ID <span className="mandator_txt"> *</span></>}
                name="td_ID"
                formControlName={formik.values.td_ID}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.td_ID && formik.touched.td_ID && (
                <VError title={formik.errors.td_ID} />
              )}
            </div>

              <div class="sm:col-span-4 areaSec">
              <label className="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Tender Status </label>

              <Radiobtn
              data={tenderStatus}
              val={maturedData}
              onChangeVal={(value) => {
              tenderStatusFunc(value)
              }}
              />

              </div>

              

              {maturedData == 'C' &&(
                <div class="sm:col-span-12">
                <TDInputTemplate
                  placeholder="Type here..."
                  type="text"
                  label='Remarks'
                  name="tenderCancel_reason"
                  formControlName={formik.values.tenderCancel_reason}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  mode={3}
                  required={true}
                  disabled={userDataLocalStore.user_type === 'A'}
                />
                {formik.errors.tenderCancel_reason && formik.touched.tenderCancel_reason && (
                  <VError title={formik.errors.tenderCancel_reason} />
                )}
              </div>
              )}
            
            </div>



          {maturedData == 'M' &&(
            <>
            <Heading title={'Tender Formality Details'} button={'N'}/>
            <div class="grid gap-4 sm:grid-cols-12 sm:gap-6">

            {/* <div class="sm:col-span-4">
              <TDInputTemplate
                type="text"
                placeholder="Tender ID"
                label={<>Tender ID{maturedData == 'M' ? <span className="mandator_txt"> *</span> : ''}</>}
                name="td_ID"
                formControlName={formik.values.td_ID}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.td_ID && formik.touched.td_ID && (
                <VError title={formik.errors.td_ID} />
              )}
            </div> */}

            <div class="sm:col-span-4">
        {/* {JSON.stringify(agencyList, null, 2)} */}
          <label for="agency" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Choose Agency
         {maturedData == 'M' ? <span className="mandator_txt"> *</span> : ''}
          </label>
        <Select
        required
        showSearch
        placeholder="Choose Agency"
        value={formik.values.agency || undefined} // Ensure default empty state
        onChange={(value) => {
        formik.setFieldValue("agency", value);
        generateAgencyDetails(value)
        }}
        onBlur={formik.handleBlur}
        style={{ width: "100%" }}
        optionFilterProp="children"
        filterOption={(input, option) =>
        option?.children?.toLowerCase().includes(input.toLowerCase())
        }
        >
        <Select.Option value="" disabled>
        Choose Project implemented By
        </Select.Option>
        {agencyList?.map((data) => (
        <Select.Option key={data.agency_id} value={data.agency_id}>
        {data.agency_name}
        </Select.Option>
        ))}
        </Select>

          {formik.errors.agency && formik.touched.agency && (
          <VError title={formik.errors.agency} />
          )}
          </div>
          {/* {JSON.stringify(agencyDetails?.agency_name, null, 2)} // {JSON.stringify(agencyDetails.length, null, 2)} */}


          {agencyDetails && Object.keys(agencyDetails).length > 0 && (
  <div className="sm:col-span-12 agencyDetails agency_sec">
    <div className="sm:col-span-12 text-black text-md font-bold -mb-2 titleSection">
                Agency Details
              </div>
    {/* {JSON.stringify(agencyDetails, null, 2)} */}
    <label><span>Agency Name:</span> {agencyDetails?.agency_name}</label>
    <label><span>Contact No.:</span> {agencyDetails?.ph_no}</label>
    <label><span>Registration No.:</span> {agencyDetails?.reg_no}</label>
    <label><span>GST No.:</span> {agencyDetails?.gst_no}</label>
    <label><span>PAN No.:</span> {agencyDetails?.pan_no}</label>
    <label><span>Bank A/C No.:</span> {agencyDetails?.acc_no}</label>
    <label><span>IFSC Code:</span> {agencyDetails?.ifs_code}</label>
    <label className='address'><span>Address :</span> {agencyDetails?.address}</label>

  </div>
)}
          

          <div class="sm:col-span-4 contigencySelect">

          <label for="dis" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Choose Asst. Engineer
         {maturedData == 'M' ? <span className="mandator_txt"> *</span> : ''}
          </label>
        <Select
        required
        showSearch
        placeholder="Choose Asst. Engineer"
        value={formik.values.asstEng || undefined} // Ensure default empty state
        onChange={(value) => {
        formik.setFieldValue("asstEng", value);
        }}
        onBlur={formik.handleBlur}
        style={{ width: "100%" }}
        optionFilterProp="children"
        filterOption={(input, option) =>
        option?.children?.toLowerCase().includes(input.toLowerCase())
        }
        >
        <Select.Option value="" disabled>
        Choose Project implemented By
        </Select.Option>
        {asstEngListData?.map((data) => (
        <Select.Option key={data.assistant_eng_id} value={data.assistant_eng_id}>
        {data.name}
        </Select.Option>
        ))}
        </Select>

          {formik.errors.asstEng && formik.touched.asstEng && (
          <VError title={formik.errors.asstEng} />
          )}
          </div>
          

            <div class="sm:col-span-4">
              <TDInputTemplate
                type="date"
                placeholder="Tender Invited On"
                label={<>Tender Invited On{maturedData == 'M' ? <span className="mandator_txt"> *</span> : ''}</>}
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
              label={<>Tender Notice (PDF Max Size 2 MB){maturedData == 'M' ? <span className="mandator_txt"> *</span> : ''}</>}
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
                label={<>Tender Inviting Authority{maturedData == 'M' ? <span className="mandator_txt"> *</span> : ''}</>}
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
                type="text"
                placeholder="e-NIT No...."
                label={<>e-NIT No{maturedData == 'M' ? <span className="mandator_txt"> *</span> : ''}</>}
                name="e_nit_no"
                formControlName={formik.values.e_nit_no}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.e_nit_no && formik.touched.e_nit_no && (
                <VError title={formik.errors.e_nit_no} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Amount Put to Tender..."
                type="number"
                label={<>Amount Put to Tender{maturedData == 'M' ? <span className="mandator_txt"> *</span> : ''}</>}
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
                type="text"
                label={<>DLP{maturedData == 'M' ? <span className="mandator_txt"> *</span> : ''}</>}
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
                label={<>Additional Performance Security</>}
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
                placeholder="EMD/Security Deposit..."
                type="number"
                label={<>EMD/Security Deposit{maturedData == 'M' ? <span className="mandator_txt"> *</span> : ''}</>}
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
                label={<>Date Of Refund </>}
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
                label={<>Tender Matured On{maturedData == 'M' ? <span className="mandator_txt"> *</span> : ''}</>}
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
                label={<>Work Order Issued On<span className="mandator_txt"> *</span></>}
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
              label={<>Work Order Copy (PDF Max Size 2 MB){maturedData == 'M' ? <span className="mandator_txt"> *</span> : ''}</>}
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
                label={<>Work Order Value{maturedData == 'M' ? <span className="mandator_txt"> *</span> : ''}</>}
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
                label={<>Date of Completion (As per Work Order){maturedData == 'M' ? <span className="mandator_txt"> *</span> : ''}</>}
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
            
          </div>
            </>
          )}
          <div class="grid gap-4 sm:grid-cols-12 sm:gap-6">
            {projectIncomplete === false &&(

<div className="sm:col-span-12 flex justify-center gap-4 mt-4">

{params.id < 1 ? (
<>
<BtnComp title={'Reset'} type="reset" 
onClick={() => { 
formik.resetForm();
}}
width={'w-1/6'} bgColor={'bg-white'} color="text-blue-900" border={'border-2 border-blue-900'} />
<BtnComp type={'submit'} title={params.id > 0 ? 'Update' : 'Submit'} onClick={() => { }} width={'w-1/6'} bgColor={'bg-blue-900'} />
</>
) : editFlagStatus == 'Y' ? (
<>
<BtnComp type={'submit'} title={params.id > 0 ? 'Update' : 'Submit'} onClick={() => { }} width={'w-1/6'} bgColor={'bg-blue-900'} />
</>
) : userDataLocalStore.user_type === 'S' ? (
<>
<BtnComp type={'submit'} title={params.id > 0 ? 'Update' : 'Submit'} onClick={() => { }} width={'w-1/6'} bgColor={'bg-blue-900'} />
</>
)  : null }

  {/* {JSON.stringify(getMsgData[0]?.edit_flag, null, 2)}  */}
  


            
            </div>
            )}
          </div>

        </form>
        </>
        )}


      </div>
    </section>
  )
}

export default TFForm
