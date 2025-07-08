import React, { useEffect, useState } from "react";
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
import localforage from 'localforage';
import { getCSRFToken } from "../../CommonFunction/useCSRFToken";


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

const [loginBtnDisable, setLoginBtnDisable] = useState(false);

const [captchaText, setCaptchaText] = useState("");
const [userCaptchaInput, setUserCaptchaInput] = useState("");
const [attempLogin, setAttempLogin] = useState("");

// const { csrf} = useCSRFToken();





// Generate random alphabet captcha
  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let text = "";
    for (let i = 0; i < 5; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(text);
    setUserCaptchaInput("");
  };


  useEffect(() => {
    generateCaptcha();
  }, []);


// const getCSRFToken = async () => {
//   const res = await fetch(url + 'index.php/login/get_csrf', {
//     credentials: "include" // allows receiving the CSRF cookie
//   });
//   const data = await res.json();
//   console.log(data, 'data');
  
//   return {
//     name: data.csrf_token_name,
//     value: data.csrf_token_value
//   };
// };

const loginFnc = async () => {
  
  
  const csrf = await getCSRFToken(navigate);
 
  const formData = new FormData();
  formData.append("user_id", formik.values.email);
  formData.append("user_pwd", formik.values.pass); // Ensure this is a file if applicable
  formData.append("login_type", 'W');
  formData.append(csrf.name, csrf.value); // csrf_token
 
  const result = await fetch(url + 'index.php/login/login', {
    method: "POST",
    body: formData,
    credentials: "include", // CRITICAL: this includes the csrf_cookie
  });
 
  const response = await result.json();
  console.log(response, 'result', formData);

      if(response?.status > 0){
    Message("success", "Login successfully.");
    // setLoading(false);
    // formik.resetForm();

    localStorage.setItem("user_dt", JSON.stringify({
      name: response?.message?.name, 
      user_id: response?.message?.user_id,
      user_status: response?.message?.user_status,
      user_type: response?.message?.user_type,
      // token: response?.token
    }))

      localforage.setItem('tokenDetails', {
        'token': response?.token,
        'expires_at': response?.expires_at,
        'csrfName': csrf.name, 
        'csrfValue':csrf.value
      }).then(() => {
      console.log('Value saved!', response);
      }).catch((err) => {
      console.error('Save error:', err);
      });


    console.log("token-store_", response);
    
    
    if(response?.message?.user_type === 'S'){
      navigate('home/admin_approval')
    } else if(response?.message?.user_type === 'A'){
      navigate('home/admin_approval')
    } else if(response?.message?.user_type === 'AC'){
      navigate('home/fund_expense')
    } else if(response?.message?.user_type === 'F'){
      navigate('home/tender_formality')
    } else {
      navigate('home/')
    }
    

    }

    if(response?.status < 1){
    Message("error", "Login Credentials Wrong...");
    console.log(response, 'vvvvvvvvvv');
    setAttempLogin(response?.message)
    
    // setLoading(false);
    // formik.resetForm();
    setLoginBtnDisable(false)
    }
};

const onSubmit = (e) => {
    // saveFormData()

    // setLoginBtnDisable(true)

    // if (userCaptchaInput !== captchaText) {
    //   alert("CAPTCHA incorrect. Please try again.");
    //   generateCaptcha();
    //   return;
    // }

    // Proceed with login
    // alert("CAPTCHA correct. Logging in...");
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
                    placeholder="User ID"
                    type="text"
                    label="User ID"
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


            <div className="capture_login">
            <label className="capture_Txt">
            <span 
            style={{
            fontWeight: "bold",
            fontSize: "20px",
            letterSpacing: "3px",
            marginLeft: "10px",
            backgroundColor: "#eee",
            padding: "5px",
            borderRadius: "5px",
            userSelect: "none"
            }}
            >
            {captchaText}
            </span>
            </label>
            <input
            type="text"
            value={userCaptchaInput}
            onChange={(e) => setUserCaptchaInput(e.target.value)}
            required
            placeholder="Enter CAPTCHA above"
            className="capture_Field"
            />
            <button type="button" onClick={generateCaptcha} className="capture_Refresh_Btn">
            Refresh
            </button>
            </div>


              <BtnComp type={'submit'} title="Sign in" onClick={() => { }} disabled={loginBtnDisable} />
              <p class="text-sm text-red-500 font-semibold text-center">
                {attempLogin}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Sign_in;
