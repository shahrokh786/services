const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint', user: req.body });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint', user: req.body });
});

module.exports = router;