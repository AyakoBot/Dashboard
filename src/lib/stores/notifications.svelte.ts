export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
 id: string;
 type: NotificationType;
 title: string;
 message?: string;
 duration?: number;
 action?: {
 label: string;
 onClick: () => void;
 };
}

class NotificationStore {
 notifications = $state<Notification[]>([]);

 addNotification = (notification: Omit<Notification, 'id'>) => {
 const id = Math.random().toString(36).substring(2, 9);
 const newNotification: Notification = {
  id,
  duration: 5000,
  ...notification,
 };

 this.notifications = [...this.notifications, newNotification];

 // Auto-remove after duration
 if (newNotification.duration) {
  setTimeout(() => {
  this.removeNotification(id);
  }, newNotification.duration);
 }

 return id;
 };

 removeNotification = (id: string) => {
 this.notifications = this.notifications.filter((n) => n.id !== id);
 };

 getNotifications = () => {
 return this.notifications;
 };
}

export const notificationStore = new NotificationStore();
export const { addNotification, removeNotification } = notificationStore;