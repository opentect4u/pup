import React, { useEffect, useState } from "react";
import TDInputTemplate from "../../Components/TDInputTemplate";
import BtnComp from "../../Components/BtnComp";
import Heading from "../../Components/Heading";
import axios from "axios";
import { url, auth_key, folder_admin } from "../../Assets/Addresses/BaseUrl";
import VError from "../../Components/VError";
import * as Yup from 'yup';
import { useFormik } from "formik";
import { Select, Spin } from "antd";
import { Message } from "../../Components/Message";
import { useNavigate, useParams } from "react-router"
import { FilePdfOutlined, LoadingOutlined } from "@ant-design/icons";


const initialValues = {
  scheme_name: '',
  sector_name: '',
  fin_yr: '',
  schm_amt: '',
  cont_amt: '',
  tot_amt: '',
  admin_appr_pdf: '',
  proj_id: '',
  head_acc: '',
  dt_appr: '',
  proj_sub_by: '',
  project_submit_dtl:'',
  proj_imp_by: '',
  dis: '',
  block: '',
  ps_id: '',
  // gp_id: '',
  vet_dpr_pdf: '',
  src: '',

  jl_no: '',
  mouza: '',
  dag_no: '',
  khatian_no: '',
  area: '',
};



const validationSchema = Yup.object({
  // scheme_name: '',
  // sector_name: '',
  // fin_yr: '',
  // schm_amt: '',
  // cont_amt: '',
  // tot_amt: '',
  // admin_appr_pdf: '',
  // proj_id: '',
  // head_acc: '',
  // dt_appr: '',
  // proj_sub_by: '',
  // proj_imp_by: '',
  // dis: '',
  // block: '',
  // vet_dpr_pdf: '',
  // src: '',



  scheme_name: Yup.string().required('Scheme name is Required'),
  sector_name: Yup.string().required('Sector is Required'),
  fin_yr: Yup.string().required('Scanctioning Financial Year is Required'),
  // schm_amt: Yup.string().required('Schematic Amount is Required'),
  // cont_amt: Yup.number()
  //   .typeError('Contigency Amount must be a number')
  //   .required('Contigency Amount is Required')
  //   .positive('Contigency Amount must be greater than zero')
  //   .test(
  //     'is-three-percent',
  //     'Contingency Amount should be 3% of Schematic Amount',
  //     function (value) {
  //       const { schm_amt } = this.parent;
  //       if (!schm_amt || !value) return true; // Skip validation if either is missing
  //       const expected = parseFloat(schm_amt) * 0.03;
  //       return parseFloat(value).toFixed(2) <= expected.toFixed(2);
  //     }
  //   ),

  schm_amt: Yup.number()
      .typeError('Schematic Amount must be a number')
      .required('Schematic Amount is Required')
      .positive('Schematic Amount must be greater than zero'),
  
    cont_amt: Yup.number()
      .typeError('Contingency Amount must be a number')
      .required('Contingency Amount is Required')
      .positive('Contingency Amount must be greater than zero')
      .test(
        'is-three-percent',
        'Contingency Amount should be 3% of Schematic Amount or Below',
        function (value) {
          const { schm_amt } = this.parent;
          if (!schm_amt || !value) return true;
          const expected = parseFloat(schm_amt) * 0.03;
          return parseFloat(value) <= parseFloat(expected.toFixed(2));
        }
      ),
    
  admin_appr_pdf: Yup.string().required('Administrative Approval(G.O) is Required'),
  proj_id: Yup.string().required('Project ID is Required'),
  head_acc: Yup.string().required('Head Account is Required'),
  dt_appr: Yup.string().required('Date of administrative approval is Required'),
  proj_sub_by: Yup.string().required('Project Submitted By is Required'),
  project_submit_dtl: Yup.string().required('Details of Person/Organization by whom.. is Required'),
  proj_imp_by: Yup.string().required('Project implemented By is Required'),
  dis: Yup.string().required('District is Required'),
  block: Yup.string().required('Block is Required'),

  ps_id: Yup.string().required('Police Station is Required'),

  vet_dpr_pdf: Yup.string().required('Vetted DPR is Required'),
  src: Yup.string().required('Source of Fund is Required'),

  jl_no:  Yup.string().required('JL No. is Required'),
  mouza:  Yup.string().required('Mouza is Required'),
  dag_no:  Yup.string().required('Dag No is Required'),
  khatian_no:  Yup.string().required('Khatian No is Required'),
  area:  Yup.string().required('Area is Required'),


});



