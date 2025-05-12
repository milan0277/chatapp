import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const SendFile = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("Choose file");

    const csvData = "designation,name,email,city,password";
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const sendFile = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("file", file);
            if (!formData.get("file")) {
                toast.error("Please select a file before uploading.");
                return;
            }

            const sfile = await axios.post(
                `${process.env.REACT_APP_API_URL}loginsystem/api/sendfile`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                }
            );

            const count = sfile?.data?.duplicateInFileCount;
            toast.success(`File sent successfully. Found ${count} duplicate agents in the file.`);

            setFile(null);
            setFileName("Choose file");
        } catch (err) {
            setFile(null);
            setFileName("Choose file");
            toast.error(err.response?.data?.error || "Upload failed");
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title" style={{ fontWeight: "bolder" }}>Bulk Upload</h3>
                <div className="card-tools">
                    <button type="button" className="btn btn-tool" data-card-widget="collapse" title="Collapse">
                        <i className="fas fa-minus" onClick={()=>{setFile(null);setFileName("Choose file")}}></i>
                    </button>
                </div>
            </div>
            <div className="card-body">
                <div className="form-group">
                    <label htmlFor="exampleInputFile">File input</label>
                    <div className="input-group">
                        <div className="custom-file">
                            <input
                                type="file"
                                className="custom-file-input"
                                id="exampleInputFile"
                                name="file"
                                onChange={(e) => {
                                    const selectedFile = e.target.files[0];
                                    setFile(selectedFile);
                                    setFileName(selectedFile ? selectedFile.name : "Choose file");
                                }}
                            />
                            <label className="custom-file-label" htmlFor="exampleInputFile">
                                {fileName}
                            </label>
                        </div>
                        <div className="input-group-append">
                            <span className="input-group-text btn" onClick={sendFile}>
                                Upload
                            </span>
                        </div>
                    </div>
                    <div>
                        <button className='btn-danger mt-2'>
                        <a  href={url}  download="format.csv" className='text-white'>
                            Download Format
                        </a>
                        </button>
                        
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    );
};

export default SendFile;
