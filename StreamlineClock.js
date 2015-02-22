var data_el;
var data_vv;
var data_kv;

var data_el_coords = [];
var data_vv_coords = [];
var data_kv_coords = [];

var scale = 50;
var scale_v = 500;
var offset = 120;
var offset_v = 12;

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
        
        data_el_coords.push({"x": Math.cos(angle) * ((Number(data_el[i].Energy) * scale) + offset), "y": Math.sin(angle) * ((Number(data_el[i].Energy) * scale) + offset)});

        //Determine whether to apply positive or negative offset for warm water
        if (i > 0 && i < 7) { //Both x and y positive
            data_vv_coords.push({"x": data_el_coords[i].x + offset_v + (Math.cos(angle) * (Number(data_vv[i].Volume) * scale_v)), "y": data_el_coords[i].y + offset_v + (Math.cos(angle) * (Number(data_vv[i].Volume) * scale_v))});
        } else if (i >= 7 && i < 13) { //Negative x, positive y
            data_vv_coords.push({"x": data_el_coords[i].x - offset_v + (Math.cos(angle) * (Number(data_vv[i].Volume) * scale_v)), "y": data_el_coords[i].y + offset_v + (Math.cos(angle) * (Number(data_vv[i].Volume) * scale_v))});
        } else if ( i >= 13 && i < 19) { //Both x and y negative
            data_vv_coords.push({"x": data_el_coords[i].x - offset_v + (Math.cos(angle) * (Number(data_vv[i].Volume) * scale_v)), "y": data_el_coords[i].y - offset_v + (Math.cos(angle) * (Number(data_vv[i].Volume) * scale_v))});
        } else { //Positive x, negative y
            data_vv_coords.push({"x": data_el_coords[i].x + offset_v + (Math.cos(angle) * (Number(data_vv[i].Volume) * scale_v)), "y": data_el_coords[i].y - offset_v + (Math.cos(angle) * (Number(data_vv[i].Volume) * scale_v))});
        }
    }

    drawClock();
}

function drawClock() {
    var svg = d3.select("#chart").append("svg")
                                .attr("width", 500)
                                .attr("height", 500)
                                .append("g")
                                .attr("transform", "translate(250,250) rotate(-90)");;

    var shape_vv = svg.append("path")
                        .attr("d", pathFunction(data_vv_coords))
                        .attr("stroke", "red")
                        .attr("stroke-width", 1)
                        .attr("fill", "red");    

    var shape_el = svg.append("path")
                        .attr("d", pathFunction(data_el_coords))
                        .attr("stroke", "yellow")
                        .attr("stroke-width", 1)
                        .attr("fill", "yellow");

    var center = svg.append("circle")
                        .attr("cx", 0)
                        .attr("cy", 0)
                        .attr("r", offset)
                        .attr("stroke", "white")
                        .attr("fill", "white");
}

var pathFunction = d3.svg.line().x(function(d) { return d.x; })
                                .y(function(d) { return d.y; })
                                .interpolate("basis-closed");
