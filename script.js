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
                        offset_v: 1 * overall_scale,
                        color_el: "#FFB400",
                        color_vv: "#FF1300",
                        color_kv: "#04819E",
                        color_center: "#111111"
                    };

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
    var svg = d3.select("#chart").append("svg")
                                    .attr("width", window_width)
                                    .attr("height", window_height)
                                    .append("g")
                                    .attr("transform", "translate(" + window_width/2 + "," + window_height/2 + ") rotate(-90)")
                                    .attr("id", "svg-element");

    //Create and draw a new clock with 24 increments for daily data
    var dailyClock = new StreamlineClock(svg, daily_data_el, daily_data_vv, daily_data_kv, dailyclock_cfg);
    dailyClock.calculateDataCoordinates(0, 24);
    dailyClock.drawClock();
}
