import { useState } from "react";
import UploadArea from "./upload-area";
import CompressionSettings from "./compression-settings";
import ImageGallery from "./image-gallery";
import ProgressIndicator from "./progress-indicator";
import { useImageCompression } from "@/hooks/use-image-compression";

export interface UploadedImage {
  id: string;
  file: File;
  originalSize: number;
  compressedSize?: number;
  isCompressed: boolean;
  compressedBlob?: Blob;
  preview: string;
}

export default function ImageCompressor() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [compressionQuality, setCompressionQuality] = useState(80);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const { compressImage } = useImageCompression();

  const handleFilesSelected = (files: File[]) => {
    const newImages: UploadedImage[] = files.map(file => ({
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      file,
      originalSize: file.size,
      isCompressed: false,
      preview: URL.createObjectURL(file)
    }));
    
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const handleSingleCompress = async (imageId: string) => {
    const image = uploadedImages.find(img => img.id === imageId);
    if (!image || image.isCompressed) return;

    try {
      const compressedBlob = await compressImage(image.file, compressionQuality);
      
      setUploadedImages(prev => prev.map(img => 
        img.id === imageId 
          ? { ...img, isCompressed: true, compressedBlob, compressedSize: compressedBlob.size }
          : img
      ));
    } catch (error) {
      console.error('Compression failed:', error);
    }
  };

  const handleBatchCompress = async () => {
    const uncompressedImages = uploadedImages.filter(img => !img.isCompressed);
    if (uncompressedImages.length === 0) return;

    setIsCompressing(true);
    setProgress({ current: 0, total: uncompressedImages.length });

    for (let i = 0; i < uncompressedImages.length; i++) {
      const image = uncompressedImages[i];
      try {
        const compressedBlob = await compressImage(image.file, compressionQuality);
        
        setUploadedImages(prev => prev.map(img => 
          img.id === image.id 
            ? { ...img, isCompressed: true, compressedBlob, compressedSize: compressedBlob.size }
            : img
        ));
        
        setProgress({ current: i + 1, total: uncompressedImages.length });
      } catch (error) {
        console.error(`Failed to compress ${image.file.name}:`, error);
      }
    }

    setTimeout(() => {
      setIsCompressing(false);
    }, 1000);
  };

  const handleClearAll = () => {
    uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
    setUploadedImages([]);
    setProgress({ current: 0, total: 0 });
  };

  const handleDeleteImage = (imageId: string) => {
    const image = uploadedImages.find(img => img.id === imageId);
    if (image) {
      URL.revokeObjectURL(image.preview);
    }
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Compress IMAGE</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Compress <span className="text-primary font-medium">JPG</span>, 
          {" "}<span className="text-primary font-medium">PNG</span>, 
          {" "}<span className="text-primary font-medium">SVG</span> or 
          {" "}<span className="text-primary font-medium">GIF</span> with the best quality and compression.<br />
          Reduce the filesize of your images at once.
        </p>
      </div>

      <UploadArea onFilesSelected={handleFilesSelected} />

      {uploadedImages.length > 0 && (
        <>
          <CompressionSettings
            quality={compressionQuality}
            onQualityChange={setCompressionQuality}
            onBatchCompress={handleBatchCompress}
            isCompressing={isCompressing}
          />

          {isCompressing && (
            <ProgressIndicator
              current={progress.current}
              total={progress.total}
            />
          )}

          <ImageGallery
            images={uploadedImages}
            onCompress={handleSingleCompress}
            onDelete={handleDeleteImage}
            onClearAll={handleClearAll}
          />
        </>
      )}
    </main>
  );
}
