import { useMemo } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import type { Angles } from '../types/angles';
import { normalRanges, STATUS_COLORS } from '../constants/diagnostics';

interface DiagnosticPanelProps {
  angles: Angles | null;
  isLoading: boolean;
  diagnosis: string | null;
  // must be a string array or null (consistent with App.tsx)
  recommendations: string[] | null;
}

export function DiagnosticPanel({ isLoading, recommendations, diagnosis, angles }: DiagnosticPanelProps) {
  // Transform angles object into array for mapping
  const displayResults = useMemo(() => angles
    ? Object.entries(angles).map(([key, angle]) => ({
      measurement: key,
      value: angle.value.toFixed(2),
      normalRange: normalRanges[key] || "-",
      status: angle.class, // arrives as '1', '2', or '3'
    }))
    : [], [angles]);

  const displayDiagnosis = diagnosis || "Based on the cephalometric analysis, the patient presents a Class I skeletal relationship with normal facial proportions. All angular measurements are within normal limits, indicating balanced craniofacial growth and development.";

  if (isLoading) {
    return (
      <Card className="p-6">
        <h3 className="mb-4">Analysis results</h3>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="mb-4">Analysis results</h3>

    {/* On mobile let the panel grow with content (no max-h) to stay consistent with image cards;
     on large screens align with image height (lg:h-[500px]) */}
    <ScrollArea className="h-auto lg:h-[500px] pr-4">
        <div className="space-y-6">
          {/* Measurements */}
          <div>
            <h4 className="mb-3">Cephalometric measurements</h4>
            <div className="space-y-3">
              {displayResults.map((result) => (
                <div key={result.measurement} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{result.measurement}</span>
                    <Badge
                      variant="outline"
                      className={STATUS_COLORS[result.status] ?? 'bg-gray-100 text-gray-800 border-gray-200'}
                    >
                      {result.status === '1'
                        ? 'Normal'
                        : result.status === '2'
                          ? 'Poor'
                          : result.status === '3'
                            ? 'Critical'
                            : 'Unknown'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Value: </span>
                      <span>{result.value}</span>
                    </div>
                    <div>
                      <span className="font-medium">Normal: </span>
                      <span>{result.normalRange}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* AI Diagnosis */}
          <div>
            <h4 className="mb-3">Diagnosis summary</h4>
            <Card className="p-4 bg-muted/50">
              <p className="text-sm leading-relaxed">
                {displayDiagnosis}
              </p>
            </Card>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="mb-3">Clinical recommendations</h4>
            <ul className="text-sm space-y-2 text-muted-foreground">
              {Array.isArray(recommendations) && recommendations.length > 0 ? (
                recommendations.map((rec, idx) => (
                  <li key={`rec-${idx}`}>• {rec}</li>
                ))
              ) : (
                <>
                  <li>• Continue with regular check-ups</li>
                  <li>• Consider biannual evaluations to monitor growth</li>
                  <li>• Monitor any changes in facial symmetry.</li>
                  <li>• Clinically evaluate occlusal relationships.</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
}
