/*
    A streamline clock for three types of data.
*/
var StreamlineClock = function(svg, data_el, data_vv, data_kv, cfg) {

    var data_el_coords = [];
    var data_vv_coords = [];
    var data_kv_coords = [];
	
	var shape_el;
	var shape_vv;
	var shape_kv;
	var text_date;
	
	var current_day;

    this.calculateDataCoordinates = function(start, increments) {
		current_day = start;
		
		//Make sure coords arrays are empty before pushing new things
		data_el_coords = [];
		data_vv_coords = [];
		data_kv_coords = [];
		
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
        shape_kv = clock.append("path")
                            .attr("d", pathFunction(data_kv_coords))
                            .attr("stroke", cfg.color_kv)
                            .attr("stroke-width", 1)
                            .attr("fill", cfg.color_kv)
                            .attr("id", "kv-shape");     

        shape_vv = clock.append("path")
                            .attr("d", pathFunction(data_vv_coords))
                            .attr("stroke", cfg.color_vv)
                            .attr("stroke-width", 1)
                            .attr("fill", cfg.color_vv)
                            .attr("id", "vv-shape");   

        shape_el = clock.append("path")
                            .attr("d", pathFunction(data_el_coords))
                            .attr("stroke", cfg.color_el)
                            .attr("stroke-width", 1)
                            .attr("fill", cfg.color_el)
                            .attr("id", "el-shape");

        var center = clock.append("circle")
                            .attr("cx", 0)
                            .attr("cy", 0)
                            .attr("r", cfg.offset)
                            .attr("stroke", cfg.color_center)
                            .attr("fill", cfg.color_center)
                            .attr("id", "center-shape");
							
		var divider = clock.append("line")
							.attr("x1", cfg.offset-(cfg.offset/1.4))
							.attr("y1", 0)
							.attr("x2", -cfg.offset+(cfg.offset/1.4))
							.attr("y2", 0)
							.attr("stroke", cfg.color_center_details)
							.attr("stroke-width", 7);
							
		var text_am = clock.append("text")
							.attr("x", cfg.offset-(cfg.offset/1.5))
							.attr("y", (cfg.offset/16))
							.text("am")
							.attr("text-anchor", "middle")
							.attr("font-family", "sans-serif")
							.attr("font-size", (cfg.offset/3.5) + "px")
							.attr("fill", cfg.color_center_details)
							.attr("transform", "rotate(90)");
							
		var text_pm = clock.append("text")
							.attr("x", -cfg.offset+(cfg.offset/1.5))
							.attr("y", (cfg.offset/16))
							.text("pm")
							.attr("text-anchor", "middle")
							.attr("font-family", "sans-serif")
							.attr("font-size", (cfg.offset/3.5) + "px")
							.attr("fill", cfg.color_center_details)
							.attr("transform", "rotate(90)");
							
		text_date = clock.append("text")
							.attr("x", window_width/2-20)
							.attr("y", window_height/2-30)
							.text(data_el[current_day].Date)
							.attr("text-anchor", "end")
							.attr("font-family", "sans-serif")
							.attr("font-size", (cfg.offset/3.2) + "px")
							.attr("fill", cfg.color_center_details)
							.attr("transform", "rotate(90)");
    }
	
	this.update = function() {
		shape_kv.transition().duration(1000).attr("d", pathFunction(data_kv_coords));     
        shape_vv.transition().duration(1000).attr("d", pathFunction(data_vv_coords));
        shape_el.transition().duration(1000).attr("d", pathFunction(data_el_coords));
		text_date.text(data_el[current_day].Date);		
	}

    var pathFunction = d3.svg.line().x(function(d) { return d.x; })
                                    .y(function(d) { return d.y; })
                                    .interpolate("basis-closed");
}
