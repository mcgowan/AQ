/// <reference path='../libs/jquery-1.8.d.ts' />

class Level {
    hi: number;
    lo: number;
    name: string;
    style: string;
    description: string;

    constructor (lo: number, hi: number, name: string, style: string, description: string) {
        this.hi = hi;
        this.lo = lo;
        this.name = name;
        this.style = style;
        this.description = description;
    }
}

class QualityRange {
    levels: Level[];

    constructor () {
        this.levels = new Array();
        this.levels[0] = new Level(000, 000, 'Out of Range', 'out-of-range', '');
        this.levels[1] = new Level(000, 050, 'Good', 'good', '');
        this.levels[2] = new Level(051, 100, 'Moderate', 'moderate', 'Unusually sensitive people should consider reducing prolonged or heavy exertion.');
        this.levels[3] = new Level(101, 150, 'Unhealthy for Sensitive Groups', 'unhealthy-sensitive', 'People with heart or lung disease, older adults, and children should reduce prolonged or heavy exertion.');
        this.levels[4] = new Level(151, 200, 'Unhealthy', 'unhealthy', 'People with heart or lung disease, older adults, and children should avoid prolonged or heavy exertion; everyone else should reduce prolonged or heavy exertion.');
        this.levels[5] = new Level(201, 300, 'Very Unhealthy', 'very-unhealthy', 'People with heart or lung disease, older adults, and children should avoid all physical activity outdoors. Everyone else should avoid prolonged or heavy exertion.');
        this.levels[6] = new Level(301, 500, 'Hazardous', 'hazardous', 'Everyone should avoid all physical activity outdoors; people with heart or lung disease, older adults, and children should remain indoors and keep activity levels low.');
    }

    getLevel(score: number) {
        for (var i = 0; i < this.levels.length; i++) {
            if (score >= this.levels[i].lo && score <= this.levels[i].hi)
                return this.levels[i];
        }
        return this.levels[0];
    }
}

class Reading {
    score: number;
    level: Level;
    datetime: string;

    constructor (score: number, datetime: string) {
        this.score = score;
        this.datetime = datetime;
        this.level = qualityRange.getLevel(score);
    }
}

class Feed {
    url: string;
    range: QualityRange;

    constructor (url: string) {
        this.url = url;
        this.range = new QualityRange();
    }

    getFeed(): any {
        var deferred = $.Deferred();
        $.ajax({
            type: "GET",
            url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=1000&callback=?&q='
                + encodeURIComponent(this.url),
            dataType: 'json',
            success: deferred.resolve,
            error: deferred.reject
        });
        return deferred.promise();
    }

    getCurrentReading(callback) {
        this.getFeed().then(function (xml) {
            var values = xml.responseData.feed.entries;
            //+reading	[11-22-2012 12:00, PM2.5, 24.0, 72, Moderate (at 24-hour exposure at this level)]	Object, (Array)
            var reading = values[0].content.split(';');
            if (reading.length < 5)
                reading = values[0].content.split(','); //seems to alternate between ',' and ';'..!          
            callback(new Reading(reading[3], reading[0]));
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
        });

        return new Reading(-1, '');
    }

    //for debugging...
    setCurrentReading(score: number) {
        return new Reading(score, '');
    }
}

var qualityRange = new QualityRange();

