# cab-booking-app

Install node modules

    npm install
    
 Start the application
    
    npm start
    
 API endpoints
 
 POST http://localhost:5000/auth/register 
  - user can register themself by this endpoint
 
 POST http://localhost:5000/auth/login
  - user login using email and password through enpoint
  
 GET http://localhost:5000/bookings
  - list all the past bookings of perticular user 

 POST http://localhost:5000/nearby
  - list all the cabs which are available to accept the booking request withing specified distance.
  
 POST http://localhost:5000/book
  - send req to book cab for source to destination


swagger link
  http://localhost:5000/cab/api
 
