import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  uploadedImage: File | null;
}

export function ImageUpload({ onImageUpload, uploadedImage }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setFileError(null);
      onImageUpload(file);
    } else if (file) {
      setFileError('Unsupported format. Use JPG, PNG, or WEBP.');
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card className='p-6 border-2 border-dashed border-border hover:border-primary/50 transition-colors'>
      <div className='text-center space-y-4'>
        <div className='flex justify-center'>
          <div className='p-4 rounded-full bg-muted'>
            {uploadedImage ? (
              <ImageIcon className='w-8 h-8 text-muted-foreground' />
            ) : (
              <Upload className='w-8 h-8 text-muted-foreground' />
            )}
          </div>
        </div>

        <div>
          <h3>X-ray image upload</h3>
          <p className='text-muted-foreground mt-1'>
            Select a high-quality cephalogram
          </p>
        </div>

        {uploadedImage && (
          <div className='text-sm text-primary'>
            ✓ Image uploaded successfully!
          </div>
        )}

        <Button
          onClick={handleButtonClick}
          variant={uploadedImage ? "secondary" : "default"}
          className='w-full'
        >
          {uploadedImage ? "Change image" : "Select image"}
        </Button>

        {fileError && (
          <p className='text-xs text-red-600'>{fileError}</p>
        )}

        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          onChange={handleFileSelect}
          className='hidden'
        />

        <p className='text-xs text-muted-foreground'>
          Supported formats: JPG, PNG, WEBP
        </p>
      </div>
    </Card>
  )
}
