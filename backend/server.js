// imports
import http from 'http';
import { Server } from 'socket.io';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';

dotenv.config(); // loads .env file contents into ´process.env´

// Creates an Express App
const app = express();

/* used to mount the specified middleware function(s) 
  at the path which is being specified */
app.use(
  express.json() // creates an express app that only parses json
);

/* used to mount the specified middleware function(s) 
  at the path which is being specified */
app.use(
  express.urlencoded(
    { extended: true } // 
  ) // creates an express app that only parses urlencoded bodies
);

// Request Function
app.get(
  '/api/keys/paypal', // path
  (
    req, // get request
    res // get response
  ) => {
    // sends the HTTP response
    // respond with PAYPAL_CLIENT_ID or 'sb' string
    res.send(
      process.env.PAYPAL_CLIENT_ID || 'sb' 
    );
  } // callback
);

// Request Function
app.get(
  '/api/keys/google', // path
  (
    req, // get request
    res // get response
  ) => {
    // sends the HTTP response
    // response: send api key
    res.send('AIzaSyBOFyo8nZdLYfOvapNFH5rqIsv4uQn_a9A');
  } // callback
);

// open mongoose connection to MongoDb
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/ecommerce' // path
);

/* used to mount the specified middleware function(s) 
  at the path which is being specified */
app.use(
  '/api/uploads', // path
  uploadRouter // callback
);

/* used to mount the specified middleware function(s) 
  at the path which is being specified */
app.use(
  '/api/users', // path
  userRouter // callback
);

/* used to mount the specified middleware function(s) 
  at the path which is being specified */
app.use(
  '/api/products', // path
  productRouter // callback
);

/* used to mount the specified middleware function(s) 
  at the path which is being specified */
app.use(
  '/api/orders', // path
   orderRouter // callback
);
// define __dirname (absolute path)
// resolve a sequence of path-segments to an absolute path
const __dirname = path.resolve();

/* used to mount the specified middleware function(s) 
  at the path which is being specified */
app.use(
  '/uploads', // path
  // creates an express app that serves static files
  express.static(
    // join all arguments together and normalize the resulting path
    path.join(
      __dirname, // absolute path
      '/uploads' // path
    )
  ) // callback
);

/* used to mount the specified middleware function(s) 
  at the path which is being specified */
app.use(
  // creates an express app that serves static files
  express.static(
    // join all arguments together and normalize the resulting path
    path.join(
      __dirname, // absolute path
      '/frontend/build' // path
    )
  ) // callback
);

app.get(
  '*', // path
  (
    req, // get request
    res // get response
  ) =>
  // response - transfers the file at the given path
  res.sendFile(
    // join all arguments together and normalize the resulting path
    path.join(
      __dirname, // absolute path
      '/frontend/build/index.html' // path
    )
  ) // callback
);

/* used to mount the specified middleware function(s) 
  at the path which is being specified */
app.use(
  (
    err, // get error
    req, // get request
    res, // get response
    next // get next
  ) => {
  // Sends the HTTP response | status code 500 | message: err.message
  res.status(500).send(
    { message: err.message }
  );
} // callback
);

// create httpServer
const httpServer = http.Server(app);

// create server
const io = new Server( 
                      httpServer, 
                      { 
                        cors: { 
                        origin: '*' // path
                        } 
                      }  //Cross-Origin Resource Sharing ( cors )
                      );

// set users with empty array                      
const users = [];

