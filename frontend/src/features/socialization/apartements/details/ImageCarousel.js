const ImageCarousel = ({ currentIndex }) => {
    const images = ["/sosialisasi-1.jpg", "/sosialisasi-2.jpg"];
    return (
        <div className="relative w-full max-w-md mx-auto aspect-[3/2] mb-4">
            <img
                src={images[currentIndex]}
                alt="Dokumentasi Kegiatan"
                className="rounded-xl w-full h-full object-cover rounded-[24px]"
            />
        </div>
    );
};

export default ImageCarousel;
