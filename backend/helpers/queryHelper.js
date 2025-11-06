const util = require('util');
const database = require('../database');

const tzoffset = (new Date()).getTimezoneOffset() * 60000; // offset in milliseconds
const today = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');

module.exports = {
    // query for asynchronous
    asyncQuery: util.promisify(database.query).bind(database),
    // query for edit
    generateQuery: (body) => {
        /* eslint guard-for-in: "error" */
        let setQuery = '';
        for (let i = 0; i < Object.keys(body).length; i += 1) {
            setQuery += `\`${Object.keys(body)[i]}\` = '${Object.values(body)[i]}',`;
        }
        return setQuery.slice(0, -1);
    },
    today,
};
