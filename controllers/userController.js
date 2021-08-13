//const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

//Access to register form
module.exports.registerUser = (req, res) => {
    res.render('users/userRegister');
};

//Create a user in the DB
module.exports.createUser = async(req, res) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser, err => {  // we use the login method from passport to login the registered user and catch an error in the process
            if(err) return next(err);
            req.flash('success','Welcome to Laundry Services!!');
            res.redirect('/services');
        })
                
    }catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
    
};

//Access to login form
module.exports.loginForm = (req, res) => {
    res.render('users/userLogin');
};

//Authenticate user
module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/services';  //we use this variable to redirect the user to a page that wanted to access before login
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

//Logout user
module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash('success', 'We`ll miss you ;(')
    res.redirect('/');
};




