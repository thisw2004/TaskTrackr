const webpush = require('web-push');

// Updated VAPID keys from your screenshot
const VAPID_PUBLIC_KEY = 'BKWr2-ShDbsTGlPY3qSIvhNJGBtT9lWmQXk1eWTsZy1u4xQ7d5Ne8c2jouYIf5Dn7pUFrT8HSDAEBLPU4HNVJeI';
const VAPID_PRIVATE_KEY = 'Koq3mmt1eW9IuGXrd2XXNcLTwzEUrzvzlBF9B19KSUE';

webpush.setVapidDetails(
  'mailto:contact@example.com', // Update this with your email
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// In-memory store for subscriptions
const subscriptions = [];

exports.getPublicKey = (req, res) => {
  console.log('Public key requested');
  res.status(200).json({ publicKey: VAPID_PUBLIC_KEY });
};

exports.subscribe = (req, res) => {
  console.log('Subscription received:', req.body);
  const subscription = req.body;
  
  // Store subscription (in a real app, save to database)
  subscriptions.push(subscription);
  
  res.status(201).json({ message: 'Subscription stored successfully' });
};

exports.test = (req, res) => {
  console.log('Test notification requested, sending to', subscriptions.length, 'subscriptions');
  
  const payload = JSON.stringify({
    title: 'TaskTrackr Notification',
    body: 'This is a test notification from the backend server!'
  });
  
  // If no subscriptions, return success but mention no subscribers
  if (subscriptions.length === 0) {
    console.log('No subscriptions to send to');
    return res.status(200).json({ message: 'No subscriptions to send to' });
  }
  
  const sendPromises = subscriptions.map(subscription => {
    return webpush.sendNotification(subscription, payload)
      .catch(error => {
        console.error('Error sending to subscription:', error);
        // Remove invalid subscriptions
        if (error.statusCode === 410) {
          const index = subscriptions.indexOf(subscription);
          if (index !== -1) {
            subscriptions.splice(index, 1);
          }
        }
      });
  });
  
  Promise.all(sendPromises)
    .then(() => {
      res.status(200).json({ message: 'Notification sent successfully' });
    })
    .catch(error => {
      console.error('Error sending notifications:', error);
      res.status(500).json({ message: 'Error sending notifications' });
    });
};