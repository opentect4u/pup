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
import { Select, Spin } from "antd";
import { Dialog } from "primereact/dialog";
import Radiobtn from "../../Components/Radiobtn";
import { getLocalStoreTokenDts } from "../../CommonFunction/getLocalforageTokenDts";
import { useNavigate } from "react-router-dom";


const initialValues = { 
  agency_name: "",
  contact_no: "",
  address: "",
  registration_no: "",
  gst_no: "",
  pan_no: "",
  bank_acc_no: "",
  ifsc_code: "",
 };

const validationSchema = Yup.object({
  agency_name: Yup.string().required("Name of Agency is Required"),
  contact_no: Yup.string().required("Contact No. is Required"),
  address: Yup.string().required("Address is Required"),
  registration_no: Yup.string().required("Registration No. is Required"),

  gst_no: Yup.string().required("GST No. is Required"),
  pan_no: Yup.string().required("PAN No. is Required"),
  bank_acc_no: Yup.string().required("District is Required"),
  ifsc_code: Yup.string().required("Depertment is Required"),
});

function AgencyManage() {
  const [loading, setLoading] = useState(false);
  const [tableDataList, setTableDataList] = useState([]);
  const [agencyList, setAgencyList] = useState([]);
  const [userDataLocalStore, setUserDataLocalStore] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSector, setEditingSector] = useState(false); // New state for editing
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [districtDropList, setDistrictDropList] = useState([]);
  const [depertment, setDepertment] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [radiReset_pass, setRadiReset_pass] = useState("N")
  const [user_status, setUser_status] = useState("A")
  const [agencyID, setAgencyID] = useState("");
  const navigate = useNavigate()

  const fetchAgencyList = async () => {
    setLoading(true);
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    formData.append("agency_id", '0');
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    try {
      const response = await axios.post(`${url}index.php/webApi/Mdapi/agencyList`, formData, {
        headers: { 
          auth_key,
          'Authorization': `Bearer ` + tokenValue?.token
        },
      });

      console.log(response?.data?.message, 'response');
      if (response?.data?.status > 0) {
        
        
        setTableDataList(response?.data?.message);
        setAgencyList(response?.data?.message);
      } else {
        setTableDataList([]);
        setAgencyList([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      
      localStorage.removeItem("user_dt");
      navigate('/')
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const userData = localStorage.getItem("user_dt");

    if (userData) {
      setUserDataLocalStore(JSON.parse(userData))
    } else {
      setUserDataLocalStore([])
    console.log("No User Data Found");
    }
    
    fetchAgencyList();
  }, []);

  const addUser = async (submitStatus, agencyID) => {
    setLoading(true);


    console.log(submitStatus, agencyID, 'agencyID');
    
    
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    // Append each field to FormData
    formData.append("agency_id", agencyID);
    // formData.append("agency_id", {submitStatus == 'add_agency' ? '0' : });
    formData.append("agency_name", formik.values.agency_name);
    formData.append("ph_no", formik.values.contact_no);
    formData.append("address", formik.values.address);
    formData.append("reg_no", formik.values.registration_no);
    formData.append("gst_no", formik.values.gst_no);
    formData.append("pan_no", formik.values.pan_no);
    formData.append("acc_no", formik.values.bank_acc_no);
    formData.append("ifs_code", formik.values.ifsc_code);
    
    formData.append("created_by", userDataLocalStore.user_id);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token
    
        try {
    
          const response = await axios.post( `${url}index.php/webApi/Mdapi/agencySave`, 
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
            Message("success", "Updated successfully.");
            setLoading(false);
            formik.resetForm();
            setAgencyID('')
            setEditingSector(false)
            fetchAgencyList()
          }
  
          if(response?.data?.status < 1) {
          setLoading(false);
          Message("error", response?.data?.message);
          }

        
  
          
          
        } catch (error) {
          setLoading(false);
          Message("error", "Error Submitting Form:");
          console.error("Error submitting form:", error);
          
      localStorage.removeItem("user_dt");
      navigate('/')
        }

  };

  const generateEditList = async (agency_id) => {
    setLoading(true);
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    formData.append("agency_id", agency_id);
    formData.append("created_by", userDataLocalStore.user_id);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token
    
        try {
    
          const response = await axios.post( `${url}index.php/webApi/Mdapi/agencyList`, 
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
            console.log(response, 'responseresponseresponse', response?.data?.message[0]?.agency_name);

            // Then, update the form field with the district ID from API response
            formik.setFieldValue("agency_name", response?.data?.message[0]?.agency_name);
            formik.setFieldValue("contact_no", response?.data?.message[0]?.ph_no);
            formik.setFieldValue("registration_no", response?.data?.message[0]?.reg_no);
            formik.setFieldValue("gst_no", response?.data?.message[0]?.gst_no);
            formik.setFieldValue("pan_no", response?.data?.message[0]?.pan_no);
            formik.setFieldValue("bank_acc_no", response?.data?.message[0]?.acc_no);
            formik.setFieldValue("ifsc_code", response?.data?.message[0]?.ifs_code);
            formik.setFieldValue("address", response?.data?.message[0]?.address);
            setLoading(false);
          }
  
          if(response?.data?.status < 1) {
          setLoading(false);
          // Message("error", response?.data?.message);
          }

          } catch (error) {
          setLoading(false);
          Message("error", "Error Submitting Form:");
          console.error("Error submitting form:", error);

          localStorage.removeItem("user_dt");
          navigate('/')
          }

  };

  const updateUser = async () => {
    setLoading(true);
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    // Append each field to FormData
    formData.append("agency_name", formik.values.agency_name);
    formData.append("address", formik.values.address);
    formData.append("name", formik.values.registration_no);

    formData.append("dept_id", formik.values.ifsc_code);
    formData.append("dist_id", formik.values.bank_acc_no);
    formData.append("email_id", formik.values.gst_no);
    formData.append("mobile", formik.values.pan_no);

    formData.append("user_status", user_status);
    formData.append("reset_pass", radiReset_pass);


    formData.append("modified_by", userDataLocalStore.user_id);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token
    
      // try {

      // const response = await axios.post( `${url}index.php/webApi/User/userEdit`, 
      // formData,
      // {
      // headers: {
      // "Content-Type": "multipart/form-data",
      // 'auth_key': auth_key,
      // 'Authorization': `Bearer ` + tokenValue?.token
      // },
      // }
      // );



      // if(response?.data?.status > 0) {
      // Message("success", "Updated successfully.");
      // setLoading(false);
      // formik.resetForm();
      // fetchSectorDropdownOption()
      // }

      // if(response?.data?.status < 1) {
      // setLoading(false);
      // Message("error", response?.data?.message);
      // }





      // } catch (error) {
      // setLoading(false);
      // Message("error", "Error Submitting Form:");
      // console.error("Error submitting form:", error);

      // localStorage.removeItem("user_dt");
      // navigate('/')
      // }

  };


   const onSubmit = (values) => {
    console.log(values, 'onSubmit');
    
    if(editingSector === false){
      addUser('add_agency', '0');
    }

    if(editingSector === true){
      // updateUser();
      addUser('update_agency', agencyID);
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
    setAgencyList(filteredData);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(agencyList.length / rowsPerPage);
  const currentTableData = agencyList.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (data) => {
    setModalTitle(data?.agency_name)
    setEditingSector(true);
    console.log(data?.agency_id, 'handleEdit');
    setAgencyID(data?.agency_id)
    
    generateEditList(data?.agency_id)
    
  };







  return (
    <section className="bg-white p-5 dark:bg-gray-900">
      <div className="py-5 mx-auto w-full lg:py-5">
        <div className="grid grid-cols-1 gap-4">
          <div className="col-span-1">
            
          
            <>
            {/* {JSON.stringify(editingSector, null, 2)} /// {JSON.stringify(agencyID, null, 2)}  */}

            <Heading title={editingSector === false ? "Add Agency" : "Edit Agency " + modalTitle} button="N" />
            <form onSubmit={formik.handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-12 sm:gap-6">
                <div className="sm:col-span-3">
                  <TDInputTemplate
                    placeholder="Name of Agency"
                    type="text"
                    label="Name of Agency"
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

                <div className="sm:col-span-3">
                <TDInputTemplate
                placeholder="Contact No."
                type="number"
                label="Contact No."
                name="contact_no"
                formControlName={formik.values.contact_no}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
                />
                {formik.errors.contact_no && formik.touched.contact_no && (
                <VError title={formik.errors.contact_no} />
                )}
                </div>
                
                
        

            <div className="sm:col-span-3">
                  <TDInputTemplate
                    placeholder="Registration No."
                    type="text"
                    label="Registration No."
                    name="registration_no"
                    formControlName={formik.values.registration_no}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    mode={1}
                  />
                  {formik.errors.registration_no && formik.touched.registration_no && (
                    <VError title={formik.errors.registration_no} />
                  )}
                </div>


                <div className="sm:col-span-3">
                  <TDInputTemplate
                    placeholder="GST No."
                    type="gst_no"
                    label="GST No."
                    name="gst_no"
                    formControlName={formik.values.gst_no}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    mode={1}
                  />
                  {formik.errors.gst_no && formik.touched.gst_no && (
                    <VError title={formik.errors.gst_no} />
                  )}
                </div>

                <div className="sm:col-span-3">
                  <TDInputTemplate
                    placeholder="PAN No."
                    type="text"
                    label="PAN No."
                    name="pan_no"
                    formControlName={formik.values.pan_no}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    mode={1}
                  />
                  {formik.errors.pan_no && formik.touched.pan_no && (
                    <VError title={formik.errors.pan_no} />
                  )}
                </div>

              <div class="sm:col-span-3">
              <TDInputTemplate
                    placeholder="Bank A/C No."
                    type="number"
                    label="Bank A/C No."
                    name="bank_acc_no"
                    formControlName={formik.values.bank_acc_no}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    mode={1}
                  />
                  {formik.errors.bank_acc_no && formik.touched.bank_acc_no && (
                    <VError title={formik.errors.bank_acc_no} />
                  )}

            </div>

            <div class="sm:col-span-3">
            <TDInputTemplate
            placeholder="IFSC Code"
            type="text"
            label="IFSC Code"
            name="ifsc_code"
            formControlName={formik.values.ifsc_code}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            mode={1}
            />
            {formik.errors.ifsc_code && formik.touched.ifsc_code && (
            <VError title={formik.errors.ifsc_code} />
            )}
            </div>

            <div class="sm:col-span-12">
              <TDInputTemplate
                type="text"
                placeholder="Address"
                label="Address"
                name="address"
                formControlName={formik.values.address}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={3}
                required={true}
              />
              {formik.errors.address && formik.touched.address && (
                <VError title={formik.errors.address} />
              )}
            </div>
                
                <div className="sm:col-span-12 flex justify-left gap-1 mt-0">
                  <BtnComp
                    type="submit"
                    title={editingSector === false ? "Submit" : "Update"}
                    width="w-1/6"
                    bgColor="bg-blue-900"
                    onClick={() => { }}
                  />
                  <BtnComp
                    title="Reset"
                    type="reset"
                    onClick={() => {
                      formik.resetForm();
                      // setEditingSector(null);
                      setEditingSector(false)
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
          
          {/* {JSON.stringify(currentTableData, null, 2)} */}
          <div className="col-span-1">
            <Spin spinning={loading}>
              <div className="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
                <div className="flex items-center p-4 bg-blue-900">
                  <h2 className="text-xl font-bold text-white">Agency List</h2>
                  <input
                    type="text"
                    className="ml-auto bg-blue-950 border text-white text-sm rounded-lg p-2"
                    placeholder="Search by Sector"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-200">
                    <tr>
                      <th className="px-4 py-3">Sl.No.</th>
                      <th className="px-4 py-3">Name of Agency</th>
                      <th className="px-4 py-3">Contact No.</th>
                      <th className="px-4 py-3">Registration No.</th>

                      <th className="px-4 py-3">GST No.</th>
                      <th className="px-4 py-3">PAN No.</th>
                      <th className="px-4 py-3">Bank A/C No.</th>

                      <th className="px-4 py-3">IFSC Code</th>
                      <th className="px-4 py-3">Address</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTableData.map((data, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-3">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                        <td className="px-4 py-3">{data?.agency_name}</td>
                        <td className="px-4 py-3">{data?.ph_no}</td>
                        <td className="px-4 py-3">{data?.reg_no}</td>

                        <td className="px-4 py-3">{data?.gst_no}</td>
                        <td className="px-4 py-3">{data?.pan_no}</td>
                        <td className="px-4 py-3">{data?.acc_no}</td>

                        <td className="px-4 py-3">{data?.ifs_code} </td>
                        <td className="px-4 py-3">{data?.address} </td>
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
  Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, agencyList.length)} of {agencyList.length}
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


      {/* <Dialog
        // header={modalTitle}
        visible={editingSector}
        style={{ width: "70vw", maxWidth: "800px" }}
        onHide={() => setEditingSector(false)}
        dismissableMask={true}
      >
        <>
        Coming Soon
        </>
        
      </Dialog> */}
    </section>
  );
}

export default AgencyManage;