function AdApForm() {
  // axios.defaults.baseURL = url;
  // axios.defaults.headers.common['AuthKey'] = 'c299cf0ae55db8193eb2d3116';
  // axios.defaults.headers.common['Content-Type'] = 'application/json';
  const [sectorDropList, setSectorDropList] = useState([]);
  const [financialYearDropList, setFinancialYearDropList] = useState([]);
  const [projectImple, setProjectImple] = useState([]);
  const [headAccountDropList, setHeadAccountDropList] = useState([]);
  const [districtDropList, setDistrictDropList] = useState([]);
  const [district_ID, setDistrict_ID] = useState([]);

  const [block_ID, setBlock_ID] = useState([]);
  const [blockDropList, setBlockDropList] = useState(() => []);
  const [blockDropList_Load, setBlockDropList_Load] = useState(() => []);

  const [psStn_ID, setpsStn_ID] = useState([]);
  const [psStnDropList, setpsStnDropList] = useState(() => []);
  const [psStnDropList_Load, setpsStnDropList_Load] = useState(() => []);

  const [GM_ID, setGM_ID] = useState([]);
  const [GM_DropList, setGM_DropList] = useState(() => []);
  const [GM_DropList_Load, setGM_DropList_Load] = useState(() => []);

  const [sourceFundDropList, setSourceFundDropList] = useState([]);
  const params = useParams()
  const [formValues, setValues] = useState(initialValues)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [filePreview, setFilePreview] = useState(null);
  const [filePreview_2, setFilePreview_2] = useState(null);

  const [checkProjectId, setCheckProjectId] = useState(true);

  const [userDataLocalStore, setUserDataLocalStore] = useState([]);
  const [errorpdf_1, setErrorpdf_1] = useState("");
  const [errorpdf_2, setErrorpdf_2] = useState("");

  const [projectSubBy, setProjectSubBy] = useState([]);


  const fetchSectorDropdownOption = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Mdapi/sector',
        {}, // Empty body
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      // console.log("Response Data:", response.data.message); // Log the actual response data
      setSectorDropList(response?.data?.message)
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      setLoading(false);
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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      setLoading(false);
    }
  };

  const fetchProjectImplement = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Mdapi/impagency',
        {}, // Empty body
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      console.log("fetchProjectImplement:", response.data.message); // Log the actual response data
      setProjectImple(response.data.message)
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
        url + 'index.php/webApi/Mdapi/head_of_acc',
        {}, // Empty body
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      // console.log("Response Data:", response.data.message); // Log the actual response data
      setHeadAccountDropList(response.data.message)
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error); // Handle errors properly
    }
  };

  const fetchDistrictdownOption = async () => {
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

      // console.log("Response Data__:", response.data.message); // Log the actual response data
      setDistrictDropList(response.data.message)
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

      setBlockDropList(response.data.message)
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
    }
  };

  const fetchPoliceStnOption = async () => {
    const formData = new FormData();
    formData.append("dist_id", district_ID);
    formData.append("block_id", 0);

    try {
    const response = await axios.post(
    `${url}index.php/webApi/Mdapi/get_ps`,
    formData,
    {
    headers: {
    "Content-Type": "multipart/form-data",
    'auth_key': auth_key // Important for FormData
    },
    }
    );

    console.log(response, 'pssssssssssssss', formData);
    if(response?.data?.status > 0){
      setpsStnDropList(response?.data?.message)
    }

    if(response?.data?.status < 1){
      setpsStnDropList([])
    }
    

    } catch (error) {
    console.error("Error fetching data:", error); // Handle errors properly
    }


  };

  const fetch_GM_Option = async () => {
    const formData = new FormData();
    formData.append("dist_id", district_ID);
    formData.append("block_id", block_ID);

    try {
    const response = await axios.post(
    `${url}index.php/webApi/Mdapi/get_gp`,
    formData,
    {
    headers: {
    "Content-Type": "multipart/form-data",
    'auth_key': auth_key // Important for FormData
    },
    }
    );

    console.log(response?.data?.message, 'rrrrrrrrrrrrrrrrr', formData);
    if(response?.data?.status > 0){
      setGM_DropList(response?.data?.message)
    }

    if(response?.data?.status < 1){
      setGM_DropList([])
    }

    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
    }
  };

  const fetchSourceFunddownOption = async () => {
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Mdapi/sof',
        {}, // Empty body
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      console.log("Response Data Source:", response.data.message); // Log the actual response data
      setSourceFundDropList(response.data.message)
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
    }
  };

  const fetchProjectSubmitData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Mdapi/projSubmitBy',
        {}, // Empty body
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      console.log("fetchProjectSubmitData", response.data.message); // Log the actual response data
      setProjectSubBy(response?.data?.message)
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      setLoading(false);
    }
  };



  useEffect(() => {
  const userData = localStorage.getItem("user_dt");
  if (userData) {
  setUserDataLocalStore(JSON.parse(userData))
  } else {
  setUserDataLocalStore([])
  }

  }, []);

 

  useEffect(() => {
    fetchSectorDropdownOption()
    fetchFinancialYeardownOption()
    fetchProjectImplement()
    fetchHeadAccountdownOption()
    fetchDistrictdownOption()
    fetchSourceFunddownOption()
    fetchProjectSubmitData()
  }, [])

  useEffect(() => {
    fetchBlockdownOption()
    // fetch_GM_Option()
  }, [district_ID])

  useEffect(() => {
    fetchPoliceStnOption()
    fetch_GM_Option()
  }, [district_ID, block_ID])

  useEffect(()=>{

    if(params?.id > 0){
      loadFormData()
    }


  }, [])

  
  const fetchBlockdownOption__load = async (dis_id, block_id) => {
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Mdapi/block',
        { dist_id: dis_id }, // Empty body
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      var data = response?.data?.message
      const filteredBlockLoad = data.filter(block => block.block_id === block_id);

      console.log(filteredBlockLoad, 'filteredBlockLoad');
      
      setBlockDropList_Load(filteredBlockLoad)
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
    }
  };

  const fetchPoliceStnOption__load = async (dis_id, ps_id) => {
    const formData = new FormData();
    formData.append("dist_id", dis_id);
    formData.append("block_id", 0);

    try {
    const response = await axios.post(
    `${url}index.php/webApi/Mdapi/get_ps`,
    formData,
    {
    headers: {
    "Content-Type": "multipart/form-data",
    'auth_key': auth_key // Important for FormData
    },
    }
    );

    

    var data = response?.data?.message
    const filteredData = data.filter(ps => ps.id === ps_id);
    console.log(dis_id, ps_id, 'fetchPoliceStnOption__load', filteredData);
      
    setpsStnDropList_Load(filteredData)
    
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
    }
  };

  const fetch_GM_Option__load = async (dis_id, block_id, gm_id) => {
    const formData = new FormData();
    formData.append("dist_id", dis_id);
    formData.append("block_id", block_id);

    try {
    const response = await axios.post(
    `${url}index.php/webApi/Mdapi/get_gp`,
    formData,
    {
    headers: {
    "Content-Type": "multipart/form-data",
    'auth_key': auth_key // Important for FormData
    },
    }
    );

    
    
    var data = response?.data?.message
    const filteredData = data.filter(gp => gp.gp_id === gm_id);
    console.log(dis_id, block_id, gm_id, 'fetch_GM_Option__load', filteredData);
    setGM_DropList_Load(filteredData)
    
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
    }
  };




  const loadFormData = async () => {
  
    const cread = {
      approval_no: params?.id
    }

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Admapi/adm_by_approval_no',
        cread, 
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      const totalAmount = Number(response.data.message.sch_amt) + Number(response.data.message.cont_amt);
      fetchBlockdownOption__load(response?.data?.message?.district_id, response?.data?.message?.block_id)

      fetchPoliceStnOption__load(response?.data?.message?.district_id, response.data.message.ps_id)
      fetch_GM_Option__load(response?.data?.message?.district_id, response.data.message.block_id, response.data.message.gp_id)

      setValues({
        scheme_name: response.data.message.scheme_name,
        sector_name: response.data.message.sector_id,
        fin_yr: response.data.message.fin_year,
        schm_amt: response.data.message.sch_amt,
        cont_amt: response.data.message.cont_amt,
        tot_amt: totalAmount,
        admin_appr_pdf: response.data.message.admin_approval,
        proj_id: response.data.message.project_id,
        head_acc: response.data.message.account_head,
        dt_appr: response.data.message.admin_approval_dt,
        proj_sub_by: response.data.message.project_submit,
        project_submit_dtl: response.data.message.project_submit_dtl,
        proj_imp_by: response.data.message.impl_agency,
        dis: response.data.message.district_id,
        block: response.data.message.block_id,

        ps_id: response.data.message.ps_id,
        gp_id: response.data.message.gp_id,


        vet_dpr_pdf: response.data.message.vetted_dpr,
        src: response.data.message.fund_id,

        jl_no: response.data.message.jl_no,
        mouza: response.data.message.mouza,
        
        dag_no: response.data.message.dag_no,
        khatian_no: response.data.message.khatian_no,
        area: response.data.message.area,
      })

      console.log("loadFormDatafffffffff", response.data.message.dag_no); // Log the actual response data
      // setSourceFundDropList(response.data.message)
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
    }

  };

  const saveFormData = async () => {

    // setLoading(true);
  
    const formData = new FormData();
  
    // Append each field to FormData
    formData.append("scheme_name", formik.values.scheme_name);
    formData.append("sector_id", formik.values.sector_name);
    formData.append("fin_year", formik.values.fin_yr);
    formData.append("sch_amt", formik.values.schm_amt);
    formData.append("cont_amt", formik.values.cont_amt);
    formData.append("admin_approval", formik.values.admin_appr_pdf); // Ensure this is a file if applicable
    formData.append("project_id", formik.values.proj_id);
    formData.append("account_head", formik.values.head_acc);
    formData.append("admin_approval_dt", formik.values.dt_appr);
    formData.append("project_submit", formik.values.proj_sub_by);
    formData.append("project_submit_dtl'", formik.values.project_submit_dtl);
    formData.append("impl_agency", formik.values.proj_imp_by);
    formData.append("district_id", formik.values.dis);
    formData.append("block_id", formik.values.block);

    formData.append("ps_id", formik.values.ps_id);
    formData.append("gp_id", formik.values.gp_id);

    formData.append("vetted_dpr", formik.values.vet_dpr_pdf); // Ensure this is a file if applicable
    formData.append("fund_id", formik.values.src);

    formData.append("jl_no", formik.values.jl_no);
    formData.append("mouza", formik.values.mouza);
    formData.append("dag_no", formik.values.dag_no);
    formData.append("khatian_no", formik.values.khatian_no);
    formData.append("area", formik.values.area);


    formData.append("created_by", userDataLocalStore.user_id);
  
    // console.log(formik.values.admin_appr_pdf, "FormData:", formik.values.vet_dpr_pdf);
    console.log(formData, "FormData:", formik.values.admin_appr_pdf.name);

    try {
      const response = await axios.post(
        `${url}index.php/webApi/Admapi/adm_appr_add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'auth_key': auth_key // Important for FormData
          },
        }
      );
  
      // setLoading(false);
      Message("success", "Updated successfully.");
      setLoading(false);
      formik.resetForm();
    } catch (error) {
      setLoading(false);
      Message("error", "Error Submitting Form:");
      console.error("Error submitting form:", error);
    }

  };

  const updateFormData = async () => {
    setLoading(true); // Set loading state
  
    const formData = new FormData();
  
    // Append each field to FormData
    formData.append("scheme_name", formik.values.scheme_name);
    formData.append("sector_id", formik.values.sector_name);
    formData.append("fin_year", formik.values.fin_yr);
    formData.append("sch_amt", formik.values.schm_amt);
    formData.append("cont_amt", formik.values.cont_amt);
    formData.append("admin_approval", formik.values.admin_appr_pdf); // Ensure this is a file if applicable
    formData.append("project_id", formik.values.proj_id);
    formData.append("account_head", formik.values.head_acc);
    formData.append("admin_approval_dt", formik.values.dt_appr);
    formData.append("project_submit", formik.values.proj_sub_by);
    formData.append("project_submit_dtl", formik.values.project_submit_dtl);
    formData.append("impl_agency", formik.values.proj_imp_by);
    formData.append("district_id", formik.values.dis);
    formData.append("block_id", formik.values.block);

    formData.append("ps_id", formik.values.ps_id);
    formData.append("gp_id", formik.values.gp_id);

    formData.append("vetted_dpr", formik.values.vet_dpr_pdf); // Ensure this is a file if applicable
    formData.append("fund_id", formik.values.src);

    formData.append("jl_no", formik.values.jl_no);
    formData.append("mouza", formik.values.mouza);
    formData.append("dag_no", formik.values.dag_no);
    formData.append("khatian_no", formik.values.khatian_no);
    formData.append("area", formik.values.area);

    formData.append("approval_no", params?.id);
    formData.append("modified_by", userDataLocalStore.user_id);

  
    console.log(formData, "FormData:", formik.values.admin_appr_pdf);

    try {
      const response = await axios.post(
        `${url}index.php/webApi/Admapi/adm_appr_edit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'auth_key': auth_key // Important for FormData
          },
        }
      );
  
      setLoading(false);
      Message("success", "Updated successfully.");
      navigate(`/home/admin_approval`);

      formik.resetForm();
    } catch (error) {
      setLoading(false);
      Message("error", "Error Submitting Form:");
      console.error("Error submitting form:", error);
    }

  };
  


  const onSubmit = (values) => {
    // console.log(values, 'credcredcredcredcred', formik.values.scheme_name);
    if(errorpdf_1.length < 1 && errorpdf_2.length < 1){
      if(params?.id > 0){
        updateFormData()
      }
      
      if(params?.id < 1 && checkProjectId){
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


  useEffect(() => {
    const schmAmt = parseFloat(formik.values.schm_amt) || 0;
    const contAmt = parseFloat(formik.values.cont_amt) || 0;
    const total = schmAmt + contAmt;
  
    formik.setFieldValue("tot_amt", total);
  }, [formik.values.schm_amt, formik.values.cont_amt]);

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
      console.log("File is valid:", file.name);
      formik.setFieldValue("admin_appr_pdf", file);
      setFilePreview(URL.createObjectURL(file)); // Create a preview URL
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
      if (fileSizeMB > 1024) {
        setErrorpdf_2("File size should not exceed 1GB.");
        return;
      }

      setErrorpdf_2("");
      console.log("File is valid:", file.name);
      formik.setFieldValue("vet_dpr_pdf", file);
      setFilePreview_2(URL.createObjectURL(file)); // Create a preview URL
      // Proceed with file upload or further processing
    }
  };

  useEffect(() => {
    // if (formik.values.cont_amt) {
    //   formik.validateField('cont_amt');
    // }
    // formik.validateField('schm_amt');
    // formik.validateField('cont_amt');
    // const total = 150;
  
    // formik.setFieldValue("cont_amt", total);

    const schmAmt = formik.values.schm_amt; // Get the value of 'schm_amt'
const contAmt = schmAmt * 0.03; // Calculate 3% of 'schm_amt'

formik.setFieldValue('cont_amt', contAmt);

  }, [formik.values.schm_amt]);


  return (
    <section class="bg-white p-5 dark:bg-gray-900">
      <div class="py-5 mx-auto w-full lg:py-5">
        <Heading title={'Administrative Approval'} button={'Y'} />
        <Spin
						indicator={<LoadingOutlined spin />}
						size="large"
						className="text-gray-500 dark:text-gray-400"
						spinning={loading}
					>
        <form onSubmit={formik.handleSubmit}>
          <div class="grid gap-4 sm:grid-cols-12 sm:gap-6">

          <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Choose Project ID"
                type="text"
                label={<>Project ID <span className="mandator_txt">*</span></>}
                name="proj_id"
                formControlName={formik.values.proj_id}
                // handleChange={formik.handleChange}
                handleChange={(e) => {
                  formik.handleChange(e);
                  // checkProjectId_fn(e)
                  console.log('Project ID changed to:', e.target.value); // Additional action if needed
                }}
                handleBlur={formik.handleBlur}
                mode={1}
              />

{/* {JSON.stringify(formik.errors.proj_id , null, 2)} /// {JSON.stringify(formik.errors.proj_id, null, 2)} /// {JSON.stringify(checkProjectId, null, 2)} */}
{/* {checkProjectId === false &&(
  <VError title={'Project ID must be Unique'} />
)} */}

              {formik.errors.proj_id && formik.touched.proj_id &&(
                <VError title={formik.errors.proj_id} />
              )}
              
            </div>

            {params?.id > 0 &&(
              <div class="sm:col-span-4">
              <TDInputTemplate
                // placeholder="Choose Project ID"
                type="text"
                label="Approval No"
                // name="proj_id"
                value = {params?.id}
                formControlName={params?.id}
                // handleChange={formik.handleChange}
                // handleBlur={formik.handleBlur}
                mode={1}
                disabled={true}
              />
              
            </div>
            )}

<div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Date of administrative approval"
                type="date"
                label={<>Date of administrative approval<span className="mandator_txt"> *</span></>}
                name="dt_appr"
                formControlName={formik.values.dt_appr}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.dt_appr && formik.touched.dt_appr && (
                <VError title={formik.errors.dt_appr} />
              )}
            </div>
            


            <div class="sm:col-span-4">
              <TDInputTemplate
                type="text"
                placeholder="Scheme name goes here..."
                label={<>Enter scheme name<span className="mandator_txt"> *</span></>}
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
              {/* <TDInputTemplate
                placeholder="Choose Sector"
                type="text"
                label="Sector"
                name="sector_name"
                formControlName={formik.values.sector_name}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={2}
              /> */}

              <label for="sector_name" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Sector<span className="mandator_txt"> *</span></label>
              <Select
              showSearch // Search
                placeholder="Choose Sector"
                value={formik.values.sector_name || undefined} // Ensure default empty state
                onChange={(value) => {
                  formik.setFieldValue("sector_name", value)
                  console.log(value, 'ggggggggggggggggggg');
                }}
                onBlur={formik.handleBlur}
                style={{ width: "100%" }}
                optionFilterProp="children"

                filterOption={(input, option) => // Search
                option?.children?.toLowerCase().includes(input.toLowerCase()) // Search
            } // Search
              >
                <Select.Option value="" disabled> Choose Sector </Select.Option>
                {sectorDropList?.map(data => (
                  <Select.Option key={data.sl_no} value={data.sl_no}>
                    {data.sector_desc}
                  </Select.Option>
                ))}
              </Select>


              

              {/* sectorDropList */}
              {/* {JSON.stringify(sectorDropList, null, 2)} */}

              {formik.errors.sector_name && formik.touched.sector_name && (
                <VError title={formik.errors.sector_name} />
              )}
            </div>
            <div class="sm:col-span-4">
              <label for="fin_yr" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Scanctioning Financial Year<span className="mandator_txt"> *</span></label>
              <Select
              showSearch // Search
                placeholder="Choose Financial Year"
                value={formik.values.fin_yr || undefined} // Ensure default empty state
                onChange={(value) => {
                  formik.setFieldValue("fin_yr", value)
                  console.log(value, 'ggggggggggggggggggg');
                }}
                onBlur={formik.handleBlur}
                style={{ width: "100%" }}
                optionFilterProp="children"

                filterOption={(input, option) => // Search
                option?.children?.toLowerCase().includes(input.toLowerCase()) // Search
            } // Search
              >
                <Select.Option value="" disabled> Choose Scanctioning Financial Year </Select.Option>
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
            
            <div className="sm:col-span-12 text-blue-900 text-md font-bold mt-3 -mb-2">
              Amount of administrative approval
            </div>

            

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Schematic amount goes here..."
                type="number"
                label={<>Schematic Amount<span className="mandator_txt"> *</span></>}
                name="schm_amt"
                formControlName={formik.values.schm_amt}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.schm_amt && formik.touched.schm_amt && (
                <VError title={formik.errors.schm_amt} />
              )}
            </div>
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Contigency amount goes here..."
                type="number"
                label={<>Contigency Amount<span className="mandator_txt"> *</span></>}
                name="cont_amt"
                formControlName={formik.values.cont_amt}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.cont_amt && formik.touched.cont_amt && (
                <VError title={formik.errors.cont_amt} />
              )}
            </div>
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Total amount goes here..."
                type="number"
                label={<>Total Amount</>}
                name="tot_amt"
                formControlName={formik.values.tot_amt}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
                disabled= {true}
              />
              {formik.errors.tot_amt && formik.touched.tot_amt && (
                <VError title={formik.errors.tot_amt} />
              )}
            </div>
            <hr className="sm:col-span-12" />

            {/* <div class="sm:col-span-8">
              <TDInputTemplate
                placeholder="Administrative Approval"
                type="text"
                label="Administrative Approval"
                name="admin_appr"
                // formControlName={formik.values.email}
                // handleChange={formik.handleChange}
                // handleBlur={formik.handleBlur}
                mode={1}
              />
            </div> */}
            <div class="sm:col-span-4" style={{position:'relative'}}>
              

