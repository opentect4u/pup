import React from "react";
import LOGO from "../../Assets/Images/logo.png";
import BtnComp from "../../Components/BtnComp";
import { useNavigate } from "react-router-dom";
import TDInputTemplate from "../../Components/TDInputTemplate";
function Sign_in() {
const navigate = useNavigate();
  return (
    <section class="bg-blue-900 dark:bg-gray-900">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <img class="w-24 h-24 mx-auto my-5" src={LOGO} alt="logo" />
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            {/* <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
              </h1> */}
            <form class="space-y-4 md:space-y-6" action="#">
              <div>
              <TDInputTemplate
                    placeholder="youremail@gmail.com"
                    type="email"
                    label="Your email"
                    name="email"
                    // formControlName={formik.values.email}
                    // handleChange={formik.handleChange}
                    // handleBlur={formik.handleBlur}
                    mode={1}
                  />
              </div>
              <div>
              <TDInputTemplate
                    placeholder="******"
                    type="password"
                    label="Your password"
                    name="email"
                    // formControlName={formik.values.email}
                    // handleChange={formik.handleChange}
                    // handleBlur={formik.handleBlur}
                    mode={1}
                  />
              </div>
              {/* <div class="flex items-center justify-end">
                <a
                  href="#"
                  class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </a>
              </div> */}

              <BtnComp title="Sign in" onClick={()=>navigate('home/')} />
              <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <a
                  href="#"
                  class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Sign_in;
