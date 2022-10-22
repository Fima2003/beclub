exports.convertResponse = (response, res) => {
    return res.status(response.code).json({"message": response.message});
}