const jwt = require('jsonwebtoken');
const config = require('../config/variables');
module.exports = {
  validateToken: (req, res, next) => {
    const authorizationHeaader = req.headers.authorization;
    let result;
    if (authorizationHeaader) {
        const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
      const options = {
        expiresIn: '3h'
      };
      try {
        // verify makes sure that the token hasn't expired and has been issued by us
        result = jwt.verify(token,config.jwtSecretKey, options);
        // We call next to pass execution to the subsequent middleware
          console.log(result);
        next();
      } catch (err) {
        // Throw an error just in case anything goes wrong with verification
          res.status(401).send({ code: 0, message: 'Something went wrong' });
      }
    } else {
      result = { 
        message: 'Authentication error. Token required.',
        code: 0
      };
      res.status(401).send(result);
    }
  }
};