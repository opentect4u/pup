import React, { lazy } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Screens/HomeScreen/Home';
import HomeScreen from './Screens/HomeScreen/HomeScreen';
import TFTenderList from './Screens/TENDER_FORMALITY/TFTenderList___bkp';
// import FundRelList from './Screens/FUND_RELEASE/FundRelList';
// import FundExpList from './Screens/FUND_EXP/FundExpList___bkp';
import FundRelListEditForm from './Screens/FUND_RELEASE/FundRelListEditForm';
import FundExpListEditForm from './Screens/FUND_EXP/FundExpListEditForm';
// import UCList from './Screens/UC/UCList__bkp';
import UCListEditForm from './Screens/UC/UCListEditForm';
import PRView from './Screens/Progress_Report/PRView';
import PRDetails from './Screens/Progress_Report/PRDetails';
import PRComp from './Screens/Progress_Report/PRComp';
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
            // {
            //   path: "frlist",
            //   element: <FundRelList />,
            // },
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
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
