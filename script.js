
let width = window.innerWidth;
let height =  window.innerHeight;

let svg = d3.select("#myChart").append("svg")
  .attr("width", width)
  .attr("height", height)


// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
  .scale(70)
  .center([0,20])
  .translate([width / 2, height / 2]);

// Data and color scale
var data = d3.map();
var colorScale = d3.scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeBlues[7]);

const GEO_URL = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";
const POP_URL = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv"


// Load external data and boot
d3.queue()
  .defer(d3.json, GEO_URL)
  .defer(d3.csv, POP_URL, function(d) { data.set(d.code, +d.pop); })
.await(drawMap);

function drawMap(error, topo) {

  /////////////////////////////////
  console.log(topo)
  console.log(data.get('AFG'))
  /////////////////////////////////
  
  // Draw the map
  svg.append("g")
    .selectAll()
    .data(topo.features)
    .enter()
    .append("path")
    // draw each country
    .attr("d", d3.geoPath()
      .projection(projection)
    )
    // set the color of each country
    .attr("fill", function (d) {
      d.total = data.get(d.id) || 0;
      return colorScale(d.total);
    })
    .on('mouseenter', function (d) {
        d3.select(this).attr("stroke", "red");
        d3.select("#country").html(d.properties.name)
    })
    .on('mouseleave', function (d) {
        d3.select(this).attr("stroke", "none")
    })
}




// // Establish weight of each factor
// a = 0.1429
// b = 0.1429
// c = 0.1429
// d = 0.1429
// e = 0.1429
// f = 0.1429
// g = 0.1429

// // calculate the quality of life column
// qolDF["Quality of Life"] = round(qolDF['Stability'] * a + qolDF['Rights'] * b + qolDF['Health'] * c + qolDF['Safety'] * d + qolDF['Climate'] * e + qolDF['Costs'] * f + qolDF['Popularity'] * g)
// qolDF.head()

