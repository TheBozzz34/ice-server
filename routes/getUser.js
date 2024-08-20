const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

async function checkUser(userId) {
    try {
        const { data, error } = await supabase.auth.admin.getUserById(userId);
        if (error) {
            console.error("Error checking user:", error);
            return false;
        }
        return !!data; // Return true if user data exists
    } catch (err) {
        console.error("Unexpected error checking user:", err);
        return false;
    }
}

router.get('/', async (req, res) => {
    const { uuid, userId } = req.query; // Use query parameters for GET request

    if (!uuid || !userId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Verify that the logged-in user is valid
        const userExists = await checkUser(userId);
        if (!userExists) {
            return res.status(400).json({ error: 'User not authenticated' });
        }

        // Retrieve data for the specified uuid
        const { data, error } = await supabase.auth.admin.getUserById(uuid);

        if (error) {
            console.error("Error fetching user by UUID:", error);
            return res.status(500).json({ error: 'Error fetching user data' });
        }

        if (data) {
            return res.status(200).json(data);
        } else {
            return res.status(404).json({ error: 'User not found' });
        }

    } catch (err) {
        console.error("Unexpected error:", err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
