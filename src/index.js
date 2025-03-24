import React, { lazy } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Screens/HomeScreen/Home';
import HomeScreen from './Screens/HomeScreen/HomeScreen';
// import TFTenderList from './Screens/TENDER_FORMALITY/TFTenderList___bkp';
// import FundRelList from './Screens/FUND_RELEASE/FundRelList';
// import FundExpList from './Screens/FUND_EXP/FundExpList___bkp';
import FundRelListEditForm from './Screens/FUND_RELEASE/FundRelListEditForm';
import FundExpListEditForm from './Screens/FUND_EXP/FundExpListEditForm';
// import UCList from './Screens/UC/UCList__bkp';
import UCListEditForm from './Screens/UC/UCListEditForm';
import PRView from './Screens/Progress_Report/PRView';
import PRDetails from './Screens/Progress_Report/PRDetails';
import PRComp from './Screens/Progress_Report/PRComp';
import MASTERComp from './Screens/MASTER/MASTERComp';
import SECTOR_ADD_EDITForm from './Screens/MASTER/SECTOR_ADD_EDITForm';
import { Democontext } from './Context/Democontext';
import SOUR_OF_FUN_Form from './Screens/MASTER/SOUR_OF_FUN_Form';
import IMPL_AGEN_Form from './Screens/MASTER/IMPL_AGEN_Form';
import ACC_HEAD_Form from './Screens/MASTER/ACC_HEAD_Form';
import REPORTComp from './Screens/REPORTS/REPORTComp';
import Financial_Report from './Screens/REPORTS/Financial_Report';
import HeadAccountwise_Report from './Screens/REPORTS/HeadAccountwise_Report';
import Financial_Report_Graph from './Screens/REPORTS/Financial_Report_Graph';
import HeadAccountwise_Report_Graph from './Screens/REPORTS/HeadAccountwise_Report_Graph';
import USERComp from './Screens/USER_MANAGE/USERComp';
import UserManage from './Screens/USER_MANAGE/UserManage';
import ProfileComp from './Screens/PROFILE_MANAGE/ProfileComp';
import ChangePass from './Screens/PROFILE_MANAGE/ChangePass';
import Sector_Report from './Screens/REPORTS/Sector_Report';
import Sector_Report_Graph from './Screens/REPORTS/Sector_Report_Graph';
import District_Report from './Screens/REPORTS/District_Report';
import District_Report_Graph from './Screens/REPORTS/District_Report_Graph';
import Implement_Report from './Screens/REPORTS/Implement_Report';
import Implement_Report_Graph from './Screens/REPORTS/Implement_Report_Graph';

import DERTMENT_ADD from './Screens/MASTER/DERTMENT_ADD';
import DESIGNATION_ADD from './Screens/MASTER/DESIGNATION_ADD';
import UserProfile from './Screens/PROFILE_MANAGE/UserProfile';
import Financial_Report__test from './Screens/REPORTS/Financial_Report__test';
// import FundRelView__test from './Screens/FUND_RELEASE/FundRelView__test';

