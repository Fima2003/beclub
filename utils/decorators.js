let allApis = { get: {}, post: {}, update: {}, delete: {} };
function _get({ path, request_type, response_type }, fn) {
  allApis.get[path] = { req: request_type, res: response_type };
  fn();
}
function _post({ path, request_type, response_type }, fn) {
  allApis.post[path] = { req: request_type, res: response_type };
  fn();
}
function _update({ path, request_type, response_type }, fn) {
  allApis.update[path] = { req: request_type, res: response_type };
  fn();
}
function _delete({ path, request_type, response_type }, fn) {
  allApis.delete[path] = { req: request_type, res: response_type };
  fn();
}

module.exports = { _get, _post, _update, _delete, allApis };
