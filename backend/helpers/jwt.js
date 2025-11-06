const jwt = require('jsonwebtoken');

const { TOKEN_KEY } = process.env;

module.exports = {
    // create token
    createToken: (data) => jwt.sign(data, TOKEN_KEY, { expiresIn: '8hr' }),
    // verify token as middleware
    verify: (req, res, next) => {
        const { token } = req.body;
        try {
            if (!token) {
                res.status(400).send({
                    status: 'fail',
                    code: 400,
                    message: 'No token!',
                });
                return;
            }
            // verify tokenn
            const result = jwt.verify(token, TOKEN_KEY);

            // add token data to req
            req.data = result;

            // next
            next();
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error,
            });
        }
    },
};
