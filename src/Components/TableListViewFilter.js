import React from "react";
import { Select, Button } from "antd";
import * as Yup from 'yup';
import { useFormik } from 'formik';
import TDInputTemplate from "./TDInputTemplate";

const initialValues = {
    dis: '',
    block: '',
    ps_id: '',
    gp_id: ''
};

const TableListViewFilter = ({
    districtData,
    blockDropList,
    psStnDropList,
    GM_DropList,

    fetchBlockdownOption,
    fetchPoliceStnOption,
    fetch_GM_Option,
    getSubmitData,
    resetBtn

}) => {



    const validationSchema = () => Yup.object({
        dis: Yup.string(),
        block: Yup.string(),
        ps_id: Yup.string(),
        gp_id: Yup.string(),
    });


    const onSubmit = (values) => {
        getSubmitData(values)

    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
        enableReinitialize: true,
    });

    //     const formik = useFormik({
    //     initialValues,
    //     validationSchema: validationSchema(),
    //     onSubmit,
    //     enableReinitialize: true,
    //   });

    return (
        <div className="w-80 space-y-3 filterForm">


            <form onSubmit={formik.handleSubmit}>
                {/* District Select */}
                <div className="sm:col-span-12 contigencySelect">
                    <label
                        htmlFor="dis"
                        className="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100"
                    >
                        Choose District
                    </label>


                    <Select
                        placeholder="Choose District..."
                        name="dis"
                        // mode="multiple"
                        style={{ width: '100%' }}
                        value={formik.values.dis || undefined}  // 🔑 Ensures empty shows placeholder
                        onChange={(value) => {
                            formik.setFieldValue('dis', value || '');

                            //   if (value && value.length > 0) {
                            //     fetchBlockdownOption(value)
                            //   } else {
                            //     formik.setFieldValue("block", []);
                            //     // setpsStnDropList([])
                            //   }

                            if (value && value.length > 0) {
                                fetchBlockdownOption(value)
                                fetchPoliceStnOption(value)
                            } else {
                                // setBlockDropList([])
                                // setpsStnDropList([])
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
                    {/* {formik.errors.dis && formik.touched.dis && (
            <VError title={formik.errors.dis} />
          )} */}
                </div>


                {/* Block Input */}
                <div className="sm:col-span-12 mt-4">
                    <label
                        htmlFor="dis"
                        className="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100"
                    >
                        Block
                    </label>
                    <Select
                        placeholder="Choose Block..."
                        label="Choose Block"
                        name="block"
                        // mode="multiple"
                        style={{ width: '100%' }}
                        value={formik.values.block || null}
                        onChange={(value) => {
                            formik.setFieldValue("block", value ? value : "")
                            formik.setFieldValue("gp_id", "");
                            // console.log(value, 'formDataformDataformDataformData');
                            if (value && value.length > 0) {
                                fetch_GM_Option(value)
                            } else {
                                // setGM_DropList([])
                            }
                        }} // Update Formik state
                        handleChange={formik.handleChange}
                        onBlur={() => formik.setFieldTouched("block", true)}
                        tokenSeparators={[]}
                        options={blockDropList?.map(item => ({
                            value: item.block_id,
                            label: item.block_name
                        }))}
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </div>





                {/* Police Station Input */}
                <div className="sm:col-span-12 mt-4">
                    <label
                        htmlFor="dis"
                        className="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100"
                    >
                        Police Station
                    </label>

                    <Select
                        placeholder="Choose Police Station..."
                        label="Choose Police Station"
                        name="ps_id"
                        // mode="multiple"
                        style={{ width: '100%' }}
                        value={formik.values.ps_id || null}
                        onChange={(value) => {
                            formik.setFieldValue("ps_id", value ? value : "")
                        }} // Update Formik state
                        handleChange={formik.handleChange}
                        onBlur={() => formik.setFieldTouched("ps_id", true)}
                        tokenSeparators={[]}
                        options={psStnDropList?.map(item => ({
                            value: item.id,
                            label: item.ps_name
                        }))}
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                    />

                </div>






                {/* Gram Panchayat Input */}
                <div className="sm:col-span-12 mt-4">


                    <label
                        htmlFor="dis"
                        className="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100"
                    >
                        Gram Panchayat
                    </label>

                    <Select
                        placeholder="Choose Gram Panchayat..."
                        label="Choose Gram Panchayat"
                        name="gp_id"
                        // mode="multiple"
                        style={{ width: '100%' }}
                        value={formik.values.gp_id || null}
                        onChange={(value) => {
                            formik.setFieldValue("gp_id", value ? value : "")
                        }} // Update Formik state
                        handleChange={formik.handleChange}
                        onBlur={() => formik.setFieldTouched("gp_id", true)}
                        tokenSeparators={[]}
                        options={GM_DropList?.map(item => ({
                            value: item.gp_id,
                            label: item.gp_name
                        }))}
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </div>


                <div className="flex justify-between pt-2">

                    <button
                        key="submit"
                        type="submit"
                    //   onClick={formik.handleSubmit}
                    >
                        Submit</button>
                    {/* </Button> */}


                    <Button
                        onClick={() => {
                            resetBtn()
                            formik.setFieldValue("dis", '');
                            formik.setFieldValue("block", '');
                            formik.setFieldValue("ps_id", '');
                            formik.setFieldValue("gp_id", '');
                        }}
                    >
                        Reset
                    </Button>
                </div>


            </form>
        </div>
    );
};

export default TableListViewFilter;
