const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userService = require('./user-service');
const auth = require('./auth');

const port = 3000;
const app = express();


app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Registration
app.post('/users', async (req, res) => {
    const user = req.body;
    try {
        const savedUser = await userService.signUpUser(user.email, user.username, user.password);
        const token = auth.createToken(user.username);
        res.status(201).json({
            message: `User ${user.username} was registered successfully`,
            token: `${token}`,
            userid: savedUser.userid,
            username: savedUser.username,
            email: savedUser.email,
        });
    } catch (err) {
        res.status(err.status ? err.status : 500).json({
            errorMessage: err.message
        });
    }
});

//Login
app.post('/users/login', async (req, res) => {
    const user = req.body;
    try {
        const foundUser = await userService.loginUser(user.username, user.password);
        const token = auth.createToken(user.username);
        res.json({
            message: `User ${foundUser.username} was logged in`,
            token: `${token}`
        });
    } catch (err) {
        res.status(err.status ? err.status : 500).json({
            errorMessage: err.message
        });
    }
});

//Profil anzeigen
app.get('/users/me',auth.checkToken, async (req, res) => {
    const username = req.decoded.username;
    try {
        const foundUser = await userService.getUserByName(username);
        res.json({
            userid: foundUser.userid,
            username: foundUser.username,
            email: foundUser.email,
            score: foundUser.score,
            playedGames: foundUser.playedGames,
            scorePercentage: foundUser.scorePercentage
        });
    } catch (err) {
        res.status(err.status ? err.status : 500).json({
            errorMessage: err.message
        });
    }
});

//Edit profil
app.patch('/users/me', auth.checkToken, async (req, res) => {
    const user = req.body;
    const username = req.decoded.username;
    try {
        await userService.editUser(username, user);
        res.json({
            message: `${username} updated`,
        })
    } catch (err) {
        res.status(err.status ? err.status : 500).json({
            errorMessage: err.message
        });
    }
})

//Score, playedGames, scorePercentage updaten
app.post('/users/score', auth.checkToken, async (req, res)=>{
    const score = req.body.score;
    const username = req.decoded.username;
    try {
        const user = await userService.sendScore(username, score);
        res.status(200).json({
            message: 'Score posted successfully',
            score: user.score,
            playedGames: user.playedGames,
            scorePercentage: user.scorePercentage 
        });
    } catch (err) {
        res.status(err.status ? err.status : 500).json({
            errorMessage: err.message
        });
    }
})

//leaderboard laden
app.get('/users/leaderboard', auth.checkToken, async (req, res) => {
    const sort = req.query.sort;

    try {
        const users = await userService.getUsersSortedBy(sort);
        res.status(200).json({
            users,
        });
    } catch (err) {
        res.status(err.status ? err.status : 500).json({
            errorMessage: err.message
        });
    } 
});


app.listen(port, () => console.log(`Random math app listening on port ${port}!`));