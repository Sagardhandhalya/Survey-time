
-- drop table users;
-- drop table questions;
-- drop table answers;
-- drop table survey;

CREATE TABLE users(

    username VARCHAR(50) PRIMARY KEY ,
    pswd VARCHAR(50) NOT NULL
);

CREATE TABLE survey
(

    username VARCHAR(50) , 
    surveyId INT  PRIMARY key,
    surveyname VARCHAR(50) ,
    FOREIGN KEY (username) REFERENCES users(username) 
);

CREATE TABLE questions
(
    surveyId INT ,
    question VARCHAR(50) NOT NULL ,
    PRIMARY key(surveyId , question),
    FOREIGN KEY (surveyId) REFERENCES survey (surveyId) 
  
);

CREATE TABLE answers
(
    surveyId INT,
    username VARCHAR(50) ,
    question VARCHAR(50) NOT NULL,
    answer VARCHAR(50) NOT NULL ,
    PRIMARY key(surveyId , question ,username),
    FOREIGN KEY (surveyId) REFERENCES survey(surveyId) ,
    FOREIGN KEY (username) REFERENCES users(username) ,
    FOREIGN KEY (question) REFERENCES questions(question) 
);






