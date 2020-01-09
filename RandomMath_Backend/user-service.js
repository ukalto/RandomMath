const crypto = require('crypto');
const persistenceUnit = require('./persistence-unit');
const config = require('./config');

const cryptoKey = config.PW_SECRET;

//A function to sign up a user
async function signUpUser(email, username, password) {
    return await new Promise(
        async (resolve, reject) => {
            if (!email || email.length < 5) {
                const error = new Error('E-Mail must not be empty');
                error.status = 422;
                reject(error);
                return;
            }    
            if (!email || email.length >= 46) {
                const error = new Error('E-Mail has to be smaller than 45 symbols');
                error.status = 422;
                reject(error);
                return;
            }  
            if (!username || username.length < 1) {
                const error = new Error('Username must not be empty');
                error.status = 422;
                reject(error);
                return;
            }
            if (!username || username.length >= 46) {
                const error = new Error('Username has to be smaller than 45 symbols');
                error.status = 422;
                reject(error);
                return;
            }

            const passwordError = validatePassword(password);
            if (passwordError) {
                reject(passwordError);
                return;
            }

            // Check if user with same email exists
            const userWithEmail = await persistenceUnit.getUserByEmailOrUsername(email);
            if (userWithEmail) {
                const error = new Error('Email is already taken');
                error.status = 422;
                reject(error);
                return;
            }

            const userWithUsername = await persistenceUnit.getUserByEmailOrUsername(username);

            if (userWithUsername) {
                const error = new Error('Username is already taken');
                error.status = 422;
                reject(error);
                return;
            }
    
            const hash = crypto.createHmac('sha512', cryptoKey);
            hash.update(password);
            const hashedPassword = hash.digest('hex');
            const savedUser = await persistenceUnit.saveUser(email, username, hashedPassword);
            resolve(savedUser);
            return;
        }
    );
}

//A function to validate the password
function validatePassword(password) {
    if (!password) {
        const error = new Error('Password must not be empty');
        error.status = 422;
        return error;
    }
    if (password.length <= 12) {
        const error = new Error('Password must contain 12 or more symbols');
        error.status = 422;
        return error;
    }

    const atLeastOneLowercase = new RegExp("[a-z]+");
    const atLeastOneUppercase = new RegExp("[A-Z]+")
    //const atLeastOneNumber = new RegExp("[0-9]+")

    if (!atLeastOneLowercase.test(password)) {
        const error = new Error('Password must contain at least one lower case letter');
        error.status = 422;
        return error;
    }
    /*if (!atLeastOneNumber.test(password)) {
        const error = new Error('Password must contain at least one number');
        error.status = 422;
        return error;
    }*/
    if (!atLeastOneUppercase.test(password)) {
        const error = new Error('Password must contain at least one upper case letter');
        error.status = 422;
        return error;
    }

    let amountOfSymbols = 0;
    let symbol = undefined;

    for(let idx = 0; idx < password.length; idx++) {
        if (amountOfSymbols === 2 && password.charAt(idx) === symbol) {
            const error = new Error('Password cannot have three same symbols after one another');
            error.status = 422;
            return error;
        } else if (password.charAt(idx) === symbol) {
            amountOfSymbols++;
        }
        symbol = password.charAt(idx);
    }
}

//A function to login a user
function loginUser(username, password){
    return new Promise(
        (resolve, reject) => {
            if (!username || !password){
                const error = new Error('Password or Username must not be empty');
                error.status = 422;
                reject(error);
                return;
            }
            persistenceUnit.getUserByEmailOrUsername(username)
                .then((foundUser) => {
                    if(!foundUser){
                        const error = new Error(`Did not find any User with this name: ${username}`);
                        error.status = 404;
                        reject(error);
                        return;
                    }
                    const hash = crypto.createHmac('sha512', cryptoKey);
                    hash.update(password);
                    const hashedPassword = hash.digest('hex');
                    if(foundUser.password === hashedPassword){
                        resolve(foundUser);
                        return;
                    } else {
                        const error = new Error(`Wrong Password`);
                        error.status = 401;
                        reject(error);
                        return;
                    }
                }).catch((err) => reject(err));
        });
}

// A function to get a user by his name
function getUserByName(username){
    return new Promise(
        (resolve, reject) => {
            if (!username){
                const error = new Error('Username must not be empty');
                error.status = 422;
                reject(error);
                return;
            }
            persistenceUnit.getUserByEmailOrUsername(username)
                .then((foundUser) => {
                    if(!foundUser){
                        const error = new Error(`Did not find any User with this name: ${username}`);
                        error.status = 404;
                        reject(error);
                        return;
                    }
                    resolve(foundUser);
                }).catch((err) => reject(err));
        });
}

// A function to edit user
function editUser(username, updatedValue){
    return new Promise(
        (resolve, reject) => {
            if (!username){
                const error = new Error('Username must not be empty');
                error.status = 422;
                reject(error);
                return;
            }
            persistenceUnit.getUserByEmailOrUsername(username)
                .then((foundUser) => {
                    if(!foundUser){
                        const error = new Error(`Did not find any User with this name: ${username}`);
                        error.status = 404;
                        reject(error);
                        return;
                    }
                    const user = {
                        userid: foundUser.userid,
                        email: foundUser.email,
                        password: foundUser.password,
                        score: foundUser.score,
                        playedGames: foundUser.playedGames,
                        scorePercentage: foundUser.scorePercentage
                    };

                    if (updatedValue.email) {
                        user.email = updatedValue.email;
                    }
                    if (updatedValue.password) {
                        validatePassword(updatedValue.password, reject);
                        const hash = crypto.createHmac('sha512', cryptoKey);
                        hash.update(updatedValue.password);
                        const hashedPassword = hash.digest('hex');
                        user.password = hashedPassword;
                    }
                    persistenceUnit.updateUser(user.userid, user);
                    resolve();
                }).catch((err) => reject(err));
        });
}

async function sendScore(username, score){
    const user = await persistenceUnit.getUserByEmailOrUsername(username);
    if(isNaN(score) || score < 0 || score > 10){
        const error = new Error(`Score can't be null or smaller than 0 or bigger than 10`);
        error.status = 400;
        throw error;
    }
    if (!user) {
        const error = new Error(`User with username ${username} was not found`);
        error.status = 404;
        throw error;
    }
    user.score = user.score + score;
    user.playedGames++;
    user.scorePercentage = (user.score/(user.playedGames*10))*100;
    return await persistenceUnit.updateUser(user.userid, user);
}

async function getUsersSortedBy(sort) {
    const lowerCaseSort = sort.toLowerCase();
    if (lowerCaseSort !== 'score' && lowerCaseSort !== 'playedgames' && lowerCaseSort !== 'scorepercentage') {
        const error = new Error(`Cannot sort by ${sort}`);
        error.status = 400;
        throw error;
    }

    return await persistenceUnit.getUsersSortedBy(sort);
}

module.exports = {
    signUpUser,
    loginUser,
    getUserByName,
    editUser,
    sendScore,
    getUsersSortedBy,
};