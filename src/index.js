import React, { lazy } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Democontext } from './Context/Democontext';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';



const loadable = (importFunc) => 
  React.lazy(() => 
    importFunc().catch((err) => {
      console.error("Chunk load failed, reloading app...", err);
      window.location.reload();  // Try fresh load
      return new Promise(() => {});  // Prevent further errors
    })
  );

const Home = loadable(() => import('./Screens/HomeScreen/Home'));
const HomeScreen =loadable(()=>import('./Screens/HomeScreen/HomeScreen'));
const FundRelListEditForm =loadable(()=>import('./Screens/FUND_RELEASE/FundRelListEditForm'));
const FundExpListEditForm =loadable(()=>import('./Screens/FUND_EXP/FundExpListEditForm'));
const UCListEditForm =loadable(()=>import('./Screens/UC/UCListEditForm'));
const PRView =loadable(()=>import('./Screens/Progress_Report/PRView'));
const PRDetails =loadable(()=>import('./Screens/Progress_Report/PRDetails'));
const PRComp =loadable(()=>import('./Screens/Progress_Report/PRComp'));
const MASTERComp =loadable(()=>import('./Screens/MASTER/MASTERComp'));
const SECTOR_ADD_EDITForm =loadable(()=>import('./Screens/MASTER/SECTOR_ADD_EDITForm'));

const SOUR_OF_FUN_Form =loadable(()=>import('./Screens/MASTER/SOUR_OF_FUN_Form'));
const IMPL_AGEN_Form =loadable(()=>import('./Screens/MASTER/IMPL_AGEN_Form'));
const ACC_HEAD_Form =loadable(()=>import('./Screens/MASTER/ACC_HEAD_Form'));
const REPORTComp =loadable(()=>import('./Screens/REPORTS/REPORTComp'));
const Financial_Report =loadable(()=>import('./Screens/REPORTS/Financial_Report'));
const HeadAccountwise_Report =loadable(()=>import('./Screens/REPORTS/HeadAccountwise_Report'));
const Financial_Report_Graph =loadable(()=>import('./Screens/REPORTS/Financial_Report_Graph'));
const HeadAccountwise_Report_Graph =loadable(()=>import('./Screens/REPORTS/HeadAccountwise_Report_Graph'));
const USERComp =loadable(()=>import('./Screens/USER_MANAGE/USERComp'));
const UserManage =loadable(()=>import('./Screens/USER_MANAGE/UserManage'));
const ProfileComp =loadable(()=>import('./Screens/PROFILE_MANAGE/ProfileComp'));
const ChangePass =loadable(()=>import('./Screens/PROFILE_MANAGE/ChangePass'));
const Sector_Report =loadable(()=>import('./Screens/REPORTS/Sector_Report'));
const Sector_Report_Graph =loadable(()=>import('./Screens/REPORTS/Sector_Report_Graph'));
const District_Report =loadable(()=>import('./Screens/REPORTS/District_Report'));
const District_Report_Graph =loadable(()=>import('./Screens/REPORTS/District_Report_Graph'));
const Implement_Report =loadable(()=>import('./Screens/REPORTS/Implement_Report'));
const Implement_Report_Graph =loadable(()=>import('./Screens/REPORTS/Implement_Report_Graph'));

const DERTMENT_ADD =loadable(()=>import('./Screens/MASTER/DERTMENT_ADD'));
const DESIGNATION_ADD =loadable(()=>import('./Screens/MASTER/DESIGNATION_ADD'));
const UserProfile =loadable(()=>import('./Screens/PROFILE_MANAGE/UserProfile'));
const Project_Submitted_By_Form =loadable(()=>import('./Screens/MASTER/Project_Submitted_By_Form'));
const PCRView =loadable(()=>import('./Screens/PCR_Generate/PCRView'));
const PCRComp =loadable(()=>import('./Screens/PCR_Generate/PCRComp'));
const PCRForm =loadable(()=>import('./Screens/PCR_Generate/PCRForm'));
const UC_Comp =loadable(()=>import('./Screens/UC_Generate/UC_Comp'));
const UC_View =loadable(()=>import('./Screens/UC_Generate/UC_View'));
const UC_Form =loadable(()=>import('./Screens/UC_Generate/UC_Form'));
const Annex_Comp =loadable(()=>import('./Screens/ANNEXURE/Annex_Comp'));
const Annex_View =loadable(()=>import('./Screens/ANNEXURE/Annex_View'))
const Annex_Form =loadable(()=>import('./Screens/ANNEXURE/Annex_Form'))
const ProjectStatusView =loadable(()=>import('./Screens/Project_Status/ProjectStatusView'))
const ProjectStatusComp =loadable(()=>import('./Screens/Project_Status/ProjectStatusComp'))
const ProjectStatusDetails =loadable(()=>import('./Screens/Project_Status/ProjectStatusDetails'))

