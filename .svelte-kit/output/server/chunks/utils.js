var is_array = Array.isArray;
var index_of = Array.prototype.indexOf;
var array_from = Array.from;
var define_property = Object.defineProperty;
var get_descriptor = Object.getOwnPropertyDescriptor;
const noop = () => {
};
function is_promise(value) {
  return typeof value?.then === "function";
}
function run_all(arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i]();
  }
}
export {
  index_of as a,
  is_array as b,
  array_from as c,
  define_property as d,
  get_descriptor as g,
  is_promise as i,
  noop as n,
  run_all as r
};
