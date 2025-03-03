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
import { FilePdfOutlined } from '@ant-design/icons';

const initialValues = {
  issued_by: '',
  certificate_path: '',
  issued_to: '',
  cont_amt_one: '',
};



const validationSchema = Yup.object({
  issued_by: Yup.string().required('Issued By is Required'),
  issued_to: Yup.string().required('Issued To is Required'),
  certificate_path: Yup.string().required('Utilization Certificate is Required'),
  

  // issued_by: Yup.string(),
  // certificate_path: Yup.string(),
  // issued_to: Yup.string(),
  // cont_amt_one: Yup.string(),

});


function UCForm() {
  const params = useParams();
  const [formValues, setValues] = useState(initialValues);
  const location = useLocation();
  const operation_status = location.state?.operation_status || "add";
  // const sl_no = location.state?.sl_no || "";
  const navigate = useNavigate()
  const [fundStatus, setFundStatus] = useState(() => []);
  const [folderName, setFolderName] = useState('');

  useEffect(()=>{
      console.log(operation_status, 'loadFormData', 'kkkk', params?.id);
    }, [])

    
    const fundAddedList = async () => {
      // setLoading(true); // Set loading state
    
      
      const formData = new FormData();
      formData.append("approval_no", params?.id);
  
      try {
        const response = await axios.post(
          `${url}index.php/webApi/Utilization/get_added_utlization_list`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              'auth_key': auth_key // Important for FormData
            },
          }
        );

        console.log("FormData_____DONE", response?.data?.message.length);

        if(response.data.status > 0){
          setFundStatus(response?.data?.message)
          setFolderName(response.data.folder_name)
        }

        if(response.data.status < 1){
          setFundStatus([])
        }
        // setLoading(false);
        // Message("success", "Updated successfully.");
        // navigate(`/home/fund_release`);
      } catch (error) {
        // setLoading(false);
        Message("error", "Error Submitting Form:");
        console.error("Error submitting form:", error);
      }
  
    };

    const saveFormData = async () => {
      // setLoading(true); // Set loading state
    
      const formData = new FormData();
  
      // // Append each field to FormData
      formData.append("approval_no", params?.id);
      formData.append("issued_by", formik.values.issued_by);
      formData.append("certificate_path", formik.values.certificate_path); // Ensure this is a file if applicable
      formData.append("issued_to", formik.values.issued_to);
      formData.append("created_by", "SSS Name Created By");
  
    
      console.log("FormData:", formData);
  
      try {
        const response = await axios.post(
          `${url}index.php/webApi/Utilization/utlization_add`,
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
        // navigate(`/home/fund_release`);
        fundAddedList()
        formik.resetForm();
      } catch (error) {
        // setLoading(false);
        Message("error", "Error Submitting Form:");
        console.error("Error submitting form:", error);
      }
  
    };

 const onSubmit = (values) => {
    console.log(values, 'credcredcredcredcred', operation_status ==  'edit', 'lll', params?.id);

    // if(operation_status == 'edit'){
    //   updateFormData()
    // } 
    if(operation_status ==  'add'){
      saveFormData()
      
    }
    
  };

  useEffect(()=>{
    fundAddedList()
  }, [])

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
       

        {fundStatus?.length > 0 &&(
          <>
          <Heading title={"Utilization Certificate History"} button={'Y'}/>
          {fundStatus?.map((data, index) => ( 
          <div class="grid gap-0 sm:grid-cols-12 sm:gap-6 mb-5">
          <div class="sm:col-span-12">
          <h6 class="text-lg font-bold dark:text-white mb-0">{data?.certificate_no == 1? 'First' : data?.certificate_no == 2? 'Secound' : data?.certificate_no == 3? 'Third' : 'Fourth'} installment Details</h6>
          </div>
               <div class="sm:col-span-4">
                 <TDInputTemplate
                   type="text"
                   label="Issued By"
                   formControlName={data?.issued_by}
                   mode={1}
                   disable={true}
                 />
                
               </div>

               <div class="sm:col-span-4">
                 <TDInputTemplate
                   type="text"
                   label="Issued To"
                   formControlName={data?.issued_to}
                   mode={1}
                   disable={true}
                 />
                
               </div>

              
             
               <div class="sm:col-span-4">
                <label className='block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100'>Allotment Order No.</label>
                 
                 <a href={url + folderName + data?.certificate_path} target='_blank'>
                 <FilePdfOutlined style={{fontSize:22, color:'red'}} /></a>
   
                
               </div>
               
           
             </div>
            ))}
          </>
        )}
       
       {fundStatus.length < 6 &&(
        <>
       <Heading title={"Utilization Certificate Details"} button={'N'}/>
       <form onSubmit={formik.handleSubmit}>
          <div class="grid gap-4 sm:grid-cols-12 sm:gap-6">
            <div class="sm:col-span-4">
              <TDInputTemplate
                type="text"
                placeholder="Issued By"
                label="Issued By"
                name="issued_by"
                formControlName={formik.values.issued_by}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.issued_by && formik.touched.issued_by && (
                <VError title={formik.errors.issued_by} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Issued To"
                type="text"
                label="Issued To"
                name="issued_to"
                formControlName={formik.values.issued_to}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.issued_to && formik.touched.issued_to && (
                <VError title={formik.errors.issued_to} />
              )}
            </div>
          
            <div class="sm:col-span-4">
              <TDInputTemplate
              type="file"
              name="certificate_path"
              placeholder="Utilization Certificate"
              // label="Utilization Certificate"
              label={fundStatus.length == 4? 'Project Completion Report' : fundStatus.length == 5? 'Photograph Of Completed Report' : 'Utilization Certificate'}
              handleChange={(event) => {
              formik.setFieldValue("certificate_path", event.currentTarget.files[0]);
              }}
              handleBlur={formik.handleBlur}
              mode={1}
              />

              {formik.errors.certificate_path && formik.touched.certificate_path && (
                <VError title={formik.errors.certificate_path} />
              )}
            </div>
            
            

            <div className="sm:col-span-12 flex justify-center gap-4 mt-4">
         {/* <BtnComp title={'Reset'} width={'w-1/6'} bgColor={'bg-white'} color="text-blue-900" border={'border-2 border-blue-900'}/>
         <BtnComp title={'Submit'} width={'w-1/6'} bgColor={'bg-blue-900'}/> */}
         <BtnComp title={'Reset'} type="reset" 
        onClick={() => { 
          formik.resetForm();
        }}
        width={'w-1/6'} bgColor={'bg-white'} color="text-blue-900" border={'border-2 border-blue-900'} />
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

export default UCForm
