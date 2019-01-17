var obj;
var split;
var FJS;
var map;
var markers;
var authorsListGUI = [];
var categoriesListGUI = [];
var languagesListGUI = [];
var yearListGUI = [];
var licensesListGUI = [];
var conferencesListGUI = [];
var venuesListGUI = [];
var blueMarker, greenMarker, redMarker;

$(document).ready(function() {
    // init
    $.ajaxSetup({
        async: false
    });
    // set leaflet map baselayer
    map = L.map('map').setView([50, 0], 3);
    L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
    }).addTo(map);
    var MarkerIcon = L.Icon.extend({
        options: {
            iconAnchor: [9, 30],
            popupAnchor: [0, -30]
        }
    });
    blueMarker = new MarkerIcon({
        iconUrl: 'img/marker-icon_blue.png'
    });
    greenMarker = new MarkerIcon({
        iconUrl: 'img/marker-icon_green.png'
    });
    redMarker = new MarkerIcon({
        iconUrl: 'img/marker-icon_red.png'
    });
    $("#map").show();
    // get data from server
    let a = null;
    $.getJSON("https://www.jsonstore.io/fd160c1473ec15cf2f5013238db097926a16f95402cb668c3adafb409cfe32a3/pub/", function(response) {
        try {
            a = response.result;
            a = response.shift();
            console.log(a);
        } catch (e) {}
        obj = a;
        for (var i = 0; i < obj.length; i++) {
            split = obj[i].authors;
            for (var j = 0; j < split.length; j++) {
                if (split[j] != "") {
                    authorsListGUI.push(split[j]);
                }
            }
            categoriesListGUI.push(obj[i].category);
            languagesListGUI.push(obj[i].language);
            yearListGUI.push(obj[i].year); // slider
            licensesListGUI.push(obj[i].license);
            conferencesListGUI.push(obj[i]["conference_short"]);
            venuesListGUI.push(obj[i].venue);
        }
        // get single elements in array
        function remDoub(arr) {
            var temp = new Array();
            arr.sort();
            for (i = 0; i < arr.length; i++) {
                if (arr[i] == arr[i + 1]) {
                    continue
                }
                temp[temp.length] = arr[i];
            }
            return temp;
        }
        // fill Filter GUI values
        authorsListGUI = remDoub(authorsListGUI);
        for (var i = 0; i < authorsListGUI.length; i++) {
            var string = "<div class='checkbox'><label><input type='checkbox' value='" + authorsListGUI[i] + "' id='authors_criteria-" + i + "'><span>" + authorsListGUI[i] + "</span></label></div>";
            $(string).appendTo("#authors_criteria");
        }
        categoriesListGUI = remDoub(categoriesListGUI);
        for (var i = 0; i < categoriesListGUI.length; i++) {
            var string = "<div class='checkbox'><label><input type='checkbox' value='" + categoriesListGUI[i] + "' id='categories_criteria-" + i + "'><span>" + categoriesListGUI[i] + "</span></label></div>";
            $(string).appendTo("#categories_criteria");
        }
        languagesListGUI = remDoub(languagesListGUI);
        for (var i = 0; i < languagesListGUI.length; i++) {
            var string = "<div class='checkbox'><label><input type='checkbox' value='" + languagesListGUI[i] + "' id='languages_criteria-" + i + "'><span>" + languagesListGUI[i] + "</span></label></div>";
            $(string).appendTo("#languages_criteria");
        }
        licensesListGUI = remDoub(licensesListGUI);
        for (var i = 0; i < licensesListGUI.length; i++) {
            var string = "<div class='checkbox'><label><input type='checkbox' value='" + licensesListGUI[i] + "' id='licenses_criteria-" + i + "'><span>" + licensesListGUI[i] + "</span></label></div>";
            $(string).appendTo("#licenses_criteria");
        }
        conferencesListGUI = remDoub(conferencesListGUI);
        for (var i = 0; i < conferencesListGUI.length; i++) {
            var string = "<div class='checkbox'><label><input type='checkbox' value='" + conferencesListGUI[i] + "' id='conferences_criteria-" + i + "'><span>" + conferencesListGUI[i] + "</span></label></div>";
            $(string).appendTo("#conferences_criteria");
        }
        venuesListGUI = remDoub(venuesListGUI);
        for (var i = 0; i < venuesListGUI.length; i++) {
            var string = "<div class='checkbox'><label><input type='checkbox' value='" + venuesListGUI[i] + "' id='venues_criteria-" + i + "'><span>" + venuesListGUI[i] + "</span></label></div>";
            $(string).appendTo("#venues_criteria");
        }
        // show number of elements
        $('#total_data').text(obj.length);
        // init
        initFiltersHTML();
    });
});

