import { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { ImageUpload } from './components/ImageUpload';
import { ImageDisplay } from './components/ImageDisplay';
import { DiagnosticPanel } from './components/DiagnosticPanel';
import { Brain, FileText, Zap } from 'lucide-react';
import type { Angles } from './types/angles';
import { textSuccess, textFailure } from './constants/diagnostics';

export type { Angles } from './types/angles';

const API_PREFIX = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
const DIAG_PREFIX = import.meta.env.VITE_DIAG_URL ?? "http://localhost:3001";

function App() {
  const [originalImage, setOriginalImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzedImage, setAnalyzedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isDiagnosing, setIsDiagnosing] = useState(false)
  const [angles, setAngles] = useState<Angles | null>(null);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!originalImage) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(originalImage);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [originalImage]);

  const handleImageUpload = (file: File) => {
    setOriginalImage(file);
    setAnalyzedImage(null);
    setError(null);
  };

  const handleGenerateAnalysis = async () => {
    if (!originalImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", originalImage);

      const response = await fetch(`${API_PREFIX}/process-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? "API error");
      }

      const data = await response.json();

      const filename = data.image_with_overlay_path.replace(/^.*[\\/]/, "");
      const imageUrl = `${API_PREFIX}/download-image/${filename}`;
      setAnalyzedImage(imageUrl);
      setAngles(data.angles);

      await handleSendAnglesToAi(data.angles);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error during analysis");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendAnglesToAi = async (angles: Angles) => {
    if (!angles) return;

    setIsDiagnosing(true);
    try {
      const response = await fetch(`${DIAG_PREFIX}/diagnosis`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(angles),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? "Diagnosis API error");
      }

      const data = await response.json();
      setDiagnosis(data.diagnosis);
      setRecommendations(data.recommendations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error during diagnosis");
    } finally {
      setIsDiagnosing(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header>
        <div className='border-b bg-card'>
          <div className='flex items-center gap-3'>
            <div>
              <h1 className='text-3xl font-bold'>CephaloAI</h1>
              <p className='text-sm text-muted-foreground'>
                Automated cephalogram analysis
              </p>
            </div>
          </div>
        </div>
      </header>
      <main className='container mx-auto px-6 py-8'>
        {error && (
          <div className='mb-6 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700'>
            {error}
          </div>
        )}
        <div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>
          {/* Left column - Upload and Controls*/}
          <div className='space-y-6'>
            <ImageUpload
              onImageUpload={handleImageUpload}
              uploadedImage={originalImage}
            />

            <Card className='p-6'>
              <div className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <Zap className='w-5 h-5 text-primary' />
                  <h3>Analysis controls</h3>
                </div>

                <Button
                  onClick={handleGenerateAnalysis}
                  disabled={!originalImage || isAnalyzing || isDiagnosing}
                  className='w-full'
                  size='lg'
                >
                  {isAnalyzing ? (
                    <>
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                      Analyzing...
                    </>
                  ) : isDiagnosing ? (
                    <>
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                      Generating diagnosis...
                    </>
                  ) : (
                    <>
                      <Brain className='w-4 h-4 mr-2' />
                      Generate analysis
                    </>
                  )}
                </Button>

                <div className='text-xs text-muted-foreground space-y-1'>
                  <p>• Upload a lateral X-ray</p>
                  <p>• Click "Generate analysis" to process</p>
                  <p>• View results and measurements</p>
                </div>
              </div>
            </Card>

            <Card className='p-6'>
              <div className='flex items-center gap-2 mb-3'>
                <FileText className='w-5 h-5 text-primary' />
                <h3>Analysis status</h3>
              </div>
              <div className='space-y-2 text-sm'>
                <div className='flex items-center justify-between'>
                  <span>Image upload</span>
                  <span className={originalImage ? textSuccess : textFailure}>
                    {originalImage ? "✓ Done" : "Pending"}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span>Landmark detection</span>
                  <span className={analyzedImage !== null ? textSuccess : textFailure}>
                    {isAnalyzing ? "Processing..." : analyzedImage !== null ? "✓ Done" : "Pending"}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span>Measurements analysis</span>
                  <span className={angles ? textSuccess : textFailure}>
                    {angles ? "✓ Done" : "Pending"}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span>AI diagnosis</span>
                  <span className={diagnosis ? textSuccess : textFailure}>
                    {isDiagnosing ? "Processing..." : diagnosis ? "✓ Done" : "Pending"}
                  </span>
                </div>
              </div>
            </Card>
          </div>


          {/* Right column - Images and Results */}
          {/* min-h-0 allows children with h-full/min-height to shrink correctly in flex/grid layouts */}
          <div className='xl:col-span-2 space-y-8 min-h-0'>
            <ImageDisplay
              originalImage={previewUrl}
              analyzedImage={analyzedImage}
            />

            {analyzedImage !== null && recommendations && (
              <DiagnosticPanel
                angles={angles}
                isLoading={isAnalyzing}
                recommendations={recommendations}
                diagnosis={diagnosis}
              />
            )}
          </div>
        </div>

      </main>
    </div>
  )
}

export default App
