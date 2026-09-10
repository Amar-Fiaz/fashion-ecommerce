const notificationService = require("../services/notification.service");

async function getNotifications(req, res, next) {
  try {
    const notifications = await notificationService.getNotifications(req.user.id);
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    next(error);
  }
}

async function markAsRead(req, res, next) {
  try {
    const notification = await notificationService.markAsRead(req.user.id, req.params.id);
    res.status(200).json({ success: true, notification });
  } catch (error) {
    next(error);
  }
}

async function markAllAsRead(req, res, next) {
  try {
    await notificationService.markAllAsRead(req.user.id);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
}

module.exports = { getNotifications, markAsRead, markAllAsRead };