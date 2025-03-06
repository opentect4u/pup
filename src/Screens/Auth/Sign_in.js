import React, { useState } from "react";
import LOGO from "../../Assets/Images/logo.png";
import BtnComp from "../../Components/BtnComp";
import { useNavigate } from "react-router-dom";
import TDInputTemplate from "../../Components/TDInputTemplate";
import * as Yup from 'yup';
import { useFormik } from "formik";
import VError from "../../Components/VError";
import axios from "axios";
import { auth_key, url } from "../../Assets/Addresses/BaseUrl";
import { Message } from "../../Components/Message";


const initialValues = {
  email: '',
  pass: '',
};



const validationSchema = Yup.object({
  // email: Yup.string().email('Invalid email format').required('Email is Required'),
  email: Yup.string().required('Email is Required'),
  pass: Yup.string().required('Password is Required'),
});

function Sign_in() {

const navigate = useNavigate();
const [loading, setLoading] = useState(false);


const loginFnc = async () => {
  const formData = new FormData();
  
  // // Append each field to FormData
  formData.append("user_id", formik.values.email);
  formData.append("user_pwd", formik.values.pass); // Ensure this is a file if applicable

  console.log("FormData:", formData);

  try {
    const response = await axios.post(
      `${url}index.php/Login/login`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          'auth_key': auth_key // Important for FormData
        },
      }
    );

    console.log("Response", response?.data?.status);
    if(response?.data?.status > 0){
    Message("success", "Login successfully.");
    // setLoading(false);
    // formik.resetForm();
    navigate('home/')
    }

    if(response?.data?.status < 1){
    Message("error", "There have some error...");
    // setLoading(false);
    // formik.resetForm();
    }
    

    
  } catch (error) {
    setLoading(false);
    Message("error", "Error Submitting Form: uu");
    console.error("Error submitting form:", error);
  }
  
}

const onSubmit = (values) => {
    // saveFormData()
    console.log('Form data', values);

    loginFnc()
    
  
};

const formik = useFormik({
      // initialValues:formValues,
      // initialValues: +params.id > 0 ? formValues : initialValues,
      initialValues,
      onSubmit,
      validationSchema,
      enableReinitialize: true,
      validateOnMount: true,
    });

    
  return (
    <section class="bg-blue-900 dark:bg-gray-900">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <img class="w-24 h-24 mx-auto my-5" src={LOGO} alt="logo" />
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            {/* <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
              </h1> */}
            <form className="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>
              <div>
              <TDInputTemplate
                    placeholder="youremail@gmail.com"
                    type="text"
                    label="Your email"
                    name="email"
                    formControlName={formik.values.email}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    mode={1}
                  />
                  {formik.errors.email && formik.touched.email && (
                <VError title={formik.errors.email} />
              )}
              </div>
              <div>
              <TDInputTemplate
                    placeholder="******"
                    type="password"
                    label="Your password"
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
              {/* <div class="flex items-center justify-end">
                <a
                  href="#"
                  class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </a>
              </div> */}

              <BtnComp type={'submit'} title="Sign in" onClick={() => { }} />
              {/* <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <a
                  href="#"
                  class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up
                </a>
              </p> */}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Sign_in;
