var readingTime = 0;
//set the ignore domain not to be read
var setIgnoreDomain = function (domain, ignore) {
    if (ignore === undefined) {
        ignore = true;
    }
    if (ignore) {
        if (IGNORED_DOMAINS.indexOf(domain) < 0) {
            IGNORED_DOMAINS.push(domain);
            _storeIgnoredDomains();
        }
    } else {
        var idx = IGNORED_DOMAINS.indexOf(domain);
        if (idx >= 0) {
            IGNORED_DOMAINS.splice(idx, 1);
            _storeIgnoredDomains();
        }
    }
};
//calculate the online activity pie chart data
var mainPieChartData = function () {
    var data = [];
    var categories = categoryData();
    var totalTime = 0;
    console.log(categoryData());
    $.each(MAIN_CATEGORY_NAMES, function (i, name) {
        if (categories[name]) {
            totalTime += categories[name]['time'];
        }
    });
    $.each(MAIN_CATEGORY_NAMES, function (i, name) {
        var cat = categories[name];
        if (cat === undefined) {
            cat = { time: 0 }
        }
        
        if (totalTime == 0) {
            data[data.length] = { key: name, y: (1 / 5) * 100 };
        } else {
            if (cat == 'Reading' || cat == 'reading') {
                data[data.length] = { key: name, y: (readingTime / totalTime) * 100};
            }
            else {
                data[data.length] = { key: name, y: (cat['time'] / totalTime) * 100 };
            }
        }
    });
    return data;
}; // main pieChartData

//calculate the reading activity pie chart
var pieChartData = function () {
    var data = [];
    var categories = categoryData();
    console.log(categoryData());
    var totalTime = 0;
    $.each(CATEGORY_NAMES, function (i, name) {
        if (categories[name]) {
            totalTime += categories[name]['time'];
        }
    });
    readingTime = totalTime;
    $.each(CATEGORY_NAMES, function (i, name) {
        var cat = categories[name];
        if (cat === undefined) {
            cat = { time: 0 }
        }
        if (totalTime == 0) {
            data[data.length] = { key: name, y: (1 / 6) * 100 };
        }
        else {
            data[data.length] = { key: name, y: (cat['time'] / totalTime) * 100 };
        }
    });
    return data;
}; // pieChartData

