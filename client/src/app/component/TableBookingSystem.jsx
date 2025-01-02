"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription } from "@/components/ui/alert"


const api = "https://table-booking-system.onrender.com/restarunet/table";
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
  const [loading, setLoading] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");



  // Fetch available time slots when date changes
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        setError("");
        const formattedDate = bookingDetails.date.toISOString().split("T")[0];
        const response = await fetch(
          `${api}/available-slots?date=${formattedDate}`
        );
        const slots = await response.json();
        setAvailableTimeSlots(slots);
      } catch (error) {
        setError("Failed to fetch available time slots");
      }
    };

    if (bookingDetails.date) {
      fetchAvailableSlots();
    }
  }, [bookingDetails.date]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear any existing errors when user starts typing
    setError("");
  };

  const handleDateSelect = (date) => {
    setBookingDetails((prev) => ({
      ...prev,
      date,
      time:""
    }));
    setError('');
  };

// submit data
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${api}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingDetails,
          date: bookingDetails.date.toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create booking');
      }

      await response.json();
      setBookingConfirmed(true);
      setSuccess('Your booking has been confirmed!');
    } catch (error) {
      setError(error.message);
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
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


 


  if (bookingConfirmed) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Booking Confirmed!</CardTitle>
        </CardHeader>
        <CardContent>
          {success && (
            <Alert className="mb-4">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <p><strong>Name:</strong> {bookingDetails.name}</p>
            <p><strong>Email:</strong> {bookingDetails.email}</p>
            <p><strong>Phone:</strong> {bookingDetails.number}</p>
            <p><strong>Guests:</strong> {bookingDetails.guests}</p>
            <p><strong>Date:</strong> {bookingDetails.date.toLocaleDateString()}</p>
            <p><strong>Time:</strong> {bookingDetails.time}</p>
          </div>
          <Button 
            className="mt-4 w-full"
            onClick={() => {
              setBookingConfirmed(false);
              setStep(1);
              setError('');
              setSuccess('');
              setBookingDetails({
                name: '',
                email: '',
                number: '',
                guests: 1,
                date: new Date(),
                time: ''
              });
            }}
          >
            Make Another Booking
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Restaurant Table Booking System</CardTitle>
        </CardHeader>
        <CardContent>
        {error && (
          <Alert className="mb-4" variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    type="text"
                    name="name"
                    required
                    value={bookingDetails.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    required
                    value={bookingDetails.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="number">Number</Label>
                  <Input
                    name="number"
                    required
                    value={bookingDetails.number}
                    onChange={handleChange}
                    placeholder="Enter your number"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="guests">Number of Guests</Label>
                  <Input
                    type="number"
                    name="guests"
                    required
                    value={bookingDetails.guests}
                    onChange={handleChange}
                    placeholder="Enter your guests"
                    disabled={loading}
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!canProceedToTimeSelection() || loading}
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
                    selected={bookingDetails.date}
                    onSelect={handleDateSelect}
                    className="rounded-md border"
                    disabled={(date) => date < new Date() || loading}
                  />
                </div>

                <div>
                  <Label>Select Time</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {availableTimeSlots.map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={bookingDetails.time === time ? "default" : "outline"}
                        onClick={() =>
                          handleChange({
                            target: { name: "time", value: time },
                          })
                        }
                        className="w-full"
                        disabled={loading}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                  {availableTimeSlots.length === 0 && (
                  <Alert className="mt-2">
                    <AlertDescription>
                      No available time slots for this date.
                    </AlertDescription>
                  </Alert>
                )}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="w-full"
                    disabled={loading}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={!canConfirmBooking() || loading}
                    className="w-full"
                  >
                     {loading ? 'Confirming...' : 'Confirm Booking'}
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
