import { Button } from "@/components/ui/button";
import { Download, Trash2, Plus, ArrowUpDown } from "lucide-react";
import ImageCard from "./image-card";
import { UploadedImage } from "./image-compressor";
import JSZip from "jszip";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ImageGalleryProps {
  images: UploadedImage[];
  onCompress: (imageId: string) => void;
  onDelete: (imageId: string) => void;
  onClearAll: () => void;
  onAddImages: (files: File[]) => void;
}

export default function ImageGallery({ images, onCompress, onDelete, onClearAll, onAddImages }: ImageGalleryProps) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();
  
  const compressedImages = images.filter(img => img.isCompressed);
  const hasCompressedImages = compressedImages.length > 0;

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const validFiles = fileArray.filter(file => {
        if (!validTypes.includes(file.type)) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not supported. Use JPG, PNG, GIF, or WebP.`,
            variant: "destructive",
          });
          return false;
        }
        return true;
      });
      
      if (validFiles.length > 0) {
        onAddImages(validFiles);
      }
    }
    e.target.value = '';
  };

  const handleAddMoreImages = () => {
    const input = document.getElementById('addMoreImagesGallery') as HTMLInputElement;
    input?.click();
  };

  const handleSortImages = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    // Sort images by filename
    const sortedImages = [...images].sort((a, b) => {
      const comparison = a.file.name.localeCompare(b.file.name);
      return newOrder === 'asc' ? comparison : -comparison;
    });
    // This would need to be passed back to parent, but for now we'll just show the toast
    toast({
      title: "Images sorted",
      description: `Arranged ${newOrder === 'asc' ? 'A to Z' : 'Z to A'}`,
    });
  };

  // Sort images based on current sort order
  const sortedImages = [...images].sort((a, b) => {
    const comparison = a.file.name.localeCompare(b.file.name);
    return sortOrder === 'asc' ? comparison : -comparison;
  });

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
          <Button
            onClick={handleSortImages}
            variant="outline"
            className="text-gray-600 hover:text-gray-900 font-medium flex items-center"
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Arrange {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
          </Button>
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

      <div className="flex justify-start mb-6">
        <Button
          onClick={handleAddMoreImages}
          className="bg-primary text-white hover:bg-blue-700 font-medium flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add More Images
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedImages.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onCompress={() => onCompress(image.id)}
            onDelete={() => onDelete(image.id)}
          />
        ))}
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        id="addMoreImagesGallery"
        multiple
        accept=".jpg,.jpeg,.png,.gif,.webp"
        className="hidden"
        onChange={handleFileInput}
      />
    </div>
  );
}
