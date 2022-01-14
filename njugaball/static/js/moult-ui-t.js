


var log = console.log;


function Moult() {

}

Moult.prototype.CONSTANTS = {

entries: ["is", "id", "nodes", "class", "meets", "operand", "props", "attributes"],

};

Moult.prototype.utilities = {

forEach: function(l,c,x) {
for(x = x !== undefined ? x : 0 ; x < l.length; x++) {
c(l[x],x,l);
}},

entries: function(obj,loop,array) {
array = [];
Moult.utilities.forEach(Object.keys(obj), function(key, i) {
if(typeof loop === "function") { loop([key,obj[key]],i); }
array.push([key,obj[key]]);
});
return array;
},

assign: function(to,from) {
Moult.utilities.forEach(Object.keys(from), function(entry) { to[entry] = from[entry]; });
return to;
},

clone: function(obj) {
return typeof obj === "object" ? JSON.parse(JSON.stringify(obj)) : obj;
},

clearNodes: function(parent) {
parent.innerHTML = "";
},

removeNode: function(parent, node, c) {
// alert(parent.id);
// if(parent && node && parent === node.parentElement) {
parent.removeChild(node);
// }
},

replaceNode: function(parent, node, withThis) {
node && node.parentElement === parent ? node.parentNode.replaceChild(withThis, node) : parent.appendChild(withThis);
}

};

// alert(Moult.prototype.utilities);

Moult.prototype.component = function(defs) {
return new MoultComponent(defs);
}

Moult.prototype.build = function(defs,ele) {


// ele = undefined;

if(defs.meets !== undefined && !defs.meets) {
return document.createElement("div");
}

if(defs.is === "text") {
ele = document.createElement("span");
ele.innerHTML = defs.text;
return ele;
} else {
if(defs.is === "img") {
ele = document.createElement(defs.label ? "label": "div");
ele.style.background = (defs.shade ? "linear-gradient("+defs.shade+"), " : "")+"url("+defs.src+") center";
ele.style.backgroundSize = "cover";
} else {
ele = document.createElement(defs.is);
}

if(defs.id) { ele.setAttribute("id",defs.id); }

if(defs.class) { ele.setAttribute("class", defs.class); }

if(defs.props) {
Moult.utilities.forEach(Moult.utilities.entries(defs.props), function(prop,i) {
ele.setAttribute(prop[0],prop[1]);
});
}

if(defs.attributes) {
Moult.utilities.forEach(Moult.utilities.entries(defs.attributes), function(attribute) {
ele[attribute[0]] = attribute[1];
});
}

if(defs.src) { ele.src = defs.src; }

if(defs.events) {
Moult.utilities.entries(defs.events, function(event) {
ele["on"+event[0]] = function() {};
if(typeof event[1] === "array" || typeof event[1] === "object") {
Moult.utilities.forEach(event[1], function(listener) {
if(typeof listener === "function") {
ele.addEventListener(event[0], listener);
}});} else {
ele.addEventListener(event[0],event[1]);
}});
}

if(defs.nodes) {
Moult.utilities.forEach(defs.nodes, function(node) {
ele.appendChild(Moult.build(node));
});}

return ele;

}}