// connection
io.on( 
  'connection', // 1st arg: 'connection' string
  (
    socket // arg: socket
  ) => 
  {
    console.log('connection', socket.id);

    // disconnect
    socket.on(
      'disconnect', // 1st arg: 'disconnect' string
      () => 
      {
        // define user
        const user = users.find(
          // find x 
          (x) => x.socketId === socket.id
        );

          // check user
          if (user) 
          {
            // set user.online to false
            user.online = false;

            console.log('Offline', user.name);

            // find user that is admin and does onliine
            const admin = users.find(
              // user isAdmin and does online
              (x) => x.isAdmin && x.online
            );
          
          // check admin
          if (admin) 
          {
            // targets a room when emitting
            io.to(
              admin.socketId // room
            )
            /* emits to all clients */
            .emit(
              'updateUser', // 1st arg: 'updateUser' ( string )
               user // 2nd arg: user ( object )
            );
          }

          }
      } // 2nd arg: arrow function
    );

    // onLogin
    socket.on(
      'onLogin', // 1st arg: 'onLogin' string
      (
        user // arg: user ( object )
      ) => 
      {
        // define updatedUser
        const updatedUser = {
          ...user, 
          online: true,
          socketId: socket.id,
          messages: [], 
        };

        // define existUser
        const existUser = users.find(
          // check user id
          (x) => x._id === updatedUser._id
        );
        
        // check existUser
        if (existUser) 
        { // true
          existUser.socketId = socket.id;
          existUser.online = true;
        } 
        else 
        { // false
          // append updatedUser to the end of users array
          users.push(updatedUser);
        }

        console.log('Online', user.name);

        // define admin
        const admin = users.find(
          // check if user isAdmin and does online
          (x) => x.isAdmin && x.online
        );
        
        // check admin
        if (admin) 
        {
          // targets a room when emitting
          io.to(
            admin.socketId // 1st arg
          // emits to all clients
          ).emit(
            'updateUser', // 1st arg: 'updateUser' ( string )
            updatedUser // 2nd arg: updatedUser ( object )
          );
        }
        
        // check updatedUser.isAdmin
        if (updatedUser.isAdmin) 
        {
          // targets a room when emitting
          io.to(
            updatedUser.socketId
          )
          // emits to all users
          .emit(
            'listUsers', // 1st arg: 'updateUser' ( string )
             users // 2nd arg: users ( array )
          );
        }
      } // 2nd arg: arrow function
    );

    // onUserSelected
    socket.on(
      'onUserSelected', // 1st arg: 'onUserSelected' string

      (
        user //  arg: user ( object )
      ) =>
      {
      
      // define user that isAdmin and is online
      const admin = users.find(
        (x) => x.isAdmin && x.online
      );
      
      // check admin 
      if (admin) 
      { // true

        // existUser by id
        const existUser = users.find(
          // check ids
          (x) => x._id === user._id
        );

        // targets a room when emitting
        io.to(
          admin.socketId // arg : admin.socketId ( room )
        // emits to all clients
        ).emit(
          'selectUser', // 1st arg: 'selectUser'
          existUser // 2nd arg: existUser
        );
      }
      } // 2nd arg: arrow function
    );

    // onMessage
    socket.on(
      'onMessage', // 1st arg: 'onMessage' string
      (
        message // arg: message
      ) => 
      {
        // check message.isAdmin
        if (message.isAdmin) 
        { // true
          // define user
          const user = users.find(
            (x) => x._id === message._id && x.online
          );

          // check user
          if (user)
          { // true
            // targets a room when emitting
            io.to(
              user.socketId // room
            )
            // emits to all clients
            .emit(
              'message', // 1st arg: 'message'
              message // 2nd arg: message ( object )
            );
            
            // append message to the end of messages array
            user.messages.push(
              message // arg: message
            );
          }
        } 
        else 
        { // false
          
          // define admin
          const admin = users.find(
            // find user ( isAdmin and is online ) in users ( array )
            (x) => x.isAdmin && x.online
          );

          // check admin
          if (admin) 
          { // true
            // targets a room when emitting
            io.to(
              admin.socketId // room 
            )
            // emits to all clients
            .emit(
              'message', // 1st arg: 'message' ( str )
              message // 2nd arg: message ( obj )
            );

            // define user
            const user = users.find(
              // find user in users array
              (x) => x._id === message._id && x.online
            );

            // append message to the end of messages array
            user.messages.push(message);
          } else {
            // targets a room when emitting
            io.to(socket.id)
            // emits to all clients
            .emit(
              'message', // 1st arg: 'message'
            {
              name: 'Admin',
              body: 'Sorry. I am not online right now',
            } // 2nd arg: object
            );
          }
        }
      } // 2nd arg: arrow function
    );

  } // 2nd arg: function
);

// define port
const port = process.env.PORT || 5000;

// start httpServer
httpServer.listen(
  port, // get port
  () => {
    console.log(`Serve at http://localhost:${port}`);
  } // get function
);
