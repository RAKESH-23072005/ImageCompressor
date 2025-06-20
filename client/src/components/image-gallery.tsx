import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import ImageCard from "./image-card";
import { UploadedImage } from "./image-compressor";
import JSZip from "jszip";

interface ImageGalleryProps {
  images: UploadedImage[];
  onCompress: (imageId: string) => void;
  onDelete: (imageId: string) => void;
  onClearAll: () => void;
}

export default function ImageGallery({ images, onCompress, onDelete, onClearAll }: ImageGalleryProps) {
  const compressedImages = images.filter(img => img.isCompressed);
  const hasCompressedImages = compressedImages.length > 0;

  const handleDownloadAll = async () => {
    if (compressedImages.length === 0) return;

    const zip = new JSZip();
    
    for (const image of compressedImages) {
      if (image.compressedBlob) {
        const fileName = image.file.name.replace(/\.[^/.]+$/, "") + "_compressed" + image.file.name.match(/\.[^/.]+$/)?.[0];
        zip.file(fileName, image.compressedBlob);
      }
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
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Your Images</h3>
        <div className="flex space-x-3">
          {hasCompressedImages && (
            <Button
              onClick={handleDownloadAll}
              className="bg-success text-white hover:bg-green-600 font-medium flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Download All
            </Button>
          )}
          <Button
            onClick={onClearAll}
            variant="outline"
            className="text-gray-600 hover:text-gray-900 font-medium flex items-center"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onCompress={() => onCompress(image.id)}
            onDelete={() => onDelete(image.id)}
          />
        ))}
      </div>
    </div>
  );
}
