
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Trash2 } from "lucide-react";

interface Agent {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string;
  createdAt: string;
}

interface AgentListProps {
  agents: Agent[];
  loading: boolean;
  onDelete: (id: string) => void;
}

const AgentList = ({ agents, loading, onDelete }: AgentListProps) => {
  if (loading) {
    return (
      <div className="w-full py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-muted-foreground">No agents found. Add your first agent using the button above.</p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {agents.map((agent) => (
        <Card key={agent._id} className="overflow-hidden">
          <CardHeader className="bg-muted/50">
            <CardTitle className="flex justify-between items-center">
              <span className="truncate">{agent.name}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-destructive hover:text-destructive/90" 
                onClick={() => onDelete(agent._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate">{agent.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{agent.mobileNumber}</span>
              </div>
              <div className="pt-2 text-xs text-muted-foreground border-t">
                Added on {formatDate(agent.createdAt)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AgentList;
