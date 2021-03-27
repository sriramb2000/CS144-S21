CREATE TABLE Actors (
    name varchar(40),
    movie varchar(80),
    year int,
    role varchar(40)
);

LOAD DATA LOCAL INFILE './actors.csv' INTO TABLE Actors
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"';

SELECT name 
FROM Actors
WHERE movie="Die Another Day";