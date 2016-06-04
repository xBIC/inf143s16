/**
 * Credit to: https://bl.ocks.org/mbostock/3887118
 * Used as the basis for this scatterplot visualization
 */

var xParam = 'quality';
var yParam = 'fixed acidity';
var yParamPretty = 'Fixed Acidity';
var colorParam = 'wine_type';
var showRed = true;
var showWhite = true;
var opacity = .35;

var margin = {top: 20, right: 20, bottom: 30, left: 60},
    width = 700 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

//var color = d3.scale.category10();
var color = d3.scale.ordinal().range(['#D55E00', '#56B4E9']);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg;

var loadedData = [];

d3.csv("winequality.csv", function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
        d['fixed acidity'] = +d['fixed acidity'];
        d['volatile acidity'] = +d['volatile acidity'];
        d['citric acid'] = +d['citric acid'];
        d['residual sugar'] = +d['residual sugar'];
        d['chlorides'] = +d['chlorides'];
        d['free sulfur dioxide'] = +d['free sulfur dioxide'];
        d['total sulfur dioxide'] = +d['total sulfur dioxide'];
        d['density'] = +d['density'];
        d['pH'] = +d['pH'];
        d['sulphates'] = +d['sulphates'];
        d['alcohol'] = +d['alcohol'];
        d['quality'] = +d['quality'];
    });

    loadedData = data;

    setupSvg(loadedData);

});

$('input[type=radio][name=optradio]').change(function() {
    yParam = this.value;
    yParamPretty = $(this).parent()[0].innerText;
    svg.remove();
    $('svg').remove();

    setupSvg(loadedData);
});

$('input[type=checkbox][name=redcheckbox]').change(function() {
    showRed = this.checked;
    svg.remove();
    $('svg').remove();

    setupSvg(loadedData);
});

$('input[type=checkbox][name=whitecheckbox]').change(function() {
    showWhite = this.checked;
    svg.remove();
    $('svg').remove();

    setupSvg(loadedData);
});

function setupSvg(loadedData)
{
    var data = [];

    $('#vis_title').html(yParamPretty + ' vs Quality');

    loadedData.forEach(function(d) {
        if (d['wine_type'] == 'red' && showRed) {
            data.push(d);
        } else if (d['wine_type'] == 'white' && showWhite) {
            data.push(d);
        }
    });

    x.domain([d3.min(data, function(d) { return d[xParam]; }) - 1, d3.max(data, function(d) { return d[xParam]; })]).nice();
    y.domain(d3.extent(data, function(d) { return d[yParam]; })).nice();

    svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(xParam);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yParam)

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 2.5)
        .attr("cx", function(d) { return x(d[xParam]); })
        .attr("cy", function(d) { return y(d[yParam]); })
        .style("fill", function(d) { return color(d[colorParam]); })
        .style("opacity", opacity);

    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
}