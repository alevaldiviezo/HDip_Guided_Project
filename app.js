if(process.env.NODE_ENV !== "production"){  // Enviroment variables to handle development and production
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const ejs = require('ejs');
const pdf = require('html-pdf');

const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const myBookingsRoutes = require('./routes/myBookingsRoutes');
const User = require('./models/user');
const Service = require('./models/service');
const Review = require('./models/review');
const Booking = require('./models/booking');
const ExpressError = require('./utils/ExpressError');
const {isLoggedIn, isBookingAuthor, isAdmin} = require('./middleware');
const catchAsync = require('./utils/catchAsync');
const { findById } = require('./models/user');


//Conecction to DB
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/laundry-services2'; //Depends on the environment variables, the DB will connect locally or in the cloud

// mongodb://localhost:27017/laundry-services2
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false 
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database Connected!");
});



const app = express();

//App configuration
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname+'/views')); // Set the folder views with path
app.use(express.static(__dirname+'/public')); // This line allows us to use local images

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method')); //Configure the use of methods

//Session configuration
const sessionConfig = {
    secret: 'victoriasSecret',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now()+ 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());
// from the passport documentation the recommended usage is after sessionConfig
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //Method from passport-local

passport.serializeUser(User.serializeUser()); //Store a user in the session
passport.deserializeUser(User.deserializeUser()); // Delete a user in the session

//locals are globa variables that can be used along all the app
app.use((req, res, next) => {
    res.locals.currentUser = req.user;  //we have access in all the templates to this information
    res.locals.service = req.service;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//Routes to be used for the entities
app.use('/', userRoutes);
app.use('/services', serviceRoutes);
app.use('/reviews', reviewRoutes);
app.use('/services/:id/bookings', bookingRoutes);
app.use('/bookings', myBookingsRoutes);


//Access to home
app.get('/', catchAsync(async(req, res) => {
    const reviews = await Review.find({}).populate('author');
    res.render('home', {reviews});   
}));


//Error handlers
app.all('*', (req, res, next) => {  //Error when a page does not exist in our routes
    next(new ExpressError('Page not Found!', 404));
})

app.use((err, req, res, next) => {  // message when we dont find something in the DB, or err will be an error generated above
    const {statusCode = 500} = err; 
    if(!err.message) err.message = 'Something went wrong!!';
    res.status(statusCode).render('error', {err});
})

//Port to be used
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server started at ${port}!`);
})