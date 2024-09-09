const express = require('express');
const app = express();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino');  // Import Pino logger
const { ObjectId } = require('mongoose').Types; 


const logger = pino();

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const db = await connectToDatabase();
        const collection = db.collection('users');
        const user = await collection.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Password comparison
        const isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Create JWT token
        const payload = {
            user: { id: user._id.toString() }
        };
        const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        // Send response
        res.json({
            authtoken,
            userName: user.firstName,
            userEmail: user.email
        });

        // Logging
        logger.info(`User ${user.email} logged in successfully`);
    } catch (e) {
        logger.error('Error in /login route:', e);
        return res.status(500).send('Internal server error');
    }
});

router.post('/register', [
        body('email', 'Please include a valid email').isEmail(),
        body('password', 'Password must be at least 8 characters').isLength({ min: 8 }),
    ], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Validation failed:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    };

    try {
        const email = req.body.email;

        const db = await connectToDatabase();
        const collection =db.collection("users");

        const getEmail = await collection.findOne({ email:  email});
        if(getEmail){
            return res.status(400).json({ error: "User with email already exists" });
        } else {
            const salt = await bcryptjs.genSalt(10);
            const hash = await bcryptjs.hash(req.body.password, salt);
            
            const newUser = await collection.insertOne({
                email: email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: hash,
                createdAt: new Date(),
            });

            const payload = {
                user: {id: newUser.insertedId.toString(),},
            };

            const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
            logger.info('User registered successfully');
            res.json({authtoken,userEmail: email});
        }
    } catch (e) {
        logger.error('Error in /register route', e);
        return res.status(500).send('Internal server error');
    }
});

router.put('/update', [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be at least 8 characters').optional().isLength({ min: 8 }),
    body('name').optional().custom(value => {
        // Custom validation to ensure that if name is provided, it should not be empty
        if (value && typeof value !== 'string') {
            throw new Error('Name must be a string');
        }
        return true;
    })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Validation failed:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: 'No authorization token provided' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.user.id;
        const _id = new ObjectId(userId);

        const db = await connectToDatabase();
        const collection = db.collection('users');

        // Find the existing user
        const existingUser = await collection.findOne({ _id: _id });

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user details
        const updateData = { updatedAt: new Date() };
        if (email) updateData.email = email;
        if (name) {
            const [firstName, lastName] = name.split(' ');
            updateData.firstName = firstName || existingUser.firstName;
            updateData.lastName = lastName || existingUser.lastName;
        }
        if (password) {
            const salt = await bcryptjs.genSalt(10);
            updateData.password = await bcryptjs.hash(password, salt);
        }

        await collection.updateOne({ _id: _id }, { $set: updateData });

        // Create a new JWT token
        const payload = { user: { id: _id.toString() } };
        const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.json({ authtoken });
    } catch (e) {
        logger.error('Error in /update route', e);
        return res.status(500).send('Internal server error');
    }
});


router.get('/profile', async (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'No authorization token provided' });
    }

    try {
        console.log('Authorization Header:', authHeader); // Log header
        const token = authHeader.split(' ')[1];
        console.log('Token:', token); // Log token

        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Decoded Token:', decoded); // Log decoded token

        const userId = decoded.user.id;

        const db = await connectToDatabase();
        const collection = db.collection('users');

        // Find the existing user
        const user = await collection.findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return user details
        const { email, firstName, lastName } = user;
        res.json({ email, name: `${firstName || ''} ${lastName || ''}` });
    } catch (e) {
        console.error('Error in /profile route', e);
        return res.status(500).send('Internal server error');
    }
});



module.exports = router;