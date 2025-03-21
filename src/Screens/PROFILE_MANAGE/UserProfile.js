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

const userTypes = {
  S: 'Super Admin',
  A: 'Admin',
  U: 'User',
  F: 'Field User',
  
  
};

const reset_pass = [
	{
		label: "Yes",
		value: "Y",
	},
	{
		label: "No",
		value: "N",
	}
]

const user_status_form = [
	{
		label: "Active",
		value: "A",
	},
	{
		label: "In Active",
		value: "I",
	}
]

const userTypes_Form = [
  { user_val: "S", userTypeNam: "Super Admin" },
  { user_val: "A", userTypeNam: "Admin" },
  { user_val: "U", userTypeNam: "User" },
  { user_val: "F", userTypeNam: "Field User" },
];

const userStatus = {
  A: 'Active',
  I: 'In Active',
};

const initialValues = { 
  user_id: "",
  user_type: "",
  user_name: "",
  email: "",
  phon: "",
  dis: "",
  depert: "",
  desig: "",
 };

const validationSchema = Yup.object({
  user_id: Yup.string(),
  user_type: Yup.string(),
  user_name: Yup.string(),

  email: Yup.string(),
  phon: Yup.string(),
  dis: Yup.string(),
  depert: Yup.string(),
  desig: Yup.string(),
});

