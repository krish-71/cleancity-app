import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Types
export type User = {
  id: string;
  username: string;
  name: string;
  role: "citizen" | "admin" | "pending_admin";
};

export type ComplaintStatus = "pending" | "in_progress" | "resolved" | "rejected";

export type Complaint = {
  id: string;
  userId: string;
  category: "organic" | "recyclable" | "hazardous" | "construction" | "other";
  description: string;
  imageUrl?: string;
  lat: number;
  lng: number;
  address: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
};

type AppState = {
  user: User | null;
  complaints: Complaint[];
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  addComplaint: (data: any) => Promise<void>;
  updateComplaintStatus: (id: string, status: ComplaintStatus) => Promise<void>;
};

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/user")
      .then(res => res.ok ? res.json() : null)
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      fetch("/api/complaints")
        .then(res => res.ok ? res.json() : [])
        .then(setComplaints);
    } else {
      setComplaints([]);
    }
  }, [user]);

  const login = async (data: any) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Login failed");
    const u = await res.json();
    setUser(u);
    toast({ title: `Welcome back, ${u.name}!`, description: "You have successfully logged in." });
  };

  const register = async (data: any) => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Registration failed");
    const u = await res.json();
    setUser(u);
    toast({ title: `Welcome to CleanCity, ${u.name}!`, description: "Your account has been created." });
  };

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    toast({ title: "Logged out", description: "See you next time!" });
  };

  const addComplaint = async (data: any) => {
    const res = await fetch("/api/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to submit");
    const newComplaint = await res.json();
    setComplaints([newComplaint, ...complaints]);
    toast({ title: "Complaint Submitted", description: "We have received your report." });
  };

  const updateComplaintStatus = async (id: string, status: ComplaintStatus) => {
    const res = await fetch(`/api/complaints/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update status");
    const updated = await res.json();
    setComplaints(complaints.map(c => c.id === id ? updated : c));
    toast({ title: "Status Updated", description: "Complaint status updated." });
  };

  return (
    <AppContext.Provider value={{ user, complaints, isLoading, login, register, logout, addComplaint, updateComplaintStatus }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
