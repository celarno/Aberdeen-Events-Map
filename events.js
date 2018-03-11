var lati, long;
var map;
var data;
var events;
var entries;
var marker;
var markers = [];
var today = moment();

var style = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ebe3cd"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#523735"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#f5f1e6"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#c9b2a6"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#dcd2be"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ae9e90"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dfd2ae"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dfd2ae"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#93817c"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#a5b076"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#447530"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f1e6"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#fdfcf8"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f8c967"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#e9bc62"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e98d58"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#db8555"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#806b63"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dfd2ae"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#8f7d77"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ebe3cd"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dfd2ae"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#b9d3c2"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#92998d"
            }
        ]
    }
];

function main(){
    fb_start();
    initMap();
    getData();
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 57.145, lng: -2.10},
        zoom: 13,
        styles: style
    });
    console.log('map loaded ... ');
}

function setMarker(title, cat, scat, website, events, location){
    console.log('setting marker ...');

    var header = "<h5>" + cat + " - " + scat + "</h5><h2>" + title + "</h2><p>" + website + "</p>";
    lati = location.split(',')[0];
    long = location.split(',')[1];
    var close = '<a href="#" style="color:black;padding:0 3px;' +
        'text-decoration:none;float:right;" onclick="$(\'#info\').hide();"><i class="fas fa-times"></i></a>';
    var marker1 = new google.maps.LatLng(lati, long);

    var mcolor = "red";
    if(cat === "Entertainment") {   mcolor = 'red';}
    if(cat === "Dining") {          mcolor = 'purple';}
    if(cat === "Accommodation") {   mcolor = 'yellow';}
    if(cat === "Sports") {          mcolor = 'orange';}
    if(cat === "Culture") {         mcolor = 'green';}
    if(cat === "Professional") {    mcolor = 'grey';}

    colorCat(cat,mcolor);

    marker = new google.maps.Marker({
        position: marker1,
        title: title,
        map: map,
        icon: pinSymbol(mcolor),
        opacity: 1
    });

    marker.addListener('click', function () {
        var e = [];
        $(events).each(function() {
            e.push([this.date.format("DD/MM/YYYY") + " - " + this.time, this.n, this.desc].join(""));
        });
        e = e.join('<br>');

        $("#info").html(close + header + e).show();
        var h = $(document).height() - $(".navi").height();

        $("#info").css("height", h);
        var isMobile = window.matchMedia("only screen and (max-width: 768px)");
        if (isMobile.matches) {
            $("#info").css("width", "100%");
        }
    });

    if(events.length <1) {marker.opacity=0.5;}
    var test = new createMarkers(cat,scat,marker,events);
    markers.push(test);

}

function fb_start() {
    FB.init({
        appId: '541885672846625',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v2.12'
    });
    console.log('fb initialized ...');
}

var fb_events = function(page, callback){
    var token = '541885672846625|L29fSufvR0PLhEv2XI9DL76HdqM';
    FB.api(page, 'GET', {access_token: token},
        function(response) {
            if (response.data) {
                data = response.data;
                callback(data.slice(0,5)); // just take first 5 events
            } else { console.log("no events! " + page); }
        });
};

function getData(){
    var spreadsheetID = "1laOX2_2aeSDz3H8lP7U8W_ohgeK39Ye1J3X-Q-_hsDU";
    var url = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/od6/public/values?alt=json";

    $.getJSON(url, function(data) {
        entries = data.feed.entry;
        entries = $.grep(entries, function(n) {
            var x = n.gsx$location.$t;
            var y = n.gsx$facebook.$t;
            return x.length > 0 && y.length > 0;
        });

        fillMap(entries);
    });
}

function fillMap(e){
    $(e).each(function(){
       var t = new URL(this.gsx$facebook.$t).pathname;
       this.gsx$facebook.$t = t + 'events';
       var fb = this.gsx$facebook.$t;
       var title = this.gsx$name.$t;
       var loc = this.gsx$location.$t;
       var cat = this.gsx$cat.$t;
       var scat = this.gsx$subcat.$t;
       var website = "<a href=" + this.gsx$website.$t + " target=\"_blank\">" + this.gsx$website.$t + "</a>";

       fb_events(fb, function(data) {
           var events = [];
           var i = 0;
           $(data).each(function(){
               var date = data[i].start_time;
               var time = date.substring(11,16);
               //date = date.substring(0,10);
               date = moment(date);

               var x = '$(\'#event_desc_' + i + '\').toggle();';
               var n  = '<div style="font-weight:bold;" class="event_names" id="event_name_' + i +
                   '" onclick="' + x + '">' + data[i].name + ' <i class="fas fa-caret-down"></i></div>';
               var desc = '<div id="event_desc_' + i + '" class="event_desc" style="display:none;">' + data[i].description + '</div>';

               if(date < today){
                   // nothing
               } else {
                   var test = new event(date, time, n, desc);
                   events.push(test);
               }
               i++;
           });
           setMarker(title, cat, scat, website, events, loc);
           // create autocomplete tags

       });
    });
}

