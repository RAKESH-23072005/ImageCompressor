import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/header";
import CompressionSettings from "@/components/compression-settings";
import ImageGallery from "@/components/image-gallery";
import ProgressIndicator from "@/components/progress-indicator";

import { useImageCompression } from "@/hooks/use-image-compression";
import { UploadedImage } from "@/components/image-compressor";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, Loader2 } from "lucide-react";

export default function Compress() {
  const [, setLocation] = useLocation();
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [compressionQuality, setCompressionQuality] = useState(80);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const { compressImage } = useImageCompression();

  // Get images from session storage or redirect if no images
  useEffect(() => {
    const storedImages = sessionStorage.getItem('uploadedImages');
    if (storedImages) {
      const parsedImages = JSON.parse(storedImages);
      // Restore file objects from global map
      const restoredImages = parsedImages.map((img: any) => {
        const actualFile = (window as any).imageFiles?.get(img.id);
        return {
          ...img,
          file: actualFile || new File([], img.file.name, { 
            type: img.file.type,
            lastModified: img.file.lastModified 
          })
        };
      });
      setUploadedImages(restoredImages);
      // Clear from session storage after loading
      sessionStorage.removeItem('uploadedImages');
    } else {
      // Redirect to home if no images
      setLocation('/');
    }
  }, [setLocation]);

  const handleSingleCompress = async (imageId: string) => {
    const image = uploadedImages.find(img => img.id === imageId);
    if (!image || image.isCompressed) return;

    try {
      // Get the actual file from global storage
      const actualFile = (window as any).imageFiles?.get(imageId);
      if (!actualFile) {
        console.error('File not found for compression');
        return;
      }

      const compressedBlob = await compressImage(actualFile, compressionQuality);
      
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
        // Get the actual file from global storage
        const actualFile = (window as any).imageFiles?.get(image.id);
        if (!actualFile) {
          console.error(`File not found for compression: ${image.file.name}`);
          continue;
        }

        const compressedBlob = await compressImage(actualFile, compressionQuality);
        
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
    setLocation('/');
  };

  const handleDeleteImage = (imageId: string) => {
    const image = uploadedImages.find(img => img.id === imageId);
    if (image) {
      URL.revokeObjectURL(image.preview);
    }
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
    
    // If no images left, redirect to home
    if (uploadedImages.length === 1) {
      setLocation('/');
    }
  };

  const handleBackToHome = () => {
    uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
    setLocation('/');
  };

  const handleAddMoreImages = (newFiles: File[]) => {
    const newImages: UploadedImage[] = newFiles.map((file, index) => {
      const id = Date.now() + index + Math.random().toString(36).substr(2, 9);
      
      // Store actual file in global storage for compression
      if (!(window as any).imageFiles) {
        (window as any).imageFiles = new Map();
      }
      (window as any).imageFiles.set(id, file);
      
      return {
        id,
        file,
        originalSize: file.size,
        isCompressed: false,
        preview: URL.createObjectURL(file)
      };
    });
    
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  if (uploadedImages.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header with back button */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Button
                  variant="outline"
                  onClick={handleBackToHome}
                  className="mr-4 flex items-center"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Upload
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Compress Images</h1>
              </div>
            </div>

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
              onAddImages={handleAddMoreImages}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col min-h-screen">
          <div className="flex-1 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Compress images</h2>
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-blue-700">
                    All images will be compressed with the best quality and filesize ratio.
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Statistics</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Images:</span>
                    <span className="font-medium">{uploadedImages.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Compressed:</span>
                    <span className="font-medium text-success">
                      {uploadedImages.filter(img => img.isCompressed).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining:</span>
                    <span className="font-medium text-orange-600">
                      {uploadedImages.filter(img => !img.isCompressed).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total savings */}
              {uploadedImages.some(img => img.isCompressed) && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Total Savings</h3>
                  <div className="text-sm">
                    {(() => {
                      const compressedImages = uploadedImages.filter(img => img.isCompressed);
                      const totalOriginalSize = compressedImages.reduce((sum, img) => sum + img.originalSize, 0);
                      const totalCompressedSize = compressedImages.reduce((sum, img) => sum + (img.compressedSize || 0), 0);
                      const savings = totalOriginalSize > 0 ? Math.round(((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100) : 0;
                      
                      return (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Space Saved:</span>
                            <span className="font-medium text-success">{savings}%</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fixed Compress All Button at Bottom */}
          <div className="border-t border-gray-200 p-6 bg-white">
            <Button
              onClick={handleBatchCompress}
              disabled={isCompressing || uploadedImages.filter(img => !img.isCompressed).length === 0}
              className="w-full bg-primary text-white hover:bg-blue-700 font-medium py-4 text-lg shadow-lg"
            >
              {isCompressing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Compressing {progress.current}/{progress.total}...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                  </svg>
                  COMPRESS IMAGES ({uploadedImages.filter(img => !img.isCompressed).length})
                </>
              )}
            </Button>
          </div>
        </div>
      </div>


    </div>
  );
}