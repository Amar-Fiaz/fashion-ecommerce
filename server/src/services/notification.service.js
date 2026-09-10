const Notification = require("../models/Notification");

async function createNotification(userId, type, message, data = {}) {
  if (!userId) return null; // guests have no account to notify
  return Notification.create({ user: userId, type, message, data });
}

async function getNotifications(userId) {
  return Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(50);
}

async function markAsRead(userId, notificationId) {
  const notification = await Notification.findOne({ _id: notificationId, user: userId });
  if (!notification) {
    const error = new Error("Notification not found");
    error.statusCode = 404;
    throw error;
  }
  notification.isRead = true;
  await notification.save();
  return notification;
}

async function markAllAsRead(userId) {
  await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
}

module.exports = { createNotification, getNotifications, markAsRead, markAllAsRead };