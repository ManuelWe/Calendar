function loadDoc() {
    var xhttp = new XMLHttpRequest();
    var url = "http://dhbw.ramonbisswanger.de/calendar/stefang/events";
    xhttp.open("GET", url, false);
    xhttp.send();
    //document.getElementById("demo").innerHTML = xhttp.responseText;
    myObj = JSON.parse(xhttp.responseText);
    var txt = "<table border='1'>"
    for (x in myObj) {
        //  txt += "<tr><td>" + myObj[x].title + "</td></tr>";

        txt += " <tr>\n" +
            "<td class=\"agenda-date\" class=\"active\" rowspan=\"1\">" +
            "<div class=\"dayofmonth\">" + myObj[x].start.substr(8, 2) + "</div>" +
            "<div class=\"dayofweek\">Saturday</div>" +
            "<div class=\"shortdate text-muted\">" + myObj[x].start.substr(0, 4) + "</div>" +
            "</td>" +
            "<td class=\"agenda-time\">" +
            myObj[x].start.substr(11, 5) +
            "</td>" +
            "<td class=\"agenda-events\">" +
            "<div class=\"agenda-event\">" +
            "<i class=\"glyphicon glyphicon-repeat text-muted\" title=\"Repeating event\"></i> \n" +
            myObj[x].title +
            "</div>\n" +
            "</td>\n" +
            "<td>\n" +
            "                        <button onclick=\"delete("+myObj[x].id+")\" type=\"button\" class=\"btn btn-round\">\n" +
            "                            <span class=\"glyphicon glyphicon-trash\"></span>\n" +
            "                        </button>\n" +
            "                    </td>"
        "</tr>"

    }
    txt += "</table>"
    document.getElementById("agendabody").innerHTML += txt;
}