function UserProfile() {
  const [formValues, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [tableDataList, setTableDataList] = useState([]);
  const [sectorDropList, setSectorDropList] = useState([]);
  const [userDataLocalStore, setUserDataLocalStore] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSector, setEditingSector] = useState(false); // New state for editing
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [districtDropList, setDistrictDropList] = useState([]);
  const [depertment, setDepertment] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [radiReset_pass, setRadiReset_pass] = useState("N")
  const [user_status, setUser_status] = useState("A")

  const fetchSectorDropdownOption = async () => {
    setLoading(true);

    const formData = new FormData();
    // Append each field to FormData
    formData.append("user_id", userDataLocalStore.user_id);

    try {
      const response = await axios.post(`${url}index.php/webApi/User/userdata`, formData, {
        headers: { auth_key },
      });

      console.log(response?.data?.message, 'hhhhhhhttttttttttttttthhhhh', userDataLocalStore.user_id);

      if (response?.data?.status > 0) {
        
        // setTableDataList(response?.data?.message);
        // setSectorDropList(response?.data?.message);
        setValues({
          user_id: userDataLocalStore.user_id,
          user_type: response.data.message.user_type,
          user_name: response.data.message.name,
          email: response.data.message.email_id,
          phon: response.data.message.mobile,
          dis: response.data.message.dist_id,
          depert: response.data.message.dept_id,
          desig: response.data.message.desig_id,
        })
      } else {
        setTableDataList([]);
        setSectorDropList([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDistrictdownOption = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Mdapi/dist',
        {}, // Empty body
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      // console.log("Response Data__:", response.data.message); // Log the actual response data
      setDistrictDropList(response.data.message)
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error); // Handle errors properly
    }
  };

  const fetchDepertment = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Mdapi/department',
        {}, // Empty body
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      // console.log("Response Data__:", response.data.message); // Log the actual response data
      setDepertment(response.data.message)
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error); // Handle errors properly
    }
  };

  const fetchDesignation = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Mdapi/designation',
        {}, // Empty body
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      // console.log("Response Data__:", response.data.message); // Log the actual response data
      setDesignation(response.data.message)
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error); // Handle errors properly
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user_dt");

    if (userData) {
      setUserDataLocalStore(JSON.parse(userData))
    console.log("User Data Found:", userData);
    } else {
      setUserDataLocalStore([])
    console.log("No User Data Found");
    }
    
    fetchDistrictdownOption();
    // fetchSectorDropdownOption();
    fetchDepertment();
    fetchDesignation();
  }, []);


  useEffect(() => {
    
    fetchSectorDropdownOption();
  }, [userDataLocalStore]);

  const addUser = async () => {
    setLoading(true);
      
    const formData = new FormData();
    // Append each field to FormData
    formData.append("user_id", formik.values.user_id);
    formData.append("user_type", formik.values.user_type);
    formData.append("name", formik.values.user_name);

    formData.append("dept_id", formik.values.depert);
    formData.append("desig_id", formik.values.desig);
    formData.append("dist_id", formik.values.dis);
    formData.append("email_id", formik.values.email);
    formData.append("mobile", formik.values.phon);


    formData.append("created_by", userDataLocalStore.user_id);
    
        try {
    
          const response = await axios.post( `${url}index.php/webApi/User/userAdd`, 
          formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                'auth_key': auth_key // Important for FormData
              },
            }
          );

          console.log(response, 'gggggtttttttttttttgggggg', formData);
          
  
          if(response?.data?.status > 0) {
            Message("success", "Updated successfully.");
            setLoading(false);
            formik.resetForm();
            fetchSectorDropdownOption()
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

  const generateEditList = async (user_id) => {
    setLoading(true);
      
    const formData = new FormData();
    formData.append("user_id", user_id);



    formData.append("created_by", userDataLocalStore.user_id);
    
        try {
    
          const response = await axios.post( `${url}index.php/webApi/User/userdata`, 
          formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                'auth_key': auth_key // Important for FormData
              },
            }
          );

          console.log(response?.data?.message, 'gggggtttttttttttttgggggg', formData);
          
  
          if(response?.data?.status > 0) {
            // Message("success", "Updated successfully.");
            // await fetchDistrictdownOption();

            // Then, update the form field with the district ID from API response
            formik.setFieldValue("dis", response?.data?.message.dist_id);
            formik.setFieldValue("depert", response?.data?.message.dept_id);
            formik.setFieldValue("desig", response?.data?.message.desig_id);

            formik.setFieldValue("user_id", response?.data?.message.user_id);
            formik.setFieldValue("user_type", response?.data?.message.user_type);
            formik.setFieldValue("user_name", response?.data?.message.name);
            formik.setFieldValue("email", response?.data?.message.email_id);
            formik.setFieldValue("phon", response?.data?.message.mobile);
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
        }

  };

  const updateUser = async () => {
    setLoading(true);
      
    const formData = new FormData();
    // Append each field to FormData
    formData.append("user_id", formik.values.user_id);
    formData.append("user_type", formik.values.user_type);
    formData.append("name", formik.values.user_name);

    formData.append("dept_id", formik.values.depert);
    formData.append("desig_id", formik.values.desig);
    formData.append("dist_id", formik.values.dis);
    formData.append("email_id", formik.values.email);
    formData.append("mobile", formik.values.phon);

    formData.append("user_status", user_status);
    formData.append("reset_pass", radiReset_pass);


    formData.append("modified_by", userDataLocalStore.user_id);
    
        try {
    
          const response = await axios.post( `${url}index.php/webApi/User/userEdit`, 
          formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                'auth_key': auth_key // Important for FormData
              },
            }
          );

          console.log(response, 'rrrrrrrrrrrrrrrrrrrr', formData);
          
  
          if(response?.data?.status > 0) {
            Message("success", "Updated successfully.");
            setLoading(false);
            formik.resetForm();
            fetchSectorDropdownOption()
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
    // console.log(editingSector === null, 'ggggggggggg - yyyyyyyyyy', editingSector != null);
    // if(editingSector)
    if(editingSector === false){
      addUser();
    }

    if(editingSector === true){
      updateUser();
      // addSector();
    }
    
  };

  const formik = useFormik({
    // initialValues,
    initialValues: formValues,
    onSubmit,
    validationSchema,
    enableReinitialize: true,
    validateOnMount: true,
  });

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filteredData = tableDataList.filter((data) =>
      data?.name?.toLowerCase().includes(value)
    );
    setSectorDropList(filteredData);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(sectorDropList.length / rowsPerPage);
  const currentTableData = sectorDropList.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (data) => {
    // console.log(data, 'sector');
    setModalTitle(data?.name)
    setEditingSector(true);
    generateEditList(data?.user_id)
    
  };

  const onChange_status = (e) => {
   setUser_status(e)
  }

  const onChange_reset = (e) => {
    setRadiReset_pass(e)
  }
  






  return (
    <section className="bg-white p-5 dark:bg-gray-900">
      <div className="py-5 mx-auto w-full lg:py-5">
        <div className="grid grid-cols-1 gap-4">
          <div className="col-span-1">
            
          
            <>
            <Heading title={editingSector === false ? "User Profile" : "Edit User Profile " + modalTitle} button="N" />
            <form onSubmit={formik.handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-12 sm:gap-6">
                <div className="sm:col-span-3">
                  <TDInputTemplate
                    placeholder="User ID"
                    type="text"
                    label="User ID"
                    name="user_id"
                    formControlName={formik.values.user_id}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    mode={1}
                    // disabled = {editingSector === true ? true : false}
                    disabled = {true}
                  />
                 
                </div>

                
                <div class="sm:col-span-3">
                {/* userTypes */}


<TDInputTemplate
                    placeholder="User Typr"
                    type="text"
                    label="User Type"
                    name="user_type"
                    // formControlName={formik.values.user_type }
                    formControlName={formik.values.user_type === 'U' ? userTypes.U : formik.values.user_type === 'S' ? userTypes.S : formik.values.user_type === 'F' ? userTypes.F : formik.values.user_type === 'A' ? userTypes.A : 'Unknown'}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    mode={1}
                    // disabled = {editingSector === true ? true : false}
                    disabled = {true}
                  />
            </div>

            <div className="sm:col-span-3">
                  <TDInputTemplate
                    placeholder="User Name"
                    type="text"
                    label="User Name"
                    name="user_name"
                    formControlName={formik.values.user_name}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    mode={1}
                  />
                  
                </div>


                <div className="sm:col-span-3">
                  <TDInputTemplate
                    placeholder="Email"
                    type="email"
                    label="Email"
                    name="email"
                    formControlName={formik.values.email}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    mode={1}
                  />
                  
                </div>

                <div className="sm:col-span-3">
                  <TDInputTemplate
                    placeholder="Phone No"
                    type="number"
                    label="Phone No"
                    name="phon"
                    formControlName={formik.values.phon}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    mode={1}
                  />
                  
                </div>

                <div class="sm:col-span-3">

              <label for="dis" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Choose District</label>
              <Select
                placeholder="Choose District"
                value={formik.values.dis || undefined} // Ensure default empty state
                onChange={(value) => {
                  formik.setFieldValue("dis", value)
                  // setDistrict_ID(value)
                  console.log(value, 'disdisdis');
                }}
                onBlur={formik.handleBlur}
                style={{ width: "100%" }}
              >
                <Select.Option value="" disabled> Choose District </Select.Option>
                {districtDropList?.map(data => (
                  <Select.Option key={data.dist_code} value={data.dist_code}>
                    {data.dist_name} {data.dist_code}
                  </Select.Option>
                ))}
              </Select>
              
            </div>

            <div class="sm:col-span-3">
            <label for="depert" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Choose Depertment ID</label>
              <Select
                placeholder="Choose Depertment ID"
                value={formik.values.depert || undefined} // Ensure default empty state
                onChange={(value) => {
                  formik.setFieldValue("depert", value)
                  // setDistrict_ID(value)
                  // formik.setFieldValue("block", "");
                  // setBlockDropList([]);
                  // setBlockDropList_Load([]);
                  console.log(value, 'disdisdis');
                }}
                onBlur={formik.handleBlur}
                style={{ width: "100%" }}
              >
                <Select.Option value="" disabled> Choose Depertment ID </Select.Option>
                {depertment?.map(data => (
                  <Select.Option key={data.sl_no} value={data.sl_no}>
                    {data.dept_name}
                  </Select.Option>
                ))}
              </Select>
              
            </div>

            <div class="sm:col-span-3">
            <label for="desig" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Choose Designation</label>
              <Select
                placeholder="Choose Designation"
                value={formik.values.desig || undefined} // Ensure default empty state
                onChange={(value) => {
                  formik.setFieldValue("desig", value)
                  // setDistrict_ID(value)
                  // formik.setFieldValue("block", "");
                  // setBlockDropList([]);
                  // setBlockDropList_Load([]);
                  console.log(value, 'disdisdis');
                }}
                onBlur={formik.handleBlur}
                style={{ width: "100%" }}
              >
                <Select.Option value="" disabled> Choose Depertment ID </Select.Option>
                {designation?.map(data => (
                  <Select.Option key={data.sl_no} value={data.sl_no}>
                    {data.desig_name}
                  </Select.Option>
                ))}
              </Select>
              
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

export default UserProfile;
