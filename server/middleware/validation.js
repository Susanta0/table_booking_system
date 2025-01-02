const validateBooking=(req, res, next)=>{
    const {name, email, number, guests, date, time}=req.body;

    if(!name||!email||!number||!guests||!date||!time){
        return res.status(400).json({error:"All fields are required"})
    }
    if (guests<1){
        return res.status(400).json({ error: 'Number of guests must be at least 1' });
    }
     // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  // Basic phone validation (10 digits)
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(number)) {
    return res.status(400).json({ error: 'Invalid phone number format' });
  }
  
  next();
}

module.exports=validateBooking