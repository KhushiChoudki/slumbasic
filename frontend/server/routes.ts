import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertReportSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Projects routes
  app.get("/api/projects", async (_req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.patch("/api/projects/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      const project = await storage.updateProjectStatus(req.params.id, status);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProject(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Reports routes
  app.get("/api/reports", async (req, res) => {
    try {
      const { projectId } = req.query;
      const reports = projectId 
        ? await storage.getReportsByProject(projectId as string)
        : await storage.getAllReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

  app.get("/api/reports/:id", async (req, res) => {
    try {
      const report = await storage.getReport(req.params.id);
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch report" });
    }
  });

  app.post("/api/reports", async (req, res) => {
    try {
      const validatedData = insertReportSchema.parse(req.body);
      const report = await storage.createReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create report" });
    }
  });

  app.patch("/api/reports/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      const report = await storage.updateReportStatus(req.params.id, status);
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: "Failed to update report" });
    }
  });

  app.delete("/api/reports/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteReport(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Report not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete report" });
    }
  });

  // Areas routes for "Roads to be Drawn" feature
  app.get("/api/areas", async (_req, res) => {
    try {
      // Return list of available areas
      const areas = [
        {
          id: "dharavi",
          name: "Dharavi",
          description: "Mumbai's largest informal settlement with complex road network requiring comprehensive mapping",
          location: "Mumbai, Maharashtra",
          coordinates: { lat: 19.0436, lng: 72.8480 },
          featureCount: 489
        }
        // Future areas can be added here:
        // { id: "shivajinagar", name: "Shivajinagar", ... },
        // { id: "indiranagar", name: "Indiranagar", ... }
      ];
      res.json(areas);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch areas" });
    }
  });

  app.get("/api/areas/:areaId/map", async (req, res) => {
    try {
      const { areaId } = req.params;
      
      // For now, only dharavi is supported
      if (areaId !== "dharavi") {
        return res.status(404).json({ error: "Area not found" });
      }

      // Read the GeoJSON data for the area
      const fs = await import("fs/promises");
      const path = await import("path");
      const dataPath = path.join(process.cwd(), "server", "areas", areaId, "points.json");
      
      const data = await fs.readFile(dataPath, "utf-8");
      const geojson = JSON.parse(data);

      // Define connections between points (indices refer to points in the filtered Point features array)
      const connections = [
        [8, 122],
        [109, 52],
        [65, 122],
        [57, 33],
        [45, 7],
        [102, 7],
      ];

      // Return the GeoJSON data with metadata
      res.json({
        id: areaId,
        name: areaId === "dharavi" ? "Dharavi" : areaId,
        description: "Interactive map showing roads, paths, and buildings",
        geojson,
        center: [19.0436, 72.8480] as [number, number],
        zoom: 15,
        connections
      });
    } catch (error) {
      console.error("Error fetching area map data:", error);
      res.status(500).json({ error: "Failed to fetch area map data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
