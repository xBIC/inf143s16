var margin = {top: 40, right: 10, bottom: 10, left: 10},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var color = d3.scale.category20c();

var treemap = d3.layout.treemap()
    .size([width, height])
    .sticky(true)
    .value(function(d) { return d.size; });

var div = d3.select("body").append("div")
    .style("position", "relative")
    .style("width", (width + margin.left + margin.right) + "px")
    .style("height", (height + margin.top + margin.bottom) + "px")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px");

d3.csv(fileName, function(error, root) {
    if (error) throw error;

    root = formatData(root);

    var node = div.datum(root).selectAll(".node")
        .data(treemap.nodes)
        .enter().append("div")
        .attr("class", "node")
        .call(position)
        .style("background", function(d) { return d.children ? color(d.name) : null; })
        .text(function(d) { return d.children ? null : d.name; });

    d3.selectAll("input").on("change", function change() {
        var value = this.value === "count"
            ? function() { return 1; }
            : function(d) { return d.size; };

        node
            .data(treemap.value(value).nodes)
            .transition()
            .duration(1500)
            .call(position);
    });
});

function position() {
    this.style("left", function(d) { return d.x + "px"; })
        .style("top", function(d) { return d.y + "px"; })
        .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
        .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}

function position2(node) {
    node.style("left", function(d) { return d.x + "px"; })
        .style("top", function(d) { return d.y + "px"; })
        .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
        .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}

function formatData(data) {
    formattedData = {"name" : "CSCW Data", "children" : []};
    data.forEach(function (d, index) {
        for (var key in d) {
            if (d[key] == "" || d[key] == undefined) {
                continue;
            }
            entry = {"name" : d[key] + ' - ' + key, "size" : d[key]};

            pos = schoolArrayPosition(key, formattedData.children);

            if (pos !== false) {
                formattedData.children[pos].children.push(entry);
            } else {
                formattedData.children.push({"name" : key, "children" : [entry]});
            }
        }
    });

    return formattedData;
}

function schoolArrayPosition(name, schools) {
    pos = false;
    schools.forEach(function (school, index) {
        if (school.name == name) {
            pos = index;
        }
    });

    return pos;
}