{/* {JSON.stringify(filePreview, null, 2)} */}
{/* {JSON.stringify(errorpdf_1 , null, 2)} */}
              <TDInputTemplate
              type="file"
              name="admin_appr_pdf"
              placeholder="Administrative Approval(G.O)"
              label={<>Administrative Approval(G.O) (PDF Max Size 2 MB)<span className="mandator_txt"> *</span></>}
              // handleChange={(event) => {
              // formik.setFieldValue("vet_dpr_pdf", event.currentTarget.files[0]);
              // }}
              handleChange={(event) => {
                handleFileChange_pdf_1(event)
              }}
              handleBlur={formik.handleBlur}
              mode={1}
              />

            {filePreview && (
            <a href={filePreview} target="_blank" rel="noopener noreferrer" style={{position:'absolute', top:37, right:10}}>
            <FilePdfOutlined style={{ fontSize: 22, color: "red" }} />
            </a>
            )}

            {/* {JSON.stringify(formValues.admin_appr_pdf, null, 2)} //  */}

            {formValues.admin_appr_pdf.length > 0 &&(
              <>
              {filePreview === null && (
                <a href={url + folder_admin + formValues.admin_appr_pdf} target='_blank' style={{position:'absolute', top:37, right:10}}>
                <FilePdfOutlined style={{fontSize:22, color:'red'}} /></a>
                )}
              </>
            )}
            
            
              {formik.errors.admin_appr_pdf && formik.touched.admin_appr_pdf && (
                <VError title={formik.errors.admin_appr_pdf} />
              )}
              {errorpdf_1 && <p style={{ color: "red", fontSize:12 }}>{errorpdf_1}</p>}

            </div>
            
            <div class="sm:col-span-4">
              

              <label for="head_acc" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Head Account<span className="mandator_txt"> *</span></label>
              {/* {JSON.stringify(headAccountDropList, null, 2)} */}
              <Select
                placeholder="Choose Head Account"
                value={formik.values.head_acc || undefined} // Ensure default empty state
                onChange={(value) => {
                  formik.setFieldValue("head_acc", value)
                  console.log(value, 'ggggggggggggggggggg');
                }}
                onBlur={formik.handleBlur}
                style={{ width: "100%" }}
              >
                <Select.Option value="" disabled> Choose Head Account </Select.Option>
                {headAccountDropList?.map(data => (
                  <Select.Option key={data.sl_no} value={data.sl_no}>
                    {data.account_head}
                  </Select.Option>
                ))}
              </Select>

              {formik.errors.head_acc && formik.touched.head_acc && (
                <VError title={formik.errors.head_acc} />
              )}
            </div>
            
            <div class="sm:col-span-4">