$(document).ready(function () {

    $("form").submit(function(e) {
        e.preventDefault();
        mySearch();
        $('.navbar-collapse').collapse('hide');
    });

    $(".navbar-brand").click(function() {
        var id = $(this).text();
        $("#info").hide();
        $("a.nav-link.dropdown-toggle").removeAttr("style");
        filterMap(id);
    });

    $("a.nav-link.dropdown-toggle").click(function() {
        var id = $(this).text();
        $("#info").hide();
        $("a.nav-link.dropdown-toggle").removeAttr("style");
        $(this).css("font-weight", "bold");
        filterMap(id);
    });

    $(".dropdown-item").click(function() {
        var id = $(this).text();
        $("#info").hide();
        $('.navbar-collapse').collapse('hide');
        filterMap(id);
    });

    var start = moment();
    var end = moment().endOf('year');

    function cb(start, end) {
        $('#reportrange span').html(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
        $("#info").hide();
        filterDates(start,end);
    }

    $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        locale: {
            "format": "DD/MM/YYYY",
            "separator": " - ",
            "applyLabel": "Apply",
            "cancelLabel": "Cancel",
            "fromLabel": "From",
            "toLabel": "To",
            "customRangeLabel": "Custom",
            "weekLabel": "W",
            "daysOfWeek": [
                "Su",
                "Mo",
                "Tu",
                "We",
                "Th",
                "Fr",
                "Sa"
            ],
            "firstDay": 2
        },
        ranges: {
            'Today': [moment(), moment()],
            'Tomorrow': [moment().add(1, 'days'), moment().add(1, 'days')],
            'This Week': [moment(), moment().endOf('week')],
            'Next Week': [moment().add(1,'week').startOf('week'), moment().add(1,'week').endOf('week')],
            'This Month': [moment(), moment().endOf('month')],
            'Next Month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')]
        }
    }, cb);
    cb(start, end);
});


function filterDates(start,end){
    for (var i = 0; i < markers.length; i++) {
        if(markers[i].events.length > 0){
            $(markers[i].events).each(function () {
                var d = this.date;
                if(d >= start && d <= end){
                    markers[i].marker.setVisible(true);
                    return false;
                } else {
                    markers[i].marker.setVisible(false);
                    return true;
                }
            });
        } else {
            markers[i].marker.setVisible(false);
        }
    }
}

function filterMap(id) {
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].category === id || markers[i].subcategory === id || id === "Aberdeen Events Map") {
            markers[i].marker.setVisible(true);
        } else {
            markers[i].marker.setVisible(false);
        }
    }
}


function createMarkers(category, subcategory, marker, events) {
    this.category = category;
    this.subcategory = subcategory;
    this.marker = marker;
    this.events = events;
}

function event(date, time, n, desc){
    this.date = date;
    this.time = time;
    this.n = n;
    this.desc = desc;
}

function mySearch(){

    $("#info").hide();
    $("a.nav-link.dropdown-toggle").removeAttr("style");

    var keyword = document.getElementById('search_box').value.toLowerCase();
    for (var i = 0; i < markers.length; i++) {
        if(markers[i].events.length > 0){
            $(markers[i].events).each(function(){
                var test = this.n + markers[i].marker.title + this.desc;
                test = strip(test).toLowerCase().replace(/[^\w\s]/gi, '').trim();
                if(test.indexOf(keyword) !== -1){
                    markers[i].marker.setVisible(true);
                    return false;
                } else {
                    markers[i].marker.setVisible(false);
                    return true;
                }
            });
        } else {
            markers[i].marker.setVisible(false);
        }
    }
}

function strip(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

Array.prototype.unique = function() {
    return this.filter(function (value, index, self) {
        return self.indexOf(value) === index;
    });
}

function pinSymbol(color) {
    return {
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#000',
        strokeWeight: 0.2,
        scale: 1
    };
}

function colorCat(a,b){
    //$("a:contains(" + a + ")").css("background-color", b);
}