export const errorHandler = (error, req, res, next) => {
  console.log('MyError:', error);
  const { status = 500, message } = error;
  res.status(status).json({
    status,
    message,
  });
};
