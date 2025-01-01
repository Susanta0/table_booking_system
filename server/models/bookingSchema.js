const {Schema, model}=require("mongoose")

const bookingSchema= new Schema({
    name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      number: {
        type: String,
        required: true
      },
      guests: {
        type: Number,
        required: true,
        min: 1
      },
      date: {
        type: Date,
        required: true
      },
      time: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
})


const bookingModel= new model("Booking", bookingSchema)

module.exports=bookingModel