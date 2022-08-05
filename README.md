# cab-booking-app

### Install node modules

    npm install

##### Before running the application add .env file at the root level of project and add following env variables in it
	1.MONGO_URL
   	2.TOKEN_EXPIRE_IN
   	3.SECRET
	
	For example : 
	MONGO_URL="mongodb://localhost/cab"
    TOKEN_EXPIRE_IN ='1d'
    SECRET='This Is Secret'
    
### **Start the application**
    
    npm start
	
    
### **API endpoints**
 
 POST http://localhost:5000/auth/register 
  - user can register themself by using this endpoint
 
 POST http://localhost:5000/auth/login
  - user can login using email and password
  
 GET http://localhost:5000/bookings
  - list all the past bookings of perticular user 

 POST http://localhost:5000/nearby
  - list all the cabs which are available to accept the booking request withing specified distance.
  
 POST http://localhost:5000/book
  - send req to book a cab from source to destination


### **swagger link**

  http://localhost:5000/cab/api



### **MongoDb collections diagram**

![cab-booking-schema](https://user-images.githubusercontent.com/110447114/183032384-448223a5-1a18-4246-bdbe-9985dd5ebbe2.jpg)




