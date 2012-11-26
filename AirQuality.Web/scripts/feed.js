var Level = (function () {
    function Level(lo, hi, name, style, description) {
        this.hi = hi;
        this.lo = lo;
        this.name = name;
        this.style = style;
        this.description = description;
    }
    return Level;
})();
var QualityRange = (function () {
    function QualityRange() {
        this.levels = new Array();
        this.levels[0] = new Level(0, 0, 'Out of Range', 'out-of-range', '');
        this.levels[1] = new Level(0, 50, 'Good', 'good', '');
        this.levels[2] = new Level(51, 100, 'Moderate', 'moderate', 'Unusually sensitive people should consider reducing prolonged or heavy exertion.');
        this.levels[3] = new Level(101, 150, 'Unhealthy for Sensitive Groups', 'unhealthy-sensitive', 'People with heart or lung disease, older adults, and children should reduce prolonged or heavy exertion.');
        this.levels[4] = new Level(151, 200, 'Unhealthy', 'unhealthy', 'People with heart or lung disease, older adults, and children should avoid prolonged or heavy exertion; everyone else should reduce prolonged or heavy exertion.');
        this.levels[5] = new Level(201, 300, 'Very Unhealthy', 'very-unhealthy', 'People with heart or lung disease, older adults, and children should avoid all physical activity outdoors. Everyone else should avoid prolonged or heavy exertion.');
        this.levels[6] = new Level(301, 500, 'Hazardous', 'hazardous', 'Everyone should avoid all physical activity outdoors; people with heart or lung disease, older adults, and children should remain indoors and keep activity levels low.');
    }
    QualityRange.prototype.getLevel = function (score) {
        for(var i = 0; i < this.levels.length; i++) {
            if(score >= this.levels[i].lo && score <= this.levels[i].hi) {
                return this.levels[i];
            }
        }
        return this.levels[0];
    };
    return QualityRange;
})();
var Reading = (function () {
    function Reading(score, datetime) {
        this.score = score;
        this.datetime = datetime;
        this.level = qualityRange.getLevel(score);
    }
    return Reading;
})();
var Feed = (function () {
    function Feed(url) {
        this.url = url;
        this.range = new QualityRange();
    }
    Feed.prototype.getFeed = function () {
        var deferred = $.Deferred();
        $.ajax({
            type: "GET",
            url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=1000&callback=?&q=' + encodeURIComponent(this.url),
            dataType: 'json',
            success: deferred.resolve,
            error: deferred.reject
        });
        return deferred.promise();
    };
    Feed.prototype.getCurrentReading = function (callback) {
        this.getFeed().then(function (xml) {
            var values = xml.responseData.feed.entries;
            var reading = values[0].content.split(';');
            if(reading.length < 5) {
                reading = values[0].content.split(',');
            }
            callback(new Reading(reading[3], reading[0]));
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
        });
        return new Reading(-1, '');
    };
    Feed.prototype.setCurrentReading = function (score) {
        return new Reading(score, '');
    };
    return Feed;
})();
var qualityRange = new QualityRange();
//@ sourceMappingURL=feed.js.map
