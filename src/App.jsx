import React, { useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "./components/InputField";
import Dropdown from "./components/Dropdown";
import FileUpload from "./components/FileUpload";
import { generatePDF } from "./utils/generatePDF";
import axios from "axios";

const App = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState,
    formState: { errors },
  } = useForm();

  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const pdfBlob = await generatePDF(data); // Generate the PDF Blob
      
      const formData = new FormData();
      formData.append("pdfBlob", pdfBlob, "Attachment.pdf");
  
      const files = data.attachments;
      files.forEach(file => formData.append("attachments", file));
  
      formData.append("formData", JSON.stringify(data));
  
      // API Call
      const response = await axios.post("http://localhost:5000/api/send-email", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      handleCancel();
      alert(response.data.message);
      
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    reset();
    setValue("phoneNumber", "");
    setValue("postalCode", "");
    setValue("sellPrice", "");
    setValue("listPrice", "");
    setValue("depositValue", "");
    setValue("discount", "");
    setValue("commission", "");
    setValue("sellPrice", "");
    setValue("attachments", []);
    setFiles([]);
    // resetFileInput();
  };
  
  return (
    <div className="container mx-auto p-3 rounded-lg" id="form-container">
      <div className="bg-white rounded-lg">
        <h1 
          className="text-2xl font-bold mb-4 text-white p-4 rounded-t-lg" 
          style={{ backgroundColor: '#3e5fae' }}
        >
          New Order Intake - Supply & Install
        </h1>
        {isLoading && (
          <div className="flex justify-center items-center mb-4">
            <div className="loader border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
            <span className="ml-2 text-blue-500">Submitting...</span>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="p-3">
          <div className="flex flex-row gap-2">

            {/* Customer Info Section */}
            <section className="mb-6 basis-1/2 border border-gray-300 shadow-sm">
              <div className="bg-gray-100 p-1 mb-2">
                <h2 className="text-lg font-semibold">Customer Information</h2>
              </div>
              <div className="p-2">
                <div className="flex flex-row gap-5">
                  <div className="basis-1/2">
                    <InputField
                      label="Customer Number"
                      type="text"
                      name="customerNumber"
                      placeholder="123456"
                      register={register}
                      validation={{ required: "Customer Number is required" }}
                      errors={errors} 
                    />
                    <InputField
                      label="Work Order #"
                      type="text"
                      name="workOrderNum"
                      placeholder="A12400"
                      register={register}
                      validation={{ required: "Work Order # is required" }}
                      errors={errors} 
                    />
                    <InputField
                      label="Customer Name"
                      type="text"
                      name="customerName"
                      placeholder="John Doe"
                      register={register}
                      validation={{ required: "Customer Name is required" }}
                      errors={errors} 
                    />
                    <InputField
                      label="Email"
                      type="email"
                      name="customerEmail"
                      placeholder="johnDoe@gmail.com"
                      register={register}
                      validation={{
                        required: "Email is required",
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Please enter a valid email address"
                        }
                      }}
                      errors={errors} 
                    />
                    <InputField
                      label="Phone Number"
                      type="tel"
                      name="phoneNumber"
                      placeholder="604-123-1234"
                      register={register}
                      validation={{ required: "Phone number is required" }}
                      errors={errors}
                    />
                  </div>
                  <div className="basis-1/2">
                    <InputField
                      label="Street Address"
                      type="text"
                      name="streetAddress"
                      placeholder="Search Address"
                      register={register}
                      validation={{ required: "Street Address is required" }}
                      errors={errors}
                    />
                    <InputField
                      label="Province"
                      type="text"
                      name="province"
                      placeholder="BC"
                      register={register}
                      validation={{ required: "Province is required" }}
                      errors={errors}
                    />
                    <InputField
                      label="City"
                      type="text"
                      name="city"
                      placeholder="Langley"
                      register={register}
                      validation={{ required: "City is required" }}
                      errors={errors}
                    />
                    <InputField
                      label="Postal Code"
                      type="postal"
                      name="postalCode"
                      placeholder="V3E 2X5"
                      register={register}
                      validation={{ required: "Postal Code is required" }}
                      errors={errors}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Order Details Section */}
            <section className="mb-6 basis-1/2 border border-gray-300 shadow-sm">
              <div className="bg-gray-100 p-1 mb-2">
                <h2 className="text-lg font-semibold">Order Details</h2>
              </div>
              <div className="p-2">
                <div className="flex flex-row gap-5">
                  <div className="basis-1/2">
                    <Dropdown
                      label="Branch"
                      name="branch"
                      options={["AA", "AB", "AC", "AD"]}
                      placeholder="Select Branch"
                      register={register}
                      validation={{
                        required: "Branch is required", 
                        validate: value => value !== "" || "Please select a branch"
                      }}
                      errors={errors}
                      defaultValue=""
                    />
                    <Dropdown
                      label="Order Type"
                      name="orderType"
                      options={["Supply & Install", "Supply Only"]}
                      register={register}
                      validation={{
                        required: "Order Type is required", 
                        validate: value => value !== "" || "Please select an Order Type"
                      }}
                      errors={errors}
                      defaultValue="Supply & Install"
                    />
                    <Dropdown
                      label="Home Depot Order"
                      name="homeDepotOrder"
                      options={["Yes", "No"]}
                      placeholder="Select Option"
                      register={register}
                      validation={{
                        required: "Home Depot Order is required", 
                        validate: value => value !== "" || "Please select an option"
                      }}
                      errors={errors}
                      defaultValue=""
                    />
                    <InputField
                      label="Lead Source"
                      type="text"
                      name="leadSource"
                      placeholder="Lead Name"
                      register={register}
                      validation={{ required: "Lead Source is required" }}
                      errors={errors}
                    />
                    <Dropdown
                      label="Estimator"
                      name="estimator"
                      options={["A", "B", "C"]}
                      placeholder="Select Estimator"
                      register={register}
                      validation={{
                        required: "Estimator is required", 
                        validate: value => value !== "" || "Please select an estimator"
                      }}
                      errors={errors}
                      defaultValue=""
                    />
                    <InputField
                      label="Marketer"
                      type="text"
                      name="marketer"
                      placeholder="Marketer Name"
                      register={register}
                      validation={{ required: "Marketer is required" }}
                      errors={errors}
                    />
                  </div>
                  <div className="basis-1/2">
                    <Dropdown
                      label="Remeasure Required?"
                      name="remeasureRequired"
                      options={["Yes", "No"]}
                      register={register}
                      validation={{
                        required: "Remeasure Required? is required", 
                        validate: value => value !== "" || "Please select an option"
                      }}
                      errors={errors}
                      defaultValue="Yes"
                    />
                    <Dropdown
                      label="Delivery Zone"
                      name="deliveryZone"
                      options={["DZ 1", "DZ 2", "DZ 3"]}
                      placeholder="Select Delivery Zone"
                      register={register}
                      validation={{
                        required: "Delivery Zone is required", 
                        validate: value => value !== "" || "Please select a delivery zone"
                      }}
                      errors={errors}
                      defaultValue=""
                    />
                    <Dropdown
                      label="Payment Type"
                      name="paymentType"
                      options={["Credit", "Debit", "Cash"]}
                      placeholder="Select Payment Type"
                      register={register}
                      validation={{
                        required: "Payment Type is required", 
                        validate: value => value !== "" || "Please select an payment type"
                      }}
                      errors={errors}
                      defaultValue=""
                    />
                    <InputField
                      label="Sell Price (Before Tax)"
                      type="decimal"
                      name="sellPrice"
                      placeholder="0"
                      register={register}
                      validation={{ required: "Sell Price (Before Tax) is required" }}
                      errors={errors}
                    />
                    <InputField
                      label="List Price"
                      type="decimal"
                      name="listPrice"
                      placeholder="0.00"
                      register={register}
                      validation={{ required: "List Price is required" }}
                      errors={errors}
                    />
                    <InputField
                      label="Deposit Value"
                      type="decimal"
                      name="depositValue"
                      placeholder="0"
                      register={register}
                      validation={{ required: "Deposit Value is required" }}
                      errors={errors}
                    />
                    <InputField
                      label="Discount %"
                      type="decimal"
                      name="discount"
                      placeholder="0"
                      register={register}
                      validation={{ required: "Discount % is required" }}
                      errors={errors}
                    />
                    <InputField
                      label="Commission %"
                      type="decimal"
                      name="commission"
                      placeholder="0"
                      register={register}
                      validation={{ required: "Commission % is required" }}
                      errors={errors}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="flex flex-row gap-2">

            {/* Product Summary Section */}
            <section className="mb-6 basis-3/5 border border-gray-300 shadow-sm">
              <div className="bg-gray-100 p-1 mb-2">
                <h2 className="text-lg font-semibold">Product Summary</h2>
              </div>
              <div className="p-2">
                <div className="flex flex-row gap-5">
                  <div className="basis-1/2">
                    <InputField
                      label="Windows"
                      type="number"
                      name="windows"
                      placeholder="0"
                      register={register}
                      validation={{ required: "Windows is required" }}
                      errors={errors} 
                    />
                    <InputField
                      label="Patio Doors"
                      type="number"
                      name="patioDoors"
                      placeholder="0"
                      register={register}
                      validation={{ required: "Patio Doors is required" }}
                      errors={errors} 
                    />
                    <InputField
                      label="Doors"
                      type="number"
                      name="doors"
                      placeholder="0"
                      register={register}
                      validation={{ required: "Doors is required" }}
                      errors={errors}
                    />
                    <InputField
                      label="Sealed Units"
                      type="number"
                      name="sealedUnits"
                      placeholder="0"
                      register={register}
                      validation={{ required: "Sealed Units is required" }}
                      errors={errors}
                    />
                    <InputField
                      label="Others"
                      type="number"
                      name="others"
                      placeholder="0"
                      register={register}
                      validation={{ required: "Others is required" }}
                      errors={errors}
                    />
                    <InputField
                      label="Submitter Email"
                      type="email"
                      name="submitterEmail"
                      placeholder="johnDoe@gmail.com"
                      register={register}
                      validation={{
                        required: "Submitter Email is required",
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Please enter a valid email address"
                        }
                      }}
                      errors={errors} 
                    />
                  </div>
                  <div className="basis-1/2">
                    <Dropdown
                      label="CleanBC IQP Code Required Before Ordering Product?"
                      name="cleanBcIqpCode"
                      options={["Yes", "No"]}
                      placeholder="Select Option"
                      register={register}
                      validation={{
                        required: "CleanBC IQP Code Required Before Ordering Product? is required", 
                        validate: value => value !== "" || "Please select an option"
                      }}
                      errors={errors}
                      defaultValue=""
                    />
                    <Dropdown
                      label="Door Saved In Codel Program?"
                      name="doorSavedInCodelProgram"
                      options={["N/A", "Yes", "No"]}
                      placeholder="Select Option"
                      register={register}
                      validation={{
                        required: "Door Saved in Codel Program? is required", 
                        validate: value => value !== "" || "Please select an option"
                      }}
                      errors={errors}
                      defaultValue="N/A"
                    />
                    <Dropdown
                      label="Was A Future Opportunity Created?"
                      name="futureOpportunity"
                      options={["Yes", "No"]}
                      placeholder="Select Option"
                      register={register}
                      validation={{
                        required: "Was A Future Opportunity Created? is required", 
                        validate: value => value !== "" || "Please select an option"
                      }}
                      errors={errors}
                      defaultValue=""
                    />
                    <Dropdown
                      label="Alteration Drawing & Price Breakdown Submitted?"
                      name="altDurationAndPriceBreakdown"
                      options={["Yes", "No"]}
                      placeholder="Select Option"
                      register={register}
                      validation={{
                        required: "Alteration Drawing & Price Breakdown Submitted? is required", 
                        validate: value => value !== "" || "Please select an option"
                      }}
                      errors={errors}
                      defaultValue=""
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Attachments Section */}
            <section className="mb-6 basis-2/5 border border-gray-300 shadow-sm">
              <div className="bg-gray-100 p-1 mb-2">
                <h2 className="text-lg font-semibold">Attachments</h2>
              </div>
              <div className="p-2">
                <FileUpload 
                  name="attachments"
                  register={register}
                  setValue={setValue} 
                  getValues={getValues}
                  formState={formState}
                  files={files}
                  setFiles={setFiles}
                />
              </div>
            </section>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="text-white px-4 py-2"
              style={{ backgroundColor: '#3e5fae' }}
              disabled={isLoading}
            >
              Submit
            </button>
            <button
              type="button"
              className="text-black px-4 py-2 hover:bg-gray-600"
              style={{ backgroundColor: '#ebeff3' }}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default App;
