import React, { useState } from 'react';
import instance from '../constants/axios';
import { useDispatch } from 'react-redux';
import { setPdfFileId } from '../redux/pdfFile';
import { useNavigate } from 'react-router-dom';

function UploadPDF() {
    const [file, setFile] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onFileChange = (e) => {
        const { files } = e.target;
        if (files && files[0]) {
            setFile(files[0] || null);
        }
    };

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('pdfFile', file);

        instance
            .post('/upload-pdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(({ data }) => {
                dispatch(setPdfFileId(data.fileId));
                navigate('/display-pdf');
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="Example">
            <header>
                <h1>SelectPDF.io Pro</h1>
            </header>
            <div className="Example__container">
                <div className="Example__container__load">
                    <label htmlFor="file">Load from file:</label>{' '}
                    <input onChange={onFileChange} type="file" />
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
}

export default UploadPDF;
