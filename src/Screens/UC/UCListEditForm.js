import React, { useEffect, useState } from 'react'
import TDInputTemplate from '../../Components/TDInputTemplate'
import BtnComp from '../../Components/BtnComp'
import Heading from '../../Components/Heading'
import * as Yup from 'yup';
import { useFormik } from "formik";
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import VError from '../../Components/VError';
import axios from 'axios';
import { auth_key, url, folder_certificate } from '../../Assets/Addresses/BaseUrl';
import { Message } from '../../Components/Message';
import { FilePdfOutlined, LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { getLocalStoreTokenDts } from '../../CommonFunction/getLocalforageTokenDts';

const initialValues = {
  issued_by: '',
  certificate_path: '',
  issued_to: '',
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


function UCListEditForm() {
  const params = useParams();
  const [formValues, setValues] = useState(initialValues);
  const location = useLocation();
  const operation_status = location.state?.operation_status || "add";
  const certificate_no = location.state?.certificate_no || "";
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()
  const [fundStatus, setFundStatus] = useState(() => []);
  // const [folderName, setFolderName] = useState('');
  const [filePreview, setFilePreview] = useState(null);
  const [userDataLocalStore, setUserDataLocalStore] = useState([]);

  useEffect(() => {

    const userData = localStorage.getItem("user_dt");
    if (userData) {
    setUserDataLocalStore(JSON.parse(userData))
    } else {
    setUserDataLocalStore([])
    }
    
  }, []);

    


    const loadFormData = async () => {
      setLoading(true); // Set loading state
      // const cread = {
      //   approval_no: params?.id,
      //   receive_no: receive_no,
      //   receive_date: receive_date,
      // }
      const tokenValue = await getLocalStoreTokenDts(navigate);
      const formData = new FormData();
  
      // // Append each field to FormData
      formData.append("approval_no", params?.id);
      formData.append("certificate_no", certificate_no);
      formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token
  
      try {
        const response = await axios.post(
          url + 'index.php/webApi/Utilization/utlization_single_data',
          formData, 
          {
            headers: {
              'auth_key': auth_key,
              'Authorization': `Bearer ` + tokenValue?.token
            },
          }
        );

        setLoading(false);
        // const totalAmount = Number(response.data.message.sch_amt) + Number(response.data.message.cont_amt);
        // fetchBlockdownOption__load(response?.data?.message?.district_id, response?.data?.message?.block_id)
        setValues({
          // approval_no: response.data.message.approval_no,
          issued_by: response.data.message.issued_by,
          issued_to: response.data.message.issued_to,
          certificate_path: response.data.message.certificate_path,



          // approval_no,
          ///////// receive_no,
          ///////// receive_date
          // instl_amt,
          // allotment_no,
          // sch_amt,
          // cont_amt,
          // modified_by

        })
  
        // setSourceFundDropList(response.data.message)
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error); // Handle errors properly
        
      localStorage.removeItem("user_dt");
      navigate('/')
      }
  
    };

    const saveFormData = async () => {
      // setLoading(true); // Set loading state
      const tokenValue = await getLocalStoreTokenDts(navigate);

      const formData = new FormData();
  
      // // Append each field to FormData
      formData.append("approval_no", params?.id);
      formData.append("certificate_no", certificate_no);

      formData.append("issued_by", formik.values.issued_by);
      formData.append("certificate_path", formik.values.certificate_path); // Ensure this is a file if applicable
      formData.append("issued_to", formik.values.issued_to);
      formData.append("created_by", userDataLocalStore.user_id);
      formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

// approval_no,
// certificate_no
// certificate_path,
// issued_by,
// issued_to,
// created_by

  
    
  
      try {
        const response = await axios.post(
          `${url}index.php/webApi/Utilization/utlization_edit`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              'auth_key': auth_key,
              'Authorization': `Bearer ` + tokenValue?.token
            },
          }
        );
    
        // setLoading(false);
        Message("success", "Updated successfully.");
        // navigate(`/home/fund_release`);
        loadFormData()
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

    // if(operation_status == 'edit'){
    //   updateFormData()
    // } 
    if(operation_status ==  'add'){
      saveFormData()
      
    }
    
  };

  useEffect(()=>{
    // fundAddedList()
    loadFormData()
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
       
       
        <>
       <Heading title={"Utilization Certificate Edit"} button={'Y'}/>
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
          
            <div class="sm:col-span-4" style={{position:'relative'}}>
              
            <TDInputTemplate
            type="file"
            name="certificate_path"
            placeholder="Utilization Certificate"
            label="Utilization Certificate"
            handleChange={(event) => {
            const file = event.currentTarget.files[0];
            if (file) {
            formik.setFieldValue("certificate_path", file);
            setFilePreview(URL.createObjectURL(file)); // Create a preview URL
            }
            }}
            handleBlur={formik.handleBlur}
            mode={1}
            />

            {filePreview && (
            <a href={filePreview} target="_blank" rel="noopener noreferrer" style={{position:'absolute', top:37, right:10}}>
            <FilePdfOutlined style={{ fontSize: 22, color: "red" }} />
            </a>
            )}
            
            {/* {JSON.stringify(filePreview, null, 2)} */}
            {filePreview === null && (
            <a href={url + folder_certificate + formValues.certificate_path} target='_blank' style={{position:'absolute', top:37, right:10}}>
                 <FilePdfOutlined style={{fontSize:22, color:'red'}} /></a>
            )}

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
        </Spin>
        </>
      
      </div>
    </section>
  )
}

export default UCListEditForm
