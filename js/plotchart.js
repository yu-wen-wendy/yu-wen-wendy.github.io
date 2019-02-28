/*
*    plotchart.js
*    Mastering Data Visualization with D3.js
*    FreedomCorp Dashboard
*/



plotchart = function(_parentElement, _variable){
    this.parentElement = _parentElement;
    //this.variable = _variable;
    //this.title = _variable;

    this.initVis();
};



plotchart.prototype.initVis = function(){
    var vis = this;

    vis.margin = { left:80, right:100, top:50, bottom:40 };
    vis.height = 370 - vis.margin.top - vis.margin.bottom;
    vis.width = 800 - vis.margin.left - vis.margin.right;

    vis.svg = d3.select(vis.parentElement)
        .append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);
    vis.g = vis.svg.append("g")
        .attr("transform", "translate(" + vis.margin.left + 
            ", " + vis.margin.top + ")");

    vis.t = () => { return d3.transition().duration(1000); }

    vis.linePath = vis.g.append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke-width", "3px");

//    vis.color = d3.scaleOrdinal(d3.schemeGreys[4]); schemeSet3
	vis.color = d3.scaleOrdinal(d3.schemeSet3);

    vis.x = d3.scaleBand()
        .domain(["Very Poor", "Poor", "Fair", "Good","Very good"])				
        .range([0, vis.width])
        .padding(0.5);

    vis.y = d3.scaleLinear().range([vis.height, 0]);


    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    vis.yAxisCall = d3.axisLeft()
        .ticks(4);
    vis.xAxisCall = d3.axisBottom()
        .tickFormat(function(d) {
            return "" + capitalizeFirstLetter(d);
        });
    vis.xAxis = vis.g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + vis.height +")")
    vis.yAxis = vis.g.append("g")
        .attr("class", "y axis");
	
	
//    vis.g.append("text")
//        .attr("class", "title")
//        .attr("y", -15)
//        .attr("x", -50)
//        .attr("font-size", "15px")
//        .attr("text-anchor", "start")
//        .text(vis.title)
	
	vis.xLabel = vis.g.append("text")
		.attr("y", 310)
		.attr("x", 600)
		.attr("font-size", "15px")
		.attr("text-anchor", "middle")
		.text("State of Health");

    vis.wrangleData();
};


plotchart.prototype.wrangleData = function(){
    var vis = this;
	vis.variable = $("#var-select").val()

    vis.dataFiltered = nestedCalls.map(function(StateHealth){
        return {
            StateHealth: StateHealth.key,
            size: (StateHealth.values.reduce(function(accumulator, current){
                return accumulator + current[vis.variable]
            }, 0) / StateHealth.values.length)
        }
    })

    vis.updateVis();
};


plotchart.prototype.updateVis = function(){
    var vis = this;

    // Update scales
    vis.y.domain([0, d3.max(vis.dataFiltered, (d) => { return +d.size; })]);

    // Update axes
    vis.xAxisCall.scale(vis.x);
    vis.xAxis.transition(vis.t()).call(vis.xAxisCall);
    vis.yAxisCall.scale(vis.y);
    vis.yAxis.transition(vis.t()).call(vis.yAxisCall);
	

    // JOIN new data with old elements.
    vis.rects = vis.g.selectAll("rect").data(vis.dataFiltered, function(d){
        return d.StateHealth;
    });

	var legendArray = [
    	{label: "Very Poor", color: vis.color("Very Poor")},
    	{label: "Poor", color: vis.color("Poor")},
    	{label: "Fair", color: vis.color("Fair")},
		{label: "Good", color: vis.color("Good")},
    	{label: "Very Good", color: vis.color("Very good")}
	]

    // EXIT old elements not present in new data.
    vis.rects.exit()
        .attr("class", "exit")
        .transition(vis.t())
        .attr("height", 0)
        .attr("y", vis.height)
        .style("fill-opacity", "0.1")
        .remove();

    // UPDATE old elements present in new data.
    vis.rects.attr("class", "update")
        .transition(vis.t())
            .attr("y", function(d){ return vis.y(d.size); })
            .attr("height", function(d){ return (vis.height - vis.y(d.size)); })
            .attr("x", function(d){ return vis.x(d.StateHealth) })
            .attr("width", vis.x.bandwidth)

    // ENTER new elements present in new data.
    vis.rects.enter()
        .append("rect")
        .attr("class", "enter")
        .attr("y", function(d){ return vis.y(d.size); })
        .attr("height", function(d){ return (vis.height - vis.y(d.size)); })
        .attr("x", function(d){ return vis.x(d.StateHealth) })
        .attr("width", vis.x.bandwidth)
        .attr("fill", "#AEC17B"
			//		   "#C1395E","#E07B42", "#F0CA50", ,"#89A7C2"
			 );
};