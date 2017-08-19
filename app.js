//Width and height
var width = 1000;
var height = 500;
var margin = {left: 60, right: 0, top: 100, bottom: 100};

//Create scale functions
var rectWidth = (((width - margin.left - margin.right) - margin.left) + 150) / ((2015 - 1753) + 1);  // The 150 is a fudge
var xScale = d3.scale.linear()
  .domain([1753, 2015 + 1])
	.range([margin.left, width - margin.left - margin.right]);

var rectHeight = (height - margin.top - margin.bottom + 6) / 12;  // The 6 is a fudge
//rectHeight++;
var yScale = d3.scale.linear()
  .domain([1, 12 + 1])
	.range([margin.top, height - margin.top]);

//Define X axis
var xAxis = d3.svg.axis()
  .scale(xScale)
	.orient("bottom")
	.ticks(15);

//Define Y axis
var yAxis = d3.svg.axis()
  .scale(yScale)
	.orient("left")
	.ticks(12)
  .tickFormat(function(d) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return (months[d-1]);
  });

//Create SVG element
var svg = d3.select("#graph")
  .attr("width", width)
	.attr("height", height);

function fetchJSON() {
  fetch("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json")
    .then(function(response) {
       return response.json();
     })
    .then(function(json) {
       var baseTemperature = json.baseTemperature;
       var data = json.monthlyVariance;
       var maxTemp = d3.max(data, function(d) {return d.variance + baseTemperature;});
       var minTemp = d3.min(data, function(d) {return d.variance + baseTemperature;});
       //Create rectangles
			 svg.selectAll("rect")
			   .data(data)
			   .enter()
			   .append("rect")
			   .attr("x", function(d) {
			   		return xScale(d.year);
			   })
			   .attr("y", function(d) {
			   		return yScale(d.month);
			   })
         .attr("width", rectWidth)
			   .attr("height", rectHeight)
         .attr("fill", function(d) {
            // The coldest temp is 1.70 and the warmest is 13.9, which gives us 1.525 degrees per block, and I'm rounding to nearest decimal
            // 1.7 - 13.9 = 12.2/8=1.525
            // Note: This puts the middle of the yellow block at 8.5625 and the baseTemp is 8.66 so this is spot on.
            //       The demo is skewed too hot. It has middle of yellow block 7.75, and it starts chart at 0 degrees, but lowest temp is 1.7
            //       However, assuming valid data, it is still hotter now than in the past.
            var color = "";
            if (baseTemperature + d.variance < 3.2) {
              color = "#800080";  //purple
            } else if (baseTemperature + d.variance >= 3.2 && baseTemperature + d.variance < 4.8) {
              color = "#0000FF";  //blue
            } else if (baseTemperature + d.variance >= 4.8 && baseTemperature + d.variance < 6.3) {
              color = "#00CC00";  //green  #008000
            } else if (baseTemperature + d.variance >= 6.3 && baseTemperature + d.variance < 7.8) {
              color = "#CCFF99";  //greenYellow  #ADFF2F
            } else if (baseTemperature + d.variance >= 7.8 && baseTemperature + d.variance < 9.3) {
              color = "#FFFFCC";  //yellow #FFFF00
            } else if (baseTemperature + d.variance >= 9.3 && baseTemperature + d.variance < 10.9) {
              color = "#FFE066";  //orangeYellow
            } else if (baseTemperature + d.variance >= 10.9 && baseTemperature + d.variance < 12.4) {
              color = "#FFA500";  //orange
            } else if (baseTemperature + d.variance >= 12.4 && baseTemperature + d.variance < 13.9) {
              color = "	#FF0000";  //red
            } else if (baseTemperature + d.variance >= 13.9) {
              color = "#800000";  //maroon
            }
			   		return color;
			   })
         .on('mouseover', function (data)  {
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            document.getElementById("year").innerHTML = data.year;
            document.getElementById("month").innerHTML = " – " + months[data.month - 1];
            document.getElementById("temp").innerHTML = Math.round((8.66 + data.variance) * 10000) / 10000 + " °C";
            tooltip.style.left = event.clientX - 260 + "px";
            tooltip.style.top = event.clientY - 100 + "px";
            tooltip.style.display = "block";
		      })
		     .on('mouseout', function (data)  {
            tooltip.style.display = "none";
		      });

			 //Create X axis
			 svg.append("g")
				 .attr("class", "axis")
				 .attr("transform", "translate(0," + (height - margin.top) + ")")
				 .call(xAxis);
			
			 //Create Y axis
			 svg.append("g")
				 .attr("class", "axis")
				 .attr("transform", "translate(" + margin.left + ",0)")
				 .call(yAxis);
    
      //Create Map and Axis labels/text
      svg.append("text")
        .attr("x", (width / 2))
        .attr("y", "1em")
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif") 
        .attr("font-size", "1.5em")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .text("Monthly Global Land-Surface Temperature");
      svg.append("text")
        .attr("x", (width / 2))
        .attr("y", "2.2em")
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif") 
        .attr("font-size", "1.3em")
        .attr("fill", "black")
        .text("1753-2015");
      svg.append("text")
        .attr("x", (width / 2))
        .attr("y", "5em")
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif") 
        .attr("font-size", ".8em")
        .attr("fill", "black")
        .text("Temperatures are in Celsius and reported as abnormalities relative to the Jan 1951–Dec 1980 average");
      svg.append("text")
        .attr("x", (width / 2))
        .attr("y", "6.1em")
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif") 
        .attr("font-size", ".8em")
        .attr("fill", "black")
        .text("Estimated Jan 1951–Dec 1980 absolute temperature °C 8.66 ±0.07");
      svg.append("text")
        .attr("x", -240)
        .attr("y", "1.3em")
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif") 
        .attr("font-size", "1.2em")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .attr("transform", "rotate(-90)")
        .text("Months");
      svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 440)
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif") 
        .attr("font-size", "1.2em")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .text("Years");
      svg.append("rect")
        .attr("x", 670)
        .attr("y", 430)
        .attr("width", 30)
        .attr("height", 15)
        .attr("fill", "#800080");
      svg.append("rect")
        .attr("x", 700)
        .attr("y", 430)
        .attr("width", 30)
        .attr("height", 15)
        .attr("fill", "#0000FF");
      svg.append("rect")
        .attr("x", 730)
        .attr("y", 430)
        .attr("width", 30)
        .attr("height", 15)
        .attr("fill", "#00CC00");
      svg.append("rect")
        .attr("x", 760)
        .attr("y", 430)
        .attr("width", 30)
        .attr("height", 15)
        .attr("fill", "#CCFF99");
      svg.append("rect")
        .attr("x", 790)
        .attr("y", 430)
        .attr("width", 30)
        .attr("height", 15)
        .attr("fill", "#FFFFCC");
      svg.append("rect")
        .attr("x", 820)
        .attr("y", 430)
        .attr("width", 30)
        .attr("height", 15)
        .attr("fill", "#FFE066");
      svg.append("rect")
        .attr("x", 850)
        .attr("y", 430)
        .attr("width", 30)
        .attr("height", 15)
        .attr("fill", "#FFA500");
      svg.append("rect")
        .attr("x", 880)
        .attr("y", 430)
        .attr("width", 30)
        .attr("height", 15)
        .attr("fill", "#FF0000");
      svg.append("rect")
        .attr("x", 910)
        .attr("y", 430)
        .attr("width", 30)
        .attr("height", 15)
        .attr("fill", "#800000");
      svg.append("text")
        .attr("x", 670)
        .attr("y", 460)
        .attr("text-anchor", "left")
        .attr("font-family", "sans-serif") 
        .attr("font-size", ".8em")
        .attr("fill", "black")
        .text("1.7");
      svg.append("text")
        .attr("x", 700)
        .attr("y", 460)
        .attr("text-anchor", "left")
        .attr("font-family", "sans-serif") 
        .attr("font-size", ".8em")
        .attr("fill", "black")
        .text("3.2");
      svg.append("text")
        .attr("x", 730)
        .attr("y", 460)
        .attr("text-anchor", "left")
        .attr("font-family", "sans-serif") 
        .attr("font-size", ".8em")
        .attr("fill", "black")
        .text("4.8");
      svg.append("text")
        .attr("x", 760)
        .attr("y", 460)
        .attr("text-anchor", "left")
        .attr("font-family", "sans-serif") 
        .attr("font-size", ".8em")
        .attr("fill", "black")
        .text("6.3");
      svg.append("text")
        .attr("x", 790)
        .attr("y", 460)
        .attr("text-anchor", "left")
        .attr("font-family", "sans-serif") 
        .attr("font-size", ".8em")
        .attr("fill", "black")
        .text("7.8");
      svg.append("text")
        .attr("x", 820)
        .attr("y", 460)
        .attr("text-anchor", "left")
        .attr("font-family", "sans-serif") 
        .attr("font-size", ".8em")
        .attr("fill", "black")
        .text("9.3");
      svg.append("text")
        .attr("x", 850)
        .attr("y", 460)
        .attr("text-anchor", "left")
        .attr("font-family", "sans-serif") 
        .attr("font-size", ".8em")
        .attr("fill", "black")
        .text("10.9");
      svg.append("text")
        .attr("x", 880)
        .attr("y", 460)
        .attr("text-anchor", "left")
        .attr("font-family", "sans-serif") 
        .attr("font-size", ".8em")
        .attr("fill", "black")
        .text("12.4");
      svg.append("text")
        .attr("x", 910)
        .attr("y", 460)
        .attr("text-anchor", "left")
        .attr("font-family", "sans-serif") 
        .attr("font-size", ".8em")
        .attr("fill", "black")
        .text("13.9");
    
    });
}

fetchJSON();