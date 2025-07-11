import React from 'react';
import { Button, Modal, Select } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import VError from './VError';
import TDInputTemplate from './TDInputTemplate';

const initialValues = {
  dis: '',
  block_add: '',
  ps_id: '',
  block_with_gp: ''
};

function DialogBoxAddDisBlock({
  isModalOpen,
  handleCancel,
  dialogBoxTitle,
  blockDropList,
  addMasterFlag,
  userCheck,
  districtData,
  submitBtn,
  fetchBlockdownOption,
  setpsStnDropList

}) {


  // const validationSchema = Yup.object({
// const validationSchema = () => Yup.object({
//     // dis: Yup.string().required('District is required'),
//     // block_add: Yup.string().required('Block is required'),

//     // dis: Yup.string(),

//     dis: Yup.array().when([], {
//     is: () => addMasterFlag === 'add_block' || addMasterFlag === 'add_PS' || addMasterFlag === 'add_GP',
//     then: (schema) => schema.min(1, 'District is Required').required('District is is Required'),
//     otherwise: (schema) => schema.notRequired(),
//     }),

//     block_add: Yup.array().when([], {
//     is: () => addMasterFlag === 'add_block',
//     then: (schema) => schema.min(1, 'Block is Required').required('Block is is Required'),
//     otherwise: (schema) => schema.notRequired(),
//     }),

//     ps_id: Yup.array().when([], {
//     is: () => addMasterFlag === 'add_PS',
//     then: (schema) => schema.min(1, 'Police Station is Required').required('Police Station is is Required'),
//     otherwise: (schema) => schema.notRequired(),
//     }),


//     block_with_gp: Yup.array().when([], {
//     is: () => addMasterFlag === 'add_GP',
//     then: (schema) => schema.min(1, 'Block is Required').required('Block is is Required'),
//     otherwise: (schema) => schema.notRequired(),
//     }),

//     gp_id: Yup.array().when([], {
//     is: () => addMasterFlag === 'add_GP',
//     then: (schema) => schema.min(1, 'Gram Panchayat is Required').required('Gram Panchayat is is Required'),
//     otherwise: (schema) => schema.notRequired(),
//     }),

//     // block_add: Yup.string(),
//     // ps_id: Yup.string(),
//     // block_with_gp: Yup.string(),
//     // gp_id: Yup.string(),

//   });

// const validationSchema = Yup.object({
//   dis: Yup.string()
//     .trim()
//     .min(1, 'District is required')
//     .required('District is required'),

//   block_add: Yup.string()
//     .trim()
//     .min(1, 'Block is required')
//     .required('Block is required'),

//   ps_id: Yup.string()
//     .trim()
//     .min(1, 'Police Station is required')
//     .required('Police Station is required'),

//   block_with_gp: Yup.string()
//     .trim()
//     .min(1, 'Block is required')
//     .required('Block is required'),

//   gp_id: Yup.string()
//     .trim()
//     .min(1, 'Gram Panchayat is required')
//     .required('Gram Panchayat is required'),
// });

const validationSchema = (addMasterFlag) => Yup.object({
  dis: Yup.string()
    .trim()
    .when([], {
      is: () => ['add_block', 'add_PS', 'add_GP'].includes(addMasterFlag),
      then: (schema) => schema.min(1, 'District is required').required('District is required'),
      otherwise: (schema) => schema.notRequired(),
    }),

  block_add: Yup.string()
    .trim()
    .when([], {
      is: () => addMasterFlag === 'add_block',
      then: (schema) => schema.min(1, 'Block is required').required('Block is required'),
      otherwise: (schema) => schema.notRequired(),
    }),

  ps_id: Yup.string()
    .trim()
    .when([], {
      is: () => addMasterFlag === 'add_PS',
      then: (schema) => schema.min(1, 'Police Station is required').required('Police Station is required'),
      otherwise: (schema) => schema.notRequired(),
    }),

  block_with_gp: Yup.string()
    .trim()
    .when([], {
      is: () => addMasterFlag === 'add_GP',
      then: (schema) => schema.min(1, 'Block is required').required('Block is required'),
      otherwise: (schema) => schema.notRequired(),
    }),

  gp_id: Yup.string()
    .trim()
    .when([], {
      is: () => addMasterFlag === 'add_GP',
      then: (schema) => schema.min(1, 'Gram Panchayat is required').required('Gram Panchayat is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
});




  

  const onSubmit = (values) => {
    // console.log("Submitted values:", values); // <-- ✅ Console output here
    submitBtn(values); // <-- send values to screen_A
    formik.setFieldValue("dis", '');
    formik.setFieldValue("block_add", '');
    formik.setFieldValue("ps_id", '');
    formik.setFieldValue("block_with_gp", '');
    formik.setFieldValue("gp_id", '');
  };

  // const formik = useFormik({
  //   initialValues,
  //   validationSchema,
  //   onSubmit,
  //   enableReinitialize: true,
  // });

  const formik = useFormik({
  initialValues,
  validationSchema: validationSchema(addMasterFlag),
  onSubmit,
  enableReinitialize: true,
});

//   const formik = useFormik({
//   initialValues,
//   validationSchema: validationSchema(addMasterFlag),
//   onSubmit,
//   enableReinitialize: true,
// });

  return (
    <Modal
      title={dialogBoxTitle}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={formik.handleSubmit}
        >
          {dialogBoxTitle}
        </Button>,
      ]}
    >
      <form onSubmit={formik.handleSubmit}>
        {/* District Select */}
        <div className="sm:col-span-12 contigencySelect">
          <label
            htmlFor="dis"
            className="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100"
          >
            Choose District <span className="mandator_txt">*</span>
          </label>


          <Select
            placeholder="Choose District..."
            name="dis"
            // mode="multiple"
            style={{ width: '100%' }}
            value={formik.values.dis || undefined}  // 🔑 Ensures empty shows placeholder
            onChange={(value) => {
              formik.setFieldValue('dis', value || '');

              if (value && value.length > 0) {
                fetchBlockdownOption(value)
              } else {
                // formik.setFieldValue("block", []);
                setpsStnDropList([])
              }

            }}
            onBlur={() => formik.setFieldTouched('dis', true)}
            options={districtData?.map((item) => ({
              value: item.dist_code,
              label: item.dist_name,
            }))}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
          {formik.errors.dis && formik.touched.dis && (
            <VError title={formik.errors.dis} />
          )}
        </div>
        
        {addMasterFlag === 'add_block' && (
        <>
          {/* Block Input */}
        <div className="sm:col-span-12 mt-4">
          <TDInputTemplate
            placeholder="Block goes here..."
            type="text"
            label={
              <>
                Block<span className="mandator_txt"> *</span>
              </>
            }
            name="block_add"
            formControlName={formik.values.block_add}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            mode={1}
          />
          {formik.errors.block_add && formik.touched.block_add && (
            <VError title={formik.errors.block_add} />
          )}
        </div>
        </>
        )}
        

        {addMasterFlag == 'add_PS' && (
        <>
        {/* Police Station Input */}
        <div className="sm:col-span-12 mt-4">
          <TDInputTemplate
            placeholder="Police Station goes here..."
            type="text"
            label={
              <>
                Police Station<span className="mandator_txt"> *</span>
              </>
            }
            name="ps_id"
            formControlName={formik.values.ps_id}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            mode={1}
          />
          {formik.errors.ps_id && formik.touched.ps_id && (
            <VError title={formik.errors.ps_id} />
          )}
        </div>
        </>
        )}

        {addMasterFlag == 'add_GP' && (
        <>
        <div class="sm:col-span-12 addMaster mt-4">
          {/* {JSON.stringify(district_ID, null, 2)} ///  {JSON.stringify(block_ID, null, 2)} */}



          <label for="block" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Block<span className="mandator_txt"> *</span></label>


          <Select
            placeholder="Choose Block..."
            name="block_with_gp"
            style={{ width: '100%' }}
            // mode="multiple"
            value={formik.values.block_with_gp || undefined}
            onChange={(value) => {
              formik.setFieldValue("block_with_gp", value ? value : "")
              // console.log(value, 'formDataformDataformDataformData');
              if (value && value.length > 0) {
                // fetch_GM_Option(value)
              } else {
                // setGM_DropList([])
              }
            }} // Update Formik state
            // handleChange={formik.handleChange}
            onBlur={() => formik.setFieldTouched("block_with_gp", true)}
            // tokenSeparators={[]}
            options={blockDropList?.map(item => ({
              value: item.block_id,
              label: item.block_name
            }))}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />

          {/* {JSON.stringify(blockDropList_Load[0]?.block_name, null, 2)} */}
          {formik.errors.block_with_gp && formik.touched.block_with_gp && (
            <VError title={formik.errors.block_with_gp} />
          )}
        </div>
        

        {/* Gram Panchayat Input */}
        <div className="sm:col-span-12 mt-4">
          <TDInputTemplate
            placeholder="Police Station goes here..."
            type="text"
            label={
              <>
                Gram Panchayat<span className="mandator_txt"> *</span>
              </>
            }
            name="gp_id"
            formControlName={formik.values.gp_id}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            mode={1}
          />
          {formik.errors.gp_id && formik.touched.gp_id && (
            <VError title={formik.errors.gp_id} />
          )}
        </div>

        </>
        )}


      </form>
    </Modal>
  );
}

export default DialogBoxAddDisBlock;
