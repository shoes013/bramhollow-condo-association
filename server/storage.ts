import { users, documents, news, events, photos, maintenanceRequests, contacts, newsletters, notifications, assessments, assessmentQuestions, userAssessments, boardMemberRoles } from "@shared/schema";
import type { 
  User, InsertUser, Document, InsertDocument, News, InsertNews,
  Event, InsertEvent, Photo, InsertPhoto, MaintenanceRequest,
  InsertMaintenanceRequest, Contact, InsertContact, Newsletter, InsertNewsletter,
  Notification, InsertNotification, Assessment, InsertAssessment, 
  AssessmentQuestion, InsertAssessmentQuestion, UserAssessment, InsertUserAssessment,
  BoardMemberRole, InsertBoardMemberRole
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
  
  // Notification methods
  getNotifications(userId: number): Promise<Notification[]>;
  getUnreadNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  markAllNotificationsAsRead(userId: number): Promise<number>;
  deleteNotification(id: number): Promise<boolean>;
  
  // Assessment methods
  getAssessments(): Promise<Assessment[]>;
  getAssessmentsByType(moduleType: string): Promise<Assessment[]>;
  getAssessment(id: number): Promise<Assessment | undefined>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  
  // Assessment question methods
  getAssessmentQuestions(assessmentId: number): Promise<AssessmentQuestion[]>;
  getAssessmentQuestion(id: number): Promise<AssessmentQuestion | undefined>;
  createAssessmentQuestion(question: InsertAssessmentQuestion): Promise<AssessmentQuestion>;
  
  // User assessment methods
  getUserAssessments(userId: number): Promise<UserAssessment[]>;
  getUserAssessmentsByStatus(userId: number, status: string): Promise<UserAssessment[]>;
  getUserAssessment(id: number): Promise<UserAssessment | undefined>;
  createUserAssessment(userAssessment: InsertUserAssessment): Promise<UserAssessment>;
  isUserQualified(userId: number): Promise<boolean>;
  getExpiredAssessments(userId: number): Promise<UserAssessment[]>;
  
  // Board member role methods
  getBoardMemberRoles(): Promise<BoardMemberRole[]>;
  getActiveBoardMembers(): Promise<BoardMemberRole[]>;
  getBoardMemberRole(id: number): Promise<BoardMemberRole | undefined>;
  getBoardMemberRolesByUser(userId: number): Promise<BoardMemberRole[]>;
  createBoardMemberRole(role: InsertBoardMemberRole): Promise<BoardMemberRole>;
  deactivateBoardMemberRole(id: number): Promise<BoardMemberRole | undefined>;
  
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
  private notificationsItems: Map<number, Notification>;
  private assessmentsItems: Map<number, Assessment>;
  private assessmentQuestionsItems: Map<number, AssessmentQuestion>;
  private userAssessmentsItems: Map<number, UserAssessment>;
  private boardMemberRolesItems: Map<number, BoardMemberRole>;
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
    this.notificationsItems = new Map();
    this.assessmentsItems = new Map();
    this.assessmentQuestionsItems = new Map();
    this.userAssessmentsItems = new Map();
    this.boardMemberRolesItems = new Map();
    
    this.currentId = {
      users: 1,
      documents: 1,
      news: 1,
      events: 1,
      photos: 1,
      maintenanceRequests: 1,
      contacts: 1,
      newsletters: 1,
      notifications: 1,
      assessments: 1,
      assessmentQuestions: 1,
      userAssessments: 1,
      boardMemberRoles: 1
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
  
  // Notification methods
  async getNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notificationsItems.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => {
        // Sort by created date (newest first)
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
  }
  
  async getUnreadNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notificationsItems.values())
      .filter(notification => notification.userId === userId && !notification.read)
      .sort((a, b) => {
        // Sort by created date (newest first)
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
  }
  
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.currentId.notifications++;
    const now = new Date();
    const notification: Notification = {
      ...insertNotification,
      id,
      read: false,
      createdAt: now
    };
    this.notificationsItems.set(id, notification);
    return notification;
  }
  
  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const notification = this.notificationsItems.get(id);
    if (!notification) return undefined;
    
    const updatedNotification: Notification = {
      ...notification,
      read: true
    };
    this.notificationsItems.set(id, updatedNotification);
    return updatedNotification;
  }
  
  async markAllNotificationsAsRead(userId: number): Promise<number> {
    let count = 0;
    const userNotifications = Array.from(this.notificationsItems.values())
      .filter(notification => notification.userId === userId && !notification.read);
      
    for (const notification of userNotifications) {
      this.notificationsItems.set(notification.id, {
        ...notification,
        read: true
      });
      count++;
    }
    
    return count;
  }
  
  async deleteNotification(id: number): Promise<boolean> {
    return this.notificationsItems.delete(id);
  }
  
  // Assessment methods
  async getAssessments(): Promise<Assessment[]> {
    return Array.from(this.assessmentsItems.values());
  }
  
  async getAssessmentsByType(moduleType: string): Promise<Assessment[]> {
    return Array.from(this.assessmentsItems.values()).filter(
      (assessment) => assessment.moduleType === moduleType
    );
  }
  
  async getAssessment(id: number): Promise<Assessment | undefined> {
    return this.assessmentsItems.get(id);
  }
  
  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const id = this.currentId.assessments++;
    const now = new Date();
    const assessment: Assessment = {
      ...insertAssessment,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.assessmentsItems.set(id, assessment);
    return assessment;
  }
  
  // Assessment question methods
  async getAssessmentQuestions(assessmentId: number): Promise<AssessmentQuestion[]> {
    return Array.from(this.assessmentQuestionsItems.values()).filter(
      (question) => question.assessmentId === assessmentId
    );
  }
  
  async getAssessmentQuestion(id: number): Promise<AssessmentQuestion | undefined> {
    return this.assessmentQuestionsItems.get(id);
  }
  
  async createAssessmentQuestion(insertQuestion: InsertAssessmentQuestion): Promise<AssessmentQuestion> {
    const id = this.currentId.assessmentQuestions++;
    const now = new Date();
    const question: AssessmentQuestion = {
      ...insertQuestion,
      id,
      createdAt: now
    };
    this.assessmentQuestionsItems.set(id, question);
    return question;
  }
  
  // User assessment methods
  async getUserAssessments(userId: number): Promise<UserAssessment[]> {
    return Array.from(this.userAssessmentsItems.values()).filter(
      (userAssessment) => userAssessment.userId === userId
    );
  }
  
  async getUserAssessmentsByStatus(userId: number, status: string): Promise<UserAssessment[]> {
    return Array.from(this.userAssessmentsItems.values()).filter(
      (userAssessment) => userAssessment.userId === userId && userAssessment.status === status
    );
  }
  
  async getUserAssessment(id: number): Promise<UserAssessment | undefined> {
    return this.userAssessmentsItems.get(id);
  }
  
  async createUserAssessment(insertUserAssessment: InsertUserAssessment): Promise<UserAssessment> {
    const id = this.currentId.userAssessments++;
    const now = new Date();
    const userAssessment: UserAssessment = {
      ...insertUserAssessment,
      id,
      createdAt: now
    };
    this.userAssessmentsItems.set(id, userAssessment);
    return userAssessment;
  }
  
  async isUserQualified(userId: number): Promise<boolean> {
    // A user is qualified if they have at least one active assessment with passed=true and status='current'
    const userAssessments = await this.getUserAssessmentsByStatus(userId, 'current');
    return userAssessments.some(assessment => assessment.passed);
  }
  
  async getExpiredAssessments(userId: number): Promise<UserAssessment[]> {
    const now = new Date();
    return Array.from(this.userAssessmentsItems.values()).filter(
      (userAssessment) => 
        userAssessment.userId === userId && 
        new Date(userAssessment.expiresAt) < now
    );
  }
  
  // Board member role methods
  async getBoardMemberRoles(): Promise<BoardMemberRole[]> {
    return Array.from(this.boardMemberRolesItems.values());
  }
  
  async getActiveBoardMembers(): Promise<BoardMemberRole[]> {
    return Array.from(this.boardMemberRolesItems.values()).filter(
      (role) => role.isActive
    );
  }
  
  async getBoardMemberRole(id: number): Promise<BoardMemberRole | undefined> {
    return this.boardMemberRolesItems.get(id);
  }
  
  async getBoardMemberRolesByUser(userId: number): Promise<BoardMemberRole[]> {
    return Array.from(this.boardMemberRolesItems.values()).filter(
      (role) => role.userId === userId
    );
  }
  
  async createBoardMemberRole(insertRole: InsertBoardMemberRole): Promise<BoardMemberRole> {
    const id = this.currentId.boardMemberRoles++;
    const now = new Date();
    const role: BoardMemberRole = {
      ...insertRole,
      id,
      createdAt: now
    };
    this.boardMemberRolesItems.set(id, role);
    return role;
  }
  
  async deactivateBoardMemberRole(id: number): Promise<BoardMemberRole | undefined> {
    const role = this.boardMemberRolesItems.get(id);
    if (!role) return undefined;
    
    const updatedRole: BoardMemberRole = {
      ...role,
      isActive: false,
      endDate: new Date()
    };
    this.boardMemberRolesItems.set(id, updatedRole);
    return updatedRole;
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
    
    // Seed notifications
    this.createNotification({
      title: "New Document Added",
      message: "The 'Rules and Regulations' document has been updated.",
      type: "document",
      userId: 1,
      relatedId: 3
    });
    
    this.createNotification({
      title: "Upcoming Event",
      message: "Don't forget about the Annual Community BBQ this weekend!",
      type: "event",
      userId: 1,
      relatedId: 1
    });
    
    this.createNotification({
      title: "Maintenance Update",
      message: "The pool renovation has been completed and is now open for use.",
      type: "maintenance",
      userId: 1,
      relatedId: 0
    });
    
    // Seed assessments
    const boardBasics = await this.createAssessment({
      title: "Board Member Basic Certification",
      description: "Essential knowledge for all board members including roles, responsibilities, and legal obligations.",
      moduleType: "board",
      passScore: 80,
      isRequired: true,
      validityPeriod: 12 // Valid for 1 year
    });
    
    const njLaws = await this.createAssessment({
      title: "New Jersey Condominium Act Compliance",
      description: "Comprehensive assessment on the New Jersey Condominium Act (N.J.S.A. 46:8B-1 et. seq.) requirements and compliance.",
      moduleType: "regulations",
      passScore: 85,
      isRequired: true,
      validityPeriod: 24 // Valid for 2 years
    });
    
    const financialManagement = await this.createAssessment({
      title: "Financial Management for HOAs",
      description: "Assessment covering budgeting, reserve funds, financial reporting, and audit procedures for HOAs.",
      moduleType: "executive",
      passScore: 75,
      isRequired: true,
      validityPeriod: 12 // Valid for 1 year
    });
    
    // Seed assessment questions
    await this.createAssessmentQuestion({
      assessmentId: boardBasics.id,
      questionText: "What is the primary fiduciary duty of a board member?",
      questionType: "multiple_choice",
      options: JSON.stringify([
        "To increase property values",
        "To act in the best interest of the association",
        "To keep maintenance fees low",
        "To organize social events"
      ]),
      correctAnswer: "To act in the best interest of the association",
      points: 10
    });
    
    await this.createAssessmentQuestion({
      assessmentId: boardBasics.id,
      questionText: "Board members can be held personally liable for their actions if they:",
      questionType: "multiple_choice",
      options: JSON.stringify([
        "Act in good faith but make a mistake",
        "Follow the advice of legal counsel",
        "Act with gross negligence or deliberate misconduct",
        "Vote against a popular amenity"
      ]),
      correctAnswer: "Act with gross negligence or deliberate misconduct",
      points: 10
    });
    
    await this.createAssessmentQuestion({
      assessmentId: njLaws.id,
      questionText: "According to the NJ Condominium Act, how much notice must be given before an annual meeting?",
      questionType: "multiple_choice",
      options: JSON.stringify([
        "No notice required",
        "At least 7 days",
        "At least 10 days",
        "At least 30 days"
      ]),
      correctAnswer: "At least 10 days",
      points: 10
    });
    
    await this.createAssessmentQuestion({
      assessmentId: njLaws.id,
      questionText: "The NJ Condominium Act requires associations to maintain which type of insurance?",
      questionType: "multiple_choice",
      options: JSON.stringify([
        "Only liability insurance",
        "Only property insurance",
        "Both property and liability insurance",
        "No insurance is required by law"
      ]),
      correctAnswer: "Both property and liability insurance",
      points: 10
    });
    
    // Create a board member role
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    await this.createBoardMemberRole({
      userId: 1,
      role: "President",
      startDate: sixMonthsAgo,
      isActive: true
    });
    
    // Create a completed assessment for the admin user
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const expirationDate = new Date(threeMonthsAgo);
    expirationDate.setMonth(expirationDate.getMonth() + boardBasics.validityPeriod);
    
    await this.createUserAssessment({
      userId: 1,
      assessmentId: boardBasics.id,
      score: 90,
      passed: true,
      completedAt: threeMonthsAgo,
      expiresAt: expirationDate,
      attemptCount: 1,
      status: "current"
    });
  }
}

export const storage = new MemStorage();
