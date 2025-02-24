class NotificationService {
    async notify(notification) {
      // Email
      if (notification.channels.includes('email')) {
        await this.sendEmail(notification);
      }
      
      // Push notification
      if (notification.channels.includes('push')) {
        await this.sendPushNotification(notification);
      }
      
      // Notification in-app
      await this.saveNotification(notification);
    }
  }
