const userModel = require('../models/user.model');
const asyncErrorHandler = require('../utils/asyncError');
const customError = require('../utils/customError');

exports.register = asyncErrorHandler(async(req, res, next) => {
    const {name, email , password} = req.body;

    isEmailExist = await userModel.findOne({ email });

    if(isEmailExist){
      return next (new customError(400, 'Email is already exit')) ;
    };

    const newUser = await userModel.create({ name, email, password });

    res.status(201).json({
        success: true,
        newUser,
    });
});

exports.logIn = asyncErrorHandler(async (req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return  next(new customError(404, 'Please enter email and password!'));
    };

    const user =await userModel.findOne({email});
    if(!user) {
        return next(new customError(400, 'Invalid Email'));
    };

    const isPasswordMatch = await user.comparePassword(password);
    if(!isPasswordMatch) {
        return next(new customError(401, 'Invalid password'));
    };

    const accessToken = await user.SignAccessToken();

    res.status(201).json({
        success: true,
        accessToken,
        user,  
    });

});

exports.getUserInfo = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;

    const user = await userModel.findById(userId);

    res.status(201).json({
        success: true,
        user,
    });

});

exports.getAllUser = asyncErrorHandler(async (req, res, next) => {
    const user = await userModel.find().sort({ createdAt: -1});

    res.status(201).json({
        success: true,
        user
    });
});


exports.updateUser = asyncErrorHandler(async(req, res, next) => {
    const {name, email} = req.body;
    const id = req.user._id;

    const user = await userModel.findByIdAndUpdate(
        id,
        {name, email},
        {new: true}
    );

    if(!user) {
        return next(new customError(404, 'User not found!'));
    };

    res.status(201).json({
        success: true,
        user
    });
});

exports.updateUserPassword = asyncErrorHandler(async (req, res, next) => {
    const  id = req.user._id;

    const {oldPassword , newPassword} = req.body;
    if(!oldPassword || !newPassword) {
        return next(new customError(404, 'Enter old and new password'));
    };

    const user = await userModel.findById(id);

    const isPasswordMatch = await user?.comparePassword(oldPassword);

    if(!isPasswordMatch) {
        return next(new customError(400, 'Invalid oldPassword'));
    };

    user.password = newPassword;
    user.save();

    res.status(201).json({
        success: true,
        message: 'password updated successfully'
    });

});


exports.deleteOneUser = asyncErrorHandler(async (req, res, next) => {
    const id = req.params;

    const user = await userModel.findByIdAndDelete(id);
    if(!user) {
        return next(new customError(404, 'User not found'));
    };

    res.status(201).json({
        success: true,
        message: 'User deleted successfully'
    });
});