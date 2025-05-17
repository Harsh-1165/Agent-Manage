
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Users } from "lucide-react";
import ContactListTable from "./ContactListTable";

interface Agent {
  _id: string;
  name: string;
  email: string;
}

interface DistributionItem {
  agentId: string;
  name: string;
  email: string;
  contactCount: number;
}

interface DistributionData {
  agents: Agent[];
  distribution: DistributionItem[];
}

const DistributionSummary = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [distributionData, setDistributionData] = useState<DistributionData>({ 
    agents: [], 
    distribution: [] 
  });
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  useEffect(() => {
    const fetchDistribution = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/contacts/distribution", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch distribution data");
        }

        const data = await response.json();
        setDistributionData(data);
        
        // Set first agent as selected by default if available
        if (data.agents && data.agents.length > 0) {
          setSelectedAgent(data.agents[0]._id);
        }
      } catch (error) {
        console.error("Error fetching distribution:", error);
        toast({
          title: "Error",
          description: "Failed to load distribution data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDistribution();
  }, [token]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contact Distribution</CardTitle>
          <CardDescription>Loading distribution data...</CardDescription>
        </CardHeader>
        <CardContent className="h-40 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        </CardContent>
      </Card>
    );
  }

  if (distributionData.agents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contact Distribution</CardTitle>
          <CardDescription>No agents available</CardDescription>
        </CardHeader>
        <CardContent className="h-40 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Users className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p>You need to add agents before distributing contacts</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Find the distribution for a specific agent
  const getDistributionForAgent = (agentId: string) => {
    return distributionData.distribution.find(item => item.agentId === agentId) || {
      agentId,
      contactCount: 0,
      name: '',
      email: ''
    };
  };

  const totalContacts = distributionData.distribution.reduce(
    (sum, item) => sum + item.contactCount, 0
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Distribution Summary</CardTitle>
          <CardDescription>
            {totalContacts} contacts distributed among {distributionData.agents.length} agents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {distributionData.agents.map((agent) => {
              const distribution = getDistributionForAgent(agent._id);
              const contactCount = distribution.contactCount || 0;
              
              return (
                <div 
                  key={agent._id} 
                  className="border rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-sm text-muted-foreground">{agent.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{contactCount}</p>
                    <p className="text-xs text-muted-foreground">contacts</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Agent Contact Lists</CardTitle>
          <CardDescription>
            View the contacts assigned to each agent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedAgent || undefined} onValueChange={setSelectedAgent}>
            <TabsList className="mb-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {distributionData.agents.map((agent) => (
                <TabsTrigger key={agent._id} value={agent._id} className="w-full">
                  {agent.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {distributionData.agents.map((agent) => (
              <TabsContent key={agent._id} value={agent._id}>
                <ContactListTable 
                  agentId={agent._id} 
                  agentName={agent.name} 
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DistributionSummary;