var formatTime = function (ms) {
    var m = ms / 1000 / 60;
    if (isNaN(m)) {
        return ms;
    }
    var h = Math.round(m / 60);
    m = Math.round(m - h * 60);
    if (m < 0) { m = 0; }
    if (h > 0) {
        return '' + h + 'h ' + m + 'm';
    } else {
        return '' + m + 'm';
    }
}
//build reading activity table
var buildActivityTable = function () {
    $.each(CATEGORY_NAMES, function (i, cat) {
        var category = categoryData()[cat];
        if (category === undefined) {
            category = {
                name: cat,
                domains: {}
            };
        }
        var name = category.name;
        if (name == 'SciTech') {
            name = 'Science & Technology';
        }
        $('table#cat-source-table tbody').append(
          '<tr style="background-color:#f9f9f9"><td><b>'
          + category.name + '</b></td><td></td><td></tr></tr>');
        var top1 = [null, 0];
        var top2 = [null, 0];
        var top3 = [null, 0];
        $.each(category.domains, function (url, time) {
            if (time && time >= top1[1]) {
                top3 = top2;
                top2 = top1;
                top1 = [url, time];
            } else if (time && time >= top2[1]) {
                top3 = top2;
                top2 = [url, time];
            } else if (time && time >= top3[1]) {
                top3 = [url, time];
            }
        });
        if (top1[0] !== null) {
            $('table#cat-source-table tbody').append(
              '<tr><td>' + top1[0] + '</td><td><span alt="ignore ' + top1[0] + '" title="ignore ' + top1[0] + '" data-domain="' + top1[0] + '" class="glyphicon glyphicon-ban-circle ignore-domain"></span></td><td>'
               + formatTime(top1[1]) + '</td></tr>');
        }
        if (top2[0] !== null) {
            $('table#cat-source-table tbody').append(
              '<tr><td>' + top2[0] + '</td><td><span alt="ignore ' + top2[0] + '" title="ignore ' + top2[0] + '" class="glyphicon glyphicon-ban-circle ignore-domain" data-domain="' + top2[0] + '"></span></td><td>'
              + formatTime(top2[1]) + '</td></tr>');
        }
        if (top3[0] !== null) {
            $('table#cat-source-table tbody').append(
              '<tr><td>' + top3[0] + '</td><td><span alt="ignore ' + top3[0] + '" title="ignore ' + top3[0] + '" class="glyphicon glyphicon-ban-circle ignore-domain" data-domain="' + top3[0] + '"></span></td><td>'
              + formatTime(top3[1]) + '</td></tr>');
        }
        $('table#cat-source-table tbody').append(
          '<tr><td></td><td></td><td></td></tr>');
    });
}; // buildActivityTable
//build online activity table
var buildActivityTable2 = function () {
    $.each(MAIN_CATEGORY_NAMES, function (i, cat) {
        var category = categoryData()[cat];
        if (category === undefined) {
            category = {
                name: cat,
                domains: {}
            };
        }
        var name = category.name;
        $('table#cat-source-table2 tbody').append(
          '<tr style="background-color:#f9f9f9"><td><b>'
          + category.name + '</b></td><td></td><td></tr></tr>');
        var top1 = [null, 0];
        var top2 = [null, 0];
        var top3 = [null, 0];
        $.each(category.domains, function (url, time) {
            if (time && time >= top1[1]) {
                top3 = top2;
                top2 = top1;
                top1 = [url, time];
            } else if (time && time >= top2[1]) {
                top3 = top2;
                top2 = [url, time];
            } else if (time && time >= top3[1]) {
                top3 = [url, time];
            }
        });
        if (top1[0] !== null) {
            $('table#cat-source-table2 tbody').append(
              '<tr><td>' + top1[0] + '</td><td><span alt="ignore ' + top1[0] + '" title="ignore ' + top1[0] + '" data-domain="' + top1[0] + '" class="glyphicon glyphicon-ban-circle ignore-domain"></span></td><td>'
               + formatTime(top1[1]) + '</td></tr>');
        }
        if (top2[0] !== null) {
            $('table#cat-source-table2 tbody').append(
              '<tr><td>' + top2[0] + '</td><td><span alt="ignore ' + top2[0] + '" title="ignore ' + top2[0] + '" class="glyphicon glyphicon-ban-circle ignore-domain" data-domain="' + top2[0] + '"></span></td><td>'
              + formatTime(top2[1]) + '</td></tr>');
        }
        if (top3[0] !== null) {
            $('table#cat-source-table2 tbody').append(
              '<tr><td>' + top3[0] + '</td><td><span alt="ignore ' + top3[0] + '" title="ignore ' + top3[0] + '" class="glyphicon glyphicon-ban-circle ignore-domain" data-domain="' + top3[0] + '"></span></td><td>'
              + formatTime(top3[1]) + '</td></tr>');
        }
        $('table#cat-source-table2 tbody').append(
          '<tr><td></td><td></td><td></td></tr>');
    });
};


var showIgnoredDomains = function () {
    var table = $('table#ignored-domains-table');
    if (IGNORED_DOMAINS.length > 0) {
        table.html('');
    }
    $.each(IGNORED_DOMAINS, function (i, d) {
        table.append('<tr><td><span alt="Stop ignoring" title="Stop ignoring" class="glyphicon glyphicon-ok-circle remove-ignored-domain"></span><td>' + d + '</td></tr>');
    });
};

var showSettings = function () {
    showIgnoredDomains();
};


$('table#ignored-domains-table').on('click', '.remove-ignored-domain',
        function (evt) {
            var el = $(this);
            var domain = el.closest('td').next().html();
            setIgnoreDomain(domain, false);
            el.closest('tr').remove();
        });
