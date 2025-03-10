import React, { useEffect, useRef, useState } from "react";
import TDInputTemplate from "../../Components/TDInputTemplate";
import BtnComp from "../../Components/BtnComp";
import Heading from "../../Components/Heading";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Message } from "../../Components/Message";
import { EditOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import { auth_key, url } from "../../Assets/Addresses/BaseUrl";
import VError from "../../Components/VError";
import { Spin } from "antd";

const initialValues = { agency_name: "" };

const validationSchema = Yup.object({
  agency_name: Yup.string().required("Implementing Agency is Required"),
});

function IMPL_AGEN_Form() {
  const [loading, setLoading] = useState(false);
  const [tableDataList, setTableDataList] = useState([]);
  const [agencyDropList, setAgencyDropList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingAgency, setEditingAgency] = useState(null); // New state for editing
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const fetchAgencyDropdownOption = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${url}index.php/webApi/Mdapi/impagency`, {}, {
        headers: { auth_key },
      });

      console.log(response?.data, 'ggggggggggggg');
      
      if (response?.data?.status > 0) {
        setTableDataList(response?.data?.message);
        setAgencyDropList(response?.data?.message);
      } else {
        setTableDataList([]);
        setAgencyDropList([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };



  const addAgency = async () => {
    setLoading(true);
      
    const formData = new FormData();
    // Append each field to FormData
    formData.append("agency_name", formik.values.agency_name);
    formData.append("created_by", "SSS Name Created By");
    
        try {
    
          const response = await axios.post( `${url}index.php/webApi/Mdapi/impAdd`, 
          formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                'auth_key': auth_key // Important for FormData
              },
            }
          );

          console.log(response?.data?.status, 'ggggggggggg');
          
  
          if(response?.data?.status > 0) {
            Message("success", "Updated successfully.");
            setLoading(false);
            formik.resetForm();
            fetchAgencyDropdownOption()
          }
  
          if(response?.data?.status < 1) {
          setLoading(false);
          }

        
  
          
          
        } catch (error) {
          setLoading(false);
          Message("error", "Error Submitting Form:");
          console.error("Error submitting form:", error);
        }

  };

  const updateAgency = async () => {
    setLoading(true);

    const formData = new FormData();
          // Append each field to FormData
          formData.append("agency_name", formik.values.agency_name);
          formData.append("id", editingAgency.id);
          formData.append("modified_by", "SSS Name Modified By");

          console.log(formData, 'ggggggggggg', editingAgency, 'llll', formik.values.agency_name);
          
        try {
    
          const response = await axios.post( `${url}index.php/webApi/Mdapi/impedit`, 
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                'auth_key': auth_key // Important for FormData
              },
            }
          );

          console.log(response?.data, 'tttttttttttttttt');
          
  
          if(response?.data?.status > 0) {
            Message("success", "Updated successfully.");
            setLoading(false);
            formik.resetForm();
            fetchAgencyDropdownOption()
          }
  
          if(response?.data?.status < 1) {
          setLoading(false);
          }
          
          
        } catch (error) {
          setLoading(false);
          Message("error", "Error Submitting Form:");
          console.error("Error submitting form:", error);
        }

  };


  

  const onSubmit = (values) => {
    console.log(editingAgency === null, 'ggggggggggg - yyyyyyyyyy', editingAgency != null);
    // if(editingAgency)
    if(editingAgency === null){
      addAgency();
    }

    if(editingAgency != null){
      updateAgency();
    }
    
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    enableReinitialize: true,
    validateOnMount: true,
  });

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filteredData = tableDataList.filter((data) =>
      data?.agency_name?.toLowerCase().includes(value)
    );
    setAgencyDropList(filteredData);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(agencyDropList.length / rowsPerPage);
  const currentTableData = agencyDropList.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (agency) => {
    console.log(agency, 'sector');
    
    setEditingAgency(agency);
    formik.setFieldValue("agency_name", agency?.agency_name);
  };

  useEffect(() => {
    fetchAgencyDropdownOption();
  }, []);


  return (
    <section className="bg-white p-5 dark:bg-gray-900">
      <div className="py-5 mx-auto w-full lg:py-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <Heading title={editingAgency ? "Edit Implementing Agency" : "Add Implementing Agency"} button="N" />
            <form onSubmit={formik.handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-12 sm:gap-6">
                <div className="sm:col-span-4">
                  <TDInputTemplate
                    placeholder="Add Implementing Agency"
                    type="text"
                    label="Add Implementing Agency"
                    name="agency_name"
                    formControlName={formik.values.agency_name}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    mode={1}
                  />
                  {formik.errors.agency_name && formik.touched.agency_name && (
                    <VError title={formik.errors.agency_name} />
                  )}
                </div>
                <div className="sm:col-span-12 flex justify-left gap-1 mt-4">
                  <BtnComp
                    type="submit"
                    title={editingAgency ? "Update" : "Submit"}
                    width="w-1/6"
                    bgColor="bg-blue-900"
                    onClick={() => { }}
                  />
                  <BtnComp
                    title="Reset"
                    type="reset"
                    onClick={() => {
                      formik.resetForm();
                      setEditingAgency(null);
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
                setEditingAgency(null);
                }}
                width={'w-1/6'} bgColor={'bg-white'} color="text-blue-900" border={'border-2 border-blue-900'} /> */}
                
                </div>
              </div>
            </form>
          </div>

          <div className="col-span-1">
            <Spin spinning={loading}>
              <div className="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
                <div className="flex items-center p-4 bg-blue-900">
                  <h2 className="text-xl font-bold text-white">Implementing Agency</h2>
                  <input
                    type="text"
                    className="ml-auto bg-blue-950 border text-white text-sm rounded-lg p-2"
                    placeholder="Search By Implementing Agency"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-200">
                    <tr>
                      <th className="px-4 py-3">Sl.No.</th>
                      <th className="px-4 py-3">Implementing Agency</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTableData.map((data, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-3">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                        <td className="px-4 py-3">{data?.agency_name}</td>
                        <td className="px-4 py-3">
                          <button
                            className="text-blue-700 border px-3 py-1.5 rounded-lg"
                            onClick={() => handleEdit(data)}
                          >
                            <EditOutlined />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
                <div className="flex justify-between p-4">
  <span className="text-sm text-gray-500">
  Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, agencyDropList.length)} of {agencyDropList.length}
  </span>
  <div className="flex space-x-2 pagination">
  {Array.from({ length: totalPages }, (_, index) => (
  <button
  key={index}
  className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'}`}
  onClick={() => handlePageChange(index + 1)}
  >
  {index + 1}
  </button>
  ))}
  </div>
  </div>



              </div>
            </Spin>
          </div>
        </div>
      </div>
    </section>
  );
}

export default IMPL_AGEN_Form;
