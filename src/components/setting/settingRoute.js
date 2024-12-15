const express = require ('express');
const router =express.Router();
const {ensureAuthenticated} = require('../../middlewares/AuthMiddleware');


const settingController= require('./controllers/SettingController');

router.get('/edit-profile',ensureAuthenticated ,settingController.editProfile);
router.post('/update-profile/general',ensureAuthenticated ,settingController.updateGeneral);
router.post('/update-profile/info',ensureAuthenticated ,settingController.updateInfo);
router.post('/update-profile/password',ensureAuthenticated ,settingController.updatePassword);


module.exports = router;