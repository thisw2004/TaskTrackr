module.exports = app => {
  const notifications = require('../controllers/notification.controller.js');
  const router = require('express').Router();
  
  // Get VAPID public key
  router.get('/key', notifications.getPublicKey);
  
  // Subscribe to notifications
  router.post('/subscribe', notifications.subscribe);
  
  // Send test notification
  router.post('/test', notifications.test);
  
  app.use('/api/notifications', router);
};