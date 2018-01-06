var txt;
var eventArray;

function termineAuslesen() {
//dieses Skript ließt alle Einträge und gibt sie in einer Tabelle aus

    var xhttp = new XMLHttpRequest();
    var url = "http://dhbw.ramonbisswanger.de/calendar/test/events";
    xhttp.open("GET", url, false);
    xhttp.send();

    eventArray = JSON.parse(xhttp.responseText);

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
            "</td>"+
            "<td>" +
            eventArray[event].start.substr(11, 5) +
            "</td>\n" +
            "<td>"+
            eventArray[event].end.substr(0, 10) +
            "</td>" +
            "<td>" +
            eventArray[event].end.substr(11, 5) +
            "</td>" +
            "<td>"+
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
    var url = "http://dhbw.ramonbisswanger.de/calendar/jihivsdi/events";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
        }
    };
    var data = JSON.stringify(
        {
            "title": " Christmas Feast",
            "location": "Stuttgart",
            "organizer": "dhbw@bisswanger.de",
            "start": "2014-12-24T18:00",
            "end": "2014-12-24T23:30",
            "status": "Busy",
            "allday": 0,
            "webpage": "http://www.bisswanger.de/"
        }

    );

//EINKOMMENTIEREN WENN IHR WIEDER TERMINE ERSTELLEN WOLLT
xhr.send(data);
}

function listeAktualisieren(anzahl) {

    if(anzahl>eventArray.length || anzahl === -1){
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
            eventArray[anzahl].title +
            "</td>"+
            "<td>" +
            eventArray[anzahl].start.substr(11, 5) +
            "</td>\n" +
            "<td>"+
            eventArray[anzahl].end.substr(0, 10) +
            "</td>" +
            "<td>" +
            eventArray[anzahl].end.substr(11, 5) +
            "</td>" +
            "<td>"+
            eventArray[anzahl].end.substr(0, 10) +
            "</td>" +
            "</tr>"
    }

    txt += "</table>"
    document.getElementById("dasHauptDivElementWoEureEinträgeAngezeigtWerden").innerHTML = txt;
}


termineAuslesen();


