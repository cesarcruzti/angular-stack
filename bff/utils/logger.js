function info(msg) {
  console.log(`[INFO] ${msg}`);
}
function error(msg, err) {
  console.error(`[ERROR] ${msg}`, err);
}
module.exports = { info, error };
