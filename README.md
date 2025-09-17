# Jacto

tabela utilizada:
Create database Cars;

use Cars;

CREATE TABLE Cars (
id int identity primary key,
model VARCHAR(255),
year INT,
price INT,
transmission VARCHAR(255),
mileage INT,
fuelType VARCHAR(255),
tax INT,
mpg FLOAT,
engineSize FLOAT,
Manufacturer VARCHAR(255)
);

select \* from Cars;
