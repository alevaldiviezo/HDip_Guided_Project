const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Service = require('../models/service');
const {serviceSchema, reviewSchema} = require('../schemas');
const {isLoggedIn, validateService, isAuthor, isAdmin} = require('../middleware');
const serviceController = require('../controllers/serviceController');





//Access to index of services
router.get('/', catchAsync(serviceController.serviceIndex));

//Access to the form to create a new service
router.get('/newService', isLoggedIn, isAdmin, serviceController.newService);

//Create a service

router.post('/', isLoggedIn, isAdmin, validateService, catchAsync(serviceController.createService));

//See one service
router.get('/:id', catchAsync(serviceController.showService));

//Access to the edit form
router.get('/:id/editService', isLoggedIn, isAdmin, catchAsync(serviceController.editService));

//Update service
router.put('/:id', isLoggedIn, isAdmin, validateService, catchAsync(serviceController.updateService));

//Delete Service
router.delete('/:id', isLoggedIn, isAdmin, catchAsync(serviceController.deleteService));

module.exports = router;