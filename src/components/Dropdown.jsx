import React from "react";

const Dropdown = ({ label, name, options, placeholder, register, validation, errors, defaultValue }) => (
    <div className="mb-2 flex items-start">
      <label htmlFor={name} className="w-2/5 text-left font-medium pr-2 whitespace">
        {label}
        {validation?.required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        {...register(name, validation)}
        className="ml-auto w-3/5 border border-gray-300 p-1 mr-1"
        defaultValue={defaultValue}
      >
        <option value="" disabled hidden>
            {placeholder ? placeholder : "Select an option"}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );
  

export default Dropdown;
