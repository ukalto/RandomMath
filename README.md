# RandomMath

First of all, you have to download the following software:

- [Docker](https://docs.docker.com)
- [NodeJS](https://nodejs.org/en/)
- [Git Bash](https://git-scm.com/downloads)

### Project structure
The database is a MySQL database, which runs on a docker-container.

NodeJS is used for the backend.

Angular is used for the frontend.

### First steps
`git clone https://github.com/ukalto/RandomMath.git`

`npm install` will install the node_modules

`docker-compose up` will start the docker-compose file

`npm install -g @angular/cli` will install Angular CLI globally 

###### Write every command in the terminal
- Navigate to the `RandomMath_Frontend/` direcotry and execute `npm install`.
- Navigate to the `RandomMath_Backend/` direcotry and execute `npm install`. Based on the *package.json* file, npm will download all required node_modules to run a Angular application.
- Navigate to the `RandomMath/data/db/` directory and execute `docker-compose up`.
- Navigate to the `RandomMath_Frontend/` directory and execute `npm install -g @angular/cli` to install the **Angular CLI globally**.

### Packages to add
Navigate to the `RandomMath/` directory and create a package called *data*. In the package data create a package *db*.

### Database
``` sql
create table users (
userid integer primary key AUTO_INCREMENT,
username varchar(45),
password varchar(128),
email varchar(60),
score integer,
playedGames integer,
scorePercentage decimal(5,2)
)
```

### User handling
The password is hashed with **SHA-512** at the moment a user signs up. If somebody logs in to the website, the hash of the passwords will be compared. Furthermore, the session is handled with a bearer token. User data will only be sent at login or sign up.

### Files which are not in the repository
- data/db
- node_modules in frontend and backend package

### Get in use to the website
`npm start` will start the node_modules

###### Write every command in the terminal
- Navigate to the `RandomMath/data/db/` directory and execute `docker-compose up`, to start the container.
- Navigate to the `RandomMath_Frontend/` direcotry and execute `npm start` to start the application.
- Navigate to the `RandomMath_Backend/` direcotry and execute `npm start` to start the application.

Now start a browser your choice and open the ***url*** localhost:4200 (The standard port from **Angular**).

### Angular in detail
You find further information to **Angular** in my second [Readme](https://github.com/ukalto/RandomMath/edit/master/RandomMath_Frontend/README.md)
