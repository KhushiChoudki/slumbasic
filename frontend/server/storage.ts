import { type User, type InsertUser, type Project, type InsertProject, type Report, type InsertReport } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Projects
  getAllProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProjectStatus(id: string, status: string): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  
  // Reports
  getAllReports(): Promise<Report[]>;
  getReportsByProject(projectId: string): Promise<Report[]>;
  getReport(id: string): Promise<Report | undefined>;
  createReport(report: InsertReport): Promise<Report>;
  updateReportStatus(id: string, status: string): Promise<Report | undefined>;
  deleteReport(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<string, Project>;
  private reports: Map<string, Report>;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.reports = new Map();
    
    // Add some initial mock data
    this.seedData();
  }

  private seedData() {
    const project1: Project = {
      id: randomUUID(),
      title: "Dharavi Road Network",
      location: "Dharavi, Mumbai",
      description: "Comprehensive road planning for Dharavi community to improve accessibility and safety.",
      imageUrl: null,
      status: "in_progress",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    };
    
    const project2: Project = {
      id: randomUUID(),
      title: "Cape Town Settlement",
      location: "Cape Town, South Africa",
      description: "Infrastructure planning for informal settlements to create safer road networks.",
      imageUrl: null,
      status: "completed",
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    };
    
    this.projects.set(project1.id, project1);
    this.projects.set(project2.id, project2);
    
    const report1: Report = {
      id: randomUUID(),
      projectId: project1.id,
      title: "Pothole on Main Street",
      description: "Large pothole affecting traffic flow",
      location: "Main Street, Dharavi",
      issueType: "pothole",
      status: "verified",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    };
    
    this.reports.set(report1.id, report1);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Projects
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
  
  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }
  
  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      id,
      title: insertProject.title,
      location: insertProject.location,
      description: insertProject.description,
      imageUrl: insertProject.imageUrl ?? null,
      status: insertProject.status ?? "in_progress",
      createdAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }
  
  async updateProjectStatus(id: string, status: string): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updated = { ...project, status };
    this.projects.set(id, updated);
    return updated;
  }
  
  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }
  
  // Reports
  async getAllReports(): Promise<Report[]> {
    return Array.from(this.reports.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
  
  async getReportsByProject(projectId: string): Promise<Report[]> {
    return Array.from(this.reports.values())
      .filter(r => r.projectId === projectId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getReport(id: string): Promise<Report | undefined> {
    return this.reports.get(id);
  }
  
  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = randomUUID();
    const report: Report = {
      id,
      projectId: insertReport.projectId ?? null,
      title: insertReport.title,
      description: insertReport.description,
      location: insertReport.location,
      issueType: insertReport.issueType,
      status: insertReport.status ?? "pending",
      createdAt: new Date(),
    };
    this.reports.set(id, report);
    return report;
  }
  
  async updateReportStatus(id: string, status: string): Promise<Report | undefined> {
    const report = this.reports.get(id);
    if (!report) return undefined;
    
    const updated = { ...report, status };
    this.reports.set(id, updated);
    return updated;
  }
  
  async deleteReport(id: string): Promise<boolean> {
    return this.reports.delete(id);
  }
}

export const storage = new MemStorage();
