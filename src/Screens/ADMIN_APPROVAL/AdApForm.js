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
  proj_imp_by: '',
  dis: '',
  block: '',
  vet_dpr_pdf: '',
  src: '',
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
  fin_yr: Yup.string().required('Financial Year is Required'),
  schm_amt: Yup.string().required('Schematic Amount is Required'),
  cont_amt: Yup.string().required('Contigency Amount is Required'),
  // tot_amt: Yup.string().required('Total Amount is Required'),
  admin_appr_pdf: Yup.string().required('Administrative Approval(G.O) is Required'),
  proj_id: Yup.string().required('Project ID is Required'),
  head_acc: Yup.string().required('Head Account is Required'),
  dt_appr: Yup.string().required('Date of administrative approval is Required'),
  proj_sub_by: Yup.string().required('Project Submitted By is Required'),
  proj_imp_by: Yup.string().required('Project implemented By is Required'),
  dis: Yup.string().required('District is Required'),
  block: Yup.string().required('Block is Required'),
  vet_dpr_pdf: Yup.string().required('Vetted DPR is Required'),
  src: Yup.string().required('Source of Fund is Required'),


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

  const [blockDropList, setBlockDropList] = useState(() => []);
  const [blockDropList_Load, setBlockDropList_Load] = useState(() => []);

  const [sourceFundDropList, setSourceFundDropList] = useState([]);
  const params = useParams()
  const [formValues, setValues] = useState(initialValues)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [filePreview, setFilePreview] = useState(null);
  const [filePreview_2, setFilePreview_2] = useState(null);


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

      console.log("Response Data__Block:", response.data.message); // Log the actual response data
      setBlockDropList(response.data.message)
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



 

  useEffect(() => {
    console.log(params?.id, 'paramsparamsparamsparams');
    // axios.post(url+'index.php/webApi/Mdapi/sector', {},
    //   {headers: { 
    //   'auth_key': auth_key, 
    // }}).then(res=>console.log(res))
    fetchSectorDropdownOption()
    fetchFinancialYeardownOption()
    fetchProjectImplement()
    fetchHeadAccountdownOption()
    fetchDistrictdownOption()
    fetchSourceFunddownOption()
  }, [])

  useEffect(() => {
    fetchBlockdownOption()
  }, [district_ID])

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

      console.log("/////////////////////", filteredBlockLoad); // Log the actual response data
      
      setBlockDropList_Load(filteredBlockLoad)
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
    }
  };



  const loadFormData = async () => {
    // setLoading(true); // Set loading state

    

    // const defaultBlock = blockDropList.find(item => item.block_id === 65);

    // console.log(defaultBlock, 'defaultBlock', blockDropList);
    
  
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
        proj_imp_by: response.data.message.impl_agency,
        dis: response.data.message.district_id,
        block: response.data.message.block_id,
        vet_dpr_pdf: response.data.message.vetted_dpr,
        src: response.data.message.fund_id,
      })

      console.log("loadFormData", response.data.message); // Log the actual response data
      // setSourceFundDropList(response.data.message)
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
    }

  };

  const saveFormData = async () => {

    setLoading(true);
  
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
    formData.append("impl_agency", formik.values.proj_imp_by);
    formData.append("district_id", formik.values.dis);
    formData.append("block_id", formik.values.block);
    formData.append("vetted_dpr", formik.values.vet_dpr_pdf); // Ensure this is a file if applicable
    formData.append("fund_id", formik.values.src);
    formData.append("created_by", "SSS Name Created By");
  
    console.log(formik.values.admin_appr_pdf, "FormData:", formik.values.vet_dpr_pdf);

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
    formData.append("impl_agency", formik.values.proj_imp_by);
    formData.append("district_id", formik.values.dis);
    formData.append("block_id", formik.values.block);
    formData.append("vetted_dpr", formik.values.vet_dpr_pdf); // Ensure this is a file if applicable
    formData.append("fund_id", formik.values.src);
    formData.append("approval_no", params?.id);
    formData.append("modified_by", "SSS Name Modified By");
    formData.append("created_by", "SSS Name Created By");
  
    console.log(formik.values.block, "FormData:", formData);

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
    if(params?.id > 0){
      updateFormData()
    } else {
      saveFormData()
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
                label="Project ID"
                name="proj_id"
                formControlName={formik.values.proj_id}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.proj_id && formik.touched.proj_id && (
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
                label="Date of administrative approval"
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
                label="Enter scheme name"
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

              <label for="sector_name" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Sector</label>
              <Select
                placeholder="Choose Sector"
                value={formik.values.sector_name || undefined} // Ensure default empty state
                onChange={(value) => {
                  formik.setFieldValue("sector_name", value)
                  console.log(value, 'ggggggggggggggggggg');
                }}
                onBlur={formik.handleBlur}
                style={{ width: "100%" }}
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
              <label for="fin_yr" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Financial Year</label>
              <Select
                placeholder="Choose Financial Year"
                value={formik.values.fin_yr || undefined} // Ensure default empty state
                onChange={(value) => {
                  formik.setFieldValue("fin_yr", value)
                  console.log(value, 'ggggggggggggggggggg');
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
            <div className="sm:col-span-12 text-blue-900 text-md font-bold mt-3 -mb-2">
              Amount of administrative approval
            </div>

            

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Schematic amount goes here..."
                type="number"
                label="Schematic Amount"
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
                label="Contigency Amount"
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
                label="Total Amount"
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

              <TDInputTemplate
              type="file"
              name="admin_appr_pdf"
              placeholder="Administrative Approval(G.O)"
              label="Administrative Approval(G.O)"
              // handleChange={(event) => {
              // formik.setFieldValue("vet_dpr_pdf", event.currentTarget.files[0]);
              // }}
              handleChange={(event) => {
                const file = event.currentTarget.files[0];
                if (file) {
                formik.setFieldValue("admin_appr_pdf", file);
                setFilePreview(URL.createObjectURL(file)); // Create a preview URL
                }
              }}
              handleBlur={formik.handleBlur}
              mode={1}
              />

            {filePreview && (
            <a href={filePreview_2} target="_blank" rel="noopener noreferrer" style={{position:'absolute', top:37, right:10}}>
            <FilePdfOutlined style={{ fontSize: 22, color: "red" }} />
            </a>
            )}

            {filePreview === null && (
            <a href={url + folder_admin + formValues.admin_appr_pdf} target='_blank' style={{position:'absolute', top:37, right:10}}>
            <FilePdfOutlined style={{fontSize:22, color:'red'}} /></a>
            )}

              {formik.errors.admin_appr_pdf && formik.touched.admin_appr_pdf && (
                <VError title={formik.errors.admin_appr_pdf} />
              )}

            </div>
            
            <div class="sm:col-span-4">
              

              <label for="head_acc" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Head Account</label>
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
              <TDInputTemplate
                placeholder="Name goes here..."
                type="text"
                label="Project Submitted By"
                name="proj_sub_by"
                formControlName={formik.values.proj_sub_by}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.proj_sub_by && formik.touched.proj_sub_by && (
                <VError title={formik.errors.proj_sub_by} />
              )}
            </div>
            <div class="sm:col-span-4">
              {/* <TDInputTemplate
                placeholder="Name goes here..."
                type="text"
                label="Project implemented By"
                name="proj_imp_by"
                formControlName={formik.values.proj_imp_by}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              /> */}

              <label for="dis" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Project implemented By</label>
              <Select
                placeholder="Choose Project implemented By"
                value={formik.values.proj_imp_by || undefined} // Ensure default empty state
                onChange={(value) => {
                  formik.setFieldValue("proj_imp_by", value)
                  console.log(value, 'ggggggggggggggggggg');
                }}
                onBlur={formik.handleBlur}
                style={{ width: "100%" }}
              >
                <Select.Option value="" disabled> Choose Project implemented By </Select.Option>
                {projectImple?.map(data => (
                  <Select.Option key={data.id} value={data.id}>
                    {data.agency_name}
                  </Select.Option>
                ))}
              </Select>

              
              {formik.errors.proj_imp_by && formik.touched.proj_imp_by && (
                <VError title={formik.errors.proj_imp_by} />
              )}
            </div>
            <div class="sm:col-span-4">

              <label for="dis" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Choose District</label>
              <Select
                placeholder="Choose District"
                value={formik.values.dis || undefined} // Ensure default empty state
                onChange={(value) => {
                  formik.setFieldValue("dis", value)
                  setDistrict_ID(value)
                  formik.setFieldValue("block", "");
                  setBlockDropList([]);
                  setBlockDropList_Load([]);
                  console.log(value, 'disdisdis');
                }}
                onBlur={formik.handleBlur}
                style={{ width: "100%" }}
              >
                <Select.Option value="" disabled> Choose District </Select.Option>
                {districtDropList?.map(data => (
                  <Select.Option key={data.dist_code} value={data.dist_code}>
                    {data.dist_name}
                  </Select.Option>
                ))}
              </Select>
              {formik.errors.dis && formik.touched.dis && (
                <VError title={formik.errors.dis} />
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

            <div class="sm:col-span-4" style={{position:'relative'}}>

              <TDInputTemplate
              type="file"
              name="vet_dpr_pdf"
              placeholder="Vetted DPR"
              label="Vetted DPR"
              // handleChange={(event) => {
              // formik.setFieldValue("vet_dpr_pdf", event.currentTarget.files[0]);
              // }}
              handleChange={(event) => {
                const file = event.currentTarget.files[0];
                if (file) {
                formik.setFieldValue("vet_dpr_pdf", file);
                setFilePreview_2(URL.createObjectURL(file)); // Create a preview URL
                }
              }}
              handleBlur={formik.handleBlur}
              mode={1}
              />

            {filePreview_2 && (
            <a href={filePreview_2} target="_blank" rel="noopener noreferrer" style={{position:'absolute', top:37, right:10}}>
            <FilePdfOutlined style={{ fontSize: 22, color: "red" }} />
            </a>
            )}

            {filePreview_2 === null && (
            <a href={url + folder_admin + formValues.vet_dpr_pdf} target='_blank' style={{position:'absolute', top:37, right:10}}>
            <FilePdfOutlined style={{fontSize:22, color:'red'}} /></a>
            )}

              {formik.errors.vet_dpr_pdf && formik.touched.vet_dpr_pdf && (
                <VError title={formik.errors.vet_dpr_pdf} />
              )}
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

              <label for="src" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Source of Fund</label>
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
            <div className="sm:col-span-12 flex justify-center gap-4 mt-4">
              
              <BtnComp title={params?.id > 0 ? 'Reload' : 'Reset'} type="reset" 
              onClick={() => { 
                formik.resetForm();
              }}
              width={'w-1/6'} bgColor={'bg-white'} color="text-blue-900" border={'border-2 border-blue-900'} />
              {/* <button type="submit">Search</button> */}
              <BtnComp type={'submit'} title={params?.id > 0 ? 'Update' : 'Submit'} onClick={() => { }} width={'w-1/6'} bgColor={'bg-blue-900'} />
            </div>
          </div>

        </form>
        </Spin>
      </div>
    </section>
  );
}

export default AdApForm;
