import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ImageDisplayProps {
  originalImage: string | null;
  analyzedImage: string | null;
}

export function ImageDisplay({ originalImage, analyzedImage }: ImageDisplayProps) {
  return (
    // make height responsive: avoid forcing 500px on small screens
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[500px] h-auto">
      {/* Original Image */}
      <Card className="p-4 bg-black">
        <div className="mb-3">
          <h3 className="text-white">Original image</h3>
        </div>
  <div className="h-full min-h-0 bg-black rounded border border-gray-700 flex items-center justify-center relative">
          {originalImage ? (
            <ImageWithFallback
              src={originalImage}
              alt="Original cephalometric X-ray"
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <div className="text-center text-gray-400">
              <div className="w-16 h-16 mx-auto mb-3 bg-gray-800 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p>Upload an image to start the analysis</p>
            </div>
          )}
        </div>
      </Card>

      {/* Analyzed Image with Points */}
      <Card className="p-4 bg-black">
        <div className="mb-3">
          <h3 className="text-white">Analyzed image</h3>
        </div>
  <div className="h-full min-h-0 bg-black rounded border border-gray-700 flex items-center justify-center relative">
          {analyzedImage ? (
            <ImageWithFallback
              src={analyzedImage}
              alt="Analyzed cephalometric X-ray with anatomical points"
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <div className="text-center text-gray-400">
              <div className="w-16 h-16 mx-auto mb-3 bg-gray-800 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p>Analysis will appear here</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
