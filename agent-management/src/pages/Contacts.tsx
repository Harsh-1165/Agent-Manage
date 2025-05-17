
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUp, ListChecks } from "lucide-react";
import CsvUploadForm from "@/components/contacts/CsvUploadForm";
import DistributionSummary from "@/components/contacts/DistributionSummary";
import { useNavigate } from "react-router-dom";

const Contacts = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upload");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUploadSuccess = () => {
    // Switch to distribution tab and trigger refresh
    setActiveTab("distribution");
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center text-white font-bold">A</div>
            <span className="logo-text">AuthApp</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
            <Button variant="ghost" onClick={() => navigate('/agents')}>
              Agents
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-10 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Contact Management</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid grid-cols-2 gap-4 max-w-md">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <FileUp className="h-4 w-4" /> 
              Upload Contacts
            </TabsTrigger>
            <TabsTrigger value="distribution" className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" /> 
              View Distribution
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <CsvUploadForm onUploadSuccess={handleUploadSuccess} />
                
                <div className="px-4 py-3 bg-muted/30 rounded-lg border">
                  <h3 className="font-medium text-base mb-2">Template Format</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your CSV or Excel file should have the following columns:
                  </p>
                  <div className="text-sm bg-background rounded border overflow-hidden">
                    <div className="grid grid-cols-3 border-b text-xs font-medium bg-muted/50 px-3 py-1.5">
                      <div>FirstName</div>
                      <div>Phone</div>
                      <div>Notes (Optional)</div>
                    </div>
                    <div className="grid grid-cols-3 px-3 py-1.5 text-xs text-muted-foreground">
                      <div>John</div>
                      <div>1234567890</div>
                      <div>New lead</div>
                    </div>
                    <div className="grid grid-cols-3 px-3 py-1.5 text-xs text-muted-foreground border-t">
                      <div>Jane</div>
                      <div>9876543210</div>
                      <div>Follow up</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 border rounded-lg p-6 flex flex-col items-center justify-center text-center">
                <img src="/placeholder.svg" alt="Upload illustration" className="w-32 h-32 mb-4" />
                <h3 className="text-xl font-medium mb-2">Automate Your Contact Distribution</h3>
                <p className="text-muted-foreground">
                  Upload your contact list and our system will automatically distribute them 
                  equally among your agents, saving you time and effort.
                </p>
                <ul className="text-sm text-left w-full mt-4 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground">✓</span>
                    Distribute contacts fairly among agents
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground">✓</span>
                    Support for CSV and Excel files
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground">✓</span>
                    Easy-to-view distribution summary
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="distribution" key={refreshTrigger}>
            <DistributionSummary />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="border-t border-border">
        <div className="container p-4 text-sm text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} AuthApp. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Contacts;
