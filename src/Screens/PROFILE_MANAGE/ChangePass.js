import React, { useEffect, useRef, useState } from "react";
import TDInputTemplate from "../../Components/TDInputTemplate";
import BtnComp from "../../Components/BtnComp";
import Heading from "../../Components/Heading";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Message } from "../../Components/Message";
import axios from "axios";
import { auth_key, url } from "../../Assets/Addresses/BaseUrl";
import VError from "../../Components/VError";
import { useNavigate } from "react-router-dom";


const initialValues = { 
  user_id: "",
  pass: "",
  pass_con: "",
 };

// const validationSchema = Yup.object({
//   user_id: Yup.string().required("Email ID is Required"),
//   pass: Yup.string().required("Password is Required"),
//   pass_con: Yup.string().required("Confirm Password is Required"),
// });

const validationSchema = Yup.object({
  user_id: Yup.string().required("Email ID is Required"),
  pass: Yup.string().required("Password is Required"),
  pass_con: Yup.string()
    .required("Confirm Password is Required")
    .oneOf([Yup.ref("pass"), null], "Passwords must match"),
});

function ChangePass() {
  const [loading, setLoading] = useState(false);
  const [userDataLocalStore, setUserDataLocalStore] = useState([]);
  const navigate = useNavigate()
  const [editingSector, setEditingSector] = useState(false); // New state for editing
 

  useEffect(() => {
    const userData = localStorage.getItem("user_dt");

    if (userData) {
      setUserDataLocalStore(JSON.parse(userData))
    console.log("User Data Found:", userData);
    } else {
      setUserDataLocalStore([])
    console.log("No User Data Found");
    }

  }, []);

  const changePassword = async () => {
    setLoading(true);
      
    const formData = new FormData();
    // Append each field to FormData
    formData.append("user_id", formik.values.user_id);
    formData.append("pass", formik.values.pass);
    formData.append("modified_by", userDataLocalStore.user_id);
    
        try {
    
          const response = await axios.post( `${url}index.php/webApi/User/changepass`, 
          formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                'auth_key': auth_key // Important for FormData
              },
            }
          );

          console.log(response, 'rrrrrrrrrrrrrrrr', formData);
          
  
          if(response?.data?.status > 0) {
            Message("success", "Updated Password successfully.");
            setLoading(false);
            navigate('/')
            localStorage.removeItem("user_dt");
          }
  
          if(response?.data?.status < 1) {
          setLoading(false);
          Message("error", response?.data?.message);
          }

        
  
          
          
        } catch (error) {
          setLoading(false);
          Message("error", "Error Submitting Form:");
          console.error("Error submitting form:", error);
        }

  };




  const onSubmit = (values) => {
    console.log(values);
    changePassword(); 
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    enableReinitialize: true,
    validateOnMount: true,
  });





  return (
    <section className="bg-white p-5 dark:bg-gray-900">
      <div className="py-5 mx-auto w-full lg:py-5">
        <div className="grid grid-cols-1 gap-4">
          <div className="col-span-1">
            
          
            <>
            <Heading title={"Change Password"} button="N" />
            <form onSubmit={formik.handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-12 sm:gap-6">
                <div className="sm:col-span-4">
                  <TDInputTemplate
                    placeholder="User ID"
                    type="text"
                    label="User ID"
                    name="user_id"
                    formControlName={formik.values.user_id}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    mode={1}
                  />
                  {formik.errors.user_id && formik.touched.user_id && (
                    <VError title={formik.errors.user_id} />
                  )}
                </div>


                <div className="sm:col-span-4">
                  <TDInputTemplate
                    placeholder="Type Password"
                    type="password"
                    label="Type Password"
                    name="pass"
                    formControlName={formik.values.pass}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    mode={1}
                  />
                  {formik.errors.pass && formik.touched.pass && (
                    <VError title={formik.errors.pass} />
                  )}
                </div>

                <div className="sm:col-span-4">
                  <TDInputTemplate
                    placeholder="Confirm Password"
                    type="password"
                    label="Confirm Password"
                    name="pass_con"
                    formControlName={formik.values.pass_con}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    mode={1}
                  />
                  {formik.errors.pass_con && formik.touched.pass_con && (
                    <VError title={formik.errors.pass_con} />
                  )}
                </div>


            

          

            
            

                
                <div className="sm:col-span-12 flex justify-left gap-1 mt-0">
                  <BtnComp
                    type="submit"
                    title={"Change Password"}
                    width="w-1/6"
                    bgColor="bg-blue-900"
                    onClick={() => {  }}
                  />
                  <BtnComp
                    title="Reset"
                    type="reset"
                    onClick={() => {
                      formik.resetForm();
                    }}
                    width="w-1/6"
                    bgColor="bg-white"
                    color="text-blue-900"
                    border="border-2 border-blue-900"
                  />

                {/* <BtnComp type={'submit'} title={'Submit'} onClick={() => { }} width={'w-1/6'} bgColor={'bg-blue-900'} />
                <BtnComp title={'Reset'} type="reset" 
                onClick={() => { 
                formik.resetForm();
                setEditingSector(null);
                }}
                width={'w-1/6'} bgColor={'bg-white'} color="text-blue-900" border={'border-2 border-blue-900'} /> */}
                
                </div>
              </div>
            </form>
            </>
          


          </div>

        </div>
      </div>


    </section>
  );
}

export default ChangePass;
