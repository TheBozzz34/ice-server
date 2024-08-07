var express = require('express');
var router = express.Router();
var supabase = require('../supabase');


async function checkUser(userId) {
    const { data, error } = await supabase.auth.admin.getUserById(userId)
    if (error) {a
        console.error(error)
        return false
    } else {
        return true
    }
}


router.get('/', async function(req, res, next) { // Note the async keyword here
    const uuid = req.body.uuid;
    const userId = req.body.userId;

    if (!uuid || !userId) {
        res.status(400).send('Missing required fields');
        return;
    }

    /*
    const user = await checkUser(userId); // Await the result of checkUser

    if (!user) {
        return res.status(400).send('User not found');
    }
    */

    
    const { data, error } = await supabase.auth.admin.getUserById(uuid)


    if (error) {
        console.error("Error" + error);
        return res.status(500).send('Error fetching data');
    }

    if (data) {
        return res.status(200).send(data);
    }

    res.status(500).send('Error fetching data');


});

module.exports = router;
