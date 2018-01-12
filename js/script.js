var txt;
var eventArray;
var selectedRow;


function init() {

    termineAuslesen();
    document
        .getElementById('popup-clickie')
        .addEventListener('click', showPopup);
}


function termineAuslesen() {
//dieses Skript ließt alle Einträge und gibt sie in einer Tabelle aus

    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/events";
    xhr.open("GET", url, false);
    xhr.send();

    eventArray = JSON.parse(xhr.responseText);

    var txt = "<table class='calenderList'>" +
        "<tr>" +
        "<th>Eventname" +
        "</th>" +
        "<th>Startdate" +
        "</th>" +
        "<th>Starttime" +
        "</th>" +
        "<th>Endtime" +
        "</th>" +
        "<th>Enddate" +
        "</th>" +
        "</tr>"

    for (event in eventArray) {
        tableRow = "tableRow" + event
        txt += "<tr id='" + tableRow + "' class='tableRows' onclick='javascript:targetRow(" + event + ")'>" +
            "<td>" +
            eventArray[event].title +
            "</td>" +
            "<td>" +
            eventArray[event].end.substr(0, 10) +
            "</td>\n" +
            "<td>" +
            eventArray[event].start.substr(11, 5) +
            "</td>" +
            "<td>" +
            eventArray[event].end.substr(11, 5) +
            "</td>" +
            "<td>" +
            eventArray[event].end.substr(0, 10) +
            "</td>" +
            "</tr>"

    }
    txt += "</table>"
    document.getElementById("dasHauptDivElementWoEureEinträgeAngezeigtWerden").innerHTML = txt;
}

function eintragErstellen() {
//Dieses Skript ERSTELLT einen eintrag
    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/events";
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var json = JSON.parse(xhr.responseText);
        }
    };
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");

    var data = JSON.stringify(
        {
            "id": 1,
            "title": "Ramon 3",
            "location": null,
            "organizer": "test@dsad.com",
            "start": "2017-12-11T11:11",
            "end": "2017-12-11T11:15",
            "status": "Busy",
            "allday": false,
            "webpage": "google.com"
        }
    );

//EINKOMMENTIEREN WENN WIEDER TERMINE ERSTELLT WERDEN SOLLEN
    xhr.send(data);
    setTimeout(termineAuslesen, 100);
}

function listeAktualisieren(anzahl) {

    if (anzahl > eventArray.length || anzahl === -1) {
        anzahl = eventArray.length;
    }

    var txt = "<table class='calenderList'>" +
        "<tr>" +
        "<th>Eventname" +
        "</th>" +
        "<th>Startdate" +
        "</th>" +
        "<th>Starttime" +
        "</th>" +
        "<th>Endtime" +
        "</th>" +
        "<th>Enddate" +
        "</th>" +
        "</tr>"

    for (i = 0; i < anzahl; i++) {
        tableRow = "tableRow" + i;
        txt += "<tr id='" + tableRow + "' class='tableRows' onclick='javascript:targetRow(" + event + ")'>" +
            "<td>" +
            eventArray[i].title +
            "</td>" +
            "<td>" +
            eventArray[i].start.substr(0, 10) +
            "</td>\n" +
            "<td>" +
            eventArray[i].start.substr(11, 5) +
            "</td>" +
            "<td>" +
            eventArray[i].end.substr(11, 5) +
            "</td>" +
            "<td>" +
            eventArray[i].end.substr(0, 10) +
            "</td>" +
            "</tr>"
    }

    txt += "</table>"
    document.getElementById("dasHauptDivElementWoEureEinträgeAngezeigtWerden").innerHTML = txt;
}

var showPopup = function (event) {
    document.getElementById("liste").style.display = 'none';
    event.preventDefault();
    document
        .getElementById('popup-form')
        .style.display = 'block';
};

function deleteEntry() {
    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/events/" + eventArray[selectedRow].id;
    xhr.open("DELETE", url, true);
    xhr.send();

    setTimeout(termineAuslesen, 100);

    window.location.href = 'index.html';

}

function targetRow(row) {

    selectedRow = row;
    window.location.href = 'details.html?id=' + eventArray[selectedRow].id;

}


function retrieveEvent() {
    var id = getParameterByName("id", window.location.href);

    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/events/" + id;
    xhr.open("GET", url, false);
    xhr.send();

    eventArray = JSON.parse(xhr.responseText);
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function test() {

}


