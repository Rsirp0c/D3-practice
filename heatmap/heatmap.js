
// set the dimensions and margins of the graph
//const margin = {top: 0, right: 0, bottom: 0, left: 0},  
const margin = {top: 80, right: 50, bottom: 265, left: 300},  
  width = 700 - margin.left - margin.right, //700-300-25 = 375
  height = 700 - margin.top - margin.bottom; //585-80-30 = 475

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", 
  `translate(${margin.left}, ${margin.top})`);
  //"translate(" + (width / 4) + "," + (height / 2) + ")"); 
//Read the data
//d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv").then(function(data) {
d3.csv("data.csv").then(function(data) {

  // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
  const myGroups = Array.from(new Set(data.map(d => d.group)))
  const myVars = Array.from(new Set(data.map(d => d.variable)))

  // Build X scales and axis:
const x = d3.scaleBand()
    .range([0, width])
    .domain(myGroups)
    .padding(0.05);
svg.append("g")
    .style("font-size", 15)
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSize(0))
    .selectAll("text")
    .attr("transform", "rotate(60)")
    .attr("dy", "0.35em")
    .attr("dx", "0.8em")
    .style("text-anchor", "start")   
    .select(".domain").remove()

   

//     const x = d3.scaleBand()
//     .range([0, width])
//     .domain(myGroups)
//     .padding(0.05);
// svg.append("g")
//     .style("font-size", 15)
//     .attr("transform", `translate(0, ${height})`)
//     .call(d3.axisLeft(x).tickSize(0))
//     .selectAll("text")
//     .attr("transform", "rotate(-90)")
//     .attr("dy", "0.35em")
//     .attr("dx", "-0.8em")
//     .style("text-anchor", "end");    

  // Build Y scales and axis:
  const y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(myVars)
    .padding(0.05);
  svg.append("g")
    .style("font-size", 15)
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove()

  // Build color scale
  const myColor = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([0,1])

  // create a tooltip
  const tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  //Three function that change the tooltip when user hover / move / leave a cell
  const mouseover = function(event,d) {
    tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  const mousemove = function(event,d) {
    tooltip
      .html(d.group+" v. "+d.variable +": "+ d.value)
      .style("left", (event.x)/2 + "px")
      .style("top", (event.y)/2 + "px")
  }
  const mouseleave = function(event,d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }

  // add the squares
  svg.selectAll()
    .data(data, function(d) {return d.group+':'+d.variable;})
    .join("rect")
      .attr("x", function(d) { return x(d.group) })
      .attr("y", function(d) { return y(d.variable) })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColor(d.value)} )
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
})

// Add title to graph
svg.append("text")
        .attr("x", 0)
        .attr("y", -35)
        .attr("text-anchor", "left")
        .style("font-size", "22px")
        .text("Correlation Aalysis");

// Add subtitle to graph
svg.append("text")
        .attr("x", 0)
        .attr("y", -15)
        .attr("text-anchor", "left")
        .style("font-size", "14px")
        .style("fill", "grey")
        .style("max-width", 400)
        .text("cosi116 data visualization project");
