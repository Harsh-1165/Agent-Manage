
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, User, Trash2, Mail, Phone } from "lucide-react";
import AddAgentForm from "@/components/agents/AddAgentForm";
import AgentList from "@/components/agents/AgentList";

interface Agent {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string;
  createdAt: string;
}

const Agents = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingAgent, setIsAddingAgent] = useState(false);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/agents", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch agents");
      }

      const data = await response.json();
      setAgents(data);
    } catch (error) {
      console.error("Error fetching agents:", error);
      toast({
        title: "Error",
        description: "Failed to load agents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [token]);

  const handleAddAgent = async (agentData: {
    name: string;
    email: string;
    mobileNumber: string;
    password: string;
  }) => {
    try {
      const response = await fetch("http://localhost:5000/api/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(agentData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add agent");
      }

      toast({
        title: "Success",
        description: "Agent added successfully"
      });

      setIsAddingAgent(false);
      fetchAgents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add agent",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/agents/${agentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete agent");
      }

      toast({
        title: "Success",
        description: "Agent deleted successfully"
      });

      fetchAgents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete agent",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center text-white font-bold">A</div>
            <span className="logo-text">AuthApp</span>
          </div>
        </div>
      </header>

      <main className="container py-10 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Agents</h1>
          <Button onClick={() => setIsAddingAgent(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Agent
          </Button>
        </div>

        {isAddingAgent ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Agent</CardTitle>
              <CardDescription>Fill in the details to add a new agent</CardDescription>
            </CardHeader>
            <CardContent>
              <AddAgentForm onSubmit={handleAddAgent} onCancel={() => setIsAddingAgent(false)} />
            </CardContent>
          </Card>
        ) : null}

        <AgentList 
          agents={agents} 
          loading={loading} 
          onDelete={handleDeleteAgent} 
        />
      </main>
    </div>
  );
};

export default Agents;
