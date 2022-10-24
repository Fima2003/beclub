let apis = {};

function addApi(model, route, description, requestData, responseData) {
  console.log(model);
  if (!apis[model]) {
    apis[model] = {};
  }
  apis[model][route] = { description, requestData, responseData };
}

function getApi(req, res) {
  return res.status(200).json(apis);
}

module.exports = {
  addApi,
  getApi,
};
