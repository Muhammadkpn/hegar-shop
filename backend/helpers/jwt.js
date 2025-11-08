const jwt = require('jsonwebtoken');

const { TOKEN_KEY } = process.env;

module.exports = {
    // create token
    createToken: (data, expiresIn = '8hr') => jwt.sign(data, TOKEN_KEY, { expiresIn }),
    // verify token as middleware
    verify: (req, res, next) => {
        try {
            // Get token from Authorization header
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return res.status(401).send({
                    status: 'fail',
                    code: 401,
                    message: 'No authorization header provided',
                });
            }

            // Check if header starts with 'Bearer '
            if (!authHeader.startsWith('Bearer ')) {
                return res.status(401).send({
                    status: 'fail',
                    code: 401,
                    message: 'Invalid authorization format. Use: Bearer <token>',
                });
            }

            // Extract token from 'Bearer <token>'
            const token = authHeader.substring(7);

            if (!token) {
                return res.status(401).send({
                    status: 'fail',
                    code: 401,
                    message: 'No token provided',
                });
            }

            // Verify token
            const result = jwt.verify(token, TOKEN_KEY);

            // Add token data to req
            req.data = result;
            req.token = token;

            // next
            next();
        } catch (error) {
            console.log(error);

            if (error.name === 'TokenExpiredError') {
                return res.status(401).send({
                    status: 'fail',
                    code: 401,
                    message: 'Token has expired',
                });
            }

            if (error.name === 'JsonWebTokenError') {
                return res.status(401).send({
                    status: 'fail',
                    code: 401,
                    message: 'Invalid token',
                });
            }

            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
};
