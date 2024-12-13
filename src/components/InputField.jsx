import React from "react";
import InputMask from 'react-input-mask';
// import NumberFormat from 'react-number-format';
import CurrencyInput from 'react-currency-input-field';

const InputField = ({ label, type, name, placeholder, register, validation, errors }) => (
  
    <div className="flex items-center mb-2">
      <label
        htmlFor={name}
        className="w-2/5 text-left font-medium pr-2 whitespace-nowrap"
      >
        {label}
        {validation?.required && (
            <span className="text-red-500 ml-1">*</span>
        )}
      </label>
      {type === 'tel' ? (
            <InputMask
                mask="999-999-9999"
                id={name}
                {...register(name, validation)}
                placeholder={placeholder}
                className="ml-auto w-3/5 border border-gray-300 p-1 mr-1"
            />
        ) : type === 'postal' ? (
          <InputMask
              mask="A9A 9A9"
              id={name}
              {...register(name, validation)}
              placeholder={placeholder}
              className="ml-auto w-3/5 border border-gray-300 p-1 mr-1"
              formatChars={{
                A: '[A-Za-z]',
                9: '[0-9]'
              }}
              style={{ textTransform: 'uppercase' }}
          />
      )
       : type === 'decimal' ? (
        <CurrencyInput
          id={name}
          name={name}
          {...register(name, validation)}
          placeholder={placeholder}
          className="ml-auto w-3/5 border border-gray-300 p-1 mr-1"
          decimalScale={2}
          decimalsLimit={2}
        />
      ) 
      : (
        <input
            type={type}
            id={name}
            {...register(name, validation)}
            placeholder={placeholder}
            className="ml-auto w-3/5 border border-gray-300 p-1 mr-1"
        />
      )}
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
      
    </div>
  );
  
export default InputField;
