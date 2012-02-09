var links = [
  {source: "me", target: "RJ", id: 0},
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
  {source: "RJ", target: "me", id: 21}

];

var nodes = {};

// Compute the distinct nodes from the links.
links.forEach(function(link) {
  link.source = nodes[link.source] || (nodes[link.source] = {name: link.source, edges: []});
  //link.source.edges.push(link.id);
  link.target = nodes[link.target] || (nodes[link.target] = {name: link.target, edges: []});
  link.target.edges.push(link.id);
});

var w = window.innerWidth,
    h = window.innerHeight;

var force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([w, h])
    .linkDistance(200)
    .charge(-1200)
    .on("tick", tick)
    .start();

var svg = d3.select("#container").append("svg:svg")
    .attr("width", w)
    .attr("height", h);

// Per-type markers, as they don't inherit styles.
svg.append("svg:defs").selectAll("marker")
    .data(["suit", "licensing", "resolved"])
  .enter().append("svg:marker")
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

var path = svg.append("svg:g").selectAll("path")
    .data(force.links())
  .enter().append("svg:path")
    .attr("class", function(d) { return "link " + (d.source.name=="me"?"outgoing":"incoming"); })
    .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

var circle = svg.append("svg:g").selectAll("circle")
    .data(force.nodes())
  .enter().append("svg:circle")
    .attr("r", function(d) { return (d.name=="me"?50:30); })
    .attr("fill", function(d) { return (d.name=="me"?"#EB6841":"#6A4A3C"); })
    .call(force.drag);

var text = svg.append("svg:g").selectAll("g")
    .data(force.nodes())
  .enter().append("svg:g");

// A copy of the text with a thick white stroke for legibility.
text.append("svg:text")
    .attr("x", 0)
    .attr("y", ".31em")
    .attr("class", "shadow")
    .attr("text-anchor", "middle")
    .attr("font-size", function(d) { return (d.name=="me"?42:15); })
    .text(function(d) { return d.name; });

text.append("svg:text")
    .attr("x", 0)
    .attr("y", ".31em")
    .attr("text-anchor", "middle")
    .attr("font-size", function(d) { return (d.name=="me"?42:15); })
    .text(function(d) { return d.name; });

// Use elliptical arcs path segments to n-encode edges.
function tick() {
  path.attr("d", function(d) {
    var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        //dr = Math.sqrt(dx * dx + dy * dy);
        idx = d.target.edges.indexOf(d.id)+1; 
        dr = 1000;
    return "M" + d.source.x + "," + d.source.y + "A" + dr/idx*2 + "," + dr/idx*2 + " 0 0,1 " + d.target.x + "," + d.target.y;
  });

  circle.attr("transform", function(d) {
    return "translate(" + d.x + "," + d.y + ")";
  });

  text.attr("transform", function(d) {
    return "translate(" + d.x + "," + d.y + ")";
  });
}