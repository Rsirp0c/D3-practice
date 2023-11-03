var svgStates = d3.select("svg #states"),
    svgBoundary = d3.select("svg #boundary"),
    states = {},
    startYear = 1790,
    currentYear = startYear;

var width = window.innerWidth,
  height = window.innerHeight;

var projection = d3.geo.albersUsa()
  .translate([width / 2, height / 2]);

var path = d3.geo.path()
  .projection(projection);

d3.json("data/usa.json", function(error, boundary) {
svgBoundary.selectAll("path")
    .data(boundary.features)
    .enter()
  .append("path")
    .attr("d", path)
});

d3.json("data/states.json", function(error, topologies) {

for (var i = 0; i < topologies.length; i++) {
  states[startYear + i * 10] = topojson.feature(topologies[i], topologies[i].objects.stdin);
}

function update() {
  svgStates.selectAll("path")
      .data(states[currentYear].features)
      .enter()
    .append("path")
      .attr("d", path)
      .style("fill", function(d, i) {
        var name = d.properties.STATENAM.replace(" Territory", "");
        return colors[name];
      })
    .append("svg:title")
      .text(function(d) { return d.properties.STATENAM; });

  d3.select("#year").html(currentYear);
}

update();

d3.select("#slider")
    .call(
      chroniton()
        .domain([new Date(startYear, 1, 1), new Date(startYear + (topologies.length - 1) * 10, 1, 1)])
        .labelFormat(function(date) {
          return Math.ceil((date.getFullYear()) / 10) * 10;
        })
        .width(600)
        .on('change', function(date) {
          var newYear = Math.ceil((date.getFullYear()) / 10) * 10;
          if (newYear != currentYear) {
            currentYear = newYear;
            svgStates.selectAll("path").remove();
            update();
          }
        })
        .playButton(true)
        .playbackRate(0.2)
        .loop(true)
    );
});