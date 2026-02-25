import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Types
export type User = {
  id: string;
  email: string;
  name: string;
  role: "citizen" | "admin";
};

export type ComplaintStatus = "pending" | "in_progress" | "resolved" | "rejected";

export type Complaint = {
  id: string;
  userId: string;
  category: "organic" | "recyclable" | "hazardous" | "construction" | "other";
  description: string;
  imageUrl?: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
};

type AppState = {
  user: User | null;
  complaints: Complaint[];
  login: (email: string, role: "citizen" | "admin") => void;
  logout: () => void;
  addComplaint: (complaint: Omit<Complaint, "id" | "userId" | "status" | "createdAt" | "updatedAt">) => void;
  updateComplaintStatus: (id: string, status: ComplaintStatus) => void;
};

const AppContext = createContext<AppState | undefined>(undefined);

// Mock Data
const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: "1",
    userId: "user-1",
    category: "organic",
    description: "Overflowing compost bin in the park.",
    imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b",
    location: { lat: 40.7128, lng: -74.0060, address: "Central Park, NY" },
    status: "pending",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "2",
    userId: "user-2",
    category: "hazardous",
    description: "Batteries dumped on the sidewalk.",
    imageUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9",
    location: { lat: 40.7282, lng: -73.9942, address: "5th Ave, NY" },
    status: "in_progress",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 100000).toISOString(),
  },
  {
    id: "3",
    userId: "user-1",
    category: "recyclable",
    description: "Plastic bottles scattered near the playground.",
    imageUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41",
    location: { lat: 40.7589, lng: -73.9851, address: "Times Square, NY" },
    status: "resolved",
    createdAt: new Date(Date.now() - 400000000).toISOString(),
    updatedAt: new Date(Date.now() - 1000000).toISOString(),
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>(MOCK_COMPLAINTS);
  const { toast } = useToast();

  const login = (email: string, role: "citizen" | "admin") => {
    setUser({
      id: role === "admin" ? "admin-1" : "user-1",
      email,
      name: email.split("@")[0],
      role,
    });
    toast({
      title: `Welcome back, ${email.split("@")[0]}!`,
      description: "You have successfully logged in.",
    });
  };

  const logout = () => {
    setUser(null);
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  const addComplaint = (data: Omit<Complaint, "id" | "userId" | "status" | "createdAt" | "updatedAt">) => {
    const newComplaint: Complaint = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      userId: user?.id || "anonymous",
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setComplaints([newComplaint, ...complaints]);
    toast({
      title: "Complaint Submitted",
      description: "We have received your report and will act on it soon.",
    });
  };

  const updateComplaintStatus = (id: string, status: ComplaintStatus) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c));
    toast({
      title: "Status Updated",
      description: `Complaint #${id} marked as ${status.replace("_", " ")}.`,
    });
  };

  return (
    <AppContext.Provider value={{ user, complaints, login, logout, addComplaint, updateComplaintStatus }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
