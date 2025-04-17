import React from "react";

function TDInputTemplate(props) {
  return (
    <>
      <label
        htmlFor={props.name}
        className="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100"
      >
        {/* {props.mode != 3
          ? props.label
          : (props.label || "") +
            " (" +
            props.formControlName?.length +
            "/500)"} */}

{props.mode != 3 ? (
          props.label
        ) : (
          <>
            {props.label || ""} 
            {props.required && <span className="text-red-500"> *</span>}
            {" (" + (props.formControlName?.length || 0) + "/500)"}
          </>
        )}


      </label>
      {props.mode == 1 && (
        <input
          autoComplete="off"
          type={props.type}
          id={props.name}
          name={props.name}
          value={props.formControlName}
          multiple={props.multiple}
          min={props.min}
          accept={props.accept}
          max={props.max}
          setFieldValue={props.setFieldValue}
          onKeyDown={(e) => {
            if (props.type == "date") e.preventDefault();
          }}
          className="bg-white border-2 border-slate-300 text-gray-800 text-sm rounded-md  focus:border-gray-400 active:border-sky-600 focus:ring-sky-600 focus:border-1 duration-500  w-full p-2 dark:bg-bg-white dark:border-gray-600 dark:placeholder-sky-500 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 flex items-center"
          placeholder={props.placeholder}
          onChange={props.handleChange}
          onFocus={props.handleFocus}
          onBlur={props.handleBlur}
          disabled={props.disabled}
        />
      )}
      {props.mode == 2 && (
        <select
          className="bg-white border-2 border-slate-300 text-gray-800 text-sm rounded-md  focus:border-gray-400 active:border-sky-600 focus:ring-sky-600 focus:border-1 duration-500 block w-full p-2 dark:bg-bg-white dark:border-gray-600 dark:placeholder-sky-500 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          value={props.formControlName}
          onChange={props.handleChange}
          name={props.name}
          id={props.name}
          placeholder={props.placeholder}
          options={props?.data}
          onBlur={props.handleBlur}
          disabled={props.disabled}
        >
          <option selected>{props.placeholder}</option>
          {props?.data?.map((item, index) => (
            <option value={item.code}>{item.name}</option>
          ))}
        </select>
      )}
      {props.mode == 3 && (
        <textarea
          autoComplete="off"
          rows="4"
          className="bg-white border-1 border-slate-300 text-sm rounded-lg  focus:border-gray-400 active:border-sky-600 focus:ring-sky-600 focus:border-1 duration-500 block w-full p-1.5 dark:bg-bg-white dark:border-gray-600 dark:placeholder-sky-500 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          name={props.name}
          id={props.name}
          value={props.formControlName}
          placeholder={props.placeholder}
          onChange={props.handleChange}
          onBlur={props.handleBlur}
          disabled={props.disabled}
          maxLength={500}
        />
      )}
    </>
  );
}

export default TDInputTemplate;
