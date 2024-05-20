var express = require('express');
var router = express.Router();
var supabase = require('../supabase');


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
    const email = req.body.email;
    const userId = req.body.userId;

    if (!email || !userId) {
        res.status(400).send('Missing required fields');
        return;
    }

    const user = await checkUser(userId); // Await the result of checkUser

    if (!user) {
        return res.status(400).send('User not found');
    }

    const { data, error } = await supabase.rpc("get_user_id_by_email", { email });

    if (error) {
        console.error("RPC Error" + error);
        return res.status(500).send('Error fetching data');
    }

    if (data) {
        console.log("RPC Data: " + data[0].id);
        var id = data[0].id;


        const { data1, error1 } = await supabase.auth.admin.deleteUser(
            id
        )

        if (error1) {
            console.error(error1);
            return res.status(500).send('Error fetching data');
        }

        if (data1) {
            return res.status(200).send('User deleted');
        }

        return res.status(500).send('Error fetching data');
    }

    res.status(500).send('Error fetching data');


});


module.exports = router;
