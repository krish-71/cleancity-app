import { users, complaints, type User, type InsertUser, type Complaint, type InsertComplaint } from "../shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectSqlite3 from "connect-sqlite3";

const SQLiteStore = connectSqlite3(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createComplaint(complaint: InsertComplaint & { userId: number }): Promise<Complaint>;
  getComplaints(): Promise<Complaint[]>;
  getComplaintsByUserId(userId: number): Promise<Complaint[]>;
  updateComplaintStatus(id: number, status: string): Promise<Complaint | undefined>;
  getAdmins(): Promise<User[]>;
  getUsersByRole(role: string): Promise<User[]>;
  updateUserRole(id: number, role: "citizen" | "admin" | "pending_admin"): Promise<User | undefined>;
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new SQLiteStore({
      dir: '.',
      db: 'sessions.sqlite'
    }) as unknown as session.Store;
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createComplaint(insertComplaint: InsertComplaint & { userId: number }): Promise<Complaint> {
    const [complaint] = await db.insert(complaints).values({
      ...insertComplaint,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return complaint;
  }

  async getComplaints(): Promise<Complaint[]> {
    return await db.select().from(complaints);
  }

  async getComplaintsByUserId(userId: number): Promise<Complaint[]> {
    return await db.select().from(complaints).where(eq(complaints.userId, userId));
  }

  async updateComplaintStatus(id: number, status: string): Promise<Complaint | undefined> {
    const [complaint] = await db
      .update(complaints)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(complaints.id, id))
      .returning();
    return complaint;
  }

  async getAdmins(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, "admin"));
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, role as any));
  }

  async updateUserRole(id: number, role: "citizen" | "admin" | "pending_admin"): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, id))
      .returning();
    return user;
  }
}

export const storage = new DatabaseStorage();
