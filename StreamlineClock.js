var data_el;
var data_vv;
var data_kv;

var data_el_coords = [];
var data_vv_coords = [];
var data_kv_coords = [];

var scale = 150;

var dsv = d3.dsv(";", "text/plain");

dsv("data/30-1001-EL-short.csv", handleDataEl);

function handleDataEl(data) {
    data_el = data;
    
    dsv("data/30-1001-VV-short.csv", handleDataVv);
}

function handleDataVv(data) {
    data_vv = data;
    
    dsv("data/30-1001-KV-short.csv", handleDataKv);
}

function handleDataKv(data) {
    data_kv = data;
    
    calculateDataCoordinates();
}

function calculateDataCoordinates() {
    for (var i = 0; i < 24; i++) {
        
        var angle = ((2*Math.PI)/24) * i;
        
        data_el_coords.push({"x": Math.cos(angle) * Number(data_el[i].Energy) * scale, "y": Math.sin(angle) * Number(data_el[i].Energy * scale)});
    }

    drawClock();
}

function drawClock() {
    var svg = d3.select("#chart").append("svg")
                                .attr("width", 500)
                                .attr("height", 500)
                                .append("g")
                                .attr("transform", "translate(250,250) rotate(-90)");;

    var shape_el = svg.append("path")
                        .attr("d", pathFunction(data_el_coords))
                        .attr("stroke", "black")
                        .attr("stroke-width", 1)
                        .attr("fill", "none");
}

var pathFunction = d3.svg.line().x(function(d) { return d.x; })
                                .y(function(d) { return d.y; })
                                .interpolate("basis-closed");
