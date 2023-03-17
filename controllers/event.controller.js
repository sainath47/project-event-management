const eventModel = require("../models/event.model");
const userModel = require("../models/user.model");
async function createEvent(req, res) {
  try {
    const { name, date, location, description, attendees } = req.body;

    const userId = req.params.userId;
    // Validate inputs
    if (!name || !date) {
      res.status(400).send("Missing required input");
    }

    // Create new event
    const newEvent = {
      name: name,
      date: date,
      attendees: attendees,
      location,
      description,
      createdBy: userId,
    };

    // Save new event to database
    const savedEvent = await eventModel.create(newEvent);
    let eventId = savedEvent._id;
    await userModel.findOneAndUpdate(
      { _id: userId },
      { $push: { attending: eventId } }
    );
    return res.status(201).send({ savedEvent });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "false", msg: error });
  }
}

// Following are the actions needs to be done on listing api
// a. pagination
/*
 const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const startIndex = (page - 1) * limit;

    const events = await Event.find()
      .skip(startIndex)
      .limit(limit)
      .exec();

    const totalEvents = await Event.countDocuments();

    res.send({
      events,
      currentPage: page,
      totalPages: Math.ceil(totalEvents / limit),
      totalEvents
    });
**/



// b. Sorting
/*
    const sortBy = req.query.sortBy || 'date';

    const events = await Event.find()
      .sort(sortBy)
      .exec();

    res.send(events);
**/

// c. Date Filter
/* const startDate = req.query.startDate;
const endDate = req.query.endDate;

const events = await Event.find({
  date: {
    $gte: startDate,
    $lte: endDate
  }
}).exec();
res.send(events);
**/
// d. Search Filter
/* const eventName = req.query.name;

const events = await Event.find({
  name: { $regex: eventName, $options: 'i' }
}).exec();

res.send(events);**/

async function getEventsOfUser(req, res) {
  try {
    //user
    let { userId } = req.params;
    //when the event is created pushing his id also into event & also eventId into the user doc
    let userIvites = await userModel.findOne({ _id: userId }).populate({
      path: "attending",
      populate: {
        path: "createdBy",
        select: "name",
      },
    });

    return res.status(200).send({ status: true, data: userIvites.attending });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "false", msg: error });
  }
}

async function sendInvite(req, res) {
  try {
    //gets the eventID with the help of
    //authorization should be present for this one , only the person who created the event should be able to send the invite
    const eventId = req.params.eventId;
    const inviteId = req.body.inviteId;
    const event = {};
    const checkEvent = await eventModel.findOne({ _id: eventId });
    // .populate('attendees');
    // return res.send({msg:event.attendees})

    if (!checkEvent) {
      return res.status(400).send({ status: "false", msg: "Event not found" });
    }

    event.name = req.body.name;
    event.date = req.body.date;
    event.location = req.body.location;
    event.description = req.body.description;
let updatedEvent
    if (inviteId) {
      const invites = event.attendees;
      if (invites.includes(inviteId)) {
        return res
          .status(400)
          .send({ status: "false", msg: "User already invited" });
      }

updatedEvent=      await eventModel.findOneAndUpdate(
        { _id: eventId },
        { event, $push: { attendees: inviteId } },
        { new: true }
      );

      await userModel.findOneAndUpdate(
        { _id: inviteId },
        { $push: { attending: eventId } }
      );
    } else {
  updatedEvent=    await eventModel.findOneAndUpdate(
        { _id: eventId },
         event,
        { new: true }
      );
    }

    return res.status(200).send({ status: true, msg: updatedEvent });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "false", msg: error });
  }
}


async function getEvents(){

  try{
    let {name, sortBy} = req.query
let find = eventModel.find({}).sort()
res.status(200).send({status:false,data:find})
  }catch(error){
    res.status(500).send({ status: "false", msg: error });

  }
}

module.exports = { createEvent,getEvents, getEventsOfUser, sendInvite };
