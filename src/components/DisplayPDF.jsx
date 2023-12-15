import React, { useState, useEffect, useCallback } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import { useResizeObserver } from '@wojtekmaj/react-hooks';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useSelector, useDispatch } from 'react-redux';
import instance from '../constants/axios';
import { resetFileIdState } from '../redux/pdfFile';
import { useNavigate } from 'react-router-dom';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url
).toString();

const options = {
    cMapUrl: '/cmaps/',
    standardFontDataUrl: '/standard_fonts/',
};

const resizeObserverOptions = {};
const maxWidth = 800;

function DisplayPDF() {
    const [file, setFile] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [containerRef, setContainerRef] = useState(null);
    const [containerWidth, setContainerWidth] = useState(null);
    const [selectedPages, setSelectedPages] = useState([]);
    const navigate = useNavigate();

    const fileId = useSelector((state) => state.pdfFileId.pdfFileId);
    const dispatch = useDispatch();

    useEffect(() => {
        instance
            .get(`/display-pdf?fileId=${fileId}`)
            .then(({ data }) => {
                setFile(data.fileData);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const onResize = useCallback((entries) => {
        const [entry] = entries;

        if (entry) {
            setContainerWidth(entry.contentRect.width);
        }
    }, []);

    useResizeObserver(containerRef, resizeObserverOptions, onResize);

    function onDocumentLoadSuccess({ numPages: nextNumPages }) {
        setNumPages(nextNumPages);
    }

    const handlePageSelection = (pageNumber) => {
        if (selectedPages.includes(pageNumber)) {
            setSelectedPages(
                selectedPages.filter((page) => page !== pageNumber)
            );
        } else {
            setSelectedPages([...selectedPages, pageNumber]);
        }
    };

    const handleSubmit = () => {
        instance
            .post(`/create-pdf?fileId=${fileId}`, { selectedPages })
            .then(({ data }) => {
                const decodedUint8Array = Uint8Array.from(
                    atob(data.pdfBase64String),
                    (c) => c.charCodeAt(0)
                );

                const blob = new Blob([decodedUint8Array], {
                    type: 'application/pdf',
                });
                const url = window.URL.createObjectURL(blob);

                const downloadLink = document.createElement('a');
                downloadLink.href = url;
                downloadLink.setAttribute('download', 'generated_pdf.pdf');
                downloadLink.innerText = 'Download PDF';
                document.body.appendChild(downloadLink);
                dispatch(resetFileIdState());
                navigate('/');
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="Example__container__document" ref={setContainerRef}>
            <Document
                file={`data:application/pdf;base64,${file}`}
                onLoadSuccess={onDocumentLoadSuccess}
                options={options}
            >
                {Array.from(new Array(numPages), (el, index) => (
                    <div key={`page_${index + 1}`}>
                        <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            width={
                                containerWidth
                                    ? Math.min(containerWidth, maxWidth)
                                    : maxWidth
                            }
                        />
                        <input
                            type="checkbox"
                            checked={selectedPages.includes(index + 1)}
                            onChange={() => handlePageSelection(index + 1)}
                        />
                    </div>
                ))}
                <button onClick={handleSubmit}>Submit</button>
            </Document>
        </div>
    );
}

export default DisplayPDF;
