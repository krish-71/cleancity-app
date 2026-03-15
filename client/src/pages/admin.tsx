import { useApp } from "@/lib/store";
import { ComplaintCard } from "@/components/complaint-card";
import { Button } from "@/components/ui/button";
import { MapView } from "@/components/map-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const { complaints } = useApp();

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
      </Tabs>
    </div>
  );
}
