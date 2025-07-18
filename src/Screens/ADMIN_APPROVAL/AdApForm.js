import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { FilePdfOutlined, LoadingOutlined, UpCircleOutlined } from "@ant-design/icons";
import localforage from "localforage";
import { getCSRFToken } from "../../CommonFunction/useCSRFToken";
import { getLocalStoreTokenDts } from "../../CommonFunction/getLocalforageTokenDts";
import DialogBoxAddDisBlock from "../../Components/DialogBoxAddDisBlock";
import Radiobtn from "../../Components/Radiobtn";

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
  project_submit_dtl: '',
  proj_imp_by: '',
  dis: "",
  block: [],
  ps_id: [],
  gp_id: [],
  vet_dpr_pdf: '',
  src: '',
  jl_no: '',
  mouza: '',
  dag_no: '',
  khatian_no: '',
  area: '',
};


const options = [
	{
		label: "Area",
		value: "A",
	},
	{
		label: "Length",
		value: "L",
	}
	
	
]






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

  const [checkProjectId, setCheckProjectId] = useState(false);

  const [userDataLocalStore, setUserDataLocalStore] = useState([]);
  const [errorpdf_1, setErrorpdf_1] = useState("");
  const [errorpdf_2, setErrorpdf_2] = useState("");
  const [editFlagStatus, setEditFlagStatus] = useState("");

  const [projectSubBy, setProjectSubBy] = useState([]);
  const [tokenNumber, setTokenNumber] = useState('');
  const [visible,setVisible] = useState(false)
  const [masterPopupTitle, setMasterPopupTitle] = useState('')
  const [addMasterFlag, setAddMasterFlag] = useState('')
  const [radioType, setRadioType] = useState("A")

  const validationSchema = Yup.object({
    scheme_name: Yup.string().required('Scheme name is Required'),
    sector_name: Yup.string().required('Sector is Required'),
    fin_yr: Yup.string().required('Scanctioning Financial Year is Required'),
  
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
    
    

    proj_imp_by: Yup.string().when([], {
      is: () => userDataLocalStore.user_type == 'A',
      then: (schema) => schema.required('Project implemented By is Required'),
      otherwise: (schema) => schema.notRequired(),
    }),

    dis: Yup.array().when([], {
      is: () => userDataLocalStore.user_type == 'A',
      then: (schema) => schema.min(1, 'District is Required').required('District is is Required'),
      otherwise: (schema) => schema.notRequired(),
    }),


    block: Yup.array().when([], {
      is: () => userDataLocalStore.user_type == 'A',
      then: (schema) => schema.min(1, 'Block is Required').required('Block is is Required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  

    ps_id: Yup.array().when([], {
      is: () => userDataLocalStore.user_type == 'A',
      then: (schema) => schema.min(1, 'Police Station is Required').required('Police Station is is Required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  
    gp_id: Yup.array().when([], {
      is: () => userDataLocalStore.user_type == 'A',
      then: (schema) => schema.min(1, 'Gram Panchayat is Required').required('Gram Panchayat is is Required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  
    vet_dpr_pdf: Yup.string().when([], {
      is: () => userDataLocalStore.user_type == 'A',
      then: (schema) => schema.required('Vetted DPR is is Required'),
      otherwise: (schema) => schema.notRequired(),
    }),

    src: Yup.string().when([], {
      is: () => userDataLocalStore.user_type == 'A',
      then: (schema) => schema.required('Source of Fund is is Required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  
    jl_no: Yup.string().when([], {
      is: () => userDataLocalStore.user_type == 'A',
      then: (schema) => schema.required('JL No. is Required'),
      otherwise: (schema) => schema.notRequired(),
    }),

    mouza: Yup.string().when([], {
      is: () => userDataLocalStore.user_type == 'A',
      then: (schema) => schema.required('Mouza is is Required'),
      otherwise: (schema) => schema.notRequired(),
    }),

    dag_no: Yup.string().when([], {
      is: () => userDataLocalStore.user_type == 'A',
      then: (schema) => schema.required('Dag No is Required'),
      otherwise: (schema) => schema.notRequired(),
    }),

    khatian_no: Yup.string().when([], {
      is: () => userDataLocalStore.user_type == 'A',
      then: (schema) => schema.required('Khatian No is Required'),
      otherwise: (schema) => schema.notRequired(),
    }),

    area: Yup.string().when([], {
      is: () => userDataLocalStore.user_type == 'A',
      then: (schema) => schema.required('Area is Required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  
  
  });
  


  const fetchSectorDropdownOption = async () => {
    setLoading(true);
    // const csrf = await getCSRFToken(navigate);
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    // var tokenValue_ = {csrfName: 'fghfgjhgfhj', csrfValue: '123554447'}

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Mdapi/sector',
        formData, // Empty body
        {
          headers: {
            'auth_key': auth_key,
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );

      setSectorDropList(response?.data?.message)
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      setLoading(false);

      localStorage.removeItem("user_dt");
      navigate('/')
    }
  };

  const fetchFinancialYeardownOption = async () => {
    setLoading(true);
    // const csrf = await getCSRFToken(navigate);
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    formData.append("approval_no", params?.id);
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
      console.log(response, 'responseresponse');
      
      setFinancialYearDropList(response.data.message)
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      setLoading(false);
      console.log(error, 'responseresponse');

      localStorage.removeItem("user_dt");
      navigate('/')
    }
  };

  const fetchProjectImplement = async () => {
    setLoading(true);
    // const csrf = await getCSRFToken(navigate);
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Mdapi/impagency',
        formData, // Empty body
        {
          headers: {
            'auth_key': auth_key,
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );

      setProjectImple(response.data.message)
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
        url + 'index.php/webApi/Mdapi/head_of_acc',
        formData, // Empty body
        {
          headers: {
            'auth_key': auth_key,
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );

      setHeadAccountDropList(response.data.message)
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error); // Handle errors properly

      localStorage.removeItem("user_dt");
      navigate('/')

    }
  };

  const fetchDistrictdownOption = async () => {
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

      setDistrictDropList(response.data.message)
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error); // Handle errors properly

      localStorage.removeItem("user_dt");
      navigate('/')
    }
  };

  const fetchBlockdownOption = async (getDistrict_id) => {

    console.log(getDistrict_id, 'fffffffffffffffffffffffffff', 'kkk');
    
    
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();

    formData.append('dist_list', getDistrict_id);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    if(getDistrict_id && getDistrict_id.length > 0){

      console.log(getDistrict_id, 'fffffffffffffffffffffffffff', 'kkk');
    try {
      const response = await axios.post(
        // url + 'index.php/webApi/Mdapi/block',
        url + 'index.php/webApi/Mdapi/block_filter',
        formData, // Empty body
        {
          headers: {
            'auth_key': auth_key,
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );
      
      setBlockDropList(response.data.message)

    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      setBlockDropList([])
      
      
      localStorage.removeItem("user_dt");
      navigate('/')
    }
    } else {
      // setBlockDropList([])
    }

  };

  const fetchPoliceStnOption = async (getDistrict_id) => {
    // const formData = new FormData();
    // formData.append("dist_id", district_ID);
    // formData.append("block_id", 0);
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    formData.append('dist_list', getDistrict_id);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    if(getDistrict_id.length > 0){
    try {
      const response = await axios.post(
        // `${url}index.php/webApi/Mdapi/get_ps`,
        `${url}index.php/webApi/Mdapi/get_ps_filter`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'auth_key': auth_key, // Important for FormData
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );
      

      if (response?.data?.status > 0) {
        setpsStnDropList(response?.data?.message)
      }

      if (response?.data?.status < 1) {
        setpsStnDropList([])
      }


    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly

      localStorage.removeItem("user_dt");
      navigate('/')

    }
    } else {
      setpsStnDropList([])
    }


  };

  const fetch_GM_Option = async (getBlock_id) => {
    // const formData = new FormData();
    // formData.append("dist_id", district_ID);
    // formData.append("block_id", block_ID);
    const tokenValue = await getLocalStoreTokenDts(navigate);

    console.log('formDataformDataformDataformData', getBlock_id);

    const formData = new FormData();
    formData.append('block_id', getBlock_id);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    if(getBlock_id.length > 0){
    try {
      const response = await axios.post(
        // `${url}index.php/webApi/Mdapi/get_gp`,
        `${url}index.php/webApi/Mdapi/get_gp_filter`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'auth_key': auth_key, // Important for FormData
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );

      console.log(response, 'formDataformDataformDataformData', formData);
      

      if (response?.data?.status > 0) {
        setGM_DropList(response?.data?.message)
      }

      if (response?.data?.status < 1) {
        setGM_DropList([])
      }

    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      console.log('formDataformDataformDataformData', error);
      localStorage.removeItem("user_dt");
      navigate('/')

    }
    } else {
      setGM_DropList([])
    }

  };

  const fetchSourceFunddownOption = async () => {

    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Mdapi/sof',
        formData, // Empty body
        {
          headers: {
            'auth_key': auth_key,
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );

      setSourceFundDropList(response.data.message)
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly

      localStorage.removeItem("user_dt");
      navigate('/')

    }
  };

  const fetchProjectSubmitData = async () => {
    setLoading(true);

    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token


    try {
      const response = await axios.post(
        url + 'index.php/webApi/Mdapi/projSubmitBy',
        formData, // Empty body
        {
          headers: {
            'auth_key': auth_key,
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );

      setProjectSubBy(response?.data?.message)
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      setLoading(false);

      localStorage.removeItem("user_dt");
      navigate('/')

    }
  };


  const checkProjectID_Fnc = async (project_id) => {

    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    formData.append("project_id", project_id.target.value);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token


    try {
      const response = await axios.post(
        `${url}index.php/webApi/Admapi/check_pi`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'auth_key': auth_key, // Important for FormData
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );

      if (response?.data?.status > 0) {
        setCheckProjectId(false)
      }

      if (response?.data?.status < 1) {
        // setpsStnDropList([])
        setCheckProjectId(true)
      }


    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly

      localStorage.removeItem("user_dt");
      navigate('/')

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
    fetchSourceFunddownOption()
    fetchProjectSubmitData()

    fetchDistrictdownOption()



    // fetchBlockdownOption()
    // fetchPoliceStnOption()
    // fetch_GM_Option()
  }, [])


  useEffect(() => {

    // localforage.getItem('tokenDetails').then((value) => {
    // console.log('token-store_', value);
    // setTokenNumber(value?.token);
    // if (params?.id > 0) {
    //   loadFormData(value?.token) 
    // }

    // }).catch((err) => {
    // console.error('Read error:', err);
    // localStorage.removeItem("user_dt");
    // });

    if (params?.id > 0) {
      loadFormData() 
    }

  }, [])


  // const fetchBlockdownOption__load = async (dis_id, block_id) => {
  //   try {
  //     const response = await axios.post(
  //       url + 'index.php/webApi/Mdapi/block',
  //       { dist_id: dis_id }, // Empty body
  //       {
  //         headers: {
  //           'auth_key': auth_key,
  //         },
  //       }
  //     );

  //     var data = response?.data?.message
  //     const filteredBlockLoad = data.filter(block => block.block_id === block_id);


  //     setBlockDropList_Load(filteredBlockLoad)
  //   } catch (error) {
  //     console.error("Error fetching data:", error); // Handle errors properly
  //   }
  // };

  // const fetchPoliceStnOption__load = async (dis_id, ps_id) => {
  //   const formData = new FormData();
  //   formData.append("dist_id", dis_id);
  //   formData.append("block_id", 0);

  //   try {
  //     const response = await axios.post(
  //       `${url}index.php/webApi/Mdapi/get_ps`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           'auth_key': auth_key // Important for FormData
  //         },
  //       }
  //     );



  //     var data = response?.data?.message
  //     const filteredData = data.filter(ps => ps.id === ps_id);
  //     setpsStnDropList_Load(filteredData)

  //   } catch (error) {
  //     console.error("Error fetching data:", error); // Handle errors properly
  //   }
  // };

  // const fetch_GM_Option__load = async (dis_id, block_id, gm_id) => {
  //   const formData = new FormData();
  //   formData.append("dist_id", dis_id);
  //   formData.append("block_id", block_id);

  //   try {
  //     const response = await axios.post(
  //       `${url}index.php/webApi/Mdapi/get_gp`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           'auth_key': auth_key // Important for FormData
  //         },
  //       }
  //     );



  //     var data = response?.data?.message
  //     const filteredData = data.filter(gp => gp.gp_id === gm_id);
  //     setGM_DropList_Load(filteredData)

  //   } catch (error) {
  //     console.error("Error fetching data:", error); // Handle errors properly
  //   }
  // };




  const loadFormData = async () => {
    // const csrf = await getCSRFToken(navigate);
    const tokenValue = await getLocalStoreTokenDts(navigate);
    // const cread = {
    //   approval_no: params?.id
    // }
    const formData = new FormData();
    formData.append("approval_no", params?.id);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Admapi/adm_by_approval_no',
        formData,
        {
          headers: {
            'auth_key': auth_key,
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );

      

      const totalAmount = Number(response.data.message.sch_amt) + Number(response.data.message.cont_amt);
      // fetchBlockdownOption__load(response?.data?.message?.district_id, response?.data?.message?.block_id)

      // fetchPoliceStnOption__load(response?.data?.message?.district_id, response.data.message.ps_id)
      // fetch_GM_Option__load(response?.data?.message?.district_id, response.data.message.block_id, response.data.message.gp_id)

      // console.log(response, 'formDataformDataformData', 'loadFormData');

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
        options:  setRadioType(response?.data?.message?.dimension_type),
      })

      setEditFlagStatus(response?.data?.message?.edit_flag)

      fetchBlockdownOption(response?.data?.message?.district_id)
      fetchPoliceStnOption(response?.data?.message?.district_id)
      fetch_GM_Option(response?.data?.message?.block_id)

      // setSourceFundDropList(response.data.message)
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly

      localStorage.removeItem("user_dt");
      navigate('/')

    }

  };

  const saveFormData = async () => {

    // setLoading(true);
    // const csrf = await getCSRFToken(navigate);
    const tokenValue = await getLocalStoreTokenDts(navigate);

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
    formData.append("dimension_type", radioType);
    formData.append("created_by", userDataLocalStore.user_id);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    // console.log(formData, 'formDataformDataformData', 'saveFormData');
    

    

    try {
      const response = await axios.post(
        `${url}index.php/webApi/Admapi/adm_appr_add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'auth_key': auth_key, // Important for FormData
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );

      Message("success", "Add successfully.");
      navigate('/home/admin_approval')
      setLoading(false);
      formik.resetForm();
    } catch (error) {
      setLoading(false);
      Message("error", "Error Submitting Form:");
      console.error("Error submitting form:", error);

      localStorage.removeItem("user_dt");
      navigate('/')

    }

  };

  const updateFormData = async () => {
    // setLoading(true); // Set loading state
    // const csrf = await getCSRFToken(navigate);
    const tokenValue = await getLocalStoreTokenDts(navigate);

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
    formData.append("dimension_type", radioType);

    formData.append("approval_no", params?.id);
    formData.append("modified_by", userDataLocalStore.user_id);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    // console.log(formData, 'formDataformDataformData', 'updateFormData');


    try {
      const response = await axios.post(
        `${url}index.php/webApi/Admapi/adm_appr_edit`,
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
      Message("success", "Updated successfully.");
      navigate('/home/admin_approval')

      formik.resetForm();
    } catch (error) {
      setLoading(false);
      Message("error", "Error Submitting Form:");
      console.error("Error submitting form:", error);

      localStorage.removeItem("user_dt");
      navigate('/')
    }

  };



  const onSubmit = (values) => {
    console.log('onSubmitonSubmitonSubmitonSubmit====>>', values);
    
    if (errorpdf_1.length < 1 && errorpdf_2.length < 1) {
      if (params?.id > 0 && checkProjectId === false) {
        updateFormData()
      }

      if (params?.id < 1 && checkProjectId === false) {
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
    context: { userType: userDataLocalStore.user_type }
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




const handleSchmAmtChange_schm_amt = (e) => {
  formik.handleChange(e); // Update Formik values first

  const value = e.target.value;
  const parsedValue = parseFloat(value);

  if (e.target.name === 'schm_amt') {
    const contAmt = !isNaN(parsedValue) && parsedValue > 0 ? parsedValue * 0.03 : 0;


    formik.setFieldValue('cont_amt', contAmt);
  }
};



const addMasterOpenPopup = (title, addFlag)=>{
  console.log("Submitted values:", addFlag);
  setMasterPopupTitle(title)
  setAddMasterFlag(addFlag)
  
  setVisible(true)
}



const addMasterFnc = (submitData)=>{
  console.log(addMasterFlag, 'Submitted values:');
  // console.log("Submitted values:", submitData);

  if(addMasterFlag == 'add_block'){
    addBlock(submitData)
  } else if(addMasterFlag == 'add_PS'){
    add_PS(submitData)
  } else if(addMasterFlag == 'add_GP'){
    add_GP(submitData)
  }

  console.log(formik.values.dis, 'ggggggggggggg');
  

  // formik.setFieldValue("dis", value ? value : "")
  formik.setFieldValue("dis", [])
  formik.setFieldValue("block", []);
  formik.setFieldValue("ps_id", []);
  formik.setFieldValue("gp_id", []);

  setVisible(false)
}

  const addBlock = async (submitData) => {
    
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    formData.append('sl_no', '0');
    formData.append('dist_id', submitData?.dis);
    formData.append('block_name', submitData?.block_add);
    formData.append("created_by", userDataLocalStore.user_id);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    try {
      const response = await axios.post(
        // `${url}index.php/webApi/Mdapi/get_gp`,
        `${url}index.php/webApi/Mdapi/blockSave`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'auth_key': auth_key, // Important for FormData
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );

      console.log(response, 'formDataformDataformDataformData', formData);
      Message("success", "Updated successfully.");


      // if (response?.data?.status > 0) {
      //   setGM_DropList(response?.data?.message)
      // }

      // if (response?.data?.status < 1) {
      //   setGM_DropList([])
      // }

    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      Message("error", "Error Submitting Form:");
      localStorage.removeItem("user_dt");
      navigate('/')

    }


  };


  const add_PS = async (submitData) => {
    
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    formData.append('sl_no', '0');
    formData.append('dist_id', submitData?.dis);
    formData.append('ps_name', submitData?.ps_id);
    formData.append("created_by", userDataLocalStore.user_id);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    try {
      const response = await axios.post(
        // `${url}index.php/webApi/Mdapi/get_gp`,
        `${url}index.php/webApi/Mdapi/psSave`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'auth_key': auth_key, // Important for FormData
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );

      console.log(response, 'formDataformDataformDataformData', formData);
      Message("success", "Updated successfully.");

      // formik.setFieldValue("dis", "")
      // formik.setFieldValue("block", "");
      // formik.setFieldValue("ps_id", "");
      // formik.setFieldValue("gp_id", "");

      // if (response?.data?.status > 0) {
      //   setGM_DropList(response?.data?.message)
      // }

      // if (response?.data?.status < 1) {
      //   setGM_DropList([])
      // }

    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      Message("error", "Error Submitting Form:");
      localStorage.removeItem("user_dt");
      navigate('/')

    }


  };

  const add_GP = async (submitData) => {
    
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    formData.append('sl_no', '0');
    formData.append('dist_id', submitData?.dis);
    formData.append('block_id', submitData?.block_with_gp);
    formData.append('gp_name', submitData?.gp_id);
    formData.append("created_by", userDataLocalStore.user_id);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    try {
      const response = await axios.post(
        // `${url}index.php/webApi/Mdapi/get_gp`,
        `${url}index.php/webApi/Mdapi/gpSave`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'auth_key': auth_key, // Important for FormData
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );

      console.log(response, 'formDataformDataformDataformData', formData);
      Message("success", "Updated successfully.");

      // formik.setFieldValue("dis", "")
      // formik.setFieldValue("block", "");
      // formik.setFieldValue("ps_id", "");
      // formik.setFieldValue("gp_id", "");

      // if (response?.data?.status > 0) {
      //   setGM_DropList(response?.data?.message)
      // }

      // if (response?.data?.status < 1) {
      //   setGM_DropList([])
      // }

    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      Message("error", "Error Submitting Form:");
      localStorage.removeItem("user_dt");
      navigate('/')

    }


  };

  const onChangeArea = (e) => {
      setRadioType(e)
    }

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
            <div class="grid gap-4 sm:grid-cols-12 sm:gap-6 hoSection pb-5">
              
              <div className="sm:col-span-12 text-black text-md font-bold -mb-2 titleSection">
                To be Field By HO
              </div>
              <div class="sm:col-span-4">
                <TDInputTemplate
                  placeholder="Choose Project ID"
                  type="text"
                  label={<>Project ID <span className="mandator_txt">*</span></>}
                  name="proj_id"
                  formControlName={formik.values.proj_id}
                  handleChange={(e) => {
                    formik.handleChange(e);
                    checkProjectID_Fnc(e)
                  }}
                  handleBlur={formik.handleBlur}
                  mode={1}
                  disabled={userDataLocalStore.user_type === 'A' || params?.id > 0}
                />

                {/* {JSON.stringify(formik.errors.proj_id , null, 2)} /// {JSON.stringify(formik.errors.proj_id, null, 2)} /// {JSON.stringify(checkProjectId, null, 2)} */}
                {checkProjectId === true &&(
  <VError title={'Project ID must be Unique'} />
)}

                {formik.errors.proj_id && formik.touched.proj_id && (
                  <VError title={formik.errors.proj_id} />
                )}

              </div>



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
                  disabled={userDataLocalStore.user_type === 'A'}
                />
                {formik.errors.dt_appr && formik.touched.dt_appr && (
                  <VError title={formik.errors.dt_appr} />
                )}
              </div>



              <div class="sm:col-span-12">
                <TDInputTemplate
                  type="text"
                  placeholder="Scheme name goes here..."
                  label={<>Enter scheme name<span className="mandator_txt"> *</span></>}
                  name="scheme_name"
                  formControlName={formik.values.scheme_name}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  mode={3}
                  disabled={userDataLocalStore.user_type === 'A'}
                />
                {formik.errors.scheme_name && formik.touched.scheme_name && (
                  <VError title={formik.errors.scheme_name} />
                )}
              </div>
              <div class="sm:col-span-4">

                <label for="sector_name" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Sector<span className="mandator_txt"> *</span></label>
                <Select
                  showSearch // Search
                  placeholder="Choose Sector"
                  value={formik.values.sector_name || undefined} // Ensure default empty state
                  onChange={(value) => {
                    formik.setFieldValue("sector_name", value)
                  }}
                  onBlur={formik.handleBlur}
                  style={{ width: "100%" }}
                  optionFilterProp="children"
                  disabled={userDataLocalStore.user_type === 'A'}
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
                  }}
                  onBlur={formik.handleBlur}
                  style={{ width: "100%" }}
                  optionFilterProp="children"
                  disabled={userDataLocalStore.user_type === 'A'}
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
                  // handleChange={formik.handleChange}
                  handleChange={handleSchmAmtChange_schm_amt}
                  handleBlur={formik.handleBlur}
                  mode={1}
                  disabled={userDataLocalStore.user_type === 'A'}
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
                  disabled={userDataLocalStore.user_type === 'A'}
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
                  disabled={true}
                />
                {formik.errors.tot_amt && formik.touched.tot_amt && (
                  <VError title={formik.errors.tot_amt} />
                )}
              </div>
              <hr className="sm:col-span-12" />

              <div class="sm:col-span-4" style={{ position: 'relative' }}>


                <TDInputTemplate
                  type="file"
                  name="admin_appr_pdf"
                  placeholder="Administrative Approval(G.O)"
                  label={<>Administrative Approval(G.O) (PDF Max Size 2 MB)<span className="mandator_txt"> *</span></>}
                  handleChange={(event) => {
                    handleFileChange_pdf_1(event)
                  }}
                  handleBlur={formik.handleBlur}
                  mode={1}
                  disabled={userDataLocalStore.user_type === 'A'}
                />

                {filePreview && (
                  <a href={filePreview} target="_blank" rel="noopener noreferrer" style={{ position: 'absolute', top: 37, right: 10 }}>
                    <FilePdfOutlined style={{ fontSize: 22, color: "red" }} />
                  </a>
                )}


                {formValues.admin_appr_pdf.length > 0 && (
                  <>
                    {filePreview === null && (
                      <a href={url + folder_admin + formValues.admin_appr_pdf} target='_blank' style={{ position: 'absolute', top: 37, right: 10 }}>
                        <FilePdfOutlined style={{ fontSize: 22, color: 'red' }} /></a>
                    )}
                  </>
                )}


                {formik.errors.admin_appr_pdf && formik.touched.admin_appr_pdf && (
                  <VError title={formik.errors.admin_appr_pdf} />
                )}
                {errorpdf_1 && <p style={{ color: "red", fontSize: 12 }}>{errorpdf_1}</p>}

              </div>

              <div class="sm:col-span-4">


                <label for="head_acc" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Head Account<span className="mandator_txt"> *</span></label>
                <Select
                  placeholder="Choose Head Account"
                  value={formik.values.head_acc || undefined} // Ensure default empty state
                  onChange={(value) => {
                    formik.setFieldValue("head_acc", value)
                  }}
                  onBlur={formik.handleBlur}
                  style={{ width: "100%" }}
                  disabled={userDataLocalStore.user_type === 'A'}
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
                  }}
                  onBlur={formik.handleBlur}
                  style={{ width: "100%" }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.children?.toLowerCase().includes(input.toLowerCase())
                  }
                  disabled={userDataLocalStore.user_type === 'A'}
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
                  label='Details of Person/Organization by whom the project has been submitted'
                  name="project_submit_dtl"
                  formControlName={formik.values.project_submit_dtl}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  mode={3}
                  required={true}
                  disabled={userDataLocalStore.user_type === 'A'}
                />
                {formik.errors.project_submit_dtl && formik.touched.project_submit_dtl && (
                  <VError title={formik.errors.project_submit_dtl} />
                )}
              </div>

              

              {userDataLocalStore.user_type === 'A' && (
                <div class="sm:col-span-12">
                  <div class="p-4 mb-0 text-sm text-yellow-800 border-2 border-yellow-500 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
                    <span class="font-bold"></span>The section displayed above is restricted and cannot be edited or modified under any circumstances. 👆
                  </div>
                </div>
              )}
              </div>

<div class="grid gap-4 sm:grid-cols-12 sm:gap-6 hoSection pb-5">
              
              <div className="sm:col-span-12 text-black text-md font-bold -mb-2 titleSection">
                To be Field By Branch
              </div>

              <div class="sm:col-span-4">


                <label for="dis" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Project implemented By
                  {userDataLocalStore.user_type === 'A' &&(
                    <><span className="mandator_txt"> *</span></>
                  )}
                  
                  </label>


                <Select
                  showSearch
                  placeholder="Choose Project implemented By"
                  value={formik.values.proj_imp_by || undefined} // Ensure default empty state
                  onChange={(value) => {
                    formik.setFieldValue("proj_imp_by", value);
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
              <div class="sm:col-span-12 contigencySelect">

                <label for="dis" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Choose District
                {userDataLocalStore.user_type === 'A' &&(
                    <><span className="mandator_txt"> *</span></>
                  )}
                </label>


                <Select
                  placeholder="Choose District..."
                  label="Choose District"
                  name="dis"
                  
                  mode="multiple"
                  style={{ width: '100%' }}
                  value={formik.values.dis || null}
                  onChange={(value) => {
                    formik.setFieldValue("dis", value ? value : "")
                    // formik.handleChange()
                    formik.setFieldValue("block", []);
                    formik.setFieldValue("ps_id", []);
                    formik.setFieldValue("gp_id", []);
                    // console.log(value, 'formDataformDataformDataformData');
                    if(value && value.length > 0){
                      fetchBlockdownOption(value)
                      fetchPoliceStnOption(value)
                    } else {
                      // formik.setFieldValue("block", []);
                      setBlockDropList([])
                      setpsStnDropList([])
                    }
                    // console.log(formik?.values?.dis)
                  }} // Update Formik state
                  
                  // handleChange={formik.handleChange}
                  onBlur={() => formik.setFieldTouched("dis", true)}
                  tokenSeparators={[]}
                  options={districtDropList?.map(item => ({
                    value: item.dist_code,
                    label: item.dist_name
                  }))}
                  filterOption={(input, option) =>
                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                />






                {formik.errors.dis && formik.touched.dis && (
                  <VError title={formik.errors.dis} />
                )}
              </div>
              <div class="sm:col-span-12 addMaster">
               {/* {JSON.stringify(blockDropList, null, 2)} */}



                <label for="block" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Block 
                {userDataLocalStore.user_type === 'A' &&(
                    <><span className="mandator_txt"> *</span> </> 
                  )}  <button type="button" className="ant-btn css-dev-only-do-not-override-ppv1a7 ant-btn-primary bg-blue-900 ant-btn-variant-solid floatRight_btn" 
                  onClick={()=>{ addMasterOpenPopup('Add Block', 'add_block')}}>Add Block</button>
                  </label>



                
                  {/* {JSON.stringify(blockDropList, null, 2)} */}

                <Select
                  placeholder="Choose Block..."
                  label="Choose Block"
                  name="block"
                  mode="multiple"
                  style={{ width: '100%' }}
                  value={formik.values.block || null}
                  onChange={(value) => {
                    formik.setFieldValue("block", value ? value : "")
                    formik.setFieldValue("gp_id", "");
                    // console.log(value, 'formDataformDataformDataformData');
                    if(value && value.length>0){
                      fetch_GM_Option(value)
                    } else {
                      setGM_DropList([])
                    }
                  }} // Update Formik state
                  handleChange={formik.handleChange}
                  onBlur={() => formik.setFieldTouched("block", true)}
                  tokenSeparators={[]}
                  options={blockDropList?.map(item => ({
                    value: item.block_id,
                    label: item.block_name
                  }))}
                  filterOption={(input, option) =>
                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                />
                {/* {JSON.stringify(blockDropList_Load[0]?.block_name, null, 2)} */}
                {formik.errors.block && formik.touched.block && (
                  <VError title={formik.errors.block} />
                )}
              </div>


              <div class="sm:col-span-12 addMaster">


                <label for="block" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Police Station
                {userDataLocalStore.user_type === 'A' &&(
                    <><span className="mandator_txt"> *</span></>
                  )} <button type="button" className="ant-btn css-dev-only-do-not-override-ppv1a7 ant-btn-primary bg-blue-900 ant-btn-variant-solid floatRight_btn" 
                  onClick={()=>{ addMasterOpenPopup('Add Police Station', 'add_PS')}}>Add Police Station</button>
                  </label>



                <Select
                  placeholder="Choose Police Station..."
                  label="Choose Police Station"
                  name="ps_id"
                  mode="multiple"
                  style={{ width: '100%' }}
                  value={formik.values.ps_id || null}
                  onChange={(value) => {
                    formik.setFieldValue("ps_id", value ? value : "")
                  }} // Update Formik state
                  handleChange={formik.handleChange}
                  onBlur={() => formik.setFieldTouched("ps_id", true)}
                  tokenSeparators={[]}
                  options={psStnDropList?.map(item => ({
                    value: item.id,
                    label: item.ps_name
                  }))}
                  filterOption={(input, option) =>
                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                />

                {/* {JSON.stringify(blockDropList_Load[0]?.block_name, null, 2)} */}
                {formik.errors.ps_id && formik.touched.ps_id && (
                  <VError title={formik.errors.ps_id} />
                )}
              </div>


              <div class="sm:col-span-12 addMaster">


                <label for="block" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Gram Panchayat
                {userDataLocalStore.user_type === 'A' &&(
                    <><span className="mandator_txt"> *</span></>
                  )} <button className="ant-btn css-dev-only-do-not-override-ppv1a7 ant-btn-primary bg-blue-900 ant-btn-variant-solid floatRight_btn" 
                  type="button" onClick={()=>{ addMasterOpenPopup('Add Gram Panchayat', 'add_GP')}}>Add Gram Panchayat</button>
                  </label>

                  {/* {JSON.stringify(GM_DropList, null, 2)} */}

                <Select
                  placeholder="Choose Gram Panchayat..."
                  label="Choose Gram Panchayat"
                  name="gp_id"
                  mode="multiple"
                  style={{ width: '100%' }}
                  value={formik.values.gp_id || null}
                  onChange={(value) => {
                    formik.setFieldValue("gp_id", value ? value : "")
                  }} // Update Formik state
                  handleChange={formik.handleChange}
                  onBlur={() => formik.setFieldTouched("gp_id", true)}
                  tokenSeparators={[]}
                  options={GM_DropList?.map(item => ({
                    value: item.gp_id,
                    label: item.gp_name
                  }))}
                  filterOption={(input, option) =>
                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                />
                {/* {JSON.stringify(blockDropList_Load[0]?.block_name, null, 2)} */}
                {formik.errors.gp_id && formik.touched.gp_id && (
                  <VError title={formik.errors.gp_id} />
                )}
              </div>

              <div class="sm:col-span-4" style={{ position: 'relative' }}>
                {/* {JSON.stringify(errorpdf_2 , null, 2)} */}
                <TDInputTemplate
                  type="file"
                  name="vet_dpr_pdf"
                  placeholder="Vetted DPR"
                  label={<>Vetted DPR (PDF Max Size 1 GB) 
                  {userDataLocalStore.user_type === 'A' &&(
                    <><span className="mandator_txt"> *</span></>
                  )}
                  </>}
                  handleChange={(event) => {
                    handleFileChange_pdf_2(event)
                  }}
                  handleBlur={formik.handleBlur}
                  mode={1}
                />

                {filePreview_2 && (
                  <a href={filePreview_2} target="_blank" rel="noopener noreferrer" style={{ position: 'absolute', top: 37, right: 10 }}>
                    <FilePdfOutlined style={{ fontSize: 22, color: "red" }} />
                  </a>
                )}

                {formValues.vet_dpr_pdf.length > 0 && (
                  <>
                    {filePreview_2 === null && (
                      <a href={url + folder_admin + formValues.vet_dpr_pdf} target='_blank' style={{ position: 'absolute', top: 37, right: 10 }}>
                        <FilePdfOutlined style={{ fontSize: 22, color: 'red' }} /></a>
                    )}
                  </>
                )}




                {formik.errors.vet_dpr_pdf && formik.touched.vet_dpr_pdf && (
                  <VError title={formik.errors.vet_dpr_pdf} />
                )}
                {errorpdf_2 && <p style={{ color: "red", fontSize: 12 }}>{errorpdf_2}</p>}
              </div>
              <div class="sm:col-span-4">


                <label for="src" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Source of Fund
                {userDataLocalStore.user_type === 'A' &&(
                    <><span className="mandator_txt"> *</span></>
                  )}
                  </label>
                <Select
                  placeholder="Choose Source of Fund"
                  value={formik.values.src || undefined} // Ensure default empty state
                  onChange={(value) => {
                    formik.setFieldValue("src", value)
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
                  label={<>JL No.
                  {userDataLocalStore.user_type === 'A' &&(
                    <><span className="mandator_txt"> *</span></>
                  )}
                  </>}
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
                  label={<>Mouza 
                  {userDataLocalStore.user_type === 'A' &&(
                    <><span className="mandator_txt"> *</span></>
                  )}
                  </>}
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
                  label={<>Dag No.
                  {userDataLocalStore.user_type === 'A' &&(
                    <><span className="mandator_txt"> *</span></>
                  )}
                  </>}
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
                  label={<>Khatian No.
                  {userDataLocalStore.user_type === 'A' &&(
                    <><span className="mandator_txt"> *</span></>
                  )}
                  </>}
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


              <div class="sm:col-span-4 areaSec">
                <label className="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">{radioType == "A" ? "Area" : "Length"} (in Acre) 
                  {userDataLocalStore.user_type === 'A' &&(
                    <><span className="mandator_txt"> *</span></>
                  )}
                  <Radiobtn
                            data={options}
                            val={radioType}
                            onChangeVal={(value) => {
                              onChangeArea(value)
                            }}
                          />
                </label>
                <TDInputTemplate
                  placeholder="Name goes here..."
                  type="number"
                  // label={<>Area (in Acre)
                  // {userDataLocalStore.user_type === 'A' &&(
                  //   <><span className="mandator_txt"> *</span></>
                  // )}
                  // </>}
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


            </div>

            {/* {JSON.stringify(editFlagStatus, null, 2)} */}
{editFlagStatus == 'Y' ? (
<div className="sm:col-span-12 flex justify-center gap-4 mt-6">
<BtnComp title={params?.id > 0 ? 'Reload' : 'Reset'} type="reset" onClick={() => {formik.resetForm();}} width={'w-1/6'} bgColor={'bg-white'} color="text-blue-900" border={'border-2 border-blue-900'} />
<BtnComp type={'submit'} title={params?.id > 0 ? 'Update' : 'Submit'} onClick={() => { }} width={'w-1/6'} bgColor={'bg-blue-900'} />
</div>
) : userDataLocalStore.user_type === 'S' ? (
<div className="sm:col-span-12 flex justify-center gap-4 mt-4">
<BtnComp title={params?.id > 0 ? 'Reload' : 'Reset'} type="reset" onClick={() => {formik.resetForm();}} width={'w-1/6'} bgColor={'bg-white'} color="text-blue-900" border={'border-2 border-blue-900'} />
<BtnComp type={'submit'} title={params?.id > 0 ? 'Update' : 'Submit'} onClick={() => { }} width={'w-1/6'} bgColor={'bg-blue-900'} />
</div>
) : null }



              {/* <div className="sm:col-span-12 flex justify-center gap-4 mt-4">
<BtnComp title={params?.id > 0 ? 'Reload' : 'Reset'} type="reset" onClick={() => {formik.resetForm();}} width={'w-1/6'} bgColor={'bg-white'} color="text-blue-900" border={'border-2 border-blue-900'} />
<BtnComp type={'submit'} title={params?.id > 0 ? 'Update' : 'Submit'} onClick={() => { }} width={'w-1/6'} bgColor={'bg-blue-900'} />
              </div> */}

          </form>
        </Spin>
      </div>
      <DialogBoxAddDisBlock 
      dialogBoxTitle={masterPopupTitle}
      districtData={districtDropList}
      blockDropList={blockDropList}
      addMasterFlag = {addMasterFlag}
      userCheck={userDataLocalStore}
      isModalOpen={visible} 
      fetchBlockdownOption={fetchBlockdownOption}
      setpsStnDropList={setpsStnDropList}
      submitBtn={(val) => {
        console.log("Received in screen_A:", val); // <-- "testttttttttttttttttttttt"
        addMasterFnc(val); 
      }}
      // handleOk={()=>{
      //   addMasterFnc()
      // }} 
      handleCancel={()=>setVisible(false)}
      />
    </section>
    
  );
}

export default AdApForm;
