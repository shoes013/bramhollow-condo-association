import { users, documents, news, events, photos, maintenanceRequests, contacts, newsletters } from "@shared/schema";
import type { 
  User, InsertUser, Document, InsertDocument, News, InsertNews,
  Event, InsertEvent, Photo, InsertPhoto, MaintenanceRequest,
  InsertMaintenanceRequest, Contact, InsertContact, Newsletter, InsertNewsletter 
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Document methods
  getDocuments(): Promise<Document[]>;
  getDocumentsByCategory(category: string): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  
  // News methods
  getNewsItems(): Promise<News[]>;
  getNewsItem(id: number): Promise<News | undefined>;
  createNewsItem(news: InsertNews): Promise<News>;
  
  // Events methods
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  // Photo methods
  getPhotos(): Promise<Photo[]>;
  getPhotosByCategory(category: string): Promise<Photo[]>;
  getPhoto(id: number): Promise<Photo | undefined>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  
  // Maintenance requests methods
  getMaintenanceRequests(userId: number): Promise<MaintenanceRequest[]>;
  getMaintenanceRequest(id: number): Promise<MaintenanceRequest | undefined>;
  createMaintenanceRequest(request: InsertMaintenanceRequest): Promise<MaintenanceRequest>;
  updateMaintenanceRequest(id: number, status: string): Promise<MaintenanceRequest | undefined>;
  
  // Contact methods
  createContact(contact: InsertContact): Promise<Contact>;
  
  // Newsletter methods
  subscribeNewsletter(email: string): Promise<Newsletter>;
  
  // Session store for auth
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private documents: Map<number, Document>;
  private newsItems: Map<number, News>;
  private eventsItems: Map<number, Event>;
  private photosItems: Map<number, Photo>;
  private maintenanceRequests: Map<number, MaintenanceRequest>;
  private contacts: Map<number, Contact>;
  private newsletters: Map<number, Newsletter>;
  private currentId: { [key: string]: number };
  
  sessionStore: session.SessionStore;
  
  constructor() {
    this.users = new Map();
    this.documents = new Map();
    this.newsItems = new Map();
    this.eventsItems = new Map();
    this.photosItems = new Map();
    this.maintenanceRequests = new Map();
    this.contacts = new Map();
    this.newsletters = new Map();
    
    this.currentId = {
      users: 1,
      documents: 1,
      news: 1,
      events: 1,
      photos: 1,
      maintenanceRequests: 1,
      contacts: 1,
      newsletters: 1
    };
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Create admin user
    this.createUser({
      username: "admin",
      password: "$2b$10$7VvjO5hF3BNw9sGgdeqz1errQQA28QTxM5WvjMJq6gDrfn.MwRIXO", // password: admin
      firstName: "Admin",
      lastName: "User",
      email: "admin@bramhollowcondo.org",
      isAdmin: true
    }).then();
    
    // Seed some initial data
    this.seedData();
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now,
      isAdmin: insertUser.isAdmin ?? false
    };
    this.users.set(id, user);
    return user;
  }
  
  // Document methods
  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }
  
  async getDocumentsByCategory(category: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (doc) => doc.category === category
    );
  }
  
  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }
  
  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.currentId.documents++;
    const now = new Date();
    const document: Document = {
      ...insertDocument,
      id,
      updatedAt: now
    };
    this.documents.set(id, document);
    return document;
  }
  
  // News methods
  async getNewsItems(): Promise<News[]> {
    return Array.from(this.newsItems.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  
  async getNewsItem(id: number): Promise<News | undefined> {
    return this.newsItems.get(id);
  }
  
  async createNewsItem(insertNews: InsertNews): Promise<News> {
    const id = this.currentId.news++;
    const now = new Date();
    const newsItem: News = {
      ...insertNews,
      id,
      createdAt: now
    };
    this.newsItems.set(id, newsItem);
    return newsItem;
  }
  
  // Events methods
  async getEvents(): Promise<Event[]> {
    return Array.from(this.eventsItems.values()).sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  }
  
  async getEvent(id: number): Promise<Event | undefined> {
    return this.eventsItems.get(id);
  }
  
  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.currentId.events++;
    const now = new Date();
    const event: Event = {
      ...insertEvent,
      id,
      createdAt: now
    };
    this.eventsItems.set(id, event);
    return event;
  }
  
  // Photos methods
  async getPhotos(): Promise<Photo[]> {
    return Array.from(this.photosItems.values());
  }
  
  async getPhotosByCategory(category: string): Promise<Photo[]> {
    return Array.from(this.photosItems.values()).filter(
      (photo) => photo.category === category
    );
  }
  
  async getPhoto(id: number): Promise<Photo | undefined> {
    return this.photosItems.get(id);
  }
  
  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const id = this.currentId.photos++;
    const now = new Date();
    const photo: Photo = {
      ...insertPhoto,
      id,
      uploadedAt: now
    };
    this.photosItems.set(id, photo);
    return photo;
  }
  
  // Maintenance requests methods
  async getMaintenanceRequests(userId: number): Promise<MaintenanceRequest[]> {
    return Array.from(this.maintenanceRequests.values()).filter(
      (request) => request.userId === userId
    );
  }
  
  async getMaintenanceRequest(id: number): Promise<MaintenanceRequest | undefined> {
    return this.maintenanceRequests.get(id);
  }
  
  async createMaintenanceRequest(insertRequest: InsertMaintenanceRequest): Promise<MaintenanceRequest> {
    const id = this.currentId.maintenanceRequests++;
    const now = new Date();
    const request: MaintenanceRequest = {
      ...insertRequest,
      id,
      status: "pending",
      createdAt: now,
      updatedAt: now
    };
    this.maintenanceRequests.set(id, request);
    return request;
  }
  
  async updateMaintenanceRequest(id: number, status: string): Promise<MaintenanceRequest | undefined> {
    const request = this.maintenanceRequests.get(id);
    if (!request) return undefined;
    
    const updatedRequest: MaintenanceRequest = {
      ...request,
      status,
      updatedAt: new Date()
    };
    this.maintenanceRequests.set(id, updatedRequest);
    return updatedRequest;
  }
  
  // Contact methods
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentId.contacts++;
    const now = new Date();
    const contact: Contact = {
      ...insertContact,
      id,
      createdAt: now
    };
    this.contacts.set(id, contact);
    return contact;
  }
  
  // Newsletter methods
  async subscribeNewsletter(email: string): Promise<Newsletter> {
    // Check if already subscribed
    const existing = Array.from(this.newsletters.values()).find(
      (newsletter) => newsletter.email === email
    );
    
    if (existing) {
      if (!existing.subscribed) {
        // Resubscribe
        const updated: Newsletter = {
          ...existing,
          subscribed: true
        };
        this.newsletters.set(existing.id, updated);
        return updated;
      }
      return existing;
    }
    
    // New subscription
    const id = this.currentId.newsletters++;
    const now = new Date();
    const newsletter: Newsletter = {
      id,
      email,
      subscribed: true,
      createdAt: now
    };
    this.newsletters.set(id, newsletter);
    return newsletter;
  }
  
  // Seed data for development
  private async seedData() {
    // Seed documents
    this.createDocument({
      title: "Declaration of Condominium",
      description: "The master deed establishing Bramhollow Condominium Association and defining ownership units and common elements.",
      category: "Governing Documents",
      fileName: "declaration.pdf",
      fileType: "application/pdf",
      fileSize: 2400000,
      uploadedBy: 1,
    });
    
    this.createDocument({
      title: "Bylaws",
      description: "Rules governing the operation of the association, including board elections, meetings, and governance procedures.",
      category: "Governing Documents",
      fileName: "bylaws.pdf",
      fileType: "application/pdf",
      fileSize: 1800000,
      uploadedBy: 1,
    });
    
    this.createDocument({
      title: "Rules and Regulations",
      description: "Detailed community guidelines covering architectural standards, pet policies, noise limitations, and more.",
      category: "Governing Documents",
      fileName: "rules.pdf",
      fileType: "application/pdf",
      fileSize: 1200000,
      uploadedBy: 1,
    });
    
    // Seed news items
    this.createNewsItem({
      title: "Pool Renovation Project Completed",
      content: "We're excited to announce the completion of our pool renovation project. The updated facilities include new decking, improved lighting, and energy-efficient equipment.",
      imageUrl: "https://images.unsplash.com/photo-1555438474-d8a608427d31?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      authorId: 1,
    });
    
    this.createNewsItem({
      title: "Annual Community BBQ - Save the Date!",
      content: "Mark your calendars for our annual community BBQ on September 10th from 12-4pm. Join us for food, games, and a chance to meet your neighbors.",
      imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      authorId: 1,
    });
    
    // Seed events
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(10);
    
    this.createEvent({
      title: "Annual Community BBQ",
      description: "Join us for food, games, and a chance to meet your neighbors.",
      location: "Community Park",
      startTime: new Date(nextMonth.setHours(12, 0, 0, 0)),
      endTime: new Date(nextMonth.setHours(16, 0, 0, 0)),
    });
    
    nextMonth.setDate(15);
    this.createEvent({
      title: "Board Meeting",
      description: "Monthly meeting of the Bramhollow Condominium Association Board.",
      location: "Community Clubhouse",
      startTime: new Date(nextMonth.setHours(19, 0, 0, 0)),
      endTime: new Date(nextMonth.setHours(21, 0, 0, 0)),
    });
    
    // Seed photos
    this.createPhoto({
      title: "Property Exterior",
      description: "Main exterior view of Bramhollow Condominiums",
      imageUrl: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      category: "Property",
    });
    
    this.createPhoto({
      title: "Swimming Pool",
      description: "Our newly renovated swimming pool",
      imageUrl: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      category: "Amenities",
    });
  }
}

export const storage = new MemStorage();
