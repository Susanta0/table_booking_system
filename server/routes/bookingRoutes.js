const { Router } = require("express");
const bookingModel = require("../models/bookingSchema");
const validateBooking = require("../middleware/validation");

const bookingRoutes = Router();

bookingRoutes.post("/table/bookings", validateBooking, async (req, res) => {
  try {
    const { date, time } = req.body;

    // Check if this time slot is already booked
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const existingBooking = await bookingModel.findOne({
      date: {
        $gte: startDate,
        $lte: endDate
      },
      time: time
    });

    if (existingBooking) {
      return res.status(400).json({ 
        error: 'This time slot is already booked. Please select another time.' 
      });
    }

    // If slot is available, create the booking
    const booking = new bookingModel(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: "Error creating booking" });
  }
});

// Get All Bookings
bookingRoutes.get("/table/bookings", async (req, res) => {
  try {
    const bookings = await bookingModel.find().sort({ date: 1, time: 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Error fetching bookings" });
  }
});

// Get Booking by ID
bookingRoutes.get("/table/bookings/:id", async (req, res) => {
  try {
    const booking = await bookingModel.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: "Error fetching booking" });
  }
});

// Delete Booking
bookingRoutes.delete("/table/bookings/:id", async (req, res) => {
  try {
    const booking = await bookingModel.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting booking" });
  }
});

// Get Available Time Slots for a Date
bookingRoutes.get("/table/available-slots", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: "Date parameter is required" });
    }

    const allTimeSlots = [
      "11:00 AM",
      "11:30 AM",
      "12:00 PM",
      "12:30 PM",
      "1:00 PM",
      "1:30 PM",
      "2:00 PM",
      "2:30 PM",
      "5:00 PM",
      "5:30 PM",
      "6:00 PM",
      "6:30 PM",
      "7:00 PM",
      "7:30 PM",
      "8:00 PM",
      "8:30 PM",
    ];

     // Get bookings for the specified date
     const startDate = new Date(date);
     startDate.setHours(0, 0, 0, 0);
     const endDate = new Date(date);
     endDate.setHours(23, 59, 59, 999);
 
     const existingBookings = await bookingModel.find({
       date: {
         $gte: startDate,
         $lte: endDate
       }
     });

       // Get all booked time slots for that date
    const bookedTimeSlots = existingBookings.map(booking => booking.time);

    // Filter out booked slots
    const availableTimeSlots = allTimeSlots.filter(
      slot => !bookedTimeSlots.includes(slot)
    );

    res.json(availableTimeSlots);
  } catch (error) {
    res.status(500).json({ error: "Error fetching available slots" });
  }
});



module.exports=bookingRoutes