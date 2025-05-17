
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileType, AlertCircle } from "lucide-react";

interface UploadResponse {
  message: string;
  distributionSummary: {
    agent: {
      _id: string;
      name: string;
      email: string;
    };
    count: number;
  }[];
}

interface CsvUploadFormProps {
  onUploadSuccess: () => void;
}

const CsvUploadForm = ({ onUploadSuccess }: CsvUploadFormProps) => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      
      if (!['csv', 'xlsx', 'xls'].includes(fileExtension || '')) {
        setError('Only CSV, XLSX, and XLS files are allowed');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    setUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('http://localhost:5000/api/contacts/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error uploading file');
      }
      
      // Show success toast with distribution summary
      toast({
        title: "Upload Successful",
        description: data.message
      });
      
      // Display distribution summary
      if (data.distributionSummary) {
        data.distributionSummary.forEach((item: any) => {
          toast({
            title: `${item.agent.name}`,
            description: `Assigned ${item.count} contacts`
          });
        });
      }
      
      setFile(null);
      // Notify parent component that upload was successful
      onUploadSuccess();
      
    } catch (error: any) {
      console.error("Upload error:", error);
      setError(error.message || 'Error uploading file');
      toast({
        title: "Upload Failed",
        description: error.message || 'Error uploading file',
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Contact List</CardTitle>
        <CardDescription>
          Upload a CSV or Excel file with contacts to distribute among your agents.
          The file must contain columns: FirstName, Phone, and optionally Notes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="file" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Select File (CSV, XLSX, XLS)
              </label>
              <div className="flex items-center gap-4">
                <Input
                  id="file"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="w-full"
                  disabled={uploading}
                />
              </div>
              {file && (
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <FileType className="h-4 w-4" />
                  <span>{file.name} ({(file.size / 1024).toFixed(0)} KB)</span>
                </div>
              )}
              {error && (
                <div className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full mt-6" 
            disabled={!file || uploading}
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Uploading...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload and Distribute
              </span>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="bg-muted/50 text-xs text-muted-foreground">
        <p className="flex flex-col space-y-1">
          <span>• Contacts will be distributed equally among your agents</span>
          <span>• Each agent will receive approximately the same number of contacts</span>
          <span>• The system will handle any remainder distribution automatically</span>
        </p>
      </CardFooter>
    </Card>
  );
};

export default CsvUploadForm;
