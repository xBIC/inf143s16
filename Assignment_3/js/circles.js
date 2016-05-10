/*
 Code citation: http://bl.ocks.org/mbostock/3cba6ac2fac09e5483bf6c1fade733be
 */

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var format = d3.format(",d");

var round = d3.format(".3r");

var pack = d3.pack()
    .size([width - 2, height - 2])
    .padding(3);

d3.csv(fileName, function(error, data) {
    if (error) throw error;

    data = formatData(data);

    var root = d3.hierarchy(data)
        .each(function(d) { if (/^other[0-9]+$/.test(d.data.name)) d.data.name = null; })
        .sum(function(d) { return d.size; })
        .sort(function(a, b) { return b.value - a.value; });

    pack(root);

    var node = svg.select("g")
        .selectAll("g")
        .data(root.descendants())
        .enter().append("g")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .attr("class", function(d) { return "node" + (!d.children ? " node--leaf" : d.depth ? "" : " node--root"); })
        .each(function(d) { d.node = this; })
        .on("mouseover", hovered(true))
        .on("mouseout", hovered(false));

    node.append("circle")
        .attr("id", function(d, i) { return "node-" + i; })
        .attr("r", function(d) { return d.r; });

    var leaf = node.filter(function(d) { return !d.children; })
        .classed("node--leaf", true)
        .filter(function(d) { return d.data.name; });

    leaf.append("clipPath")
        .attr("id", function(d, i) { return "clip-" + i; })
        .append("use")
        .attr("xlink:href", function(d, i) { return "#node-" + i + ""; });

    leaf.append("text")
        .style("font-size", function(d) { return Math.sqrt(d.r) * 2 + "px"; })
        .attr("clip-path", function(d, i) { return "url(#clip-" + i + ")"; })
        .selectAll("tspan")
        .data(function(d) { return d.data.name.split(/\s+/g); })
        .enter().append("tspan")
        .attr("x", 0)
        .attr("y", function(d, i, nodes) { return 1.3 + (i - nodes.length / 2 - 0.5) + "em"; })
        .text(function(d) { return d; });

    node.append("title")
        .text(function(d) {
            if (d.hasOwnProperty('children')) {
                return d.data.name + "\nChildren : " + d.children.length + "\nTotal Impact : " + format(d.value) + "\nAverage Impact : " + round(d.value / d.children.length);
            } else {
                return (d.data.name || "N/A") + "\nImpact : " + format(d.value);
            }
        });
});

function hovered(hover) {
    return function(d) {
        d3.selectAll(d.ancestors()
            .map(function(d) { return d.node; }))
            .classed("node--hover", hover);
    };
}