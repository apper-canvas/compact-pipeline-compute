// Notification Service for Real-time Updates
let notifications = [];
let subscribers = [];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const notificationService = {
  // Subscribe to notifications
  subscribe(callback) {
    subscribers.push(callback);
    return () => {
      const index = subscribers.indexOf(callback);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
    };
  },

  // Notify all subscribers
  notify(notification) {
    subscribers.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Notification subscriber error:', error);
      }
    });
  },

  // Create and store notification
  async create(notificationData) {
    await delay(100);
    const newNotification = {
      Id: notifications.length + 1,
      ...notificationData,
      timestamp: new Date().toISOString(),
      read: false,
      dismissed: false
    };
    
    notifications.unshift(newNotification); // Add to beginning
    
    // Notify subscribers
    this.notify(newNotification);
    
    return { ...newNotification };
  },

  // Get all notifications
  async getAll() {
    await delay(100);
    return notifications.map(n => ({ ...n }));
  },

  // Get unread notifications
  async getUnread() {
    await delay(100);
    return notifications.filter(n => !n.read).map(n => ({ ...n }));
  },

  // Mark notification as read
  async markAsRead(id) {
    await delay(50);
    const notification = notifications.find(n => n.Id === parseInt(id));
    if (notification) {
      notification.read = true;
    }
    return notification;
  },

  // Mark all notifications as read
  async markAllAsRead() {
    await delay(100);
    notifications.forEach(n => n.read = true);
    return notifications.length;
  },

  // Dismiss notification
  async dismiss(id) {
    await delay(50);
    const notification = notifications.find(n => n.Id === parseInt(id));
    if (notification) {
      notification.dismissed = true;
    }
    return notification;
  },

  // Clear dismissed notifications
  async clearDismissed() {
    await delay(100);
    const beforeCount = notifications.length;
    notifications = notifications.filter(n => !n.dismissed);
    return beforeCount - notifications.length;
  },

  // Create specific notification types
  async createBotNotification(type, data) {
    const notificationMap = {
      'lead_created': {
        title: 'New Lead Created',
        message: `Bot conversation created a new lead: ${data.leadName}`,
        type: 'success',
        icon: 'UserPlus'
      },
      'conversation_analyzed': {
        title: 'Conversation Analyzed',
        message: `Chat conversation has been analyzed with ${data.confidence}% confidence`,
        type: 'info',
        icon: 'MessageCircle'
      },
      'activity_created': {
        title: 'Activity Created',
        message: `New ${data.activityType} created: ${data.subject}`,
        type: 'info',
        icon: 'Calendar'
      },
      'crm_update': {
        title: 'CRM Update Recommended',
        message: 'AI analysis suggests updating lead information',
        type: 'warning',
        icon: 'AlertTriangle'
      }
    };

    const template = notificationMap[type] || {
      title: 'Bot Notification',
      message: 'Bot activity update',
      type: 'info',
      icon: 'Bot'
    };

    return this.create({
      ...template,
      ...data,
      source: 'bot',
      category: 'automation'
    });
  },

  // Get notification statistics
  async getStats() {
    await delay(50);
    const total = notifications.length;
    const unread = notifications.filter(n => !n.read).length;
    const byType = notifications.reduce((acc, n) => {
      acc[n.type] = (acc[n.type] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      unread,
      read: total - unread,
      byType
    };
  }
};