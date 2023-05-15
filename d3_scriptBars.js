const QOL_URL = "https://raw.githubusercontent.com/ellachenn/Data-Viz/master/qol.csv"


let margin = { top: 20, right: 20, bottom: 170, left: 70 },
  width = window.innerWidth - margin.left - margin.right,
  height = 600

let svg2 = d3.select("#myChart2").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");


function calculateContinents(data) {
  let continents = [{ name: "Oceania", aveqol: 0, numCountries: 0 }, { name: "Asia", aveqol: 0, numCountries: 0 }, { name: "Europe", aveqol: 0, numCountries: 0 }, { name: "America", aveqol: 0, numCountries: 0 }, { name: "Africa", aveqol: 0, numCountries: 0 }];

  for (let i = 0; i < data.length; i++) {
    let continent = continents[continents.findIndex(country => country.name == data[i].State)];
    let score = calculateQOL(data[i]);
    if (score > 0) {
       continent.numCountries++;
    continent.aveqol += score;
    }
   

  }
  for (let i = 0; i < continents.length; i++) {
    continents[i].aveqol /= continents[i].numCountries;
    continents[i].aveqol = Math.floor(continents[i].aveqol);
  }
  return continents;
}

let allData;
d3.csv(POP_URL, (data) => {
  allData = data;
  drawBars();
});

let axis = svg2.append("g");
let yaxis = svg2.append("g");
 let x = d3.scaleBand()
            // .range([0, width])
            .range([0, 800])
            .padding(0.1);
let y = d3.scaleLinear()
          .range([height, 0]);

// text label for the y axis
svg2.append("text")             
  //   .attr("transform",
  //         "translate(500 , 100)")
  .attr("transform", "rotate(270)")
  .attr("x", -280)
  .attr("y", -50)
  .style("text-anchor", "middle")
  .attr("class", "label")
  .attr("font-size", "40pt")
  .attr("font-family", 'Times New Roman')
  .attr("fill", "grey")
  .attr("id", "continentStyle")
  .text("Score out of 100");

// text label for the x axis
svg2.append("text")             
    .attr("transform",
          "translate(" + (400) + " ," + 
                         (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .attr("class", "label")
    .attr("font-size", "40pt")
    .attr("font-family", 'Times New Roman')
    .attr("fill", "grey")
    .attr("y", 20)
    .attr("id", "continentStyle")
    .text("Continent")
      

function drawBars() {
  let continents = calculateContinents(allData);
  // set the x / y output ranges
 
  x.domain(continents.map(continent => continent.name));
  y.domain([0, d3.max(continents, continent => continent.aveqol)]);

  // append the rectangles for the bar chart
  let bars = svg2
    .selectAll(".bar")
    .data(continents)
    .enter()
    .append("rect")
    .attr("class", "bar")
    // .attr("fill", function(d) {return d.col})
    // .attr("fill", d => d.col)
    .attr("fill", (d)=> colorScale(d.aveqol))
    .attr("x", d => x(d.name))
    .attr("width", x.bandwidth())
    .attr("y", d => {
      console.log(d.name, d.aveqol)
      return  y(d.aveqol)
    })
    .attr("height", d => height - y(d.aveqol))

  // add the x Axis
  axis
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    

 

  // add the y Axis
  yaxis
    .call(d3.axisLeft(y));

 

}

function updateBars() {
   let continents = calculateContinents(allData);

  x.domain(continents.map(continent => continent.name));
  y.domain([0, d3.max(continents, continent => continent.aveqol)]);

  let bars = svg2.selectAll(".bar")
    .data(continents);

  // Exit
  bars.exit().remove();

  // append the rectangles for the bar chart
  bars 
    .enter()
    .append("rect")
    .attr("class", "bar")
    .merge(bars)
    .transition()
    .duration(500)
    // .attr("fill", function(d) {return d.col})
    // .attr("fill", d => d.col)
    .attr("fill", (d)=> colorScale(d.aveqol))
    .attr("x", d => x(d.name))
    .attr("width", x.bandwidth())
    .attr("y", d => {
      return  y(d.aveqol)
    })
    .attr("height", d => height - y(d.aveqol))


  // add the x Axis
  axis
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    

 

  // add the y Axis
  yaxis
    .call(d3.axisLeft(y));

 

}
