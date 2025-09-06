function info(msg:string) {
  console.log(`[INFO] ${msg}`);
}
function error(msg:string, err:any) {
  console.error(`[ERROR] ${msg}`, err);
}
export { info, error };
