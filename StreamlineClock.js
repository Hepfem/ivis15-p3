var daily_data_el;
var daily_data_vv;
var daily_data_kv;

var overall_scale = 1.5;
var window_width = 1200;
var window_height = 768;

var dailyclock_cfg = {
                        cx: 0,
                        cy: 0,
                        scale: 30 * overall_scale,
                        scale_v: 600 * overall_scale,
                        offset: 120 * overall_scale,
                        offset_v: 1 * overall_scale
                    };

var color_el = "#FFB400";
var color_vv = "#FF1300";
var color_kv = "#04819E";

var svg;

var dsv = d3.dsv(";", "text/plain");

dsv("data/30-1001-EL-short.csv", handleDataEl);

function handleDataEl(data) {
    daily_data_el = data;
    
    dsv("data/30-1001-VV-short.csv", handleDataVv);
}

function handleDataVv(data) {
    daily_data_vv = data;
    
    dsv("data/30-1001-KV-short.csv", handleDataKv);
}

function handleDataKv(data) {
    daily_data_kv = data;
    
    //Draw the dashboard
    drawDashboard();
}

function drawDashboard() {
    //Create svg element and transform coordinate system to place (0,0) in the center
    svg = d3.select("#chart").append("svg")
                                    .attr("width", window_width)
                                    .attr("height", window_height)
                                    .append("g")
                                    .attr("transform", "translate(" + window_width/2 + "," + window_height/2 + ") rotate(-90)")
                                    .attr("id", "svg-element");

    //Create and draw a new clock with 24 increments for daily data
    var dailyClock = new StreamlineClock(daily_data_el, daily_data_vv, daily_data_kv, dailyclock_cfg);
    dailyClock.calculateDataCoordinates(0, 24);
    dailyClock.drawClock();
}
/*
    A streamline clock for three types of data.
*/
var StreamlineClock = function(data_el, data_vv, data_kv, cfg) {

    var data_el_coords = [];
    var data_vv_coords = [];
    var data_kv_coords = [];

    this.calculateDataCoordinates = function(start, increments) {
        for (var i = 0; i < increments; i++) {
            
            var angle = ((2*Math.PI)/increments) * i;
            
            data_el_coords.push({"x": Math.cos(angle) * ((Number(data_el[i].Energy) * cfg.scale) + cfg.offset), "y": Math.sin(angle) * ((Number(data_el[i+start].Energy) * cfg.scale) + cfg.offset)});

            //Water coordinates along the current angle's axis
            var vv_value_x = (Math.cos(angle) * (Number(data_vv[i+start].Volume) * cfg.scale_v));
            var vv_value_y = (Math.sin(angle) * (Number(data_vv[i+start].Volume) * cfg.scale_v));
            var kv_value_x = (Math.cos(angle) * (Number(data_kv[i+start].Volume) * cfg.scale_v));
            var kv_value_y = (Math.sin(angle) * (Number(data_kv[i+start].Volume) * cfg.scale_v));

            //Determine whether to apply positive or negative offset for water
            if (i > 0 && i < ((increments/4)+1)) { //Both x and y positive
                data_vv_coords.push({"x": data_el_coords[i].x + cfg.offset_v + vv_value_x, "y": data_el_coords[i].y + cfg.offset_v + vv_value_y});
                data_kv_coords.push({"x": data_vv_coords[i].x + cfg.offset_v + kv_value_x, "y": data_vv_coords[i].y + cfg.offset_v + kv_value_y});
            } else if (i >= 7 && i < ((increments/2)+1)) { //Negative x, positive y
                data_vv_coords.push({"x": data_el_coords[i].x - cfg.offset_v + vv_value_x, "y": data_el_coords[i].y + cfg.offset_v + vv_value_y});
                data_kv_coords.push({"x": data_vv_coords[i].x - cfg.offset_v + kv_value_x, "y": data_vv_coords[i].y + cfg.offset_v + kv_value_y});
            } else if ( i >= ((increments/2)+1) && i < (((increments/4)*3)+1)) { //Both x and y negative
                data_vv_coords.push({"x": data_el_coords[i].x - cfg.offset_v + vv_value_x, "y": data_el_coords[i].y - cfg.offset_v + vv_value_y});
                data_kv_coords.push({"x": data_vv_coords[i].x - cfg.offset_v + kv_value_x, "y": data_vv_coords[i].y - cfg.offset_v + kv_value_y});
            } else { //Positive x, negative y
                data_vv_coords.push({"x": data_el_coords[i].x + cfg.offset_v + vv_value_x, "y": data_el_coords[i].y - cfg.offset_v + vv_value_y});
                data_kv_coords.push({"x": data_vv_coords[i].x + cfg.offset_v + kv_value_x, "y": data_vv_coords[i].y - cfg.offset_v + kv_value_y});
            }
        }
    }

    this.drawClock = function() {
        var clock = svg.append("g")
                            .attr("transform", "translate(" + cfg.cy + "," + cfg.cx + ")")
        var shape_kv = clock.append("path")
                            .attr("d", pathFunction(data_kv_coords))
                            .attr("stroke", color_kv)
                            .attr("stroke-width", 1)
                            .attr("fill", color_kv)
                            .attr("id", "kv-shape");     

        var shape_vv = clock.append("path")
                            .attr("d", pathFunction(data_vv_coords))
                            .attr("stroke", color_vv)
                            .attr("stroke-width", 1)
                            .attr("fill", color_vv)
                            .attr("id", "vv-shape");   

        var shape_el = clock.append("path")
                            .attr("d", pathFunction(data_el_coords))
                            .attr("stroke", color_el)
                            .attr("stroke-width", 1)
                            .attr("fill", color_el)
                            .attr("id", "el-shape");

        var center = clock.append("circle")
                            .attr("cx", 0)
                            .attr("cy", 0)
                            .attr("r", cfg.offset)
                            .attr("stroke", "black")
                            .attr("fill", "black")
                            .attr("id", "center-shape");
    }

    var pathFunction = d3.svg.line().x(function(d) { return d.x; })
                                    .y(function(d) { return d.y; })
                                    .interpolate("basis-closed");
}