function initFiltersHTML() {
    $('#authors_criteria :checkbox').prop('checked', false);
    $('#categories_criteria :checkbox').prop('checked', false);
    $('#languages_criteria :checkbox').prop('checked', false);
    $('#licenses_criteria :checkbox').prop('checked', false);
    $('#conferences_criteria :checkbox').prop('checked', false);
    $('#venues_criteria :checkbox').prop('checked', false);
    $("#years_slider").slider({
        min: 2010,
        max: 2020,
        values: [2010, 2020],
        step: 1,
        range: true,
        slide: function(event, ui) {
            $("#years_range_label").html(ui.values[0] + '-' + ui.values[1]);
            $('#years_filter').val(ui.values[0] + '-' + ui.values[1]).trigger('change');
        }
    });
    initFilters();
}

function initModal(id) {
    console.log(id);
    var modal = document.getElementById('myModal');
    var span = document.getElementsByClassName("close")[0];
    $("#modal-id").html(id);
    modal.style.display = "block";
    span.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function initFilters() {
    FJS = FilterJS(obj, '#data', {
        template: '#main_template',
        criterias: [{
            field: 'year',
            ele: '#years_filter',
            type: 'range',
            delimiter: '-'
        }, {
            field: 'authors',
            ele: '#authors_criteria input:checkbox'
        }, {
            field: 'category',
            ele: '#categories_criteria input:checkbox'
        }, {
            field: 'language',
            ele: '#languages_criteria input:checkbox'
        }, {
            field: 'license',
            ele: '#licenses_criteria input:checkbox'
        }, {
            field: 'conference_short',
            ele: '#conferences_criteria input:checkbox'
        }, {
            field: 'venue',
            ele: '#venues_criteria input:checkbox'
        }],
        search: {
            ele: '#searchbox'
        },
        callbacks: {
            afterFilter: function(result, jQ) {
                $('#total_data').text(result.length);
                // set marker
                try {
                    map.removeLayer(markers);
                } catch (e) {}
                markers = new L.FeatureGroup();
                for (var i = 0; i < result.length; i++) {
                    var lat = Number(result[i].lat);
                    var lon = Number(result[i].lon);
                    var marker = L.marker([lat, lon]);
                    marker.setIcon(blueMarker);
                    marker.options.title = result[i].id;
                    markers.addLayer(marker);
                }
                markers.on('click', function(e) {
                    highlight(e.layer._latlng.lat, e.layer._latlng.lng, e.layer.options.title, 1);
                });
                map.on('click', function(e) {
                    resethighlight();
                });
                resethighlight();
                map.addLayer(markers);
            }
        }
    });
    window.FJS = FJS;
    // init filters
    $("#years_filter").val('2010' + '-' + '2020').trigger('change');
    $("#years_filter").val('2010' + '-' + '2020').trigger('change');
}

var highlight = function(lat, lon, id, opt) {
    for (element in markers._layers) {
        if (markers._layers[element]._latlng.lat === lat && markers._layers[element]._latlng.lng === lon) {
            markers._layers[element].setIcon(greenMarker);
        } else {
            markers._layers[element].setIcon(blueMarker);
        }
    }
    var thumbnail = document.getElementById(id);
    if (id === thumbnail.id) {
        $(thumbnail).addClass("active");
    } else {
        $(thumbnail).removeClass("active");
    }
}

var resethighlight = function(id) {
    for (element in markers._layers) {
        markers._layers[element].setIcon(blueMarker);
    }
    var thumbnails = document.getElementsByClassName("caption");
    for (var i = 0; i < thumbnails.length; i++) {
        $(thumbnails[i]).removeClass("active");
    }
}

var showMap = function() {
    if ($("#map").is(":visible")) {
        $("#map").hide();
        resethighlight();
    } else {
        $("#map").show();
        resethighlight();
    }
}
