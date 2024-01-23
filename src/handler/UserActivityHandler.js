import { userActivityService } from "../service/UserActivityService.js";

class UserActivityHandler {

  static async getSummary(req, res, next) {
    try {
        const data = await userActivityService.getSummary()
      return res
        .status(200)
        .json({ message: "user activities summary data", status: "success", data: data });
    } catch (error) {
      next(error);
    }
  }

  static async getSegmentation(req, res, next) {
    try {
        const data = await userActivityService.getSegmentation()
      return res
        .status(200)
        .json({ message: "user activities segmentation data", status: "success", data: data });
    } catch (error) {
      next(error);
    }
  }

  static async topFivePerLocation(req, res, next) {
    try {
        const data = await userActivityService.topFivePerLocation()
      return res
        .status(200)
        .json({ message: "top five user by location data", status: "success", data: data });
    } catch (error) {
      next(error);
    }
  }
 
  static async userDetails(req, res, next) {
    try {
        const data = await userActivityService.userDetails()
      return res
        .status(200)
        .json({ message: "users detail data", status: "success", data: data });
    } catch (error) {
      next(error);
    }
  }
}

export default UserActivityHandler;
