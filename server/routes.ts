import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertContactSchema, 
  insertNewsletterSchema, 
  insertMaintenanceRequestSchema,
  insertNotificationSchema,
  insertAssessmentSchema,
  insertAssessmentQuestionSchema,
  insertUserAssessmentSchema,
  insertBoardMemberRoleSchema,
  notifications 
} from "@shared/schema";

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
  
  // Notification routes (protected by authentication)
  app.get("/api/notifications", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    storage.getNotifications(req.user.id)
      .then(notifications => res.json(notifications))
      .catch(() => res.status(500).json({ message: "Failed to fetch notifications" }));
  });
  
  app.get("/api/notifications/unread", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    storage.getUnreadNotifications(req.user.id)
      .then(notifications => res.json(notifications))
      .catch(() => res.status(500).json({ message: "Failed to fetch unread notifications" }));
  });
  
  app.put("/api/notifications/:id/read", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const id = parseInt(req.params.id);
    storage.markNotificationAsRead(id)
      .then(notification => {
        if (!notification) {
          return res.status(404).json({ message: "Notification not found" });
        }
        res.json(notification);
      })
      .catch(() => res.status(500).json({ message: "Failed to mark notification as read" }));
  });
  
  app.put("/api/notifications/read-all", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    storage.markAllNotificationsAsRead(req.user.id)
      .then(count => res.json({ count, message: `${count} notifications marked as read` }))
      .catch(() => res.status(500).json({ message: "Failed to mark all notifications as read" }));
  });
  
  app.delete("/api/notifications/:id", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const id = parseInt(req.params.id);
    storage.deleteNotification(id)
      .then(success => {
        if (!success) {
          return res.status(404).json({ message: "Notification not found" });
        }
        res.json({ message: "Notification deleted successfully" });
      })
      .catch(() => res.status(500).json({ message: "Failed to delete notification" }));
  });
  
  // Create notification (admin only)
  app.post("/api/notifications", (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const notificationData = insertNotificationSchema.parse(req.body);
      
      storage.createNotification(notificationData)
        .then(notification => {
          // Broadcast the notification to connected clients
          broadcastNotification(notification);
          res.status(201).json(notification);
        })
        .catch(() => res.status(500).json({ message: "Failed to create notification" }));
    } catch (error) {
      res.status(400).json({ message: "Invalid notification data" });
    }
  });
  
  // Assessment routes (some routes admin-only)
  app.get("/api/assessments", (req, res) => {
    try {
      const moduleType = req.query.type as string | undefined;
      let assessments;
      
      if (moduleType) {
        storage.getAssessmentsByType(moduleType)
          .then(assessments => res.json(assessments))
          .catch(() => res.status(500).json({ message: "Failed to fetch assessments" }));
      } else {
        storage.getAssessments()
          .then(assessments => res.json(assessments))
          .catch(() => res.status(500).json({ message: "Failed to fetch assessments" }));
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assessments" });
    }
  });
  
  app.get("/api/assessments/:id", (req, res) => {
    try {
      const id = parseInt(req.params.id);
      storage.getAssessment(id)
        .then(assessment => {
          if (!assessment) {
            return res.status(404).json({ message: "Assessment not found" });
          }
          res.json(assessment);
        })
        .catch(() => res.status(500).json({ message: "Failed to fetch assessment" }));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assessment" });
    }
  });
  
  app.post("/api/assessments", (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const assessmentData = insertAssessmentSchema.parse(req.body);
      
      storage.createAssessment(assessmentData)
        .then(assessment => res.status(201).json(assessment))
        .catch(() => res.status(500).json({ message: "Failed to create assessment" }));
    } catch (error) {
      res.status(400).json({ message: "Invalid assessment data" });
    }
  });
  
  app.get("/api/assessments/:id/questions", (req, res) => {
    try {
      const assessmentId = parseInt(req.params.id);
      storage.getAssessmentQuestions(assessmentId)
        .then(questions => res.json(questions))
        .catch(() => res.status(500).json({ message: "Failed to fetch assessment questions" }));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assessment questions" });
    }
  });
  
  app.post("/api/assessments/:id/questions", (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const assessmentId = parseInt(req.params.id);
      const questionData = insertAssessmentQuestionSchema.parse({
        ...req.body,
        assessmentId
      });
      
      storage.createAssessmentQuestion(questionData)
        .then(question => res.status(201).json(question))
        .catch(() => res.status(500).json({ message: "Failed to create assessment question" }));
    } catch (error) {
      res.status(400).json({ message: "Invalid assessment question data" });
    }
  });
  
  // User assessments routes (protected by authentication)
  app.get("/api/user-assessments", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    storage.getUserAssessments(req.user.id)
      .then(assessments => res.json(assessments))
      .catch(() => res.status(500).json({ message: "Failed to fetch user assessments" }));
  });
  
  app.get("/api/user-assessments/status/:status", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const status = req.params.status;
    storage.getUserAssessmentsByStatus(req.user.id, status)
      .then(assessments => res.json(assessments))
      .catch(() => res.status(500).json({ message: "Failed to fetch user assessments" }));
  });
  
  app.get("/api/user-assessments/expired", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    storage.getExpiredAssessments(req.user.id)
      .then(assessments => res.json(assessments))
      .catch(() => res.status(500).json({ message: "Failed to fetch expired assessments" }));
  });
  
  app.post("/api/user-assessments", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userAssessmentData = insertUserAssessmentSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      storage.createUserAssessment(userAssessmentData)
        .then(userAssessment => res.status(201).json(userAssessment))
        .catch(() => res.status(500).json({ message: "Failed to create user assessment" }));
    } catch (error) {
      res.status(400).json({ message: "Invalid user assessment data" });
    }
  });
  
  app.get("/api/user-qualification", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    storage.isUserQualified(req.user.id)
      .then(isQualified => res.json({ qualified: isQualified }))
      .catch(() => res.status(500).json({ message: "Failed to check user qualification" }));
  });
  
  // Board member roles routes
  app.get("/api/board-members", (req, res) => {
    try {
      storage.getActiveBoardMembers()
        .then(boardMembers => res.json(boardMembers))
        .catch(() => res.status(500).json({ message: "Failed to fetch board members" }));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch board members" });
    }
  });
  
  app.get("/api/board-members/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    storage.getBoardMemberRolesByUser(req.user.id)
      .then(roles => res.json(roles))
      .catch(() => res.status(500).json({ message: "Failed to fetch board member roles" }));
  });
  
  app.post("/api/board-members", (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const roleData = insertBoardMemberRoleSchema.parse(req.body);
      
      storage.createBoardMemberRole(roleData)
        .then(role => res.status(201).json(role))
        .catch(() => res.status(500).json({ message: "Failed to create board member role" }));
    } catch (error) {
      res.status(400).json({ message: "Invalid board member role data" });
    }
  });
  
  app.put("/api/board-members/:id/deactivate", (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const id = parseInt(req.params.id);
    storage.deactivateBoardMemberRole(id)
      .then(role => {
        if (!role) {
          return res.status(404).json({ message: "Board member role not found" });
        }
        res.json(role);
      })
      .catch(() => res.status(500).json({ message: "Failed to deactivate board member role" }));
  });

  const httpServer = createServer(app);
  
  // Set up WebSocket server for real-time notifications
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store connected clients with their user IDs
  const clients = new Map<WebSocket, number>();
  
  wss.on('connection', (ws, req) => {
    // Get the user ID from the session cookie
    // This is simplified - in a real app you'd parse the cookie and validate the session
    // For now, we'll use a query parameter as an example
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const userId = parseInt(url.searchParams.get('userId') || '0');
    
    if (userId) {
      clients.set(ws, userId);
      
      // Send any unread notifications for this user
      storage.getUnreadNotifications(userId)
        .then(notifications => {
          if (notifications.length > 0) {
            ws.send(JSON.stringify({
              type: 'notifications',
              data: notifications
            }));
          }
        })
        .catch(console.error);
    }
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Handle client messages if needed
        if (data.type === 'mark_read') {
          const notificationId = data.notificationId;
          if (notificationId) {
            storage.markNotificationAsRead(notificationId)
              .catch(console.error);
          }
        }
      } catch (e) {
        console.error('Invalid message format', e);
      }
    });
    
    ws.on('close', () => {
      clients.delete(ws);
    });
  });
  
  // Function to broadcast a notification to all relevant users
  function broadcastNotification(notification: typeof notifications.$inferSelect) {
    const { userId } = notification;
    
    // If userId is specified, send only to that user
    if (userId) {
      for (const [client, clientUserId] of clients.entries()) {
        if (clientUserId === userId && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'notification',
            data: notification
          }));
        }
      }
    } else {
      // If no userId specified, broadcast to all connected clients
      for (const [client, _] of clients.entries()) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'notification',
            data: notification
          }));
        }
      }
    }
  }
  
  return httpServer;
}
