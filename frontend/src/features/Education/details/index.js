import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const EducationDetail = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <div className="min-h-screen bg-base-200 px-6 py-10 relative">
            {/* PDF Viewer */}
            <div className="bg-base-100 p-6 rounded-xl shadow-lg flex justify-center">
                <div className="w-full h-[calc(100vh-150px)] overflow-hidden">
                    <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                        <Viewer
                            fileUrl="/Materi.pdf"
                            plugins={[defaultLayoutPluginInstance]}
                        />
                    </Worker>
                </div>
            </div>
        </div>
    );
};

export default EducationDetail;