Moult.prototype.render = function(component, root, l) {

l = {};

root = component.container = root ? root : component.container;

if(!root) {
return new Error("Container/root is not specified");
}



if(component.meets !== undefined && component.old && component.old.meets !== undefined && Boolean(component.meets) !== Boolean(component.old.meets)) {
return Moult.utilities.replaceNode(root, root.childNodes[component.index], Moult.build(component));
} else if(component.meets === false && component.old.meets === false) { return; }

if(component.old) {

if(component.is !== component.old.is || ((component.is === "img" || component.is === "video") && component.src !== component.old.src)) {
return Moult.utilities.replaceNode(root, root.childNodes[component.index], Moult.build(component));
}

if(component.is === "text") {
return component.text !== component.old.text ? Moult.utilities.replaceNode(root, root.childNodes[component.index], Moult.build(component)) : "";
}

if(component.nodes && component.nodes !== component.old.nodes) {

l.oldNodes = component.old.nodes ? component.old.nodes.slice() : [];

Moult.utilities.forEach(component.nodes,function(node,i) {
Moult.render(node, root.childNodes[component.index]);
l.oldNodes.shift();
});
Moult.utilities.forEach(l.oldNodes.reverse(), function(node, i) {
// console.log(node.index);
Moult.utilities.removeNode(root.childNodes[component.index], root.childNodes[component.index].childNodes[node.index], node);
});
}
if(component.events) {
Moult.utilities.entries(component.events, function (event,i,a,oldEvent) {
oldEvent = component.old.events && component.old.events[event[0]] ? component.old.events[event[0]] : null;
if(oldEvent.length) {
Moult.utilities.forEach(oldEvent, function(listener) {
if(typeof listener === "function") {
root.childNodes[component.index].removeEventListener(event[0],listener);
}
});} else {
root.childNodes[component.index].removeEventListener(event[0], oldEvent);
}
if(event[1].length) {
Moult.utilities.forEach(event[1], function(listener) {
if(typeof listener === "function") {
root.childNodes[component.index].addEventListener(event[0],listener);
}
});
} else {
root.childNodes[component.index].addEventListener(event[0], event[1]);
}
});
}

if(component.class && component.class !== component.old.class) {
root.childNodes[component.index].setAttribute("class", component.class);
}

if(component.id && component.id !== component.old.id) {
root.childNodes[component.index].setAttribute("id", component.id);
}

if(component.props) {
Moult.utilities.entries(component.props, function(prop,i) {
if(component.old.props && prop[1] !== component.old.props[prop[0]]) {
root.childNodes[component.index].setAttribute(prop[0], prop[1]);
}
});
;}

if(component.attributes) {
Moult.utilities.entries(component.attributes, function(attribute,i) {
if(component.old.attributes !== undefined && attribute[1] !== component.old.attributes[attribute[0]]) {
root.childNodes[component.index][attribute[0]] = attribute[1];
}})
}

if(component.style) {
Moult.utilities.forEach(Moult.utilities.entries(component.style), function(style,i) {
root.childNodes[component.index].style[style[0]] = style[1];
});
}

} else {
Moult.utilities.replaceNode(root, root.childNodes[component.index], Moult.build(component));
}
}


Moult.CONSTANTS = Moult.prototype.CONSTANTS;
Moult.utilities = Moult.prototype.utilities;
Moult.component = Moult.prototype.component;
Moult.render = Moult.prototype.render;
Moult.build = Moult.prototype.build;


