const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : 'mypassword',
    database        : 'RandomMathDB'
  });

function saveUser(email, username, password) {
    const user  = { email, username, password, score: 0, playedGames: 0, scorePercentage: 0};
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO users SET ?', user, async function (error, results) {
            if (error) reject(error);
            else {
                const savedUser = await getUserByUserId(results.insertId);
                resolve(savedUser);
            }
        });
    });
}

function getUserByEmailOrUsername(username) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM `users` WHERE `username` = ? OR `email` = ?', [username, username], function (error, results) {
            if (error) reject(error);
            else resolve(results[0]);
        });
    });
}

function getUsersSortedBy(sort) {
    const sortedByScoreQuery = 'SELECT username, email, score, playedGames, scorePercentage FROM `users` order by score DESC';
    const sortedByPlayedGamesQuery = 'SELECT username, email, score, playedGames, scorePercentage FROM `users` order by playedGames DESC';
    const sortedByScorePercentageQuery = 'SELECT username, email, score, playedGames, scorePercentage FROM `users` order by scorePercentage DESC';

    let query;
    if (sort.toLowerCase() === 'score') {
        query = sortedByScoreQuery;
    } else if (sort.toLowerCase() === 'playedgames') {
        query = sortedByPlayedGamesQuery;
    } else if (sort.toLowerCase() === 'scorepercentage') {
        query = sortedByScorePercentageQuery;
    }

    return new Promise((resolve, reject) => {
        pool.query(query, function (error, results) {
            if (error) reject(error);
            else resolve(results);
        });
    });
}

function getUserByUserId(userid) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM `users` WHERE `userid` = ?', [userid], function (error, results) {
            if (error) reject(error);
            else resolve(results[0]);
        });
    });
}

function updateUser(userid, user) {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE users SET ? where userid = ? limit 10',
        [user, userid], async function (error, results) {
            if (error) reject(error);
            else {
                const updatedUser = await getUserByUserId(userid);
                resolve(updatedUser);
            }
       });
    });
}

module.exports = {
    saveUser,
    getUserByEmailOrUsername,
    updateUser,
    getUsersSortedBy
};