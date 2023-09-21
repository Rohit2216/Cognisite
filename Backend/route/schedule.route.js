// Import necessary modules
const express = require('express');
const ScheduleRouter = express.Router();
const axios = require("axios");

const { Schedule } = require('../models/schedule'); // Import your Schedule model

// Define a POST route to add a new activity
// Define a route to add a new activity with only the date part (no time)
ScheduleRouter.post("/schedules", async (req, res) => {
  const { activityName, startDate, endDate, description, assignedTo } = req.body;

  // Validate the request body
  if (!activityName || !startDate || !endDate || !description || !assignedTo) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Create a new Schedule object
  const schedule = new Schedule({
    activityName,
    startDate,
    endDate,
    description,
    assignedTo,
  });

  try {
    // Convert startDate and endDate to date-only format (YYYY-MM-DD)
    const startDateOnly = new Date(startDate).toISOString().split('T')[0];
    const endDateOnly = new Date(endDate).toISOString().split('T')[0];

    // Assign the date-only values to the Schedule object
    schedule.startDate = startDateOnly;
    schedule.endDate = endDateOnly;

    // Save the Schedule object to the database
    await schedule.save();

    // Respond with the created Schedule object
    res.status(201).json(schedule);
  } catch (error) {
    console.error('Error adding schedule:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




ScheduleRouter.get('/', async (req, res) => {
  try {
    // Query the database to retrieve all activities
    const activities = await Schedule.find();

    res.status(200).json({ activities });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


ScheduleRouter.post("/schedules/filter", async (req, res) => {
  const { startDate, endDate } = req.body;

  // Validate the request body
  if (!startDate || !endDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Convert start and end dates to ISO format
    const start = new Date(startDate).toISOString();
    const end = new Date(endDate).toISOString();

    // Retrieve tasks within the specified date range
    const filteredTasks = await Schedule.find({
      startDate: { $gte: start },
      endDate: { $lte: end },
    });

    res.status(200).json(filteredTasks);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while filtering tasks" });
  }
});




ScheduleRouter.put("/update/:activityId", async (req, res) => {
  const { activityId } = req.params;
  const { progress, photoURL, comments } = req.body;
  console.log(activityId)

  try {
    // Find the activity by activityId
    const activity = await Schedule.findById(activityId);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Update the activity fields
    if (progress !== undefined) {
      activity.progress = parseInt(progress);
    }

    if (photoURL) {
      activity.photoURL = photoURL;
    }

    if (comments) {
      activity.comments.push(comments);
    }

    // Save the updated activity
    await activity.save();

    res.status(200).json({ message: "Activity updated successfully" });
  } catch (error) {
    console.error('Error updating activity:', error); // Log the error to the console
    res.status(500).json({ message: "An error occurred while updating the activity" });
  }
});




module.exports = {
  ScheduleRouter
};
