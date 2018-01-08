var txt;
var eventArray;


function init() {
    termineAuslesen();
    document
        .getElementById('popup-clickie')
        .addEventListener('click', showPopup);
}


function termineAuslesen() {
    console.log("hi");
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
        "<th>Starttime" +
        "</th>" +
        "<th>Startdate" +
        "</th>" +
        "<th>Endtime" +
        "</th>" +
        "<th>Enddate" +
        "</th>" +
        "</tr>"

    for (event in eventArray) {
        txt += "<tr>" +
            "<td>" +
            eventArray[event].title +
            "</td>" +
            "<td>" +
            eventArray[event].start.substr(11, 5) +
            "</td>\n" +
            "<td>" +
            eventArray[event].end.substr(0, 10) +
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
        "<th>Starttime" +
        "</th>" +
        "<th>Startdate" +
        "</th>" +
        "<th>Endtime" +
        "</th>" +
        "<th>Enddate" +
        "</th>" +
        "</tr>"

    for (i = 0; i < anzahl; i++) {
        txt += "<tr>" +
            "<td>" +
            eventArray[i].title +
            "</td>" +
            "<td>" +
            eventArray[i].start.substr(11, 5) +
            "</td>\n" +
            "<td>" +
            eventArray[i].start.substr(0, 10) +
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

function deleteEntry(eventId) {
    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/events/" + eventId;
    xhr.open("DELETE", url, true);
    xhr.send();
    setTimeout(termineAuslesen, 100);

}

function test() {

}


