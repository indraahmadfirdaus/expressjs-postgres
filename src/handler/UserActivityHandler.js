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
        .json({ message: "user activites segmentation data", status: "success", data: data });
    } catch (error) {
      next(error);
    }
  }
 
}

export default UserActivityHandler;
