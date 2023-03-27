# Vending Machine API

### Description ###

#### Quick summary:
An app to demonstrate my understanding of  System design in a [real world scenario](./instructions.md).

### How to Setup? ###

To run this application, you'll need 
- [Git](https://git-scm.com)  
- [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. 
- [Postgres](https://www.postgresql.org/download/)

* Clone the repository using this command(in your Command Line)
```bash
git clone https://github.com/Comurule/vending_machine_api.git
```

* Go into the repository
```bash
cd vending_machine_api
```

* Create .env file for environmental variables in your root directory like the __.env.sample__ file and provide the necessary details. ( You can also change the default values of the system configurations in `src/config/constants.js`).

* setup your postgres server and update the .env and `src/config/dbConfig.js` files with the database configuration in the respective environments.

* start up the application with

(For Production)
```bash
npm install --omit=dev && npm start
```
(For Development)
```bash
npm install && npm run dev
```

* Check the port on the specified port on the env or 8080.

### API End Points ###
The Endpoints documentation can be gotten in [this Postman documentation](https://documenter.getpostman.com/view/11194465/2s93RNzakQ).

### Recommended Improvements
- More API unit and integration testing
- More thought should be given to the optimizing the transaction services with more infrastructures, like adding a job queue when `buy` service becomes overwhelming for the system.

### Author
Chibuike Umechukwu