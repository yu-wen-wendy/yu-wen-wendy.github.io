/*
*    main.js
*    Mastering Data Visualization with D3.js
*    FreedomCorp Dashboard
*/

var parseTime = d3.timeParse("%Y");
var formatTime = d3.timeFormat("%Y");

d3.json("data/WVSnew.json").then(function(data){    
    
	
    data.map(function(d){
        d.FinancialSituation = +d.FinancialSituation
        d.Income = +d.Income
        d.Socialclass = +d.Socialclass
		d.Health = +d.Health
		d.Happpiness = +d.Happpiness
		d.Help = +d.Help
		d.ThinkLife = +d.ThinkLife
        d.Wave = parseTime(d.Wave)
        return d
    })

    allCalls = data;

    calls = data;

    nestedCalls = d3.nest()
        .key(function(d){
            return d.StateHealth;
        })
        .entries(calls)

    donut = new DonutChart("#StateHealth")

    revenueBar = new BarChart("#revenue", "Age", "Age vs. State of Health")
    durationBar = new BarChart("#call-duration", "Income", "Average Income vs. State of Health")
    unitBar = new BarChart("#units-sold", "Socialclass", "Average Social class vs. State of Health")

    //stackedArea = new StackedAreaChart("#stacked-area")
	plot = new plotchart("#stacked-area", "Income")

    timeline = new Timeline("#timeline")

    $("#var-select").on("change", function(){
        plot.wrangleData();
    })
})



function brushed() {
    var selection = d3.event.selection || timeline.x.range();
    var newValues = selection.map(timeline.x.invert)
    changeDates(newValues)
}

function changeDates(values) {
    calls = allCalls.filter(function(d){
        return ((d.Wave > values[0]) && (d.Wave < values[1]))
    })
    
    nestedCalls = d3.nest()
        .key(function(d){
            return d.StateHealth;
        })
        .entries(calls)

    $("#dateLabel1").text(formatTime(values[0]))
    $("#dateLabel2").text(formatTime(values[1]))

    donut.wrangleData();
    revenueBar.wrangleData();
    unitBar.wrangleData();
    durationBar.wrangleData();
    //stackedArea.wrangleData();
	plot.wrangleData();
}