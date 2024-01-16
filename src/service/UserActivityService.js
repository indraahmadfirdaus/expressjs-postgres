import { userActivityRepo } from "../repo/UserActivityRepo.js"
import _ from 'lodash'

class UserActivityService {
    async getSummary() {
        const [
            uniqueUserAll,
            uniqueUserPerDay,
            countAndNewReturningUser,
            mostCrowdedDay,
            mostCrowdedLoginHour,
            totalData
        ] = await Promise.all([
            userActivityRepo.getDistinctUserAll(),
            userActivityRepo.getUniquerUserPerDay(),
            userActivityRepo.getCountNewAndReturningUser(),
            userActivityRepo.getMostCrowdedDay(),
            userActivityRepo.getMostCrowdedLoginHour(),
            userActivityRepo.getTotalData()
        ])
        return {
            unique_user_all: uniqueUserAll.rows[0].unique_user_by_email,
            unique_user_per_day: uniqueUserPerDay.rows,
            count_new__and_returning_user_all: countAndNewReturningUser.rows,
            most_crowded_day: mostCrowdedDay.rows,
            most_crowded_login_hour: mostCrowdedLoginHour.rows,
            total_data: totalData.rows[0].total_data
        }
    }

    async getSegmentation() {
        const [
            ageSegmentationPercentage,
            genderPercentage,
            brandPercentage,
            digitalInterestPercentage
        ] = await Promise.all([
            userActivityRepo.getAgeSegmentationPercentage(),
            userActivityRepo.getGenderPercentage(),
            userActivityRepo.getBrandPercentage(),
            userActivityRepo.getDigitalInterestPercentage()
        ])
        return {
            age_segmentation_percentage: ageSegmentationPercentage.rows,
            gender_percentage: genderPercentage.rows,
            brand__device_percentage: brandPercentage.rows,
            digital_interest_percentage: digitalInterestPercentage.rows
        }
    }

    async topFivePerLocation() {
        const topFiveUserByLocationsData = await userActivityRepo.getTopFiveUserPerLocation()
        return topFiveUserByLocationsData.rows
    }

    async userDetails(limit, offset) {
        const userDetails = await userActivityRepo.getUserDetail(limit, offset)
        const countUser = await userActivityRepo.countAllUser()
        return {
            count: countUser.rows[0].count,
            rows: userDetails.rows,
        }
    }

}

export const userActivityService = new UserActivityService()