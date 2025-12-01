import ratelimit from "../config/upStash.js";

const ratelimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("my-rate-limit");

    if (!success) {
      return res.status(429).json({
        message: "Too many requests , Please Try again later",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default ratelimiter;
