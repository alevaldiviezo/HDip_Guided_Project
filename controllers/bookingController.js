const Booking = require('../models/booking');
const Service = require('../models/service');

// Method to create a booking

module.exports.createBooking = async(req, res) => {
    const service = await Service.findById(req.params.id);
    const booking = new Booking(req.body.booking);
    booking.author = req.user._id;
    booking.service = service.name;
    booking.price = service.price;
    service.bookings.push(booking);
    await booking.save();
    await service.save();
    req.flash('success', 'Booking created successfully!')
    res.redirect(`/services/${service._id}`);
};

// Method to delete a booking

module.exports.deleteBooking = async(req, res) => {
    const {id, bookingId} = req.params;
    await Service.findByIdAndUpdate(id, {$pull:{bookings: bookingId}});  //$pull method finds a bookingId in a bookings array
    await Booking.findByIdAndDelete(bookingId);
    req.flash('success', 'Booking deleted successfully!')
    res.redirect(`/services/${id}`);
};