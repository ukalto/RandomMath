# RandomMath

First of all, you have to download:

- [Docker](https://docs.docker.com)
- [NodeJS](https://nodejs.org/en/)

### Project structure
The database is a MySQL database, which runs on a docker-container.

NodeJS is used for the backend.

Angular is used for the frontend.

### First steps
`npm install` will install the node_modules

`npm start` will start the node_modules

`docker-compose up` will start the docker-compose file

`npm install -g @angular/cli` will install angular 

###### Write every command in the terminal
- Navigate to the RandomMath_Frontend/ direcotry and execute `npm install`, then type `npm start` to start the node_modules.
- Navigate to the RandomMath_Backend/ direcotry and execute `npm install`, then type `npm start` to start the node_modules. Based on the *package.json* file, npm will download all required node_modules to run a Angular application.
- Navigate to the RandomMath/data/db/ directory and execute `docker-compose up`.
- Navigate to the RandomMath_Frontend/ directory and execute `npm install -g @angular/cli` to install the Angular CLI globally.



### Database
``` sql
create table users(
userid integer primary key AUTO_INCREMENT,
username varchar(45),
password varchar(128),
email varchar(60),
score integer,
playedGames integer,
scorePercentage decimal(5,2)
)
```

### User handling background
The password is getting hashed with sha512, at the moment a user signs up. If somebody logs into the website, the hash instead of the origanal password is getting compared. Furthermore, the username is getting handeld with a bearer token when he is using the webiste, instead of his username.

### Files which are not in the repository
- data/db
- node_modules in frontend and backend package
