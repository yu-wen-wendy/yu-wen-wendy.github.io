/*
*    donutChart.js
*    Mastering Data Visualization with D3.js
*    FreedomCorp Dashboard
*/

DonutChart = function(_parentElement, _variable){
	this.parentElement = _parentElement;
	this.variable = _variable;

	this.initVis();
};

DonutChart.prototype.initVis = function(){
	var vis = this;

	vis.margin = { left:40, right:100, top:40, bottom:10 };
	vis.width = 350 - vis.margin.left - vis.margin.right;
	vis.height = 160 - vis.margin.top - vis.margin.bottom;
	vis.radius = Math.min(vis.width, vis.height) / 2;

    vis.svg = d3.select(vis.parentElement)
        .append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);
    
    vis.g = vis.svg.append("g")
        .attr("transform", "translate(" + (vis.margin.left + (vis.width / 2) - 50) + 
            ", " + (vis.margin.top + (vis.height / 2)) + ")");

	vis.pie = d3.pie()
		.value((d) => { return d.count; })
		.sort(null);

	vis.arc = d3.arc()
		.innerRadius(vis.radius - 15)
		.outerRadius(vis.radius);

    vis.g.append("text")
        .attr("class", "title")
        .attr("y", -60)
        .attr("x", -90)
        .attr("font-size", "12px")
        .attr("text-anchor", "start")
        .text("State of Health")

    vis.color = d3.scaleOrdinal(d3.schemeSet3);

    vis.addLegend();
	vis.wrangleData();
}

DonutChart.prototype.wrangleData = function(){
	var vis = this;

	sizeNest = d3.nest()
		.key(function(d){
			return d.StateHealth
		})
		.entries(calls)

    vis.dataFiltered = sizeNest.map(function(StateHealth){
        return {
            value: StateHealth.key,
            count: StateHealth.values.length
        }
    })

	vis.updateVis();
}

DonutChart.prototype.updateVis = function(){
	var vis = this;

	vis.path = vis.g.selectAll("path")
		.data(vis.pie(vis.dataFiltered));

	vis.path.attr("class", "update arc")
		.transition()
	        .duration(750)
	        .attrTween("d", arcTween);

	vis.path.enter().append("path") 
		.attr("class", "enter arc")
		.attr("fill", (d) => { return vis.color(d.data.value); })
			.transition()
	        .duration(750)
	        .attrTween("d", arcTween);

	// Only want to attach this once!
	d3.selectAll(".enter.arc")
		.append("title")
		.text(function(d) { return d.data.count; })

	function arcTween(d) {
		var i = d3.interpolate(this._current, d);
		this._current = i(0);
		return function(t) { return vis.arc(i(t)); };
	}

}

DonutChart.prototype.addLegend = function(){
	var vis = this;

    var legend = vis.g.append("g")
        .attr("transform", "translate(" + (150) + 
                    ", " + (-30) + ")");

    var legendArray = [
    	{label: "Very Poor", color: vis.color("Very Poor")},
    	{label: "Poor", color: vis.color("Poor")},
    	{label: "Fair", color: vis.color("Fair")},
		{label: "Good", color: vis.color("Good")},
    	{label: "Very Good", color: vis.color("Very good")}
	]

    var legendRow = legend.selectAll(".legendRow")
        .data(legendArray)
        .enter().append("g")
            .attr("class", "legendRow")
            .attr("transform", (d, i) => {
                return "translate(" + 0 + ", " + (i * 20) + ")"
            });
        
    legendRow.append("rect")
        .attr("class", "legendRect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", d => { return d.color; });

    legendRow.append("text")
        .attr("class", "legendText")
        .attr("x", -10)
        .attr("y", 10)
        .attr("text-anchor", "end")
        .text(d => { return d.label; }); 
}