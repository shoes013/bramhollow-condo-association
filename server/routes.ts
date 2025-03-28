import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertContactSchema, insertNewsletterSchema, insertMaintenanceRequestSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Documents routes
  app.get("/api/documents", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      let documents;
      
      if (category) {
        documents = await storage.getDocumentsByCategory(category);
      } else {
        documents = await storage.getDocuments();
      }
      
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.get("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const document = await storage.getDocument(id);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.json(document);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch document" });
    }
  });

  // News routes
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getNewsItems();
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  app.get("/api/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const newsItem = await storage.getNewsItem(id);
      
      if (!newsItem) {
        return res.status(404).json({ message: "News item not found" });
      }
      
      res.json(newsItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news item" });
    }
  });

  // Events routes
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEvent(id);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  // Photos routes
  app.get("/api/photos", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      let photos;
      
      if (category) {
        photos = await storage.getPhotosByCategory(category);
      } else {
        photos = await storage.getPhotos();
      }
      
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch photos" });
    }
  });

  app.get("/api/photos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const photo = await storage.getPhoto(id);
      
      if (!photo) {
        return res.status(404).json({ message: "Photo not found" });
      }
      
      res.json(photo);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch photo" });
    }
  });

  // Maintenance request routes (protected by authentication)
  app.get("/api/maintenance-requests", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    storage.getMaintenanceRequests(req.user.id)
      .then(requests => res.json(requests))
      .catch(() => res.status(500).json({ message: "Failed to fetch maintenance requests" }));
  });

  app.post("/api/maintenance-requests", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const requestData = insertMaintenanceRequestSchema.parse(req.body);
      
      storage.createMaintenanceRequest({
        ...requestData,
        userId: req.user.id
      })
        .then(request => res.status(201).json(request))
        .catch(() => res.status(500).json({ message: "Failed to create maintenance request" }));
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Contact form submission
  app.post("/api/contact", (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      
      storage.createContact(contactData)
        .then(contact => res.status(201).json({ message: "Contact form submitted successfully" }))
        .catch(() => res.status(500).json({ message: "Failed to submit contact form" }));
    } catch (error) {
      res.status(400).json({ message: "Invalid contact form data" });
    }
  });

  // Newsletter subscription
  app.post("/api/newsletter-subscribe", (req, res) => {
    try {
      const { email } = insertNewsletterSchema.parse(req.body);
      
      storage.subscribeNewsletter(email)
        .then(() => res.status(201).json({ message: "Successfully subscribed to newsletter" }))
        .catch(() => res.status(500).json({ message: "Failed to subscribe to newsletter" }));
    } catch (error) {
      res.status(400).json({ message: "Invalid email address" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
