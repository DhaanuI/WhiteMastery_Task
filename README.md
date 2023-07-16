# Nodejs Application

APIs implemented:

| METHOD | ENDPOINT | DESCRIPTION | STATUS CODE |
| --- | --- | --- | --- |
| POST | api/students/register | This endpoint allow Students to register. | 201 |
| POST | api/students/login | This endpoint allow Students to login. | 201 |
| PATCH | api/students/upload/:id | To let Student to upload their Profile Pic
| PATCH | api/students/update/:id | To update Student
| DELETE | api/students/delete/:id | To delete Student
| GET | api/students/ | To get all users or specific Student based on query | 200
| POST | api/university/register | This endpoint allow university to register. | 201 |
| POST | api/university/login | This endpoint allow university to login. | 201 |
| PATCH | api/university/update/:id | To update university
| DELETE | api/university/delete/:id | To delete university
| GET | api/university/ | To get all university or specific university based on query | 200
| GET | api/events/ | To get Events | 200
| POST | api/events/add | This endpoint allow University to add events. | 201 |
| PATCH | api/events/update/:id | To update events
| DELETE | api/events/delete/:id | To delete events



## Tech Stack Used:
[![My Skills](https://skillicons.dev/icons?i=js,nodejs,express,mongodb)](https://skillicons.dev)

## Packages used:
Nodemailer         - for mailing purposes

Winston             - to keep track of error and warnings

bcrypt             - to hash passwords

JWT                - to securely create tokens

express-validator  - to validate info at server side

moment             - to parse, validate, manipulate and display date/time

sharp              - to reduce uploaded pic quality

multer             - to deal with files such as image