const FundRelForm =loadable(()=>import('./Screens/FUND_RELEASE/FundRelForm'))
const Sign_in =loadable(()=>import('./Screens/Auth/Sign_in'))
const AdApForm =loadable(()=>import('./Screens/ADMIN_APPROVAL/AdApForm'))
const TFForm =loadable(()=>import('./Screens/TENDER_FORMALITY/TFForm'))
const FundExpForm =loadable(()=>import('./Screens/FUND_EXP/FundExpForm'))
const UCForm =loadable(()=>import('./Screens/UC/UCForm'))
const Auth = loadable(()=>import('./Screens/Auth/Auth'))
const AdApComp = loadable(()=>import('./Screens/ADMIN_APPROVAL/AdApComp'))
const AdApView = loadable(()=>import('./Screens/ADMIN_APPROVAL/AdApView'))
const TFComp = loadable(()=>import('./Screens/TENDER_FORMALITY/TFComp'))
const TFView = loadable(()=>import('./Screens/TENDER_FORMALITY/TFView'))
const FundRelComp = loadable(()=>import('./Screens/FUND_RELEASE/FundRelComp'))
const FundRelView = loadable(()=>import('./Screens/FUND_RELEASE/FundRelView'))
const FundExpView = loadable(()=>import('./Screens/FUND_EXP/FundExpView'))
const FundExpComp = loadable(()=>import('./Screens/FUND_EXP/FundExpComp'))
const UCComp = loadable(()=>import('./Screens/UC/UCComp'))
const UCView = loadable(()=>import('./Screens/UC/UCView'))

const AgencyComp =loadable(()=>import('./Screens/MANAGE_Agency/AgencyComp'));
const AgencyManage =loadable(()=>import('./Screens/MANAGE_Agency/AgencyManage'));

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
      path: "home/",
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
          path: "pcr",
          element: <PCRComp />,
          children: [
            {
              path: "",
              element: <PCRView />,
            },
            {
              path: "pcr-add/:id",
              element: <PCRForm />,
            },
            // {
            //   path: "tftenderlist",
            //   element: <TFTenderList />,
            // }
          ]
        },
        {
          path: "uc_c",
          element: <UC_Comp />,
          children: [
            {
              path: "",
              element: <UC_View />,
            },
            {
              path: "uc-add/:id",
              element: <UC_Form />,
            }
          ]
        },
        {
          path: "annex",
          element: <Annex_Comp />,
          children: [
            {
              path: "",
              element: <Annex_View />,
            },
            {
              path: "annex-add/:id",
              element: <Annex_Form />,
            }
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
          path: "project-status",
          element: <ProjectStatusComp />,
          children: [
            {
                path: "",
                element: <ProjectStatusView />,
            },
            {
              path: "prostatus-details/:id",
              element: <ProjectStatusDetails />,
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
            {
              path: "project-submitted",
              element: <Project_Submitted_By_Form />,
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
          path: "agency",
          element: <AgencyComp />,
          children: [
            {
                path: "manage-agency",
                element: <AgencyManage />,
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

            // {
            //   path: "financial-report_test/:id",
            //   element: <Financial_Report__test />,
            // },
            
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
  {/* <React.StrictMode> */}
    {/* <App /> */}
    <RouterProvider router={router} />

  {/* </React.StrictMode> */}
  </Democontext>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