function MoultComponent(defs, x, that, l) {

l = {};

that = this;
this.root = defs.root ? defs.root : function() { return that; };

this.catalyze = function(value,component,string,matches)  {
if(value === "@") {
if(component) { that.recordStateUser("@", component) };
return this.state("@");
}
if(typeof value !== "string") { return value; }
string = ""+value;
matches = string.match(/@([.a-zA-Z_0-9-]+)?/g);
if(matches) {
Moult.utilities.forEach(matches, function(match,i,a,v,m) {
m = match;
match = match.split("@")[1].split(".");
that.recordStateUser(match[0], component);
Moult.utilities.forEach(match, function(a) {
v = v === undefined ? that.state(a): v[a];
});
if(typeof v === "string" || typeof v === "number" || typeof v === "undefined") {
string = string.replace(new RegExp(m),v);
} else {
string = v;
}
});
}
return string;
}

this.statesTrack = {};
this.history = [];
this.nodes = [];
this.blueprint = Moult.utilities.clone(defs);

this.states = defs.state ? undefined : defs.states;
this.state = defs.state ? defs.state : function(state) {
return state === "@" ? that.states : that.states[state];
}
this.recordStateUser = defs.recordStateUser ? defs.recordStateUser: function(state,info,track) {
return;
if(!info) { console.log(state); }
track = { component: function() { return info.component; }, name: info.name };
that.statesTrack[state] = that.statesTrack[state] || [];
that.statesTrack[state].push(track);

}

if(this.states) {
Moult.utilities.entries(this.states, function(state) {
that.statesTrack[state[0]] = [];
});
}

if(defs.meets !== undefined) {
this.meets = this.catalyze(defs.meets, { component: this, name: "meets" });

}

this.is = this.catalyze(defs.is, { component: this, name: "is" });



if(defs.label) {
this.label = defs.label;
}

this.index = defs.index !== undefined ? defs.index : 0;
this.componentId = defs.componentId ? defs.componentId :  this.index.toString();

if(defs.id) {
this.id = this.catalyze(defs.id, { component: this, name: "id" });
}

if(this.is === "text"){
this.text = this.catalyze(defs.text, { component: this, name: "text" });
}

if(defs.class) {
this.class = this.catalyze(defs.class.join ? defs.class.join(" ") : defs.class, { component: this, name: "class" });
}

if(defs.props) {
this.props = {};
Moult.utilities.entries(defs.props, function(prop) {
that.props[prop[0]] = that.catalyze(prop[1], { component: this, name: "props" });
});
}

if(defs.style) {
this.style = {};
Moult.utilities.entries(defs.style, function(style) {
that.style[that.catalyze(style[0])] = that.catalyze(style[1], { component: this, name: "style" });
});
}

if(defs.attributes) {
this.attributes = {};
Moult.utilities.entries(defs.attributes, function(attribute)  {
that.attributes[that.catalyze(attribute[0])] = that.catalyze(attribute[1], { component: this, name: "attributes" });
});
}

if(defs.src) {
this.src = this.catalyze(defs.src, { component: this, name: "src" });
this.shade = this.catalyze(defs.shade, { component: this, name: "shade" });
}

if(defs.events) {
this.events = {};
Moult.utilities.entries(defs.events, function(event,i) {
if(event[1].length) {
that.events[event[0]] = [];
Moult.utilities.forEach(event[1], function(listener,i) {
that.events[event[0]].push(that.catalyze(listener, { component: this, name: "events" }));
});
} else {
that.events[event[0]] = that.catalyze(event[1], { component: this, name: "events" });
}});}

if(defs.loop) {
this.loop = this.catalyze(defs.loop, { component: this, name: "loop" });
if(this.loop.length) {
this.limit = defs.limit !== undefined ? this.catalyze(defs.limit, { component: this, name: "limit" }) : null;
this.nodes = [];
l.states = that.catalyze("@") ? that.catalyze("@", { component: that, name: "loop-states" }) : {};
if(this.loop !== undefined && this.loop.length && defs.nodes && defs.nodes.length) {
for(l.x = 0; l.x < this.loop.length && (this.limit === null || l.x < this.limit); l.x++) {
Moult.utilities.forEach(defs.nodes, function(node,i) {
that.nodes.push(Moult.component(Moult.utilities.assign(typeof node === "string" ? { is: "text", text: node } : node, { states: Moult.utilities.assign(Moult.utilities.assign({},l.states), that.loop[l.x]), index: defs.nodes.length*l.x+i, componentId: that.componentId + (defs.nodes*l.x+i).toString() })));
})
}}}} else if(defs.nodes && defs.nodes.length) {
this.nodes = [];
Moult.utilities.forEach(defs.nodes, function(node,i) {
that.nodes.push(Moult.component(Moult.utilities.assign(typeof node === "string" ? { is: "text", text: node } : node, { state: that.state, recordStateUser: that.recordStateUser, index: i })));
});
}


this.reset = function(defs) {

this.old = Moult.utilities.assign({}, this);


}


this.updateStates = function(states, l) {

/* 
l = {};
l.old = this.old;
delete this.old;
this.old = Moult.utilities.assign({}, this);

this.states = this.states ? Moult.utilities.assign(this.states, states) : states;
this.statesChanged = true;

states["@"] = null;
Moult.utilities.entries(states, function(state) {
Moult.utilities.forEach(that.statesTrack[state[0]], function(user, l) {
l = {};
l.component = user.component();
delete l.old;
l.component.old = Moult.utilities.assign({}, l.component);
if(user.name === "loop") {

} else if(user.name === "loop-states") {

} else if (true){

}
});
});
 */
}

this.restate = this.updateStates;

this.update = function(defs, render, blueprint, nodes, nodes1, loop, limit, blueprintNodes, props, blueprintProps, attributes, styles, x, state, events, l, that) {
l = {};
delete this.old;
this.old = Moult.utilities.assign({}, this);
that = this;
this.state = defs.state ? defs.state : function(state) {
return state === "@" ? that.states : that.states[state];
}

this.states = typeof this.states === "object" ? Moult.utilities.assign(Moult.utilities.assign({}, this.states), defs.states ? defs.states : {}) : defs.states;
this.statesChanged = defs.statesChanged || Boolean(defs.states) || false;

l.blueprint = Moult.utilities.assign(Moult.utilities.clone(this.blueprint), defs);

this.index = defs.index !== undefined ? defs.index : this.index;

this.state = defs.state ? defs.state : this.state;
this.index = defs.index !== undefined ? defs.index : this.index;
if(defs.is) {
this.is = this.catalyze(defs.is, { component: this, name: "is" });
}
if(defs.text) {
this.text = this.catalyze(defs.text, { component: this, name: "text" });
}
if(defs.src ||(this.statesChanged && this.blueprint.src !== undefined)) {
this.src = this.catalyze(defs.src || this.blueprint.src, { component: this, name: "src" });
}
if(defs.id || (this.statesChanged && this.blueprint.id !== undefined)) {
this.id = this.catalyze(defs.id || this.blueprint.id, { component: this, name: "id" });
}
if(defs.class || (this.statesChanged && this.blueprint.class !== undefined)) {
this.class = this.catalyze(defs.class || this.blueprint.class, { component: this, name: "class" });
}
if(defs.meets !== undefined || (this.blueprint.meets !== undefined && this.statesChanged)) {
this.meets = this.catalyze(defs.meets, { component: this, name: "meets" });
}

if(defs.style || (this.blueprint.style && this.statesChanged)) {
this.styles = this.styles || {};
this.style = Moult.utilities.clone(defs.style || this.blueprint.style);
this.blueprint.style = Moult.utilities.clone(defs.style || this.blueprint.style);
Moult.utilities.entries(this.style, function(style) {
that.styles[style[0]] = that.catalyze(style[1], { component: that, name: "style" });
});
}

if((this.statesChanged && this.blueprint.attributes) || defs.attributes) {
this.attributes = Moult.utilities.clone(defs.attributes || this.blueprint.attributes || {});
this.blueprint.attributes = Moult.utilities.clone(defs.attributes || this.blueprint.attributes);
Moult.utilities.entries(this.attributes, function(attribute) {
that.attributes[attribute[0]] = that.catalyze(attribute[1], { component: that, name: "attributes" });
});
}

if((this.statesChanged && this.blueprint.props) || defs.props) {
this.props = Moult.utilities.clone(defs.props || this.blueprint.props || {});
this.blueprint.props = Moult.utilities.clone(defs.props || this.blueprint.props);
Moult.utilities.entries(this.props, function(prop,i) {
that.props[prop[0]] = that.catalyze(prop[1], { component: that, name: "props" });
});}

if((this.statesChanged && this.blueprint.events) || defs.events) {
this.events = Moult.utilities.clone(defs.events || this.blueprint.events || {});
Moult.utilities.entries(this.events, function(event,i) {
if(event[1].length) {
that.events[event[0]] = [];
Moult.utilities.forEach(event[1], function(listener) {
that.events[event[0]].push(that.catalyze(listener, { component: that, name: "events" }));
});} else {
that.events[event[0]] = that.catalyze(event[1], { component: that, name: "props" });
}});}


if(this.id === "thu") {
// alert(render)
}


if(defs.loop !== undefined || (this.statesChanged && this.blueprint.loop) || (this.blueprint.loop && (defs.nodes))) {

this.loop = this.catalyze(defs.loop || this.blueprint.loop, { component: this, name: "loop" });
this.limit = defs.limit !== undefined ?  this.catalyze(defs.limit) : this.blueprint.limit !== undefined ? this.catalyze(this.blueprint.limit) : null;
l.nodes = (defs.nodes || this.blueprint.nodes || []);
l.nodes = l.nodes.length ? l.nodes.slice() : [];
l.Nodes = [];
this.blueprint.nodes = defs.nodes || this.blueprint.nodes;
for(l.x = 0; this.loop !== undefined && this.loop.length !== undefined && l.x < this.loop.length && (this.limit === null ? true : x < this.limit) && l.nodes.length; l.x++) {
Moult.utilities.forEach(l.nodes, function(node,i) {
node = Moult.utilities.clone(typeof node === "string" ? { is: "text", text: node } : node);
Moult.utilities.assign(node, { index: l.nodes.length*l.x+i, states: that.catalyze("@", { component: that, name: "states" }) ? Moult.utilities.assign(Moult.utilities.assign({},that.catalyze("@", { component: that, name: "states" })),that.loop[l.x]) : that.loop[l.x], state: undefined });
l.Nodes.push(that.nodes && that.nodes[l.nodes.length*l.x+i] ? that.nodes[l.nodes.length*l.x+i].update(node,true) : Moult.component(node));
});}
this.nodes = l.Nodes;
/*
if(this.id ===  "thu") {
console.log(that.nodes.length +" "+that.old.nodes.length);
} */
} else if(defs.nodes || (this.statesChanged && this.blueprint.nodes)) {
l.nodes = defs.nodes || this.blueprint.nodes || [];
l.nodes = l.nodes.slice();
l.Nodes = [];
Moult.utilities.forEach(l.nodes, function(node,i) {
node = typeof node === "string" ? { is: "text", text: node } : node;
Moult.utilities.assign(node, { index: i, statesChanged: that.statesChanged, state: that.state });
l.Nodes.push(that.nodes && that.nodes[i] ? that.nodes[i].update(node,true) : Moult.component(node))
});
this.nodes = l.Nodes;
}

this.blueprint = l.blueprint;

if(!render) { Moult.render(this) };
return this;
}
}