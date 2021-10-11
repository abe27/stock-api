const express = require('express');
const router = express.Router();
const userSchema = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

const calSkip = (page, size) => {
    return (page - 1) * size;
};

const calPage = (count, size) => {
    return Math.ceil(count / size);
};

router.get('/', auth, async (req, res) => {
    try {
        const page = req.query.page || 1;
        const size = req.query.size || process.env.PAGE_PAGINATION_SIZE;

        const [_results, _count] = await Promise.all([
            userSchema.find()
                .skip(calSkip(page, size))
                .limit(size)
                .exec(),
            userSchema.countDocuments().exec()
        ]);

        return res.json({
            currentPage: page,
            pages: calPage(_count, size),
            currentCount: _results.length,
            totalCount: _count,
            data: _results
        });

    } catch (error) {
        return res.status(400).send({
            status: "error",
            data: [],
            message: error.message
        });
    }
});

router.get('/get/:id', auth, async (req, res) => {
    const users = await userSchema.find({ _id: req.params.id });
    return res.status(200).send({
        status: 200,
        data: users,
        message: 'Success'
    });
});

router.post("/register", async (req, res) => {
    // Our register logic starts here
    try {
        // Get user input
        const { first_name, last_name, email, mail_to, password, avatar } = req.body;

        // Validate user input
        if (!(email && password && first_name && last_name)) {
            return res.status(400).send("All input is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await userSchema.findOne({ email });

        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await userSchema.create({
            first_name,
            last_name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
            avatar: avatar,
            mail_to: mail_to,
            token: "",
        });

        // Create token
        const token = jwt.sign({ user_id: user._id }, process.env.TOKEN_KEY, { expiresIn: `${process.env.TOKEN_LIFF}`, });
        // save user token
        user.token = token;
        user.save();

        // return new user
        return res.status(201).json(user);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 'Bad Request',
            message: err.message,
        });
    }
    // Our register logic ends here
});

router.post("/auth", async (req, res) => {

    // Our login logic starts here
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send({
                status: 'Bad Request',
                message: "All input is required"
            });
        }
        // Validate if user exist in our database
        const user = await userSchema.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign({ user_id: user._id }, process.env.TOKEN_KEY, { expiresIn: `${process.env.TOKEN_LIFF}`, });

            // save user token
            user.token = token;
            user.save();

            // user
            return res.status(200).json({
                status: 'ok',
                user_id: user._id,
                token: token,
                expiresIn: `${process.env.TOKEN_LIFF}`
            });
        }

        return res.status(400).send("Invalid Credentials");

    } catch (err) {
        // console.log(err);
        return res.status(400).json({
            status: 'Bad Request',
            message: err.message,
        });
    }
    // Our register logic ends here
});

router.get("/profile", auth, async (req, res) => {
    try {
        const token = req.headers["authorization"];
        const decoded = await jwt.verify(token.split(" ")[1], process.env.TOKEN_KEY);
        const user = await userSchema.find({ _id: decoded.user_id });
        return res.status(200).json({
            status: "ok",
            data: {
                "user_id": decoded.user_id,
                "first_name": user[0].first_name,
                "last_name": user[0].last_name,
                "email": user[0].email,
                "is_admin": user[0].is_admin,
                "is_approve": user[0].is_approve,
                "created_at": user[0].created_at,
                "updated_at": user[0].updated_at,
            },
            message: ""
        });
    }
    catch (err) {
        return res.status(400).json({
            status: 'Bad Request',
            message: err.message,
        });
    }
});

router.patch('/update', auth, async (req, res) => {
    try {
        const token = req.headers["authorization"];
        const decoded = await jwt.verify(token.split(" ")[1], process.env.TOKEN_KEY);
        const user = await userSchema.findOneAndUpdate({ _id: decoded.user_id });

        if (req.body.first_name.length > 0) {
            user.first_name = req.body.first_name;
        }

        if (req.body.last_name.length > 0) {
            user.last_name = req.body.last_name;
        }

        if (typeof(req.body.is_admin) == 'boolean') {
            user.is_admin = req.body.is_admin;
        }

        if (typeof(req.body.is_approve) == 'boolean') {
            user.is_approve = req.body.is_approve;
        }

        user.updated_at = new Date();
        user.save();
        
        return res.status(401).json({
            status: "ok",
            data: {
                "user_id": decoded.user_id,
                "first_name": req.body.first_name,
                "last_name": req.body.last_name,
                "is_admin": req.body.is_admin,
                "is_approve": req.body.is_approve,
                "updated_at": new Date(),
            },
            message: "Update data completed.",
        });
    }
    catch (err) {
        return res.status(400).json({
            status: 'Bad Request',
            message: err.message,
        });
    }
});

router.delete('/delete/:id', auth, async (req, res) => {
    try {
        const token = req.headers["authorization"];
        const decoded = await jwt.verify(token.split(" ")[1], process.env.TOKEN_KEY);
        const user = await userSchema.find({ _id: decoded.user_id });
        if (user[0].is_admin && decoded.user_id != req.params.id) {
            const data = await userSchema.find({ _id: req.params.id });
            if (data.length <= 0)
            {
                return res.status(404).json({
                    status: 'ok',
                    message: `Not found user_id: ${req.params.id}`
                });
            }

            await userSchema.find({ _id: req.params.id }).remove();
            return res.status(200).json({
                status: 'ok',
                message: `Delete user_id: ${req.params.id} is success.`
            });
        }

        return res.status(401).json({
            status: "error",
            message: "Unauthorized or invalid id!"
        });
    }
    catch (err) {
        return res.status(400).json({
            status: 'Bad Request',
            message: err.message,
        });
    }
});



module.exports = router