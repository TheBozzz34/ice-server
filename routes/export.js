var express = require('express');
var router = express.Router();
var supabase = require('../supabase');
const { convertArrayToCSV } = require('convert-array-to-csv');
const fs = require('fs');

async function checkUser(userId) {
    const { data, error } = await supabase.auth.admin.getUserById(userId)
    if (error) {
        console.error(error)
        return false
    } else {
        return true
    }
}

router.post('/', async function(req, res, next) { // Note the async keyword here
    const userId = req.body.userId;
    const table = req.body.table;

    if (!userId || !table) {
        res.status(400).send('Missing required fields');
        return;
    }

    const user = await checkUser(userId); // Await the result of checkUser

    if (!user) {
        res.status(400).send('User not found');
        return;
    }

    const { data, error } = await supabase
        .from(table)
        .select()

    if (error) {
        console.error(error)
        res.status(500).send('Error fetching data')
    }

    if (data) {
        const csvFromArrayOfObjects = convertArrayToCSV(data);
        fs.writeFileSync('rounds.csv', csvFromArrayOfObjects);
        res.download('rounds.csv');
    } else {
        res.status(500).send('Error fetching data')
    }
});


module.exports = router;
