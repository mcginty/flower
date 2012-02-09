var links = [
  {source: "me", target: "RJ", type: "licensing"},
  {source: "me", target: "RJ", type: "resolved"},
  {source: "RJ", target: "me", type: "licensing"},
  {source: "me", target: "Kellie", type: "licensing"},
  {source: "me", target: "Caroline", type: "suit"},
  {source: "me", target: "Tim", type: "suit"},
  {source: "me", target: "Metro", type: "resolved"},
  {source: "me", target: "Drew", type: "suit"},
  {source: "me", target: "James", type: "suit"},
  {source: "me", target: "Brianna", type: "suit"},
  {source: "me", target: "Roger", type: "suit"},
  {source: "me", target: "Jeff", type: "suit"},
  {source: "me", target: "Ralphie", type: "suit"},
  {source: "me", target: "RoboCop", type: "suit"}
];

var nodes = {};

// Compute the distinct nodes from the links.
links.forEach(function(link) {
  link.source = nodes[link.source] || (nodes[link.source] = {name: link.source, edges: 0});
  link.source.edges += 1;
  link.target = nodes[link.target] || (nodes[link.target] = {name: link.target, edges: 0});
  link.target.edges += 1;
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
    .attr("class", function(d) { return "link " + d.type; })
    .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

var circle = svg.append("svg:g").selectAll("circle")
    .data(force.nodes())
  .enter().append("svg:circle")
    .attr("r", 20)
    .call(force.drag);

var text = svg.append("svg:g").selectAll("g")
    .data(force.nodes())
  .enter().append("svg:g");

// A copy of the text with a thick white stroke for legibility.
text.append("svg:text")
    .attr("x", 8)
    .attr("y", ".31em")
    .attr("class", "shadow")
    .text(function(d) { return d.name; });

text.append("svg:text")
    .attr("x", 8)
    .attr("y", ".31em")
    .text(function(d) { return d.name; });

// Use elliptical arcs path segments to n-encode edges.
function tick() {
  path.attr("d", function(d) {
    var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy);
    return "M" + d.source.x + "," + d.source.y + "A" + dr*3 + "," + dr*3 + " 0 0,1 " + d.target.x + "," + d.target.y;
  });

  circle.attr("transform", function(d) {
    return "translate(" + d.x + "," + d.y + ")";
  });

  text.attr("transform", function(d) {
    return "translate(" + d.x + "," + d.y + ")";
  });
}