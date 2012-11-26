function clearDisplay() {
    $('#score').removeClass('good moderate unhealthy-sensitive unhealthy very-unhealthy hazardous');
}
function updateDisplay(reading) {
    clearDisplay();
    $('#datetime').html(reading.datetime);
    $('#score').html(reading.score.toString());
    $('#score').addClass(reading.level.style);
    $('#level').html(reading.level.name);
    $('#description').html(reading.level.description);
}
function debug(score) {
    var reading = feed.setCurrentReading(score);
    updateDisplay(reading);
}
function update() {
    feed.getCurrentReading(updateDisplay);
}
function main() {
    feed.getCurrentReading(updateDisplay);
}
window.onload = function () {
    main();
};
var feed = new Feed('http://www.beijingaqifeed.com/shanghaiaqi/shanghaiairrss.xml');
//@ sourceMappingURL=app.js.map
