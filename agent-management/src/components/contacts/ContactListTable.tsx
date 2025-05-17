
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Contact {
  _id: string;
  firstName: string;
  phone: string;
  notes: string;
  createdAt: string;
}

interface ContactListTableProps {
  agentId: string;
  agentName: string;
}

const ContactListTable = ({ agentId, agentName }: ContactListTableProps) => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/contacts/agent/${agentId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch contacts");
        }

        const data = await response.json();
        setContacts(data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        toast({
          title: "Error",
          description: "Failed to load contacts",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [agentId, token]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{agentName}'s Contact List</CardTitle>
        <CardDescription>
          {contacts.length > 0 
            ? `Showing ${contacts.length} assigned contacts` 
            : "No contacts assigned yet"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-muted-foreground">
            No contacts have been assigned to this agent yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>First Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Date Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact._id}>
                    <TableCell className="font-medium">{contact.firstName}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>{contact.notes || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactListTable;
