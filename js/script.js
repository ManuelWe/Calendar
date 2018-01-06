var txt;
var eventArray;

function termineAuslesen() {
//dieses Skript ließt alle Einträge und gibt sie in einer Tabelle aus

    var xhttp = new XMLHttpRequest();
    var url = "http://dhbw.ramonbisswanger.de/calendar/test/events";
    xhttp.open("GET", url, false);
    xhttp.send();

    eventArray = JSON.parse(xhttp.responseText);
    txt = "<table border='1'>"

    for (event in eventArray) {
        txt += " <tr><td>" +
            "<div class=\"dayofmonth\">" + eventArray[event].start + "</div>" +
            "<div class=\"shortdate text-muted\">" + eventArray[event].end + "</div>" +
            "</td><td class=\"agenda-time\">" +
            eventArray[event].start.substr(11, 5) +
            "</td>" +
            "<td class=\"agenda-events\">" +
            "<div class=\"agenda-event\">" +
            "<i class=\"glyphicon glyphicon-repeat text-muted\" title=\"Repeating event\"></i> \n" +
            eventArray[event].title +
            "</div>\n" +
            "</td>\n" +
            "</tr>"

    }
    txt += "</table>"
    document.getElementById("dasHauptDivElementWoEureEinträgeAngezeigtWerden").innerHTML = "txt";
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

    txt = "<table border='1'>"

    for (i = 0; i < anzahl; i++) {
        txt += " <tr><td>" +
            "<div class=\"dayofmonth\">" + eventArray[i].start + "</div>" +
            "<div class=\"shortdate text-muted\">" + eventArray[i].end + "</div>" +
            "</td><td class=\"agenda-time\">" +
            eventArray[i].start.substr(11, 5) +
            "</td>" +
            "<td class=\"agenda-events\">" +
            "<div class=\"agenda-event\">" +
            "<i class=\"glyphicon glyphicon-repeat text-muted\" title=\"Repeating event\"></i> \n" +
            eventArray[i].title +
            "</div>\n" +
            "</td>\n" +
            "</tr>"

    }
    txt += "</table>"
    document.getElementById("dasHauptDivElementWoEureEinträgeAngezeigtWerden").innerHTML = txt;
}


termineAuslesen();


