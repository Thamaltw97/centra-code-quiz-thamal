import React, { useState, useEffect } from "react";

const FileUpload = ({ name, register, setValue, getValues, formState, files, setFiles }) => {
  const [dragging, setDragging] = useState(false);
  // const [files, setFiles] = useState([]);

  // console.log("Register Output: ", register);

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const uploadedFiles = e.dataTransfer.files;
    handleFiles(uploadedFiles);
  };

  const handleFiles = (uploadedFiles) => {
    const newFiles = Array.from(uploadedFiles).map((file) => file);
    // setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, ...newFiles];
      setValue(name, updatedFiles);
      return updatedFiles;
    });
  };

  const handleClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleChange = (e) => {
    const selectedFiles = e.target.files;

    handleFiles(selectedFiles);

  };

  const handleRemoveFile = (fileName, e) => {
    e.stopPropagation();
    // setFiles(files.filter((file) => file.name !== fileName));
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((file) => file.name !== fileName);
      setValue(name, updatedFiles); // Update react-hook-form state after removal
      return updatedFiles;
    });
  };

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-20 w-full cursor-pointer"
      onClick={handleClick}
      onDragOver={handleDragIn}
      onDragLeave={handleDragOut}
      onDrop={handleDrop}
    >
      <input
        id="fileInput"
        type="file"
        name={name}
        multiple
        {...register(name)}
        className="hidden"
        onChange={handleChange}
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
                  onClick={(e) => handleRemoveFile(file.name, e)}
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
