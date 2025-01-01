"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

const TableBookingSystem = () => {
  const [bookingDetails, setBookingDetails] = useState({
    name: "",
    email: "",
    number: "",
    guests: 1,
    date: new Date(),
    time: "",
  });
  const [step, setStep] = useState(1);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleDateSelect = (date) => {
    setBookingDetails((prev) => ({
      ...prev,
      date,
    }));
  };

  // Time slots
  const timeSlots = [
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // submit data
  const handleSubmit = async (e) => {
    e.preventDefault();

    setBookingConfirmed(true);
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (number) => {
    return /^\d{10}$/.test(number);
  };

  const canProceedToTimeSelection = () => {
    return (
      bookingDetails.name &&
      isValidEmail(bookingDetails.email) &&
      isValidPhone(bookingDetails.number) &&
      bookingDetails.guests > 0
    );
  };

  const canConfirmBooking = () => {
    return (
      canProceedToTimeSelection() && bookingDetails.date && bookingDetails.time
    );
  };
  const { name, email, number, guests, date, time } = bookingDetails;

  return (
    <>
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Restaurant Table Booking System</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    type="text"
                    name="name"
                    required
                    value={name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <Label htmlFor="number">Number</Label>
                  <Input
                    name="number"
                    required
                    value={number}
                    onChange={handleChange}
                    placeholder="Enter your number"
                  />
                </div>
                <div>
                  <Label htmlFor="guests">Number of Guests</Label>
                  <Input
                    type="number"
                    name="guests"
                    required
                    value={guests}
                    onChange={handleChange}
                    placeholder="Enter your guests"
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!canProceedToTimeSelection()}
                  className="w-full"
                >
                  Next
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label>Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    className="rounded-md border"
                    disabled={(date) => date < new Date()}
                  />
                </div>

                <div>
                  <Label>Select Time</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={time === time ? "default" : "outline"}
                        onClick={() =>
                          handleChange({
                            target: { name: "time", value: time },
                          })
                        }
                        className="w-full"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="w-full"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={!canConfirmBooking()}
                    className="w-full"
                  >
                    Confirm Booking
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default TableBookingSystem;
