import React, { useState } from "react";
import ImageCarousel from "./ImageCarousel";

const ApartementDetail = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = ["/sosialisasi-1.jpg", "/sosialisasi-2.jpg"];

    const dummyData = {
        name: "Apartemen Graha Golf",
        address: "Jl. Raya Golf Graha Famili",
        region: "Selatan",
        subdistrict: "Dukuh Pakis",
        SK: "01_SK_SDNNUSABANGSA",
        leader: "Ari Wibowo",
        date: "1 April 2024",
        male: 19,
        female: 20,
        ageBelow6: 0,
        age6to10: 39,
        age11to18: 0,
        ageAbove44: 0,
    };

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div className="min-h-screen bg-base-200 px-6 py-10 space-y-12 relative">



            {/* Video */}
            <div className="bg-base-100 p-6 rounded-xl shadow-lg flex justify-center">
                <iframe
                    width="100%"
                    height="400"
                    src="https://www.youtube.com/embed/9PoCcYUO8UY"
                    title="Video Sosialisasi"
                    allowFullScreen
                    className="rounded-lg"
                ></iframe>
            </div>

            {/* Detail Card */}
            <div className="bg-base-100 p-6 rounded-xl shadow-lg relative">
                <div className="relative">
                    <ImageCarousel currentIndex={currentIndex} />

                    <button
                        onClick={prevImage}
                        className="absolute top-[45%] left-24 transform -translate-y-1/2 bg-white text-black w-10 h-10 rounded-full shadow-md hover:bg-gray-100 flex items-center justify-center text-xl z-10"
                    >
                        &#8592;
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute top-[45%] right-24 transform -translate-y-1/2 bg-white text-black w-10 h-10 rounded-full shadow-md hover:bg-gray-100 flex items-center justify-center text-xl z-10"
                    >
                        &#8594;
                    </button>


                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mt-10 mb-8">
                    {/* Kolom Kiri */}
                    <div className="space-y-3">
                        <div className="flex"><span className="w-40 font-semibold">Nama</span><span className="mr-1">:</span><span className="ml-4">{dummyData.name}</span></div>
                        <div className="flex"><span className="w-40 font-semibold">Alamat</span><span className="mr-1">:</span><span className="ml-4">{dummyData.address}</span></div>
                        <div className="flex"><span className="w-40 font-semibold">Wilayah</span><span className="mr-1">:</span><span className="ml-4">{dummyData.region}</span></div>
                        <div className="flex"><span className="w-40 font-semibold">Kecamatan</span><span className="mr-1">:</span><span className="ml-4">{dummyData.subdistrict}</span></div>
                        <div className="flex">
                            <span className="w-40 font-semibold">SK</span>
                            <span className="mr-1">:</span>
                            <a
                                href="/logo192.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-4 text-blue-600 underline"
                            >
                                {dummyData.SK}
                            </a>
                        </div>
                        <div className="flex"><span className="w-40 font-semibold">Nama Ketua Tim</span><span className="mr-1">:</span><span className="ml-4">{dummyData.leader}</span></div>
                    </div>

                    {/* Kolom Kanan */}
                    <div className="space-y-3">
                        <div className="flex"><span className="w-60 font-semibold whitespace-nowrap">Tanggal Kegiatan</span><span className="mr-1">:</span><span className="ml-4">{dummyData.date}</span></div>
                        <div className="flex"><span className="w-60 font-semibold whitespace-nowrap">Jumlah Peserta Laki-Laki</span><span className="mr-1">:</span><span className="ml-4">{dummyData.male}</span></div>
                        <div className="flex"><span className="w-60 font-semibold whitespace-nowrap">Jumlah Peserta Perempuan</span><span className="mr-1">:</span><span className="ml-4">{dummyData.female}</span></div>
                        <div className="flex"><span className="w-60 font-semibold whitespace-nowrap">Jumlah Peserta Usia &lt;6 Tahun</span><span className="mr-1">:</span><span className="ml-4">{dummyData.ageBelow6}</span></div>
                        <div className="flex"><span className="w-60 font-semibold whitespace-nowrap">Jumlah Peserta Usia 6–10 Tahun</span><span className="mr-1">:</span><span className="ml-4">{dummyData.age6to10}</span></div>
                        <div className="flex"><span className="w-60 font-semibold whitespace-nowrap">Jumlah Peserta Usia 11–18 Tahun</span><span className="mr-1">:</span><span className="ml-4">{dummyData.age11to18}</span></div>
                        <div className="flex"><span className="w-60 font-semibold whitespace-nowrap">Jumlah Peserta Usia &gt;44 Tahun</span><span className="mr-1">:</span><span className="ml-4">{dummyData.ageAbove44}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApartementDetail;
