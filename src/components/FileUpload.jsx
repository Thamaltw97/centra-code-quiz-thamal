import React, { useState } from "react";

const FileUpload = ({ register, setValue, getValues, formState }) => {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);

  // console.log("Register Output: ", register);

  // Handle drag-in event (highlight drop area)
  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  // Handle drag-out event (reset drop area highlight)
  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  // Handle drop event (handle files dropped into the area)
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const uploadedFiles = e.dataTransfer.files;
    handleFiles(uploadedFiles);
  };

  // Handle adding selected files (from either drag/drop or file input)
  const handleFiles = (uploadedFiles) => {
    const newFiles = Array.from(uploadedFiles).map((file) => file);
    // setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, ...newFiles];
      setValue("attachments", updatedFiles);
      return updatedFiles;
    });
  };

  // Trigger file input click to select files
  const handleClick = () => {
    document.getElementById("fileInput").click();
  };

    // Handle file selection through the file input
  const handleChange = (e) => {
    const selectedFiles = e.target.files;

    handleFiles(selectedFiles);

    // const previousFiles = getValues("attachments") || [];
    // const newFiles = Array.from(selectedFiles);

    // const allFiles = [...previousFiles, ...newFiles];
    
    // setValue("attachments", allFiles);
    // register("attachments").onChange(e);

    // register("attachments").onChange(e);
    // setValue("attachments", selectedFiles);
  };

  // Remove a selected file from the list
  const handleRemoveFile = (fileName, e) => {
    e.stopPropagation();
    // setFiles(files.filter((file) => file.name !== fileName));
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((file) => file.name !== fileName);
      setValue("attachments", updatedFiles); // Update react-hook-form state after removal
      return updatedFiles;
    });
  };

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-20 w-full cursor-pointer"
      onClick={handleClick} // Trigger file input on clicking the upload area
      onDragOver={handleDragIn} // Highlight when dragging files over
      onDragLeave={handleDragOut} // Reset highlight when dragging leaves
      onDrop={handleDrop} // Handle dropped files
    >
      {/* Hidden file input */}
      <input
        id="fileInput"
        type="file"
        name="attachments"
        multiple
        {...register("attachments")}
        className="hidden"
        onChange={handleChange} // Handle file input change
      />
      <div
        className={`text-center ${dragging ? "text-blue-500" : "text-gray-500"}`}
      >
        {dragging ? (
          <p>Drop files here...</p>
        ) : (
          <p>Drag here or click to add files</p>
        )}
      </div>
      <div className="mt-4">
        {files.length > 0 && (
          <ul>
            {files.map((file, index) => (
              <li key={index} className="flex items-center space-x-2">
                <span>{file.name}</span>
                <button
                  onClick={(e) => handleRemoveFile(file.name, e)} // Handle file removal
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
