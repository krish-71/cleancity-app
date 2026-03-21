import { useApp } from "@/lib/store";
import { ComplaintCard } from "@/components/complaint-card";
import { Button } from "@/components/ui/button";
import { MapView } from "@/components/map-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { User } from "@/lib/store";
import { UserCheck, UserX, ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
  const { complaints } = useApp();
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch("/api/admin/users?role=pending_admin");
      if (res.ok) {
        const data = await res.json();
        setPendingUsers(data);
      }
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "admin" }),
      });
      if (res.ok) {
        setPendingUsers(pendingUsers.filter(u => u.id !== userId));
      }
    } catch (err) {
      console.error("Approval failed", err);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "citizen" }),
      });
      if (res.ok) {
        setPendingUsers(pendingUsers.filter(u => u.id !== userId));
      }
    } catch (err) {
      console.error("Rejection failed", err);
    }
  };

  // Stats for chart
  const statusCounts = complaints.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = [
    { name: "Pending", value: statusCounts.pending || 0, color: "var(--chart-3)" },
    { name: "In Progress", value: statusCounts.in_progress || 0, color: "var(--chart-5)" },
    { name: "Resolved", value: statusCounts.resolved || 0, color: "var(--chart-1)" },
    { name: "Rejected", value: statusCounts.rejected || 0, color: "var(--chart-4)" },
  ];

  const mapMarkers = complaints.map(c => ({
    id: c.id,
    lat: c.lat,
    lng: c.lng,
    title: c.category
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage city-wide waste complaints and monitor progress.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {chartData.map((item, i) => (
          <Card key={i} className="border-l-4" style={{ borderLeftColor: item.color }}>
            <CardContent className="p-6">
              <div className="text-2xl font-bold mb-1">{item.value}</div>
              <div className="text-sm text-muted-foreground">{item.name} Complaints</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="stats">Analytics</TabsTrigger>
          <TabsTrigger value="access" className="relative">
            Manage Access
            {pendingUsers.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-bold">
                {pendingUsers.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.map(complaint => (
              <ComplaintCard key={complaint.id} complaint={complaint} isAdmin />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="map">
          <Card className="h-[600px] overflow-hidden">
            <MapView markers={mapMarkers} interactive zoom={12} />
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Complaint Status Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Admin Requests</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Review and approve requests for administrator access.</p>
              </div>
              <ShieldCheck className="w-8 h-8 text-primary opacity-50" />
            </CardHeader>
            <CardContent>
              {pendingUsers.length === 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed">
                  <p className="text-muted-foreground">No pending admin requests.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingUsers.map(u => (
                    <div key={u.id} className="flex items-center justify-between p-4 bg-card border rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-bold">{u.name[0]?.toUpperCase()}</span>
                        </div>
                        <div>
                          <div className="font-semibold">{u.name}</div>
                          <div className="text-sm text-muted-foreground">{u.username}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleReject(u.id)}
                        >
                          <UserX className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-primary hover:bg-primary/90"
                          onClick={() => handleApprove(u.id)}
                        >
                          <UserCheck className="w-4 h-4 mr-1" />
                          Approve Admin
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
