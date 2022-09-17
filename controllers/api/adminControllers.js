const db = require('../../db_setup');
const { convertResponse } = require('../../external_functions');
const responses = require('../../responses');

exports.unVerifiedClubs = async function(req, res){
    try{
        let results = await db.collection("unVerifiedClubs").find().toArray();
        convertResponse({code: 200, message: results}, res);
    } catch(e) {
        convertResponse(responses.custom_error(e), res);
    }
}