var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');
var supabase = require('../supabase');

require.extensions['.html'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

var emailTemplate = require('..//email.html');

const adminAuthClient = supabase.auth.admin

async function checkUser(userId) {
    const { data, error } = await supabase.auth.admin.getUserById(userId)
    if (error) {a
        console.error(error)
        return false
    } else {
        return true
    }
}

/* send new email. */
router.post('/', async function(req, res, next) { // Note the async keyword here
    const sendTo = req.body.email;
    const employeeName = req.body.name;
    const userId = req.body.userId;

    if (!sendTo || !employeeName || !userId) {
        res.status(400).send('Missing required fields');
        return;
    }

    const user = await checkUser(userId); // Await the result of checkUser

    if (!user) {
        res.status(400).send('User not found');
        return;
    }

    let custom = emailTemplate.replace('{{employee_name}}', employeeName);

    const options = {
        url: 'https://api.resend.com/emails',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.RESEND_KEY}`,
            'Content-Type': 'application/json'
        },
        json: true,
        body: {
            "from": "onboarding@resend.dev",
            "to": sendTo,
            "subject": "Welcome to Wheeler Peak Ice!",
            "html": custom
        }
    };

    request(options, function(error, response, body) {
        if (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        } else {
            console.log(response.statusCode);
            console.log(body);
            res.send(body);
        }
    });
});


module.exports = router;
