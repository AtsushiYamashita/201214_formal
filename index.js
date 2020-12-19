function get(what){
  return entity => entity[what];
}

function msg (about, how,  time){
  return entity => entity
	.map(how(about, time));
}

function all () {
  return _ => true;
}

function nonl () {
  return e => !!e; 
}

function contain (tag) {
  return  entity => entity
	.tags
	.indexOf(tag) >= 0;
}

function up( who, about,  how, time, what){
  return entities => entities
	.filter(contain(who))
	.map(msg(about, how, time))
	.map(get(what));
}

function exe (args) {
  return f => f(args);
} 

function update(about, time){
  return entity => entity.update
	.filter(about)
	.map(exe({time}));
}

const wup = time =>  up('world',
	nonl(), update, time,
	'params');



const main = (time, entities){
  const wld =  Array().concat(
    ...wup(time)(entities)
  );
}

