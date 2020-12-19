
function per(data, weight, bius) {
//  console.log('# > w', weight, 'b', bius);
  const ret = data
	.map((d,i) => d * weight[i])
	.reduce((p,c)=>p+c, bius);
  const r = ret &&  (ret / Math.abs(ret) ); 
  //const r = Math.tanh(ret);
//  console.log('ret <<',ret,'data', data ,'r' , r );
  return  r;
}

function bp (n, data, func,  fix){
  const trial = (d, f) => [per(d[0], f[0], f[1]), d[1]];
  const diff = ([y, t], f) => [(t-y), f[0], f[1] ];
  const feedback = ([de, wt, b],d) => [wt.map((w, p) =>(d[p] *de *fix) +w), b+de*fix ] ;
  const pool = func;
  // console.log('data',data);
  for (let i = 0; i < data.length; i++) {
    let f = pool.pop();
    let d = data[i];
    let tr =  trial(d, f);
    // console.log('@@ >>',n, '-', i);
//    console.log('@ => d', d,'f',f);
    // console.log('@@ [[i0,i1],o] => [y,t]', d,'=>',tr );
    let dv = diff(tr, f);
    // console.log('@@ => [de,[w0,w1],b]', dv);
    // console.log("[d,i1]",[d[0], d[0][0]], "de",dv[0], );
    let fb = feedback(dv, d[0]);
    // console.log('@@ => [[w0,w1],b]', fb);
    pool.push(fb);
  }
  // console.log('@ p', pool);
  return [data, pool];
}

const cross = [
  [[0, 0,0], 0 ], 
  [[0, 1,0], 0 ],
  [[1, 0,0], 0 ],
  [[1, 1,0], 1 ],
  [[1, 0,0], 0]
];

const func = [
  [[0, 1, 0], 1]
];

const pool = [func]

function dot(v0, v1){
  const [a, c] = v0.map(e=> e||0), [b, d] = v1.map(e=> e||0);
  // console.log('# >>', a, b, c, d);
  return  a * b + c * d; 
}

function multi(v0, t){
  return v0.map(e=>e*(t||0));
}

function iteach(n,v0,v1,imp){
  const a = v0[n], b = v1[n];
// console.log('--- v,a,b',[v0,v1],a,b)
  // return Math.round(imp(a,b)<<12)>>12;
  return imp(a,b);
}

function add (v0,v1){
  const len = Math.max(...[v0,v1].map(e=>e.length));
  //return lp(0, v=> v<len, v=>v+1, [],
  //	  (c,s)=>iteach(c, v0,v1,(a,b)=>s.concat(a+b)))
  //return Array(Math.max(v0.length, v1.length))
//	.fill(0)
//	.map((_,i)=>(v0[i]||0)+(v1[i]||0) || 0);
  const ret = [];
  for (let k = 0; k< len; k++){
  const a = v0[k], b = v1[k];
    // const n = Math.round((a+b)*100)*100
    ret.push(a+b);
  }
  return ret
}

function app(i, n, act){
  const [w,b] = n;
//  console.log('### w,b,n', w,b,n);
  //console.log('dot i w', )
	return (act(dot(i, w) + b));
}

function diff (t, y){
//  return t-y;
	return Math.round((t-y));
}

function feedback(id, n, diff, force){
  const [w, b] = n;
  const de = diff*force;
//  console.log("de",de, 'id',id, 'w',w);
  const fix = multi(id, de);
  const bde = Math.round((b+de));
 // console.log("df",diff,"fc",force,"de",de,'fix',fix,'w',w,"add",add(fix,w));
//  console.log("de",de, 'id',id, 'w',w);
//  console.log("de",de, 'id',id, 'fix',fix,'w',w,"add",add(fix,w));
  return [add(w,fix), bde]
}

function inloop (input, nuron, force, activator){
  const [i, t] = input;
  const y = app(i, nuron, activator) || 0;
 // console.log('i',i,"y",y, 't',t, 'nu', nuron, 'f', force);
  const back = feedback(i, nuron, diff(t,y), force);
  return back;
}

function lp (c, sw, next, tail, imp){
//  console.log(c, tail);
  return sw(c) && imp(c, lp(next(c), sw, next, tail, imp)) || tail;   
}

function randint (s,n){
  return s+ Math.floor(Math.random() * Math.floor(n));

}

function replace(arr,a,b){
  const ar= arr.concat();
  const t = ar[a];
  ar[a] =ar [b];
  ar[b] = t;
  return ar;

}

function shufl (arr){
  const ret = arr.concat();
  return lp(ret.length, v=>v, v=>v-1, ret, (c,s)=> replace(s, randint(0,c), c-1))
}

console.log(cross)
const c2 = cross.concat(shufl(cross));
const tm = 150;
const sf = 0.8; //0.5;

const sigf = v=>(v/Math.abs(v)+1)/2;
// const sigf = Math.tanh;

const in_imp = (c,s) => inloop(c2[c-1], s, sf, sigf);  
const in_loop = (fn) => lp(c2.length , v=>v>0, v=>v-1, fn, in_imp)
const out_imp = (c,s) => {
	s.log('ol ' + c 
		// + " " + Array(c).fill('#').join("")
		);
	const ret = in_loop(s.fn);
	 s.log(ret, '\n');
	return {log:s.log, fn:ret};
}

const out_loop = (time, log, fn) => lp(time, v=>v, v=>v-1, {log, fn}, out_imp);
const rf = out_loop(tm, console.log, func[0]).fn;


console.log('');

// console.log(cross.map(e=>[...e]));
console.log(cross
	.map(([d,t])=>[d,t, dot(d,rf[0])+rf[1]]));


/*

for(let n = 0; n< 30; n++){
  const t = pool.pop();
  //console.log(n +  '>>' , t[0],t[1])
  const func = bp(n, cross, t[1], 0.5)[1][0];
  console.log('[[w0, w1], b] >>', func);
  const c = cross.map(e=> [dot(e[0], func[0]) + func[1],"t="+  e[1]]);
  console.log(c);
  pool.push(bp(n, cross,t[1], 0.5));
}
*/

