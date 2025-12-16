// File 54: types/user.d.ts
/**
 * User type definitions for English Communities PK
 */

declare global {
  namespace User {
    // User Roles
    type UserRole = 
      | 'subscriber'
      | 'contributor'
      | 'author'
      | 'editor'
      | 'administrator'
      | 'super_admin'
      | 'student'
      | 'teacher'
      | 'moderator'
      | 'member';
    
    // User Levels
    type UserLevel = 
      | 'beginner'
      | 'intermediate'
      | 'advanced'
      | 'expert'
      | 'native';
    
    // User Status
    type UserStatus = 
      | 'active'
      | 'inactive'
      | 'suspended'
      | 'pending'
      | 'banned';
    
    // User Preferences
    interface UserPreferences {
      theme: string;
      font: string;
      fontSize: number;
      mode: 'light' | 'dark' | 'auto';
      language: string;
      timezone: string;
      dateFormat: string;
      timeFormat: string;
      notifications: {
        email: boolean;
        push: boolean;
        inApp: boolean;
        types: {
          newPosts: boolean;
          comments: boolean;
          replies: boolean;
          likes: boolean;
          mentions: boolean;
          communityUpdates: boolean;
          learningTips: boolean;
        };
      };
      privacy: {
        profileVisibility: 'public' | 'private' | 'friends';
        showOnlineStatus: boolean;
        showActivity: boolean;
        showEmail: boolean;
        allowMessages: boolean;
        allowFriendRequests: boolean;
        allowTagging: boolean;
      };
      accessibility: {
        highContrast: boolean;
        reducedMotion: boolean;
        screenReader: boolean;
        keyboardNavigation: boolean;
      };
    }
    
    // User Profile
    interface UserProfile {
      id: number;
      username: string;
      email: string;
      name: string;
      firstName?: string;
      lastName?: string;
      displayName: string;
      description?: string;
      website?: string;
      avatar?: string;
      coverImage?: string;
      location?: string;
      bio?: string;
      occupation?: string;
      education?: string;
      interests?: string[];
      languages?: Array<{
        language: string;
        level: UserLevel;
      }>;
      socialLinks?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        linkedin?: string;
        youtube?: string;
        github?: string;
      };
      badges?: UserBadge[];
      points: number;
      level: number;
      streak: number;
      joinDate: string;
      lastActive: string;
    }
    
    // User Account
    interface UserAccount {
      id: number;
      profile: UserProfile;
      roles: UserRole[];
      capabilities: Record<string, boolean>;
      status: UserStatus;
      preferences: UserPreferences;
      settings: UserSettings;
      statistics: UserStatistics;
      isVerified: boolean;
      isPremium: boolean;
      membership?: Membership;
      twoFactorEnabled: boolean;
      lastLogin: string;
      loginCount: number;
      ipAddress?: string;
    }
    
    // User Settings
    interface UserSettings {
      emailNotifications: boolean;
      pushNotifications: boolean;
      smsNotifications: boolean;
      privacySettings: {
        profileVisibility: string;
        showOnlineStatus: boolean;
        showActivity: boolean;
        allowMessages: string;
        allowTagging: boolean;
      };
      contentSettings: {
        nsfwContent: boolean;
        autoPlayVideos: boolean;
        showImages: boolean;
        fontFamily: string;
        fontSize: number;
        lineHeight: number;
      };
      securitySettings: {
        twoFactorAuth: boolean;
        loginAlerts: boolean;
        sessionTimeout: number;
        trustedDevices: string[];
      };
    }
    
    // User Statistics
    interface UserStatistics {
      posts: number;
      comments: number;
      replies: number;
      likesGiven: number;
      likesReceived: number;
      bookmarks: number;
      followers: number;
      following: number;
      groups: number;
      badges: number;
      points: number;
      streak: number;
      level: number;
      rank: number;
      views: number;
      shares: number;
      achievements: number;
    }
    
    // User Activity
    interface UserActivity {
      id: number;
      type: 
        | 'post_created'
        | 'post_updated'
        | 'comment_posted'
        | 'comment_liked'
        | 'post_liked'
        | 'bookmark_added'
        | 'follow_user'
        | 'join_group'
        | 'badge_earned'
        | 'level_up'
        | 'login'
        | 'logout';
      timestamp: string;
      data: Record<string, any>;
      userId: number;
      targetId?: number;
      targetType?: string;
      isPublic: boolean;
    }
    
    // User Notification
    interface UserNotification {
      id: number;
      type: 
        | 'comment'
        | 'reply'
        | 'like'
        | 'mention'
        | 'follow'
        | 'message'
        | 'system'
        | 'achievement'
        | 'reminder';
      title: string;
      message: string;
      data?: Record<string, any>;
      read: boolean;
      timestamp: string;
      actionUrl?: string;
      icon?: string;
      priority: 'low' | 'medium' | 'high' | 'urgent';
    }
    
    // User Badge
    interface UserBadge {
      id: number;
      name: string;
      description: string;
      icon: string;
      type: 
        | 'achievement'
        | 'level'
        | 'participation'
        | 'contribution'
        | 'community'
        | 'learning';
      tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
      earnedAt: string;
      progress?: number;
      requirement?: string;
    }
    
    // User Membership
    interface Membership {
      id: number;
      type: 'free' | 'basic' | 'premium' | 'pro' | 'enterprise';
      name: string;
      description: string;
      price: number;
      currency: string;
      billingCycle: 'monthly' | 'yearly' | 'lifetime';
      features: string[];
      status: 'active' | 'expired' | 'cancelled' | 'pending';
      startDate: string;
      endDate?: string;
      autoRenew: boolean;
      paymentMethod?: string;
      transactionId?: string;
    }
    
    // User Learning Progress
    interface LearningProgress {
      courseId: number;
      courseName: string;
      progress: number;
      completedLessons: number;
      totalLessons: number;
      lastAccessed: string;
      quizScores: Array<{
        quizId: number;
        score: number;
        passed: boolean;
        completedAt: string;
      }>;
      certificates: Array<{
        id: number;
        name: string;
        issuedAt: string;
        url: string;
      }>;
      timeSpent: number; // in minutes
      streak: number;
    }
    
    // User Social Connections
    interface SocialConnection {
      id: number;
      userId: number;
      connectedUserId: number;
      type: 'friend' | 'follower' | 'following' | 'blocked';
      status: 'pending' | 'accepted' | 'rejected' | 'blocked';
      createdAt: string;
      updatedAt: string;
    }
    
    // User Session
    interface UserSession {
      id: string;
      userId: number;
      device: string;
      browser: string;
      ipAddress: string;
      location?: string;
      lastActivity: string;
      expiresAt: string;
      isCurrent: boolean;
    }
    
    // User Report
    interface UserReport {
      id: number;
      reporterId: number;
      reportedUserId: number;
      reason: string;
      description?: string;
      status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
      createdAt: string;
      reviewedAt?: string;
      reviewedBy?: number;
      actionTaken?: string;
    }
    
    // User Support Ticket
    interface SupportTicket {
      id: number;
      userId: number;
      type: 'technical' | 'billing' | 'content' | 'abuse' | 'suggestion' | 'other';
      subject: string;
      description: string;
      priority: 'low' | 'medium' | 'high' | 'urgent';
      status: 'open' | 'in_progress' | 'resolved' | 'closed';
      assignedTo?: number;
      createdAt: string;
      updatedAt: string;
      resolvedAt?: string;
      attachments?: string[];
      messages: SupportMessage[];
    }
    
    // Support Message
    interface SupportMessage {
      id: number;
      ticketId: number;
      userId: number;
      message: string;
      isStaff: boolean;
      attachments?: string[];
      createdAt: string;
      read: boolean;
      readAt?: string;
    }
  }
}

export {};