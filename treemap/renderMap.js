// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
width = 750 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      // "translate(" + margin.left + "," + margin.top + ")");
      "translate(" + (width / 2) + "," + (height / 2) + ")"); // Center the <g> element
// Read data
d3.csv("tree.csv", function(data) {

// stratify the data: reformatting for d3.js
var root = d3.stratify()
  .id(function(d) { return d.name; })   // Name of the entity (column name is name in csv)
  .parentId(function(d) { return d.parent; })   // Name of the parent (column name is parent in csv)
  (data);
root.sum(function(d) { return +d.value })   // Compute the numeric value for each entity

// Then d3.treemap computes the position of each element of the hierarchy
// The coordinates are added to the root object above
d3.treemap()
  .size([width, height])
  .padding(3)
  (root)

console.log(root.leaves())
// use this information to add rectangles:

var colorScale = d3.scaleSequential(d3.interpolateBlues)
  .domain([-0.1,0.6]);

svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
      .attr('x', function (d) { return d.x0; })
      .attr('y', function (d) { return d.y0; })
      .attr('width', function (d) { return d.x1 - d.x0; })
      .attr('height', function (d) { return d.y1 - d.y0; })
      // .style("stroke", "black")
      // .style("fill", "steelblue")
      .style("fill", function(d) {
        return colorScale(d.data.percent);
     })

  // and to add the text labels with percentage
  svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
      .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
      .attr("y", function(d){ return d.y0+20})    // +40 to adjust position (lower)
      .text(function(d){ return d.data.name })
      .attr("font-size", "15px")
      .attr("fill", "white");

  svg
    .selectAll("text.percentage")
    .data(root.leaves())
    .enter()
    .append("text")
      .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
      .attr("y", function(d){ return d.y0+37})    // +60 to adjust position (lower)
      .text(function(d){ return (d.data.percent*100).toFixed(2) + "%" })
      .attr("font-size", "13px")
      .attr("fill", "white");
    
    });
