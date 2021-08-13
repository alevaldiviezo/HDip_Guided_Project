const Booking = require('../models/booking');
const ejs = require('ejs');
const pdf = require('html-pdf');
const path = require('path');

//See all the bookings in my boobings page
module.exports.mybookingIndex = async(req,res) => {
    const bookings = await Booking.find({});
    res.render('bookings/bookingIndex', {bookings});
};

//Show the booking
module.exports.showBooking = async(req,res) => {
    const {bookingId} = req.params;
    const booking = await Booking.findById(bookingId);
    res.render('bookings/bookingShow', {booking});
};

//Access to a form for editing a booking
module.exports.editBooking = async(req, res) => {
    const {bookingId} = req.params;
    const booking = await Booking.findById(bookingId);
    res.render('bookings/bookingEdit', {booking});
};

// Method to generate the invoice
module.exports.generateReport = async(req, res) => {
    const {bookingId} = req.params;
    const booking = await Booking.findById(bookingId);
    ejs.renderFile(path.join(__dirname, '../views/bookings', "invoice.ejs"), {booking: booking}, (err, data) => {
    if (err) {
          res.send(err);
    } else {
        let options = {
            "height": "11.25in",
            "width": "8.5in",
            "header": {
                "height": "20mm"
            },
            "footer": {
                "height": "20mm",
            },
        };
        pdf.create(data, options).toFile("report.pdf", function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send("File created successfully");
            }
        });
    }
})
};

// Update the booking in the DB

module.exports.updateBooking = async(req,res) => {
    const {bookingId} = req.params;
    const booking = await Booking.findByIdAndUpdate(bookingId, {...req.body.booking});
    if(!booking){
        req.flash('error', 'Booking does not exist :-('); // message if booking does not exist in the system
        return res.redirect('/bookings');
    }
    req.flash('success', 'booking updated successfully!')
    res.redirect(`/bookings/${booking._id}`);

};