<label for="dis" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Project Submitted By<span className="mandator_txt"> *</span></label>

<Select
  showSearch
  placeholder="Name goes here..."
  value={formik.values.proj_sub_by || undefined} // Ensure default empty state
  onChange={(value) => {
    formik.setFieldValue("proj_sub_by", value);
    console.log(value, "ggggggggggggggggggg");
  }}
  onBlur={formik.handleBlur}
  style={{ width: "100%" }}
  optionFilterProp="children"
  filterOption={(input, option) =>
    option?.children?.toLowerCase().includes(input.toLowerCase())
  }
>
  <Select.Option value="" disabled>
    Choose Project Submitted By
  </Select.Option>
  {projectSubBy?.map((data) => (
    <Select.Option key={data.sl_no} value={data.sl_no}>
      {data.proj_submit_by}
    </Select.Option>
  ))}
</Select>


              {formik.errors.proj_sub_by && formik.touched.proj_sub_by && (
                <VError title={formik.errors.proj_sub_by} />
              )}
            </div>

            <div class="sm:col-span-12">
              <TDInputTemplate
                placeholder="Type here..."
                type="text"
                label='Details of Person/Organization by whom the project has beed submitted'
                name="project_submit_dtl"
                formControlName={formik.values.project_submit_dtl}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={3}
                required={true}
              />
              {formik.errors.project_submit_dtl && formik.touched.project_submit_dtl && (
                <VError title={formik.errors.project_submit_dtl} />
              )}
            </div>

            <div class="sm:col-span-4">


              <label for="dis" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Project implemented By<span className="mandator_txt"> *</span></label>


