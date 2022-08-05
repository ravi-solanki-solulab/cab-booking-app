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
  - user can register themself by using this endpoint.
 
 POST http://localhost:5000/auth/login
  - user can login using email and password.
  
 GET http://localhost:5000/bookings
  - list all the past bookings of perticular user.

 POST http://localhost:5000/nearby
  - list all the cabs which are available to accept the booking request withing specified distance.
  
 POST http://localhost:5000/book
  - send req to book a cab from source to destination.


### **swagger link**

  http://localhost:5000/cab/api



### **MongoDb collections diagram**

![cab-booking-schema](https://user-images.githubusercontent.com/110447114/183032384-448223a5-1a18-4246-bdbe-9985dd5ebbe2.jpg)


### In Database we will have 3 collections which are :
### 1.users
 Document sample in **'users'** collection
 
 	{
  	"_id" : ObjectId("62ebc95d1b1478958da9eedd"),
    	"firstName" : "test",
    	"lastName" : "test",
    	"password" : "$2b$10$nJuSJK0E0EhhXSfW4x.cHOm0HSbU51Qw44L1DxQpy/rfsjOjOKS3q",
    	"email" : "test@gmail.com",
    	"mobile" : "6767676767"
       }

### 2.cabs
  Document sample in **'cabs'** collection :
  
  	{
    	"_id" : ObjectId("62ea078134fc15533b6c37d9"),
    	"title" : "i10",
    	"driverName" : "Sam",
    	"contact" : "987856****",
    	"status" : "AVAILABLE",
    	"location" : {
        "type" : "Point",
        	"coordinates" : [
            		72.54687368135602,
            		23.085965635261882
        	]
    	}
      }

### 3.bookings
  Document sample in **'bookings'** collection
   - field 'userId' in this collection is the reference of the field '_id' from 'users' collection.
   - field 'cabId' in this collection is the reference of the field '_id' from 'cabs' collection.
  
	{
    	"_id" : ObjectId("62ebc9f51b1478958da9eede"),
    	"userId" : "62ebc95d1b1478958da9eedd",
    	"cabId" : "62ea078134fc15533b6c37d9",
    	"bookingAt" : ISODate("2022-08-04T13:30:29.910+0000"),
    	"drop" : {
        	"type" : "Point",
        	"coordinates" : [
			72.345622635261882
            		23.876565635261882
        	]
    	},
    	"pickup" : {
        	"type" : "Point",
        	"coordinates" : [
			72.528567468736813,
                	23.987645635261882
		]
		},
    	"bookingStatus" : "COMPLETED"
	}

### Postman collection of the application
 
 [cab-booking.postman_collection.zip](https://github.com/ravi-solanki-solulab/cab-booking-app/files/9267891/cab-booking-postman-collection.postman_collection.zip)

