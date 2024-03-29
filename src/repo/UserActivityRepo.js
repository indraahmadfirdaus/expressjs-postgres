import { pgQueryHandler } from "../db/index.js"

class UserActivityRepo {
    async getDistinctUserAll() {
        let queryStr = `
            SELECT COUNT(distinct email) as unique_user_by_email from user_activities;
        `
        let responseData = await pgQueryHandler(queryStr)
        return responseData
    }

    async getUniquerUserPerDay() {
        let queryStr = `
        SELECT TO_CHAR(date, 'Day DD Month YYYY') AS date, COUNT(DISTINCT email) AS unique_users
        FROM public.user_activities
        GROUP BY date
        ORDER BY date;
    `
        let responseData = await pgQueryHandler(queryStr)
        return responseData
    }

    async getCountNewAndReturningUser() {
        let queryStr = `
        WITH user_counts AS (
            SELECT
              name,
              date,
              MIN(login_hour) AS first_login_hour
            FROM user_activities
            GROUP BY name, date
          )
          SELECT
            COUNT(DISTINCT CASE
              WHEN ua.login_hour = uc.first_login_hour THEN ua.name
            END) AS new_users,
            COUNT(DISTINCT CASE
              WHEN ua.login_hour != uc.first_login_hour THEN ua.name
            END) AS returning_users
          FROM user_activities ua
          JOIN user_counts uc ON ua.name = uc.name AND ua.date = uc.date;
    `
        let responseData = await pgQueryHandler(queryStr)
        return responseData
    }

    async getNewAndReturningUserData() {
        let queryStr = `
        SELECT
            name,
            login_hour,
            date,
        CASE
          WHEN ROW_NUMBER() OVER (PARTITION BY name, date ORDER BY login_hour) = 1 THEN 'NEW'
          ELSE 'RETURNING'
        END AS is_new
        FROM user_activities ua
        order by login_hour, date;
      
    `
        let responseData = await pgQueryHandler(queryStr)
        return responseData
    }

    async getMostCrowdedDay() {
        let queryStr = `
        SELECT TO_CHAR(date, 'Day DD Month YYYY') AS date, COUNT(*) AS total_users
        FROM public.user_activities
        GROUP BY date
        ORDER BY total_users DESC
        LIMIT 1;
    `
        let responseData = await pgQueryHandler(queryStr)
        return responseData
    }

    async getMostCrowdedLoginHour() {
        let queryStr = `
        SELECT login_hour, COUNT(*) AS total_users
        FROM public.user_activities
        GROUP BY login_hour
        ORDER BY total_users DESC
        LIMIT 1;
    `
        let responseData = await pgQueryHandler(queryStr)
        return responseData
    }

    async getTotalData() {
        let queryStr = `
        SELECT COUNT(*) AS total_data
        FROM public.user_activities;
    `
        let responseData = await pgQueryHandler(queryStr)
        return responseData
    }

    async getAgeSegmentationPercentage() {
        let queryStr = `
        WITH total_data AS (
            SELECT COUNT(*) AS total_data
            FROM public.user_activities
        ),
        age_group_data AS (
            SELECT
                CASE
                    WHEN EXTRACT(YEAR FROM CURRENT_DATE) - age < 18 THEN '< 18'
                    WHEN EXTRACT(YEAR FROM CURRENT_DATE) - age BETWEEN 18 AND 24 THEN '18 - 24'
                    WHEN EXTRACT(YEAR FROM CURRENT_DATE) - age BETWEEN 25 AND 34 THEN '25 - 34'
                    WHEN EXTRACT(YEAR FROM CURRENT_DATE) - age BETWEEN 35 AND 44 THEN '35 - 44'
                    WHEN EXTRACT(YEAR FROM CURRENT_DATE) - age BETWEEN 45 AND 64 THEN '45 - 64'
                    WHEN EXTRACT(YEAR FROM CURRENT_DATE) - age >= 65 THEN '> 64'
                    ELSE 'Unknown'
                END AS age_group,
                COUNT(*) AS total_count_per_age_group,
                ROUND((COUNT(*) * 100.0) / (SELECT total_data FROM total_data), 2) AS percentage
            FROM public.user_activities
            GROUP BY age_group
        )
        SELECT age_group, total_count_per_age_group, percentage
        FROM age_group_data agd
        ORDER BY total_count_per_age_group DESC;
    `
        let responseData = await pgQueryHandler(queryStr)
        return responseData
    }

