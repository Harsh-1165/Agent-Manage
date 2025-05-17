
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User, Plus, FileUp, Users } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-gradient min-h-screen">
      <header className="border-b border-border">
        <div className="container flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center text-white font-bold">A</div>
            <span className="logo-text">AuthApp</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/agents">Manage Agents</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/contacts">Manage Contacts</Link>
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="flex items-center">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container py-10 px-4">
        <h1 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          You're now signed in with your account
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{user?.email}</p>
                  <p className="text-sm text-muted-foreground">User ID: {user?.id.substring(0, 8)}...</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" className="w-full">Edit Profile</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Agent Management</CardTitle>
              <CardDescription>Manage your agents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/agents" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  View All Agents
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/agents" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Agent
                </Link>
              </Button>
            </CardContent>
            <CardFooter>
              <div className="w-full text-xs text-muted-foreground">
                Add agents to distribute your contacts among them
              </div>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Contact Management</CardTitle>
              <CardDescription>Upload and manage contacts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/contacts" className="flex items-center gap-2">
                  <FileUp className="h-4 w-4" />
                  Upload CSV Contacts
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/contacts" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  View Contact Distribution
                </Link>
              </Button>
            </CardContent>
            <CardFooter>
              <div className="w-full text-xs text-muted-foreground">
                Upload and distribute contacts among your agents
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Welcome to Your Dashboard</CardTitle>
            <CardDescription>This is a secure area for authenticated users only</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              You've successfully authenticated with JWT authentication. This dashboard is only accessible to logged in users.
            </p>
            <p>
              This is a simple demonstration of a protected route in a React application using JWT authentication.
              In a real application, you would have more features and functionality here.
            </p>
          </CardContent>
        </Card>
      </main>
      
      <footer className="border-t border-border">
        <div className="container p-4 text-sm text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} AuthApp. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
