import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { formatFileSize } from "@/lib/image-utils";
import JSZip from "jszip";

interface CompressedImageData {
  id: string;
  originalName: string;
  originalSize: number;
  compressedSize: number;
  compressedBlob: Blob;
}

export default function DownloadPage() {
  const [, setLocation] = useLocation();
  const [compressedImages, setCompressedImages] = useState<CompressedImageData[]>([]);
  const [totalSavings, setTotalSavings] = useState(0);

  useEffect(() => {
    const storedCompressedImages = sessionStorage.getItem('compressedImages');
    if (storedCompressedImages) {
      const parsedImages = JSON.parse(storedCompressedImages);
      
      // Restore compressed blobs from global storage
      const compressedBlobs = (window as any).compressedBlobs;
      if (compressedBlobs) {
        const imagesWithBlobs = parsedImages.map((img: any) => ({
          ...img,
          compressedBlob: compressedBlobs.get(img.id)
        })).filter((img: any) => img.compressedBlob); // Only include images with valid blobs
        
        setCompressedImages(imagesWithBlobs);
        
        // Calculate total savings
        const totalOriginal = imagesWithBlobs.reduce((sum: number, img: any) => sum + img.originalSize, 0);
        const totalCompressed = imagesWithBlobs.reduce((sum: number, img: any) => sum + img.compressedSize, 0);
        const savings = totalOriginal > 0 ? Math.round(((totalOriginal - totalCompressed) / totalOriginal) * 100) : 0;
        setTotalSavings(savings);
      }
      
      // Clear from session storage
      sessionStorage.removeItem('compressedImages');
    } else {
      // Redirect to home if no compressed images
      setLocation('/');
    }
  }, [setLocation]);

  const handleDownloadAll = async () => {
    if (compressedImages.length === 0) return;

    if (compressedImages.length === 1) {
      // Download single file directly
      const image = compressedImages[0];
      const url = URL.createObjectURL(image.compressedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = image.originalName.replace(/\.[^/.]+$/, "") + "_compressed" + image.originalName.match(/\.[^/.]+$/)?.[0];
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Download as ZIP for multiple files
      const zip = new JSZip();
      
      for (const image of compressedImages) {
        const fileName = image.originalName.replace(/\.[^/.]+$/, "") + "_compressed" + image.originalName.match(/\.[^/.]+$/)?.[0];
        zip.file(fileName, image.compressedBlob);
      }

      try {
        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'compressed_images.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Failed to create zip file:', error);
      }
    }
  };

  const handleBackToCompress = () => {
    setLocation('/');
  };

  const totalOriginalSize = compressedImages.reduce((sum, img) => sum + img.originalSize, 0);
  const totalCompressedSize = compressedImages.reduce((sum, img) => sum + img.compressedSize, 0);

  if (compressedImages.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your IMAGES have been compressed!
          </h1>
          
          {/* Download Button */}
          <Button
            onClick={handleDownloadAll}
            className="bg-primary text-white hover:bg-blue-700 font-medium px-8 py-3 text-lg shadow-lg mb-6"
          >
            <Download className="mr-2 h-5 w-5" />
            Download compressed IMAGES
          </Button>
          
          {/* Back Button */}
          <Button
            onClick={handleBackToCompress}
            variant="outline"
            className="ml-4 px-6 py-3"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Savings Circle */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-8 border-primary flex items-center justify-center bg-white shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{totalSavings}%</div>
                <div className="text-xs text-gray-600">smaller</div>
              </div>
            </div>
          </div>
          <div className="ml-6 flex flex-col justify-center">
            <p className="text-gray-700 mb-1">
              Your images are now <span className="font-semibold text-primary">{totalSavings}% smaller!</span>
            </p>
            <p className="text-sm text-gray-600">
              {formatFileSize(totalOriginalSize)} → {formatFileSize(totalCompressedSize)}
            </p>
          </div>
        </div>

        {/* Continue Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Continue to...</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="flex items-center justify-start p-4 h-auto"
              onClick={() => setLocation('/')}
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Download className="w-4 h-4 text-blue-600" />
              </div>
              <span>Resize IMAGE</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-start p-4 h-auto"
              onClick={() => setLocation('/')}
            >
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Download className="w-4 h-4 text-green-600" />
              </div>
              <span>Rotate IMAGE</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-start p-4 h-auto"
              onClick={() => setLocation('/')}
            >
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <Download className="w-4 h-4 text-yellow-600" />
              </div>
              <span>Convert to JPG</span>
            </Button>
          </div>
          <Button
            variant="outline"
            className="flex items-center justify-start p-4 h-auto mt-4"
            onClick={() => setLocation('/')}
          >
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <Download className="w-4 h-4 text-purple-600" />
            </div>
            <span>Watermark IMAGE</span>
          </Button>
        </div>

        {/* Social Sharing */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How can you thank us? Spread the word!</h3>
          <p className="text-gray-600 mb-4">Please share this tool to inspire more productive people!</p>
          <div className="flex space-x-4">
            <Button variant="outline" size="sm" className="flex items-center">
              <Share2 className="mr-2 h-4 w-4" />
              Trustpilot
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <Facebook className="mr-2 h-4 w-4" />
              Facebook
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <Twitter className="mr-2 h-4 w-4" />
              Twitter
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <Linkedin className="mr-2 h-4 w-4" />
              LinkedIn
            </Button>
          </div>
        </div>

        {/* Trust Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your trusted online image editor, loved by users worldwide
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            docFlow is your simple solution for editing images online. Access all the tools 
            you need to enhance your images easily, straight from the web, with 100% security.
          </p>
        </div>
      </main>
    </div>
  );
}