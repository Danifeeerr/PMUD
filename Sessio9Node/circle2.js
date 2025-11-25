module.exports = function circle(r) {
let _r = r;
return {
perimeter: function() {
return 2 * Math.PI * _r;
},
area: function() {
return Math.PI * _r * _r;
}
};
};