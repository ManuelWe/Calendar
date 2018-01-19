var eventArray;
var eventlistArray;
var selectedRow;
var selectedCategory;
var categorylistArray;


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

    eventlistArray = JSON.parse(xhr.responseText);

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

    for (event in eventlistArray) {
        tableRow = "tableRow" + event
        txt += "<tr id='" + tableRow + "' class='tableRows' onclick='javascript:targetRow(" + event + ")'>" +
            "<td>" +
            eventlistArray[event].title +
            "</td>" +
            "<td>" +
            eventlistArray[event].end.substr(0, 10) +
            "</td>\n" +
            "<td>" +
            eventlistArray[event].start.substr(11, 5) +
            "</td>" +
            "<td>" +
            eventlistArray[event].end.substr(11, 5) +
            "</td>" +
            "<td>" +
            eventlistArray[event].end.substr(0, 10) +
            "</td>" +
            "</tr>"

    }
    txt += "</table>"
    document.getElementById("listEntry").innerHTML = txt;
}

function eintragErstellen() {
//Dieses Skript ERSTELLT einen eintrag
    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/events";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");

    var data = JSON.stringify(
        {
            "id": 1,
            "title": "Toller Termin",
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

    if (anzahl > eventlistArray.length || anzahl === -1) {
        anzahl = eventlistArray.length;
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
            eventlistArray[i].title +
            "</td>" +
            "<td>" +
            eventlistArray[i].start.substr(0, 10) +
            "</td>\n" +
            "<td>" +
            eventlistArray[i].start.substr(11, 5) +
            "</td>" +
            "<td>" +
            eventlistArray[i].end.substr(11, 5) +
            "</td>" +
            "<td>" +
            eventlistArray[i].end.substr(0, 10) +
            "</td>" +
            "</tr>"
    }

    txt += "</table>"
    document.getElementById("listEntry").innerHTML = txt;
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
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/events/" + eventlistArray[selectedRow].id;
    xhr.open("DELETE", url, true);
    xhr.send();

    setTimeout(termineAuslesen, 100);

    toggleView('listView');

}

function targetRow(row) {

    selectedRow = row;
    toggleView('entryDetails');
    retrieveEvent();

}

function toggleView(show) {
    if(show === "entryDetails" || show === "newCategory"){
        document.getElementsByClassName("newCategory")[0].style.zIndex = "1";
        document.getElementsByClassName("listView")[0].style.zIndex = "2";
        document.getElementsByClassName("monthView")[0].style.zIndex = "1";
    }
    else {
        document.getElementsByClassName("listView")[0].style.zIndex = "1";
        document.getElementsByClassName("monthView")[0].style.zIndex = "1";
        document.getElementsByClassName("entryDetails")[0].style.zIndex = "1";
    }
    document.getElementsByClassName(show)[0].style.zIndex = "3";
}


function retrieveEvent() {

    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/events/" + eventlistArray[selectedRow].id;
    xhr.open("GET", url, false);
    xhr.send();

    eventArray = JSON.parse(xhr.responseText);

    var txt = "<table id='eventTable'>" +
        "<tr>" + "<td>" +
        "<img src='img/clockIcon.png' width='20' height='20'" +
        "</td>" + "<td>" +
        eventArray.start.substr(0, 10) + " , " +
        eventArray.start.substr(11, 5)
    if(eventArray.start.substr(0, 10) !== eventArray.end.substr(0, 10)){
        txt += " - " + eventArray.end.substr(0, 10) + " , " +
            eventArray.end.substr(11, 5)
    }
    txt += "</td>" + "</tr>" +
        "<tr>" + "<td>" +
        "<img src='img/locationIcon.png' width='20' height='20'" +
        "</td>" + "<td>" +
        eventArray.location +
        "</td>" + "</tr>" +
        "<tr>" + "<td>" +
        "<img src='img/organizerIcon.png' width='20' height='20'" +
        "</td>" + "<td>" +
        eventArray.organizer +
        "</td>" + "</tr>" +
        "<tr>" + "<td>" +
        "<img src='img/statusIcon.png' width='20' height='20'" +
        "</td>" + "<td>" +
        eventArray.status +
        "</td>" + "</tr>" +
        "<tr>" + "<td>" +
        "<img src='' alt='allday' width='20' height='20'" +
        "</td>" + "<td>" +
        eventArray.allday +
        "</td>" + "</tr>" +
        "<tr>" + "<td>" +
        "<img src='img/linkIcon.png' width='20' height='20'" +
        "</td>" + "<td>" +
        "<a href='http://" + eventArray.webpage + "'>" + eventArray.webpage + "</a>" +
        "</td>" + "</tr>" +
        "</table>"
    document.getElementById("entryTitle").innerHTML = "<h3>" + eventArray.title + "</h3>";
    document.getElementById("entryCategories").innerHTML = eventArray.categories[0].name;
    document.getElementById("entryTable").innerHTML = txt;


}

function retrieveCategories() {
    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/categories";
    xhr.open("GET", url, false);
    xhr.send();

    categorylistArray = JSON.parse(xhr.responseText);


    txt = "<table>" +
        "<tr><th>Categories</th></tr>"

    for (category in categorylistArray) {
        tableRow = "category" + category
        txt += "<tr id='" + tableRow + "' class='tableRows' onclick='javascript:targetCategory(" + category + ")'>" +
            "<td>" +
            categorylistArray[category].name +
            "</td>" +
            "</tr>"
    }
    txt += "</table>"
    document.getElementById("tableCategories").innerHTML = txt;
}

function targetCategory(category){
    selectedCategory = category;
    //document.getElementById("category" + category)[0].style.backgroundColor = "#5E4485";
    addCategory();
    toggleView("entryDetails");
}

function createCategory(){
    var categoryName = document.querySelector("#inputCategory").value;

    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/categories";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");

    var data = JSON.stringify(
        {
            "name": categoryName
        }
    );

    xhr.send(data);

    setTimeout(retrieveCategories, 100);
}

function addCategory(){
    var xhr = new XMLHttpRequest();
    console.log(selectedCategory);
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/categories/" + categorylistArray[selectedCategory].id +
    "/" + eventlistArray[selectedRow].id;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");

    var data = JSON.stringify(
        {
            "name": categorylistArray[selectedCategory].name
        }
    );

    xhr.send(data);
}

function test() {

}


