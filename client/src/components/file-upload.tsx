import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";

export function FileUpload({ onFileSelect }: { onFileSelect: (file: File | null) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onFileSelect(file);
    }
  };

  const clearFile = () => {
    setPreview(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      
      {!preview ? (
        <div 
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all group"
        >
          <div className="bg-background p-3 rounded-full mb-3 shadow-sm group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground">Click to upload photo</p>
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 5MB</p>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border bg-background group">
          <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button variant="destructive" size="sm" onClick={clearFile} className="gap-2">
              <X className="w-4 h-4" /> Remove Photo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
