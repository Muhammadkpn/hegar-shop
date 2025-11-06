const database = require('../../database');
const { asyncQuery, generateQuery, today } = require('../../helpers/queryHelper');

module.exports = {
    getEmailSubscribe: async (req, res) => {
        try {
            const query = 'SELECT * FROM email_subscribe';
            const result = await asyncQuery(query);

            res.status(200).send({
                status: 'success',
                data: result,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    addEmailSubscribe: async (req, res) => {
        const { email, notes } = req.body;

        try {
            // check email
            const checkEmail = `SELECT * FROM email_subscribe WHERE email = ${database.escape(email)}`;
            const getCheckEmail = await asyncQuery(checkEmail);

            if (getCheckEmail.length === 0) {
                // add data in our database
                const query = `INSERT INTO email_subscribe (email, subscribe_date, notes) VALUES (${database.escape(email)}, ${database.escape(today)}, ${notes !== undefined ? notes : null})`;

                await asyncQuery(query);
            }
            res.status(200).send({
                status: 'success',
                message: 'Your email has been subscribed to our website',
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    editEmailSubscribe: async (req, res) => {
        const { id } = req.params;

        try {
            // check data in our database
            const check = `SELECT * FROM email_subscribe WHERE id = ${database.escape(id)}`;
            const resultCheck = await asyncQuery(check);

            if (resultCheck.length === 0) {
                res.status(422).send({
                    status: 'fail',
                    code: 422,
                    message: 'Email doesn\'t exists in our database',
                });
                return;
            }

            // edit data in our database
            const query = `UPDATE email_subscribe SET ${generateQuery(req.body)} WHERE id = ${id}`;
            await asyncQuery(query);

            res.status(200).send({
                status: 'success',
                message: 'Your data has been updated',
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    deleteEmailSubscribe: async (req, res) => {
        const { id } = req.params;

        try {
            // check data in our database
            const check = `SELECT * FROM email_subscribe WHERE id = ${database.escape(id)}`;
            const resultCheck = await asyncQuery(check);

            if (resultCheck.length === 0) {
                res.status(422).send({
                    status: 'fail',
                    code: 422,
                    message: 'Email doesn\'t exists in our database',
                });
                return;
            }

            // delete data in our database
            const query = `DELETE FROM email_subscribe WHERE id = ${database.escape(id)}`;
            await asyncQuery(query);

            res.status(200).send({
                status: 'success',
                message: 'Your email has been deleted',
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
};
