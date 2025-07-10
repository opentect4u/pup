import React from 'react'
import { Button, Modal, Select } from 'antd';
import { useFormik } from 'formik';
import VError from './VError';
import * as Yup from 'yup';

const initialValues = {
  scheme_name: '',
  sector_name: '',
  fin_yr: '',
  schm_amt: '',
  cont_amt: '',
  tot_amt: '',
  admin_appr_pdf: '',
  proj_id: '',
  head_acc: '',
  dt_appr: '',
  proj_sub_by: '',
  project_submit_dtl: '',
  proj_imp_by: '',
  dis: [],
  block: [],
  ps_id: [],
  gp_id: [],
  vet_dpr_pdf: '',
  src: '',
  jl_no: '',
  mouza: '',
  dag_no: '',
  khatian_no: '',
  area: '',
};


function DialogBoxAddDisBlock({isModalOpen,handleOk,handleCancel,flag, userCheck, districtData}) {

  // const [userCheck, setUserDataLocalStore] = useState([]);


  const validationSchema = Yup.object({
    dis: Yup.array().when([], {
      is: () => userCheck.user_type == 'A',
      then: (schema) => schema.min(1, 'District is Required').required('District is is Required'),
      otherwise: (schema) => schema.notRequired(),
    }),


    // block: Yup.array().when([], {
    //   is: () => userCheck.user_type == 'A',
    //   then: (schema) => schema.min(1, 'Block is Required').required('Block is is Required'),
    //   otherwise: (schema) => schema.notRequired(),
    // }),
  

  
  
  });

    const onSubmit = (values) => {
    // if (errorpdf_1.length < 1 && errorpdf_2.length < 1) {
    //   if (params?.id > 0 && checkProjectId === false) {
    //     updateFormData()
    //   }

    //   if (params?.id < 1 && checkProjectId === false) {
    //     saveFormData()
    //   }
    // }

  };

    const formik = useFormik({
      // initialValues:formValues,
      // initialValues,
      initialValues: initialValues,
      onSubmit,
      validationSchema,
      enableReinitialize: true,
      validateOnMount: true,
      context: { userType: userCheck.user_type }
    });

   
  return (
    <Modal title={flag} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
    
    <div class="sm:col-span-12 contigencySelect">
    
                    <label for="dis" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Choose District
                    {userCheck.user_type === 'A' &&(
                        <><span className="mandator_txt"> *</span></>
                      )}
                    </label>
    
    
                    <Select
                      placeholder="Choose District..."
                      label="Choose District"
                      name="dis"
                      mode="tags"
                      style={{ width: '100%' }}
                      value={formik.values.dis}
                      onChange={(value) => {
                        formik.setFieldValue("dis", value ? value : [])
                        formik.setFieldValue("block", []);
                        // console.log(value, 'formDataformDataformDataformData');
                        if(value && value.length>0){
                          // fetchBlockdownOption(value)
                        } else {
                          // formik.setFieldValue("block", []);
                          // setBlockDropList([])
                        }
                        
                      }} // Update Formik state
                      handleChange={formik.handleChange}
                      onBlur={() => formik.setFieldTouched("dis", true)}
                      tokenSeparators={[]}
                      options={districtData?.map(item => ({
                        value: item.dist_code,
                        label: item.dist_name
                      }))}
                      filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                      }
                    />
    
    
    
    
    
    
                    {formik.errors.dis && formik.touched.dis && (
                      <VError title={formik.errors.dis} />
                    )}
                  </div>
    

  </Modal>
  )
}

export default DialogBoxAddDisBlock
