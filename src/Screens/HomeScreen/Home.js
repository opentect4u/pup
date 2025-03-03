import React from 'react'
import Header from '../../Components/Header'
import Sidebar from '../../Components/Sidebar'
import { Outlet } from 'react-router-dom'
import Footer from '../../Components/Footer'
import { ScrollTop } from 'primereact/scrolltop'
import ErrorBoundary from 'antd/es/alert/ErrorBoundary'
function Home() {
  return (
    <div>
      <Header />
     <Sidebar />

    <div className="p-6 sm:ml-64 bg-slate-200 min-h-screen ">
      <div
        className={
         "border-2 h-auto  bg-white shadow-sm border-slate-200 rounded-xl dark:border-gray-700 "
        }
      >
        {/* {pathnames?.length > 1 && (
          <BreadCrumb model={pathnames} className="text-xs" />
        )} */}
        <ErrorBoundary
          FallbackComponent={Error}
          onError={(error) => {
            console.error(error);
          }}
        >
          <ScrollTop style={{ backgroundColor: "#1E3A8A", height:'50px', width:'50px', borderRadius:50, color:'white'  }} />

          <Outlet />
        </ErrorBoundary>
      </div>
    </div>
  </div>
  )
}

export default Home
