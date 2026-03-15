import { useState } from "react";
import { useLocation } from "wouter";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/file-upload";
import { MapView } from "@/components/map-view";
import { MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function NewComplaint() {
  const { addComplaint, user } = useApp();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Form State
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to submit a complaint.", variant: "destructive" });
      return;
    }
    
    if (!category || !description || !address || !coords) {
      toast({ title: "Missing fields", description: "Please fill in all fields including location.", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      let imageUrl = undefined;

      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Failed to upload image");
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.imageUrl;
      }

      await addComplaint({
        category: category as any,
        description,
        imageUrl,
        lat: coords.lat,
        lng: coords.lng,
        address
      });

      toast({ title: "Success", description: "Complaint submitted successfully!" });
      setLocation("/dashboard");
    } catch (err: any) {
      toast({ title: "Submission Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setCoords({ lat, lng });
    setAddress("Selected Location on Map"); // In real app, reverse geocode here
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading">Report an Issue</h1>
        <p className="text-muted-foreground">Help us keep the city clean by reporting waste.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form Side */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Issue Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select waste type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="organic">Organic Waste</SelectItem>
                    <SelectItem value="recyclable">Recyclable Waste</SelectItem>
                    <SelectItem value="hazardous">Hazardous Waste</SelectItem>
                    <SelectItem value="construction">Construction Debris</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  placeholder="Describe the issue..." 
                  className="resize-none h-32"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Photo Evidence</Label>
                <FileUpload onFileSelect={setFile} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Location Side */}
        <div className="space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4 min-h-[400px]">
              <div className="space-y-2">
                <Label>Address/Landmark</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Enter address or click on map" 
                    className="pl-9"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex-1 border rounded-md overflow-hidden relative min-h-[300px]">
                <MapView onLocationSelect={handleLocationSelect} />
                {!coords && (
                  <div className="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none z-[1000]">
                    <div className="bg-background/90 px-4 py-2 rounded-full text-sm font-medium shadow-sm backdrop-blur">
                      Click map to set location
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <Button size="lg" className="w-full md:w-auto px-8" onClick={handleSubmit} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Submit Complaint
        </Button>
      </div>
    </div>
  );
}
