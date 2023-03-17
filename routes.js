const express = require("express");
const route = express.Router();
const { createEvent, sendInvite, getEventsOfUser } = require("./controllers/event.controller");
const { register } = require("./controllers/user.controller");
const {authentication,authorization} = require("./middleware/auth")
//event routes(CRUD)
route.post('/user/:userId/event',authorization ,createEvent);
route.get("/user/:userId/event", authorization,getEventsOfUser);
route.put("/user/:userId/event/:eventId", authorization,sendInvite);

// user routes
route.post("/user", register);


module.exports = route;
