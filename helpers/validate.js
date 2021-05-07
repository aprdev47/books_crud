const Validator = require('validatorjs');
const rules = {
    "author": "required|string",
    "title": "required|string",
    "isbn": "required|min:13",
    "release_date": "string"
}
const validator = (body, callback) => {
    const validation = new Validator(body, rules, {});
    validation.passes(() => callback(null, true));
    validation.fails(() => callback(validation.errors, false));
};

module.exports = validator;
