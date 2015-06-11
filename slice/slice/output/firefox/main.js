kango.ui.browserButton.setPopup({
    url: 'popup.html',
    width: 420,
    height: 520
})

var imageURL = chrome.extension.getURL('chart.png')
var currentURL = null;
var currentURLStartTime = null;

if (URLMeta == null) {
    URLMeta = {};
    kango.storage.setItem('URL_meta', URLMeta);
} else {
    cleanURLMeta();
}
var shopping = [
    'amazon',
    'overstock',
    '6pm',
    'newegg',
]
var email = [
    'gmail',
    'mail.google.com',
    
]
var streaming = [
    'netflix',
    'hulu',
    'pandora',
    'veoh',
    'crackle',
    'blinkx',
    'ustream',
    'youtube',
    'spotify',
];
var social = [
    'facebook',
    'twitter',
    'reddit',
    'instagram',
    'myspace',
    'bloglovin',
    'tumblr',
    'blogster',
    'foursquare',
    'goodreads',
    'plus.google',
    'orkut',
    'linkedin',
    'livejournal',
    'pinterest',
    'stumbleupon',
    'xanga',
    'yelp',
    'soundcloud',
    'weheartit',
    'spring.me',
    'flickr',
    'vine',
    'bebo',
    'friendster',
    'classmates',
    'meetup',
    'flixster',
    'imgur',
    '9gag',
];

var fetchUrlInfo = function(url) {
    //serviceURL = 'http://calm-thicket-4369.herokuapp.com/categorize.json';
    //serviceURL = 'http://127.0.0.1:5000/categorize';
    //serviceURL = 'http://slimformation.knilab.com/categorize';
    serviceURL = 'http://slimformation.knilab.com/categorize';
    details = {
        url: serviceURL + "?url=" + url,
        contentType: 'json'
    };

    var found = false;

    kango.xhr.send(details, function(data) {
        if ((data.status == 200 || data.status == 202) && data.response != null) {

            for (var i = 0; i < social.length && !found; i++) {
                if (url.indexOf(social[i]) > -1) {
                    found = true;
                    var info = {
                        category: ['social'],
                        domain: data.response['domain'],
                        url: data.response['url'],
                        readingScore: data.response['readingScore']
                    };
                }
            }
            for (var i = 0; i < streaming.length && !found; i++) {
                if (url.indexOf(streaming[i]) > -1) {
                    found = true;
                    var info = {
                        category: ['streaming'],
                        domain: data.response['domain'],
                        url: data.response['url'],
                        readingScore: data.response['readingScore']
                    };
                }
            }
            for (var i = 0; i < shopping.length && !found; i++) {
                if (url.indexOf(shopping[i]) > -1) {
                    found = true;
                    var info = {
                        category: ['shopping'],
                        domain: data.response['domain'],
                        url: data.response['url'],
                        readingScore: data.response['readingScore']
                    };
                }
            }
            for (var i = 0; i < email.length && !found; i++) {
                if (url.indexOf(email[i]) > -1) {
                    found = true;
                    var info = {
                        category: ['email'],
                        domain: data.response['domain'],
                        url: data.response['url'],
                        readingScore: data.response['readingScore']
                    };
                }
            }
            if (!found) {
                var info = {
                    category: data.response['category'],
                    domain: data.response['domain'],
                    url: data.response['url'],
                    readingScore: data.response['readingScore']
                };
            }
            var meta = {
                category: info['category'],
                domain: info['domain'],
                url: info['url'],
                readingScore: info['readingScore'],
                totalTime: 0,
                dailyTimes: {}
            };
            console.log(meta);
            console.log(info);
            if (URLMeta[url] != null) {
                meta['totalTime'] = URLMeta[url]['totalTime'];
            }
            URLMeta[url] = meta;
            kango.storage.setItem('URL_meta', URLMeta);
        } else {
            console.log('Error: could not retrieve URL info at: ' + serviceURL + ' for URL: ' + url);
        }
    });
}


var newURL = function(event, url) {
    var time = new Date();
    IGNORED_DOMAINS = _retrieveIgnoredDomains(); // refresh in case of changes
    // via UI
    if (currentURL !== null && !ignore(currentURL)) {
        var delta = time - currentURLStartTime;
        var meta = URLMeta[currentURL];
        if (meta != null) {
            meta['totalTime'] = meta['totalTime'] + delta;
            var dt = dateFormat(new Date());
            if (meta['dailyTimes'] === undefined) {
                meta['dailyTimes'] = {};
            }
            if (meta['dailyTimes'][dt] === undefined) {
                meta['dailyTimes'][dt] = 0;
            }
            meta['dailyTimes'][dt] += delta;
            URLMeta[currentURL] = meta;
            kango.storage.setItem('URL_meta', URLMeta);
        }
    }
    currentURLStartTime = time;
    if (event != null) {
        currentURL = event.target.getUrl();
    } else if (url != null) {
        currentURL = url;
    }
    console.log('new url: ' + currentURL);
    if (currentURL !== null && !ignore(currentURL)) {
        if (!URLMeta[currentURL]) {
            fetchUrlInfo(currentURL);
        }
    }
}

kango.browser.addEventListener(kango.browser.event.TAB_CHANGED, newURL);
// binding to DOCUMENT_COMPLETE instead of BEFORE_NAVIGATE since we want
// newURL to get the newly loaded URL 
kango.browser.addEventListener(kango.browser.event.DOCUMENT_COMPLETE, newURL);

var updateURL = function() {
    var name = kango.browser.getName();
    if (name == 'chrome') {
        var tabs = chrome.tabs;
        if (tabs) {
            tabs.query({
                active: true,
                lastFocusedWindow: true
            }, function(array_of_Tabs) {
                if (array_of_Tabs.length > 0) {
                    var tab = array_of_Tabs[0];
                    if (tab) {
                        var url = tab.url;
                        if (url != currentURL) {
                            newURL(null, url);
                        }
                    }
                }
            });
        } // if tabs
    } else if (name == 'firefox') {
        var currentWindow = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator).getMostRecentWindow("navigator:browser");
        var currBrowser = currentWindow.getBrowser();
        var currURL = currBrowser.currentURI.spec;
        if (currURL != currentURL) {
            newURL(null, url);
        }
    }
};

// updateURL every 10 seconds -- in case the user has multiple browser
// instances open, since there does not seem to be an event we can bind to
// for switching between browser instances
setInterval(updateURL, 10000);
