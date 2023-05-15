// https://d3-graph-gallery.com/graph/choropleth_basic.html
let topoData;

var div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// sliders
var stabilitySlider = document.getElementById("stability");
stabilitySlider.oninput = function() {
  // console.log(this.value);
  d3.select("#stabilityWeight").html(this.value);
  refreshMap();
};

var rightsSlider = document.getElementById("rights");
rightsSlider.oninput = function() {
  d3.select("#rightsWeight").html(this.value);
  refreshMap();
}

var healthSlider = document.getElementById("health");
healthSlider.oninput = function() {
  d3.select("#healthWeight").html(this.value);
  refreshMap();
}

var safetySlider = document.getElementById("safety");
safetySlider.oninput = function() {
  d3.select("#safetyWeight").html(this.value);
  refreshMap();
}

var climateSlider = document.getElementById("climate");
climateSlider.oninput = function() {
  d3.select("#climateWeight").html(this.value);
  refreshMap();
}

var costsSlider = document.getElementById("costs");
costsSlider.oninput = function() {
  d3.select("#costsWeight").html(this.value);
  refreshMap();
}

var popularitySlider = document.getElementById("popularity");
popularitySlider.oninput = function() {
  d3.select("#popularityWeight").html(this.value);
  refreshMap();
}


///////////////////////////////////////////
let svg = d3.select("#myChart").append("svg")
  // .attr("x", 300)
  // .attr("y", 300)
  .attr("width", 600)
  .attr("height", 450)
let container = d3.select(svg.node().parentNode);

// resize
function resize() {
  w = container.node().clientWidth,
    h = container.node().clientHeight;
  svg.attr("viewBox", "0 0 " + w + " " + h)
    .attr("width", "100%")
    .attr("height", "100%");
}
resize();
d3.select(window).on("resize", resize);


///////////////////////////////////////////
// Map and projection and location
var path = d3.geoPath();
var projection = d3.geoMercator()
  .scale(120)
  .center([5, 45])
  .translate([w / 2, h / 2]);

// Data and color scale
var data = d3.map();
var colorScale = d3.scaleLinear()
  .domain([0, 50, 75, 95])
  // .range(["white", "darkyellow", "lightblue", "blue", "darkblue"]);
  // .range(["white", "turquoise", "blue", "darkblue"]);
  .range(["white", "pink", "turquoise", "blue"])


/////////////////////////////////////////
// LEGEND
let svgLegend = d3.select("#legend")
  .append("svg")
  .attr("width", 200)
  .attr("height", 80)
var key = svgLegend.append("g");

for (var i = 0; i < 100; i++) {
  key.append("text")
    .attr("x", 0)
    .attr("y", 10)
    .text("Legend")

  key.append("rect")
    .attr("x", i)
    .attr("y", 18)
    .attr("width", 1)
    .attr("height", 20)
    .style("fill", function(d) { return colorScale(i) });

  key.append("text")
    .attr("x", 0)
    .attr("y", 55)
    .text("0%")

  key.append("text")
    .attr("x", 80)
    .attr("y", 55)
    .text("100%")
}
/////////////////////////////////////////

// const GEO_URL = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";
const GEO_URL = "world.geojson"

const POP_URL = "https://raw.githubusercontent.com/ellachenn/Data-Viz/master/qol.csv"


// Load external data and boot
d3.queue()
  .defer(d3.json, GEO_URL)
  .defer(d3.csv, POP_URL, function(d) {
    data.set(d.Code, d);
  })
  .await(drawMap);

function refreshMap() {
  drawMap();
  // drawBars();
  updateBars();
}

let mapSVG = svg.append("g");

function drawMap(error, topo) {
  if (topo) {
    topoData = topo;
  }

  mapSVG
    .selectAll()
    .data(topoData.features)
    .enter()
    .append("path")
    .attr("d", d3.geoPath()
      .projection(projection)
    )
    .attr("stroke", function(d) {
      let country = data.get(d.id);
      if (!country) {
        return "lightgrey"
      }
      return "none";
    })
    .attr("fill", function(d) {
      let country = data.get(d.id);
      if (!country) {
        // d3.select(this).attr("stroke", "lightgrey");
        // d3.select(this).attr("col", "white");
        return "white";
      }
      return colorScale(calculateQOL(data.get(d.id)));
    })
    .on('mouseenter', function(d) {
      d3.select(this).attr("stroke", "red");
      // d3.select("#country").html(d.properties.name + " " + calculateQOL(data.get(d.id)))

      div.transition()
        .duration(200)
        .style("opacity", .9);

      let country = d.properties.name;
      let q = calculateQOL(data.get(d.id));
      if (q == 0) {
        q = "N/A";
      }

      let newHTML =
        `
        <div>Country: ${country}</div>
        <div>Quality of Life: ${q}</div> 
        `
      div.html(newHTML)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");

    })
    .on('mouseleave', function(d) {
      let q = calculateQOL(data.get(d.id));

      if (q != 0) {
        d3.select(this).attr("stroke", "none")

      }
      else {
        d3.select(this).attr("stroke", "lightgrey");
        d3.select(this).attr("fill", "white");
      }
      div.transition()
        .duration(500)
        .style("opacity", 0);

      // if (country == "Greenland") {
      //   console.log(country, d3.select(this).attr("stroke"))
      // }
    })
    .exit()
    .remove();
}

// this function creates color scale based on weight of each factor
function calculateQOL(country) {
  if (!country) {
    return 0;
  }
  let stability = +country.Stability | 0;
  let stabilityWeight = +stabilitySlider.value / 100;

  let rights = +country.Rights | 0;
  let rightsWeight = +rightsSlider.value / 100;

  let health = +country.Health | 0;
  let healthWeight = +healthSlider.value / 100;

  let safety = +country.Safety | 0;
  let safetyWeight = +safetySlider.value / 100;

  let climate = +country.Climate | 0;
  let climateWeight = +climateSlider.value / 100;

  let costs = +country.Costs | 0;
  let costsWeight = +costsSlider.value / 100;

  let popularity = +country.Popularity | 0;
  let popularityWeight = +popularitySlider.value / 100;

  let totalWeights = stabilityWeight + rightsWeight + healthWeight + safetyWeight + climateWeight + costsWeight + popularityWeight;
  let weightedSum = stability * stabilityWeight + rights * rightsWeight + health * healthWeight + safety * safetyWeight + climate * climateWeight + costs * costsWeight + popularity * popularityWeight
  let qolScore = Math.ceil(weightedSum / totalWeights)
  return qolScore;

}


// write more words as analysis for visualization
// make bar chart with continent as x axis
// bar chart help: https://replit.com/@advanced-cs-2022-23/4-Bar-Charts-EllaChen5#index.html