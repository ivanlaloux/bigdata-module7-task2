let margin = null,
    width = null,
    height = null;
    svg = null;
    tooltip = null;
let x, y = null;

setupCanvasSize();
appendSvg("body");
appendTooltip("body");
setupXScale();
setupYScale();
appendXAxis();
appendYAxis();
appendLineCharts();
appendPointCharts();

function setupCanvasSize() {
  margin = {top: 20, left: 80, bottom: 20, right: 30};
  width = 900 - margin.left - margin.right;
  height = 320 - margin.top - margin.bottom;
}

function appendSvg(domElement) {
  svg = d3.select(domElement).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform",`translate(${margin.left}, ${margin.top})`);
}

function appendTooltip(domElement){
  tooltip=d3.select(domElement)
    .append('div')	
    .attr('class', 'tooltip')				
    .style('opacity', 0);
}

function setupXScale()
{
  x = d3.scaleTime()
      .range([0, width])
      .domain(d3.extent(totalSales, function(d) { return d.month}));
}

function setupYScale()
{
  var maxSales = d3.max(totalSales, function(d, i) {
    return d.sales;
  });
  y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, maxSales]);
}

function appendXAxis() {
  // Add the X Axis
  svg.append("g")
    .attr("transform",`translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .attr("class", "axis");
}  

function appendYAxis() {
  // Add the Y Axis
  svg.append("g")
  .call(d3.axisLeft(y))
  .attr("class", "axis");
}

function appendLineCharts()
{
  // define the line
  var valueline = d3.line()
                    .x(function(d) { return x(d.month); })
                    .y(function(d) { return y(d.sales); });
  // Add the value path
  svg.append("path")
      .data([totalSales])
      .attr("class", "line")
      .attr("d", valueline);
}

function appendPointCharts(){
  svg.selectAll('dot')
    .data(totalSales)
    .enter().append('circle')
    .attr("class", "dot")
    .attr('r', 4.5)
    .attr('cx', d => x(d.month))
    .attr('cy', d => y(d.sales))
    .on('mouseout',d=>{
      //Hide the tooltip
      tooltip.transition()		
        .duration(800)
        .style('opacity', 0);
    })
    .on('mousedown',d=>{
      //Show the tooltip when a point in the chart is clicked
      tooltip.transition()		
            .duration(10)		
            .style('opacity', .9);
      // Add tooltip content
      tooltip.html(`<span>Sales: ${d.sales}</span>`)
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY - 28) + "px");  
    });
}
