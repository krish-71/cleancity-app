import { useApp } from "@/lib/store";
import { ComplaintCard } from "@/components/complaint-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Plus, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Dashboard() {
  const { user, complaints } = useApp();
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <h2 className="text-2xl font-bold mb-4">Please log in to view your dashboard</h2>
        <Link href="/auth"><Button>Log In</Button></Link>
      </div>
    );
  }

  const myComplaints = complaints.filter(c => c.userId === user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">My Dashboard</h1>
          <p className="text-muted-foreground">Track and manage your reported issues</p>
        </div>
        <Link href="/new-complaint">
          <Button className="gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
            <Plus className="w-4 h-4" /> Report New Issue
          </Button>
        </Link>
      </div>

      {user.role === "pending_admin" && (
        <Alert className="mb-8 border-primary/20 bg-primary/5">
          <Clock className="h-4 w-4 text-primary" />
          <AlertTitle>Admin Approval Pending</AlertTitle>
          <AlertDescription>
            Your request for administrator access is being reviewed. Until approved, you can continue using the portal as a citizen.
          </AlertDescription>
        </Alert>
      )}

      {myComplaints.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-muted rounded-xl bg-muted/10">
          <h3 className="text-xl font-semibold mb-2">No complaints found</h3>
          <p className="text-muted-foreground mb-6">You haven't reported any issues yet.</p>
          <Link href="/new-complaint">
            <Button variant="outline">Report your first issue</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myComplaints.map(complaint => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))}
        </div>
      )}
    </div>
  );
}
