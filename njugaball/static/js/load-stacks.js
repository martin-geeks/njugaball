

function Stack(name) {


this.name = name;
this.loaded = false;
this.requests = {
active: new Array()
}

Stack.stacks.push(this);

}


Stack.stacks = [];

Stack.new = function(name,l) {

l = {};
l.old = Stack.current();
l.stack = new Stack(name);
if(!l.old) { return l.stack }

/*
Moult.utilities.forEach(l.old.requests.active, function(request) {
request.abort();
});
*/


return l.stack;
};


Stack.init = function(name,l) {
l = Stack.current();
return l && l.name === name ? l : Stack.new(name);
}


Stack.current = Stack.prototype.current = function() {
return Stack.stacks[Stack.stacks.length-1];
};