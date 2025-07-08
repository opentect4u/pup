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
import { getLocalStoreTokenDts } from "../../CommonFunction/getLocalforageTokenDts";
import { Alert } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";


const initialValues = { 

  // user_id: "",

  pass: "",
  pass_con: "",
 };

// const validationSchema = Yup.object({
//   user_id: Yup.string().required("Email ID is Required"),
//   pass: Yup.string().required("Password is Required"),
//   pass_con: Yup.string().required("Confirm Password is Required"),
// });

const validationSchema = Yup.object({

  // pass: Yup.string().required("Password is Required"),
  // pass_con: Yup.string()
  //   .required("Confirm Password is Required")
  //   .oneOf([Yup.ref("pass"), null], "Passwords must match"),

  pass: Yup.string()
    .required("Password is Required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),

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
    } else {
      setUserDataLocalStore([])
    console.log("No User Data Found");
    }

  }, []);

  const changePassword = async () => {
    setLoading(true);
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    // Append each field to FormData

    formData.append("user_id", userDataLocalStore.user_id);
    formData.append("pass", formik.values.pass);
    formData.append("modified_by", userDataLocalStore.user_id);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token
    
        try {
    
          const response = await axios.post( `${url}index.php/webApi/User/changepass`, 
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
    changePassword(); 
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    enableReinitialize: true,
    validateOnMount: true,
  });

const getPasswordStatusList = (password) => {
  return [
    {
      label: "At least 8 characters",
      isValid: password.length >= 8,
    },
    {
      label: "One uppercase letter (A–Z)",
      isValid: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter (a–z)",
      isValid: /[a-z]/.test(password),
    },
    {
      label: "One number (0–9)",
      isValid: /[0-9]/.test(password),
    },
    {
      label: "One special character (e.g. @, #, $)",
      isValid: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];
};



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
                    placeholder="Type Password"
                    type="password"
                    label="Type Password"
                    name="pass"
                    formControlName={formik.values.pass}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    mode={1}
                  />
                  {/* {formik.errors.pass && formik.touched.pass && (
                    <VError title={formik.errors.pass} />
                  )} */}


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

<div className="sm:col-span-8">
                  {/* {formik.touched.pass && ( */}
  <Alert
    type="info"
    // showIcon
    message="Password Must include:"
    className="alertPass"
    description={
      <ul className="list-none pl-1">
        {getPasswordStatusList(formik.values.pass).map((item, index) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            {item.isValid ? (
              <CheckCircleOutlined style={{ color: "green" }} />
            ) : (
              <CloseCircleOutlined style={{ color: "red" }} />
            )}
            <span style={{ color: item.isValid ? "green" : "red" }}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    }
  />
{/* )} */}
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
