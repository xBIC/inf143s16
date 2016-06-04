/**
 * Credit to: https://bl.ocks.org/mbostock/3887118
 * Used as the basis for this scatterplot visualization
 *
 * Credit to: http://bl.ocks.org/Caged/6476579
 * Used to handle the tooltip popups
 */

var xParam = 'quality';
var yParam = 'fixed acidity';
var yParamPretty = 'Fixed Acidity';
var colorParam = 'wine_type';
var showRed = true;
var showWhite = true;
var opacity = .5;

var margin = {top: 20, right: 20, bottom: 30, left: 60},
    width = 700 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

//var color = d3.scale.category10();
var color = d3.scale.ordinal().range(['#56B4E9', '#D55E00']);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.format("d"));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg;

var loadedData = [];

d3.csv("winequality.csv", function (error, data) {
    if (error) throw error;

    data.forEach(function (d) {
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

$('input[type=radio][name=optradio]').change(function () {
    yParam = this.value;
    yParamPretty = $(this).parent()[0].innerText;
    svg.remove();
    $('svg').remove();

    setupSvg(loadedData);
});

$('input[type=checkbox][name=redcheckbox]').change(function () {
    showRed = this.checked;
    svg.remove();
    $('svg').remove();

    setupSvg(loadedData);
});

$('input[type=checkbox][name=whitecheckbox]').change(function () {
    showWhite = this.checked;
    svg.remove();
    $('svg').remove();

    setupSvg(loadedData);
});

function setupSvg(loadedData) {
    var data = [];
    var countedData = [];

    $('#vis_title').html(yParamPretty + ' vs Quality');

    loadedData.forEach(function (d) {
        if (d['wine_type'] == 'red' && showRed) {
            data.push(d);
        } else if (d['wine_type'] == 'white' && showWhite) {
            data.push(d);
        }
    });

    var maxRed = 1;
    var maxWhite = 1;

    data.forEach(function (d) {
        found = false;
        countedData.forEach(function (k) {
           if (d[yParam] == k[yParam] && d['wine_type'] == k['wine_type'] && d['quality'] == k['quality']) {
               k['count'] += 1;
               found = true;
               if (k['count'] > maxRed && d['wine_type'] == 'red') {
                   maxRed = k['count'];
               } else if (k['count'] > maxWhite && d['wine_type'] == 'white') {
                   maxWhite = k['count'];
               }
           }
        });

        if (!found) {
            toPush = d;
            toPush['count'] = 1;
            countedData.push(toPush);
        }
    });

    function sortByCount(a, b){
        var aCount = a['count'];
        var bCount = b['count'];
        return ((aCount < bCount) ? 1 : ((aCount > bCount) ? -1 : 0));
    }

    countedData.sort(sortByCount);

    x.domain([d3.min(countedData, function (d) {
        return d[xParam];
    }) - 1, d3.max(countedData, function (d) {
        return d[xParam];
    })]).nice();
    y.domain(d3.extent(countedData, function (d) {
        return d[yParam];
    })).nice();

    svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong>" + yParamPretty + ":</strong> <span style='color:" + color(d[colorParam]) + "'>" + d[yParam] + "</span><br/><strong>Count:</strong> <span style='color:" + color(d[colorParam]) + "'>" + d['count'] + "</span>";
        });

    svg.call(tip);

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
        .text(yParam);

    svg.selectAll(".dot")
        .data(countedData)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function (d) {
            if (d['wine_type'] == 'red') {
                val = (d['count'] / maxRed) * 20;
            } else if (d['wine_type'] == 'white') {
                val = (d['count'] / maxWhite) * 20;
            }

            if (val < 2) {
                return 2;
            }
            return val;
        })
        .attr("cx", function (d) {
            return x(d[xParam]);
        })
        .attr("cy", function (d) {
            return y(d[yParam]);
        })
        .style("stroke", function (d) {
            return color(d[colorParam]);
        })
        .style("fill", function (d) {
            return color(d[colorParam]);
        })
        .style('fill-opacity', .2)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

    legend.append("circle")
        .attr("class", "dot")
        .attr("cx", width - 10)
        .attr("cy", 10)
        .attr("r", 9)
        .style("fill", color)
        .style("stroke", color)
        .style("fill-opacity", .2);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) {
            if (d == 'white') {
                return 'White Wine';
            } else if (d == 'red') {
                return 'Red Wine';
            }
            return d;
        });
}