const errorHandler = (err, req, res, next) => {
    if (err.name === 'ValidationError') {
      err.status = 400;
    }
    console.error(err);
    return res
      .status(err.status || 500)
      .json({ data: err?.data || null, message: err.message || 'Internal Server Error' });
  };
  
export default errorHandler;
  