const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Auth Routes
app.post('/api/auth/signup', (req, res) => {
    console.log('Signup data:', req.body);
    res.json({ message: 'User created successfully' });
});

app.post('/api/auth/login', (req, res) => {
    console.log('Login data:', req.body);
    if (req.body.contact === 'test' && req.body.password === 'test') {
        res.json({ token: 'mock-jwt-token-123' });
    } else {
        res.status(401).json({ message: 'Invalid credentials. Use contact: test, password: test' });
    }
});

// Referral Routes
const mockReferrals = [
    { assignedHospital: 'City General', score: 85, travelTime: 45, status: 'Accepted' },
    { assignedHospital: 'County Medical', score: 60, travelTime: 120, status: 'Pending' }
];

app.post('/api/referrals', (req, res) => {
    console.log('New referral data:', req.body);
    const newRef = {
        assignedHospital: 'Regional Care Center',
        score: 92,
        travelTime: 30,
        status: 'Pending'
    };
    mockReferrals.push(newRef);
    res.json(newRef);
});

app.get('/api/referrals', (req, res) => {
    res.json(mockReferrals);
});

app.listen(5000, () => console.log('Mock API running on port 5000'));