    async getGenderPercentage() {
        let queryStr = `
        WITH total_data AS (
            SELECT COUNT(*) AS total_data
            FROM public.user_activities
        ),
        gender_group_data AS (
            SELECT gender,
                   COUNT(*) AS total_count_per_gender,
                   ROUND((COUNT(*) * 100.0) / (SELECT total_data FROM total_data), 2) AS percentage
                   FROM public.user_activities
            GROUP BY gender
        )
        SELECT gender, total_count_per_gender, percentage
        FROM gender_group_data ggd
        ORDER BY total_count_per_gender DESC;
    `
        let responseData = await pgQueryHandler(queryStr)
        return responseData
    }

    async getBrandPercentage() {
        let queryStr = `
        WITH total_data AS (
            SELECT COUNT(*) AS total_data
            FROM public.user_activities
        ),
        brand_group_data AS (
            SELECT
                brand_device,
                COUNT(*) AS total_count_per_brand,
                ROUND((COUNT(*) * 100.0) / (SELECT total_data FROM total_data), 2) AS percentage
            FROM public.user_activities
            GROUP BY brand_device
        )
        SELECT brand_device, total_count_per_brand, percentage
        FROM brand_group_data bgd
        ORDER BY total_count_per_brand DESC;
    `
        let responseData = await pgQueryHandler(queryStr)
        return responseData
    }

    async getDigitalInterestPercentage() {
        let queryStr = `
        WITH total_data AS (
            SELECT COUNT(*) AS total_data
            FROM public.user_activities
        ),
        digital_interest_group_data AS (
            SELECT
                digital_interest,
                COUNT(*) AS total_count_per_interest,
                ROUND((COUNT(*) * 100.0) / (SELECT total_data FROM total_data), 2) AS percentage
            FROM public.user_activities
            GROUP BY digital_interest
        )
        SELECT digital_interest, total_count_per_interest, percentage
        FROM digital_interest_group_data digd
        ORDER BY total_count_per_interest DESC;
    `
        let responseData = await pgQueryHandler(queryStr)
        return responseData
    }

    async getTopFiveUserPerLocation() {
        let queryStr = `
        WITH ranked_user_data AS (
            SELECT
              name_of_location,
              name,
              age,
              gender,
              email,
              phone_number,
              ROW_NUMBER() OVER (PARTITION BY name_of_location ORDER BY COUNT(*) DESC) AS rnk
            FROM public.user_activities
            GROUP BY name_of_location, name, age, gender, email, phone_number
          )
          SELECT
            name_of_location,
            name,
            age,
            gender,
            email,
            phone_number,
            rnk as rank
          FROM ranked_user_data
          WHERE rnk <= 5;
    `
        let responseData = await pgQueryHandler(queryStr)
        return responseData
    }

    async getUserDetail() {
        let queryStr = `
        SELECT
            DISTINCT email,
            name,
            age,
            gender,
            phone_number
            FROM user_activities ua
        GROUP BY email, name, age, gender, phone_number
    `
        let responseData = await pgQueryHandler(queryStr)
        return responseData
    }

    async countAllUser() {
        let queryStr = `
        SELECT
            COUNT(DISTINCT email)
            FROM user_activities ua
        `
        let responseData = await pgQueryHandler(queryStr)
        return responseData
    }

    async getDataForCountUserNewAndReturning() {
        let queryStr = `
        select name, TO_CHAR(date, 'Day DD Month YYYY') AS date, login_hour from user_activities ua
        order by "date", login_hour
        `
        let responseData = await pgQueryHandler(queryStr)
        return responseData
    }
}

export const userActivityRepo = new UserActivityRepo()