

exports.default= (function(){
console.log('vec loaded');

return {
  dot,
  veach
};
})()

function add (a,b){
return a+b;
}

function multi(a, b){
  return a*b
}

function veach(f, a, b, n){
return f(a[n],b[n]); 
}

function counter(n){
  return Array(n).fill(null).map((_,i)=>i);
}

function dot (a,b){
const ec = i => veach(multi, a, b, i)
return  counter(a.length)
	.map(ec)
	.reduce(add,0);
}

const dt = {
  a:[1, 0],
//  b:[Math.cos(0), Math.sin(0)],
  b:[Math.cos(3.14 *0.25), Math.sin(3.14 *0.25)],
}

console.log(
dt,
	"\n",
//dot(dt.a, dt.b)
Math.round(dot(dt.a, dt.b)* 1000 ) / 1000,
	"\n",
delta(v=>-0.1 *v,0),
"\n",
);



function delta(fx, x, h =0.1){
return (fx(x+h)-fx(x))/h;
}

