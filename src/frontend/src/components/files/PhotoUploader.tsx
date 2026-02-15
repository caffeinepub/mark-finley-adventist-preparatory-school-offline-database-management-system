import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { ExternalBlob } from '../../backend';

interface PhotoUploaderProps {
  value?: ExternalBlob;
  onChange: (photo?: ExternalBlob) => void;
}

export function PhotoUploader({ value, onChange }: PhotoUploaderProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const bytes = new Uint8Array(await file.arrayBuffer());
    const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
      setUploadProgress(percentage);
    });

    onChange(blob);
    setUploadProgress(0);
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative inline-block">
          <img
            src={value.getDirectURL()}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2"
            onClick={() => onChange(undefined)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Photo
          </Button>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <p className="text-sm text-muted-foreground mt-2">
              Uploading: {uploadProgress}%
            </p>
          )}
        </div>
      )}
    </div>
  );
}