const FundRelForm =lazy(()=>import('./Screens/FUND_RELEASE/FundRelForm'))
const Sign_in =lazy(()=>import('./Screens/Auth/Sign_in'))
const AdApForm =lazy(()=>import('./Screens/ADMIN_APPROVAL/AdApForm'))
const TFForm =lazy(()=>import('./Screens/TENDER_FORMALITY/TFForm'))
const FundExpForm =lazy(()=>import('./Screens/FUND_EXP/FundExpForm'))
const UCForm =lazy(()=>import('./Screens/UC/UCForm'))
const Auth = lazy(()=>import('./Screens/Auth/Auth'))
const AdApComp = lazy(()=>import('./Screens/ADMIN_APPROVAL/AdApComp'))
const AdApView = lazy(()=>import('./Screens/ADMIN_APPROVAL/AdApView'))
const TFComp = lazy(()=>import('./Screens/TENDER_FORMALITY/TFComp'))
const TFView = lazy(()=>import('./Screens/TENDER_FORMALITY/TFView'))
const FundRelComp = lazy(()=>import('./Screens/FUND_RELEASE/FundRelComp'))
const FundRelView = lazy(()=>import('./Screens/FUND_RELEASE/FundRelView'))
const FundExpView = lazy(()=>import('./Screens/FUND_EXP/FundExpView'))
const FundExpComp = lazy(()=>import('./Screens/FUND_EXP/FundExpComp'))
const UCComp = lazy(()=>import('./Screens/UC/UCComp'))
const UCView = lazy(()=>import('./Screens/UC/UCView'))

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
    {
      path: "",
      element: <Auth />,
      children: [
        {
          path: "",
          element: <Sign_in />,
        },
        // {
        //   path: "signup",
        //   element: <Signup />,
        // },
        // {
        //   path: "forgotpassword",
        //   element: <ForgotPass />,
        // },
      ],
    },
    {
      path: "home",
      element: <Home />,
      children: [
        {
          path: "",
          // element: <HomeScreen />,
          element: <AdApView />,
        },
        {
          path: "admin_approval",
          element: <AdApComp />,
          children: [
            {
              path: "",
              element: <AdApView />,
            },
            {
              path: "AdApcrud/:id",
              element: <AdApForm />,
            }
          ]
        },
        {
          path: "tender_formality",
          element: <TFComp />,
          children: [
            {
              path: "",
              element: <TFView />,
            },
            {
              path: "tfcrud/:id",
              element: <TFForm />,
            },
            // {
            //   path: "tftenderlist",
            //   element: <TFTenderList />,
            // }
          ]
        },
        {
          path: "fund_release",
          element: <FundRelComp />,
          children: [
            {
              path: "",
              element: <FundRelView />,
            },
            {
              path: "frcrud/:id",
              element: <FundRelForm />,
            },
            {
              path: "frlistedit/:id",
              element: <FundRelListEditForm />,
            },
            
          ]
        },
        {
          path: "fund_expense",
          element: <FundExpComp />,
          children: [
            {
              path: "",
              element: <FundExpView />,
            },
            {
              path: "fecrud/:id",
              element: <FundExpForm />,
            },
            {
              path: "felistedit/:id",
              element: <FundExpListEditForm />,
            },
            // {
            //   path: "felist",
            //   element: <FundExpList />,
            // },
          ]
        },
        {
          path: "uc",
          element: <UCComp />,
          children: [
            {
              path: "",
              element: <UCView />,
            },
            {
              path: "uccrud/:id",
              element: <UCForm />,
            },
            // {
            //   path: "uclist/",
            //   element: <UCList />,
            // },
            {
              path: "uclistedit/:id",
              element: <UCListEditForm />,
            },
          ]
        },
        {
          path: "pr",
          element: <PRComp />,
          children: [
            {
                path: "",
                element: <PRView />,
            },
            {
              path: "prdetails/:id",
              element: <PRDetails />,
            },
          ]
        },
        {
          path: "master",
          element: <MASTERComp />,
          children: [
            {
                path: "add-edit-sector",
                element: <SECTOR_ADD_EDITForm />,
            },
            {
              path: "add-source-fund",
              element: <SOUR_OF_FUN_Form />,
            },
            {
              path: "implementing-agency",
              element: <IMPL_AGEN_Form />,
            },
            {
              path: "account-head-list",
              element: <ACC_HEAD_Form />,
            },
            {
              path: "depertment",
              element: <DERTMENT_ADD />,
            },
            {
              path: "designation",
              element: <DESIGNATION_ADD />,
            },

          ]
        },
        {
          path: "user",
          element: <USERComp />,
          children: [
            {
                path: "manage-user",
                element: <UserManage />,
            }
          
          ]
        },
        {
          path: "user-profile",
          element: <ProfileComp />,
          children: [
            {
                path: "change-password",
                element: <ChangePass />,
            },
            {
              path: "profile",
              element: <UserProfile />,
          }
          
          ]
        },
        {
          path: "user",
          element: <USERComp />,
          children: [
            {
                path: "manage-user",
                element: <UserManage />,
            }
          
          ]
        },
        {
          path: "user-profile",
          element: <ProfileComp />,
          children: [
            {
                path: "change-password",
                element: <ChangePass />,
            }
          
          ]
        },
        {
          path: "report",
          element: <REPORTComp />,
          children: [
            {
              path: "financial-report/:id",
              element: <Financial_Report />,
            },
            {
              path: "financial-report-graph/:id",
              element: <Financial_Report_Graph />,
            },

            {
              path: "financial-report_test/:id",
              element: <Financial_Report__test />,
            },
            
            {
                path: "head-accountwise-report/:id",
                element: <HeadAccountwise_Report />,
            },
            {
                path: "head-accountwise-report-graph/:id",
                element: <HeadAccountwise_Report_Graph />,
            },
            {
                path: "sector-report/:id",
                element: <Sector_Report />,
            },
            {
                path: "sector-report-graph/:id",
                element: <Sector_Report_Graph />,
            },
            {
                path: "district-report/:id",
                element: <District_Report />,
            },
            {
                path: "district-report-graph/:id",
                element: <District_Report_Graph />,
            },
            {
                path: "implement-report/:id",
                element: <Implement_Report />,
            },
            {
                path: "implement-report-graph/:id",
                element: <Implement_Report_Graph />,
            }


          ]
        },
        // {
        //   path: "progress_report",
        //   element: <PRView />,
        //   children: [
        //     {
        //       path: "prdetails/:id",
        //       element: <PRDetails />,
        //     }
        //   ]
        // },
      ]
      }
]}
    
  
])
    
root.render(
  <Democontext>
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />

  </React.StrictMode>
  </Democontext>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
