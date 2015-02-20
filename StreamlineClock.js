var data_el;
var data_vv;
var data_kv;

var data_el_coords;
var data_vv_coords;
var data_kv_coords;

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

}
