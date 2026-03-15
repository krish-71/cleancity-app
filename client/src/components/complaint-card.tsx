import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Complaint, useApp } from "@/lib/store";
import { MapPin, Calendar, Clock, CheckCircle2, AlertTriangle, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-700 border-blue-200", icon: AlertTriangle },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700 border-red-200", icon: Trash2 },
};

const CATEGORY_LABELS = {
  organic: "Organic Waste",
  recyclable: "Recyclable",
  hazardous: "Hazardous",
  construction: "Construction",
  other: "Other"
};

export function ComplaintCard({ complaint, isAdmin = false }: { complaint: Complaint; isAdmin?: boolean }) {
  const { updateComplaintStatus } = useApp();
  const StatusIcon = STATUS_CONFIG[complaint.status].icon;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow group border-border/50">
      <div className="aspect-video w-full bg-muted relative overflow-hidden">
        {complaint.imageUrl ? (
          <img 
            src={complaint.imageUrl} 
            alt={complaint.category} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/30">
            <Trash2 className="w-12 h-12 opacity-20" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge className={`${STATUS_CONFIG[complaint.status].color} border shadow-sm`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {STATUS_CONFIG[complaint.status].label}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start mb-1">
          <Badge variant="outline" className="uppercase text-[10px] tracking-wider font-semibold">
            {CATEGORY_LABELS[complaint.category]}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDistanceToNow(new Date(complaint.createdAt))} ago
          </span>
        </div>
        <h3 className="font-semibold text-lg line-clamp-1">{complaint.description}</h3>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <div className="flex items-center text-sm text-muted-foreground mt-2">
          <MapPin className="w-4 h-4 mr-1 text-primary shrink-0" />
          <span className="truncate">{complaint.address}</span>
        </div>
      </CardContent>

      {isAdmin && (
        <CardFooter className="p-4 bg-muted/20 border-t flex justify-between items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Update Status:</span>
          <Select 
            defaultValue={complaint.status} 
            onValueChange={(val) => updateComplaintStatus(complaint.id, val as any)}
          >
            <SelectTrigger className="w-[140px] h-8 text-xs bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </CardFooter>
      )}
    </Card>
  );
}
