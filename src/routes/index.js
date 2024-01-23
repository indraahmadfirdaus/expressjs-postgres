import express from 'express'
import UserActivityHandler from '../handler/UserActivityHandler.js';

const router = express.Router()

router.route('/user-activities/summary')
    .get(UserActivityHandler.getSummary)

router.route('/user-activities/segmentation')
    .get(UserActivityHandler.getSegmentation)

router.route('/user-activities/user-details')
    .get(UserActivityHandler.userDetails)

export default router;
