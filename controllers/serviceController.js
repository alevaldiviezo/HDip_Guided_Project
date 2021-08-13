//Require the model
const Service = require('../models/service');

// Show all the services
module.exports.serviceIndex = async (req, res) => {
    const services = await Service.find({});
    res.render('services/serviceIndex', {services});
};

//Access to a newe service form
module.exports.newService = (req, res) => {
    res.render('services/newService');
};

//Create a new service in the DB
module.exports.createService = async (req, res) => {  // we use catchAsync to catch a possible error and avoid to use try-catch
    // if(!req.body.service) throw new ExpressError('Invalid Service Data', 400);
          
    const service = new Service(req.body.service);
    service.author = req.user._id;  // We save the author's name from user
    service.author.role = req.user.role;
    await service.save();
    req.flash('success', 'Service created successfully!')
    res.redirect(`/services/${service._id}`);
};

//Show one service
module.exports.showService = async (req, res) => {
    const service = await Service.findById(req.params.id).populate({
        path:'bookings',
        populate:{
            path: 'author'
        }
    }).populate('author');
    if(!service){
        req.flash('error', 'Service does not exist :-(');  // message if the service does not exist in the system
        return res.redirect('/services');
    }
    res.render('services/showService', {service});
};

//Edit form for a service
module.exports.editService = async (req, res) => {
    const service = await Service.findById(req.params.id);
    if(!service){
        req.flash('error', 'Cannot find that service :(');
        return res.redirect('/services');
    }
    res.render('services/editService', {service});
};

//Update service in the DB
module.exports.updateService = async (req, res) => {
    const {id} = req.params;
    const service = await Service.findByIdAndUpdate(id, {...req.body.service});
    if(!service){
        req.flash('error', 'Service does not exist :-('); // message if the service does not exist in the system
        return res.redirect('/services');
    }
    req.flash('success', 'Service updated successfully!')
    res.redirect(`/services/${service._id}`);
};

//Delete a service
module.exports.deleteService = async (req, res) => {
    const {id}=req.params;
    await Service.findByIdAndDelete(id);
    req.flash('success', 'Service deleted successfully!')
    res.redirect('/services');
};