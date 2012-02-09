var links = [
 /* {source: "me", target: "RJ", id: 0},
  {source: "me", target: "RJ", id: 1},
  {source: "RJ", target: "me", id: 2},
  {source: "me", target: "Kellie", id: 3},
  {source: "me", target: "Caroline", id: 4},
  {source: "me", target: "Tim", id: 5},
  {source: "me", target: "Metro", id: 6},
  {source: "me", target: "Drew", id: 7},
  {source: "me", target: "James", id: 8},
  {source: "me", target: "Brianna", id: 9},
  {source: "me", target: "Roger", id: 10},
  {source: "me", target: "Jeff", id: 11},
  {source: "me", target: "Ralphie", id: 12},
  {source: "me", target: "RoboCop", id: 13},
  {source: "RJ", target: "me", id: 14},
  {source: "RJ", target: "me", id: 15},
  {source: "RJ", target: "me", id: 16},
  {source: "RJ", target: "me", id: 17},
  {source: "RJ", target: "me", id: 18},
  {source: "RJ", target: "me", id: 19},
  {source: "RJ", target: "me", id: 20},
  {source: "RJ", target: "me", id: 21}*/
];

var nodes = {};
var force = undefined;
$.getJSON('json/dummy.json', function(data) {
  links = data;
  console.log("Set links to JSON data.");


// Compute the distinct nodes from the links.
links.forEach(function(link) {
  link.source = nodes[link.source] || (nodes[link.source] = {name: link.source, edges: []});
  link.target = nodes[link.target] || (nodes[link.target] = {name: link.target, edges: []});
  link.target.edges.push(link.id);
});

var w = window.innerWidth,
    h = window.innerHeight;

 force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([w, h])
    .linkDistance(function(d){return 300-(d.target.weight*5);})
    .linkStrength(0.001)
    .charge(-4000)
    .on("tick", tick)
    .theta(0.3)
    .friction(.9)
    .start();

force.nodes()[1]['fixed'] = true;
force.nodes()[1].x = w/2;
force.nodes()[1].y = h/2;
force.nodes()[1].px = w/2;
force.nodes()[1].py = h/2;

/*function fadeInCharge() {
  force.charge(force.charge()-10).start()
  if (force.charge() > -50) setTimeout(fadeInCharge, 1);
}
fadeInCharge();*/



var svg = d3.select("#container").append("svg:svg")
    .attr("width", w)
    .attr("height", h);

var path = svg.append("svg:g").selectAll("path")
    .data(force.links())
  .enter().append("svg:path")
    .attr("d", "M"+w/2+","+h/2+"A1000,1000 0 0,1 "+w/2+","+h/2)
    .attr("class", function(d) { return "link " + (d.source.name=="me"?"outgoing":"incoming"); });

var circle = svg.append("svg:g").selectAll("circle")
    .data(force.nodes())
  .enter().append("svg:circle")
    .attr("r", function(d) { return (d.name=="me"?50:30); })
    .attr("transform","translate("+w/2+","+h/2+")")
    .attr("fill", function(d) { return (d.name=="me"?"#EB6841":"#6A4A3C"); })
    .on("mouseover",function(d,i) {
      d3.select(this).transition().duration(300).attr("fill", "black");
    })
    .on("mouseout",function(d,i) {
      d3.select(this).transition().duration(300).attr("fill", "#6A4A3C");
    })
    .call(force.drag);

var text = svg.append("svg:g").selectAll("g")
    .data(force.nodes())
  .enter().append("svg:g");

text.append("svg:text")
    .attr("x", 0)
    .attr("y", ".31em")
    .attr("text-anchor", "middle")
    .attr("class", function(d) {return (d.name=="me"?"me":""); })
    .text(function(d) { return d.name; });

svg.style("opacity", 1e-6)
  .transition()
    .duration(3000)
    .style("opacity", 1);

// Use elliptical arcs path segments to n-encode edges.
function tick() {
  path.attr("d", function(d) {
    var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        //dr = Math.sqrt(dx * dx + dy * dy);
        idx = d.target.edges.indexOf(d.id)+1; 
        dr = 1000;
    return "M" + d.source.x + "," + d.source.y + "A" + dr/idx*5 + "," + dr/idx*5 + " 0 0,1 " + d.target.x + "," + d.target.y;
  });
  circle.attr("transform", function(d) {
    return "translate(" + d.x + "," + d.y + ")";
  });

  text.attr("transform", function(d) {
    return "translate(" + d.x + "," + d.y + ")";
  });
}
});