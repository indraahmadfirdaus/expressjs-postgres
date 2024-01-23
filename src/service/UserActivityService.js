import { userActivityRepo } from "../repo/UserActivityRepo.js"
import _ from 'lodash'

class UserActivityService {
    async getSummary() {
        const [
            uniqueUserAll,
            uniqueUserPerDay,
            mostCrowdedDay,
            mostCrowdedLoginHour,
            totalData
        ] = await Promise.all([
            userActivityRepo.getDistinctUserAll(),
            userActivityRepo.getUniquerUserPerDay(),
            userActivityRepo.getMostCrowdedDay(),
            userActivityRepo.getMostCrowdedLoginHour(),
            userActivityRepo.getTotalData()
        ])
        return {
            unique_user_all: uniqueUserAll.rows[0].unique_user_by_email,
            unique_user_per_day: uniqueUserPerDay.rows,
            count_new_and_returning_per_day: await this.summarizeNewAndReturningPerDay(),
            count_new_and_returning_user_all: await this.summarizeNewAndReturningAll(),
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

    async userDetails() {
        const userDetails = await userActivityRepo.getUserDetail()
        const topFiveUserByLocationsData = await userActivityRepo.getTopFiveUserPerLocation()
        return {
            top_five_user_by_locations: topFiveUserByLocationsData.rows,
            user_details: userDetails.rows,
        }
    }

    async summarizeNewAndReturningPerDay() {
        const data = await userActivityRepo.getDataForCountUserNewAndReturning()
        const response = {}
        // { date: { new: number, returning: number } }
        const memory = {}
        for (const each of data.rows) {
            const date = each.date
            
            if(!response[date]) {
                response[date] = {
                    new: 0,
                    returning: 0
                }
            }

            if(memory[each.name]) {
                response[date].returning += 1
            } else {
                memory[each.name] = 1
                response[date].new += 1
            }
        }

        return response

    }

    async summarizeNewAndReturningAll() {
        const data = await this.summarizeNewAndReturningPerDay()
        const response = { new: 0, returning: 0 }

        for (const key in data) {
            response.new += data[key].new
            response.returning += data[key].returning
        }

        return response
    }

}

export const userActivityService = new UserActivityService()