<Select
  showSearch
  placeholder="Choose Project implemented By"
  value={formik.values.proj_imp_by || undefined} // Ensure default empty state
  onChange={(value) => {
    formik.setFieldValue("proj_imp_by", value);
    console.log(value, "ggggggggggggggggggg");
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
  {projectImple?.map((data) => (
    <Select.Option key={data.id} value={data.id}>
      {data.agency_name}
    </Select.Option>
  ))}
</Select>

              
              {formik.errors.proj_imp_by && formik.touched.proj_imp_by && (
                <VError title={formik.errors.proj_imp_by} />
              )}
            </div>
            <div class="sm:col-span-4 contigencySelect">

            <label for="dis" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Choose District<span className="mandator_txt"> *</span></label>
            <Select
            showSearch // Search
            placeholder="Choose District"
            value={formik.values.dis || undefined} // Ensure default empty state
            onChange={(value) => {
            formik.setFieldValue("dis", value)
            setDistrict_ID(value)

            formik.setFieldValue("block", "");
            setBlockDropList([]);
            setBlockDropList_Load([]);

            formik.setFieldValue("ps_id", "");
            setpsStnDropList([]);
            setpsStnDropList_Load([])

            formik.setFieldValue("gp_id", "");
            setGM_DropList([]);
            setGM_DropList_Load([])
            
            console.log(value, 'disdisdis');
            }}
            onBlur={formik.handleBlur}
            style={{ width: "100%" }}
            optionFilterProp="children"

            filterOption={(input, option) => // Search
            option?.children?.toLowerCase().includes(input.toLowerCase()) // Search
            } // Search
            >
            <Select.Option value="" disabled> Choose District </Select.Option>
            {districtDropList?.map(data => (
            <Select.Option key={data.dist_code} value={data.dist_code}>
            {data.dist_name}
            </Select.Option>
            ))}
            </Select>


            {/* <Select
            placeholder="Choose Contingency Remarks goes here..."
            label="Choose Contingency Remarks"
            name="dis"
            mode="tags"
            style={{ width: '100%' }}
            value={formik.values.dis}
            onChange={(value) => {
            formik.setFieldValue("dis", value)
            }} // Update Formik state
            handleChange={formik.handleChange}
            onBlur={() => formik.setFieldTouched("dis", true)}
            tokenSeparators={[]}
            options={districtDropList.map(item => ({
            value: item.dist_code,
            label: item.dist_name
            }))}
            filterOption={(input, option) => 
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            /> */}


              {formik.errors.dis && formik.touched.dis && (
                <VError title={formik.errors.dis} />
              )}
            </div>
            <div class="sm:col-span-4">
            {/* {JSON.stringify(district_ID, null, 2)} ///  {JSON.stringify(block_ID, null, 2)} */}
          


              <label for="block" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Block<span className="mandator_txt"> *</span></label>
              
          <Select
          showSearch
          placeholder="Choose Block"
          value={
          blockDropList_Load[0]?.block_name
          ? blockDropList_Load[0]?.block_name
          : formik.values.block || undefined
          }
          onChange={(value) => {
          formik.setFieldValue("block", value);
          setBlock_ID(value)

          formik.setFieldValue("ps_id", "");
            setpsStnDropList([]);
            setpsStnDropList_Load([])

            formik.setFieldValue("gp_id", "");
            setGM_DropList([]);
            setGM_DropList_Load([])

          }}
          onBlur={formik.handleBlur}
          style={{ width: "100%" }}
          optionFilterProp="children"
          filterOption={(input, option) =>
          option?.children?.toLowerCase().includes(input.toLowerCase())
          }
          >
          <Select.Option value="" disabled>Choose Block</Select.Option>
          {blockDropList.map((data) => (
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


    <div class="sm:col-span-4">


    <label for="block" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Police Station<span className="mandator_txt"> *</span></label>

    <Select
    showSearch
    placeholder="Choose Police Station"
    value={
      psStnDropList_Load[0]?.ps_name
    ? psStnDropList_Load[0]?.ps_name
    : formik.values.ps_id || undefined
    }
    // value={
    //   formik.values.ps_id || undefined
    //   }
    onChange={(value) => {
    formik.setFieldValue("ps_id", value);
    }}
    onBlur={formik.handleBlur}
    style={{ width: "100%" }}
    optionFilterProp="children"
    filterOption={(input, option) =>
    option?.children?.toLowerCase().includes(input.toLowerCase())
    }
    >
    <Select.Option value="" disabled>Choose Police Station</Select.Option>
    {psStnDropList.map((data) => (
    <Select.Option key={data.id} value={data.id}>
    {data.ps_name}
    </Select.Option>
    ))}
    </Select>
    {/* {JSON.stringify(blockDropList_Load[0]?.block_name, null, 2)} */}
    {formik.errors.ps_id && formik.touched.ps_id && (
    <VError title={formik.errors.ps_id} />
    )}
    </div>


    <div class="sm:col-span-4">


        <label for="block" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Gram Panchayat<span className="mandator_txt"> *</span></label>

        <Select
        showSearch
        placeholder="Choose Gram Panchayat"
        value={
          GM_DropList_Load[0]?.gp_name
        ? GM_DropList_Load[0]?.gp_name
        : formik.values.gp_id || undefined
        }

        onChange={(value) => {
        formik.setFieldValue("gp_id", value);
        }}
        onBlur={formik.handleBlur}
        style={{ width: "100%" }}
        optionFilterProp="children"
        filterOption={(input, option) =>
        option?.children?.toLowerCase().includes(input.toLowerCase())
        }
        >
        <Select.Option value="" disabled>Choose Police Station</Select.Option>
        {GM_DropList.map((data) => (
        <Select.Option key={data.gp_id} value={data.gp_id}>
        {data.gp_name}
        </Select.Option>
        ))}
        </Select>
        {/* {JSON.stringify(blockDropList_Load[0]?.block_name, null, 2)} */}
        {formik.errors.gp_id && formik.touched.gp_id && (
        <VError title={formik.errors.gp_id} />
        )}
        </div>

            <div class="sm:col-span-4" style={{position:'relative'}}>
            {/* {JSON.stringify(errorpdf_2 , null, 2)} */}
              <TDInputTemplate
              type="file"
              name="vet_dpr_pdf"
              placeholder="Vetted DPR"
              label={<>Vetted DPR (PDF Max Size 1 GB)<span className="mandator_txt"> *</span></>}
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

            {formValues.vet_dpr_pdf.length > 0 &&(
            <>
            {filePreview_2 === null && (
            <a href={url + folder_admin + formValues.vet_dpr_pdf} target='_blank' style={{position:'absolute', top:37, right:10}}>
            <FilePdfOutlined style={{fontSize:22, color:'red'}} /></a>
            )}
            </>
            )}

            
            
            
              {formik.errors.vet_dpr_pdf && formik.touched.vet_dpr_pdf && (
                <VError title={formik.errors.vet_dpr_pdf} />
              )}
              {errorpdf_2 && <p style={{ color: "red", fontSize:12 }}>{errorpdf_2}</p>}
            </div>
            <div class="sm:col-span-4">
              {/* <TDInputTemplate
                placeholder="Choose Source of Fund"
                type="text"
                label="Source of Fund"
                name="src"
                formControlName={formik.values.src}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={2}
              /> */}

              <label for="src" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Source of Fund<span className="mandator_txt"> *</span></label>
              <Select
                placeholder="Choose Source of Fund"
                value={formik.values.src || undefined} // Ensure default empty state
                onChange={(value) => {
                  formik.setFieldValue("src", value)
                  console.log(value, 'ggggggggggggggggggg');
                }}
                onBlur={formik.handleBlur}
                style={{ width: "100%" }}
              >
                <Select.Option value="" disabled> Choose Source of Fund </Select.Option>
                {sourceFundDropList?.map(data => (
                  <Select.Option key={data.sl_no} value={data.sl_no}>
                    {data.fund_type}
                  </Select.Option>
                ))}
              </Select>

              {formik.errors.src && formik.touched.src && (
                <VError title={formik.errors.src} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Name goes here..."
                type="text"
                label={<>JL No.<span className="mandator_txt"> *</span></>}
                name="jl_no"
                formControlName={formik.values.jl_no}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.jl_no && formik.touched.jl_no && (
                <VError title={formik.errors.jl_no} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Name goes here..."
                type="text"
                label={<>Mouza<span className="mandator_txt"> *</span></>}
                name="mouza"
                formControlName={formik.values.mouza}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.mouza && formik.touched.mouza && (
                <VError title={formik.errors.mouza} />
              )}
            </div>

            <div class="sm:col-span-4">
              

              <TDInputTemplate
                placeholder="Name goes here..."
                type="text"
                label={<>Dag No.<span className="mandator_txt"> *</span></>}
                name="dag_no"
                formControlName={formik.values.dag_no}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.dag_no && formik.touched.dag_no && (
                <VError title={formik.errors.dag_no} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Name goes here..."
                type="text"
                label={<>Khatian No.<span className="mandator_txt"> *</span></>}
                name="khatian_no"
                formControlName={formik.values.khatian_no}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.khatian_no && formik.touched.khatian_no && (
                <VError title={formik.errors.khatian_no} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Name goes here..."
                type="number"
                label={<>Area (in Acre)<span className="mandator_txt"> *</span></>}
                name="area"
                formControlName={formik.values.area}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.area && formik.touched.area && (
                <VError title={formik.errors.area} />
              )}
            </div>

            
            <div className="sm:col-span-12 flex justify-center gap-4 mt-4">
              
              <BtnComp title={params?.id > 0 ? 'Reload' : 'Reset'} type="reset" 
              onClick={() => { 
                formik.resetForm();
              }}
              width={'w-1/6'} bgColor={'bg-white'} color="text-blue-900" border={'border-2 border-blue-900'} />
              {/* <button type="submit">Search</button> */}
              <BtnComp type={'submit'} title={params?.id > 0 ? 'Update' : 'Submit'} onClick={() => { }} width={'w-1/6'} 
              bgColor={'bg-blue-900'} 
               />
            </div>
          </div>

        </form>
        </Spin>
      </div>
    </section>
  );
}

export default AdApForm;
