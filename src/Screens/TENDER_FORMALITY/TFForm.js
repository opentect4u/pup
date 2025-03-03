import React, { useEffect, useState } from 'react'
import TDInputTemplate from '../../Components/TDInputTemplate'
import BtnComp from '../../Components/BtnComp'
import Heading from '../../Components/Heading'
import * as Yup from 'yup';
import { useFormik } from "formik";
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import VError from '../../Components/VError';
import axios from 'axios';
import { auth_key, url } from '../../Assets/Addresses/BaseUrl';
import { Message } from '../../Components/Message';


const initialValues = {
  td_dt: '',
  td_pdf: '',
  tia: '',
  td_mt_dt: '',
  wo_dt: '',
  wo_pdf: '',
  wo_value: '',
  compl: '',
};



const validationSchema = Yup.object({
  // td_dt: Yup.string().required('Tender Invited On is Required'),
  // td_pdf: Yup.string().required('Tender Notice is Required'),
  // tia: Yup.string().required('Tender Inviting Authority is Required'),
  // td_mt_dt: Yup.string().required('Tender Matured On is Required'),
  // wo_dt: Yup.string().required('Work Order Issued On is Required'),
  // wo_pdf: Yup.string().required('Work Order Copy is Required'),
  // wo_value: Yup.string().required('Work Order Value is Required'),
  // compl: Yup.string().required('Tentative Date of Completion is Required'),

  td_dt: Yup.string(),
  td_pdf: Yup.string(),
  tia: Yup.string(),
  td_mt_dt: Yup.string(),
  wo_dt: Yup.string(),
  wo_pdf: Yup.string(),
  wo_value: Yup.string(),
  compl: Yup.string(),


});

function TFForm() {
  const params = useParams();
  const [formValues, setValues] = useState(initialValues);
  const location = useLocation();
  const operation_status = location.state?.operation_status || "add";
  const sl_no = location.state?.sl_no || "";
  const navigate = useNavigate()

  useEffect(()=>{
    console.log(operation_status, 'loadFormData', sl_no, 'kkkk', params?.id);
    
  }, [])

  const loadFormData = async () => {
    // setLoading(true); // Set loading state
    
    const formData = new FormData();

    formData.append("approval_no", params?.id);
    formData.append("sl_no", sl_no);
    
    console.log("loadFormData", formData); 

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Tender/tender_single_data',
        formData, 
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'auth_key': auth_key,
          },
        }
      );

      
      setValues({
        td_dt: response.data.message.tender_date,
        td_pdf: response.data.message.tender_notice,
        tia: response.data.message.invite_auth,
        td_mt_dt: response.data.message.mat_date,
        wo_dt: response.data.message.wo_date,
        wo_pdf: response.data.message.wo_copy,
        wo_value: response.data.message.wo_value,
        compl: response.data.message.comp_date_apprx,
      })

  

    console.log("loadFormData", response.data.message); // Log the actual response data
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
    }

  };

    useEffect(()=>{
  
      if(operation_status == 'edit'){
        loadFormData()
      }
  
  
    }, [])


  const saveFormData = async () => {
    // setLoading(true); // Set loading state
  
    const formData = new FormData();

    // Append each field to FormData
    formData.append("approval_no", params?.id);
    formData.append("tender_date", formik.values.td_dt);
    formData.append("tender_notice", formik.values.td_pdf); // Ensure this is a file if applicable
    formData.append("invite_auth", formik.values.tia);
    formData.append("mat_date", formik.values.td_mt_dt);
    formData.append("wo_date", formik.values.wo_dt);
    formData.append("wo_copy", formik.values.wo_pdf);
    formData.append("wo_value", formik.values.wo_value);
    formData.append("comp_date_apprx", formik.values.compl);
    formData.append("created_by", "SSS Name Created By");


  
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
  
      // setLoading(false);
      Message("success", "Updated successfully.");
      formik.resetForm();
    } catch (error) {
      // setLoading(false);
      Message("error", "Error Submitting Form:");
      console.error("Error submitting form:", error);
    }

  };

  const updateFormData = async () => {
    // setLoading(true); // Set loading state

  
    const formData = new FormData();

    formData.append("approval_no", params?.id);
    formData.append("sl_no", sl_no);
    formData.append("tender_date", formik.values.td_dt);
    formData.append("tender_notice", formik.values.td_pdf);  //////////
    formData.append("invite_auth", formik.values.tia);
    formData.append("mat_date", formik.values.td_mt_dt);
    formData.append("wo_date", formik.values.wo_dt);
    formData.append("wo_copy", formik.values.wo_pdf);
    formData.append("wo_value", formik.values.wo_value);
    formData.append("comp_date_apprx", formik.values.compl);
    formData.append("updated_by", "SSS Name Updated By");

  
    console.log("FormData:", formData);

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
      navigate(`/home/tender_formality/tftenderlist`);

      formik.resetForm();
    } catch (error) {
      // setLoading(false);
      Message("error", "Error Submitting Form:");
      console.error("Error submitting form:", error);
    }

  };
  
  



  const onSubmit = (values) => {
    console.log(values, 'credcredcredcredcred', operation_status ==  'edit', 'lll', params?.id);

    if(operation_status == 'edit'){
      updateFormData()
    } 
    if(operation_status ==  'add'){
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
  

  return (
    <section class="bg-white p-5 dark:bg-gray-900">
      <div class="py-5 mx-auto w-full lg:py-5">
      <Heading title={'Tender Formality Details'} button={'Y'}/>

      
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
          
           
            <div class="sm:col-span-4">
              
              <TDInputTemplate
              type="file"
              name="td_pdf"
              placeholder="Tender Notice"
              label="Tender Notice"
              handleChange={(event) => {
              formik.setFieldValue("td_pdf", event.currentTarget.files[0]);
              }}
              handleBlur={formik.handleBlur}
              mode={1}
              />
              {formik.errors.td_pdf && formik.touched.td_pdf && (
                <VError title={formik.errors.td_pdf} />
              )}

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
           
            <div class="sm:col-span-4">

              <TDInputTemplate
              type="file"
              name="wo_pdf"
              placeholder="Work Order Copy"
              label="Work Order Copy"
              handleChange={(event) => {
              formik.setFieldValue("wo_pdf", event.currentTarget.files[0]);
              }}
              handleBlur={formik.handleBlur}
              mode={1}
              />
              {formik.errors.wo_pdf && formik.touched.wo_pdf && (
                <VError title={formik.errors.wo_pdf} />
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
        <BtnComp title={operation_status ==  'edit' ? 'Reload' : 'Reset'} type="reset" 
        onClick={() => { 
          formik.resetForm();
        }}
        width={'w-1/6'} bgColor={'bg-white'} color="text-blue-900" border={'border-2 border-blue-900'} />
        {/* <button type="submit">Search</button> */}
        <BtnComp type={'submit'} title={operation_status ==  'edit' ? 'Update' : 'Submit'} onClick={() => { }} width={'w-1/6'} bgColor={'bg-blue-900'} />
         </div>
          </div>

        </form>


      </div>
    </section>
  )
}

export default TFForm
