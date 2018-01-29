var eventArray;
var eventlistArray;
var selectedRow;
var categorylistArray;


function init() {
    retrieveCategories();
    categories();
    retrieveEvents();
}

//######################## Entries #######################
function categories(){

    var txt="<label for='category'>Category</label>" +
        "<input class='form-control' list='listCategory' id='category'>" +
        "<datalist id='listCategory'>";
    for(category in categorylistArray) {
        console.log("Here I am: " + category);
        txt = txt + "<option value='"+categorylistArray[category].name+"'>";
    }
    txt = txt + "</datalist>";
    document.getElementById("list1").innerHTML = txt;
}
//Retrieves every Event from the Server and displays them in a list
function retrieveEvents() {

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
    txt += "</table>";
    document.getElementById("listEntry").innerHTML = txt;
}

//retrieves a single Event and displays entrys in a table
function retrieveEvent() {

    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/events/" + eventlistArray[selectedRow].id;
    xhr.open("GET", url, false);
    xhr.send();

    eventArray = JSON.parse(xhr.responseText);

    var txt = "<table id='eventTable'>" +
        "<tr>" + "<td>" +
        "<img src='img/clockIcon.png' width='20' height='20'>" +
        "</td>" + "<td>" +
        eventArray.start.substr(0, 10) + " , " +
        eventArray.start.substr(11, 5)
    if (eventArray.start.substr(0, 10) !== eventArray.end.substr(0, 10)) {
        txt += " - " + eventArray.end.substr(0, 10) + " , " +
            eventArray.end.substr(11, 5)
    }
    txt += "</td>" + "</tr>" +
        "<tr>" + "<td>" +
        "<img src='img/locationIcon.png' width='20' height='20'>" +
        "</td>" + "<td>" +
        eventArray.location +
        "</td>" + "</tr>" +
        "<tr>" + "<td>" +
        "<img src='img/organizerIcon.png' width='20' height='20'>" +
        "</td>" + "<td>" +
        eventArray.organizer +
        "</td>" + "</tr>" +
        "<tr>" + "<td>" +
        "<img src='img/statusIcon.png' width='20' height='20'>" +
        "</td>" + "<td>" +
        eventArray.status +
        "</td>" + "</tr>" +
        "<tr>" + "<td>" +
        "<img src='' alt='allday' width='20' height='20'>" +
        "</td>" + "<td>" +
        eventArray.allday +
        "</td>" + "</tr>" +
        "<tr>" + "<td>" +
        "<img src='img/linkIcon.png' width='20' height='20'>" +
        "</td>" + "<td>" +
        "<a href='http://" + eventArray.webpage + "'>" + eventArray.webpage + "</a>" +
        "</td>" + "</tr>" +
        "</table>"
    document.getElementById("entryTitle").innerHTML = "<h3>" + eventArray.title + "</h3>";
    document.getElementById("entryTable").innerHTML = txt;

    if (eventArray.categories.length !== 0) {
        var categories = "";
        for (i = 0; i < eventArray.categories.length - 1; i++) {
            categories += eventArray.categories[i].name + ", ";
        }
        categories += eventArray.categories[i].name;
        document.getElementById("displayCategories").innerHTML = categories;
    } else {
        document.getElementById("displayCategories").innerHTML = "No Category yet";
    }

}

function createEntry() {

    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/events";
    xhr.onreadystatechange = retrieveEvents;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "json");
    console.log(document.getElementById('title').value);
    console.log(document.getElementById('location').value);
    console.log(document.getElementById('organizer').value);
    console.log(document.getElementById('start').value);
    console.log(document.getElementById('end').value);
    console.log(document.getElementById('status').value);
    console.log(document.getElementById('allDay').checked);
    console.log(document.getElementById('webpage').value);
    console.log("hi");

    var data={};
    data.title=document.getElementById('title').value;
    data.location=document.getElementById('location').value;
    data.organizer=document.getElementById('organizer').value;
    data.start=document.getElementById('start').value;
    data.end=document.getElementById('end').value;
    data.status=document.getElementById('status').value;
    data.allday=document.getElementById('allDay').checked;
    data.webpage=document.getElementById('webpage').value;

            /*"id": 1456,
            "title": "Toller Termin",
            "location": null,
            "organizer": "test@dsad.com",
            "start": "2017-12-11T11:11",
            "end": "2017-12-11T11:15",
            "status": "Busy",
            "allday": false,
            "webpage": "google.com"*/
    console.log(data);
    xhr.send(JSON.stringify(data));
    xhr.onload = function () {
        retrieveEvents();
        toggleView("listView");
    };
    //setTimeout(retrieveEvents(), 100);

}

// deletes an entry and updates the list
function deleteEntry() {
    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/events/" + eventlistArray[selectedRow].id;
    xhr.open("DELETE", url, true);
    xhr.send();

    setTimeout(retrieveEvents, 100);

    toggleView('listView');

}

//displays as many events as retrieved in count
function updateList(count) {

    if (count > eventlistArray.length || count === -1) {
        count = eventlistArray.length;
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

    for (i = 0; i < count; i++) {
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


//########################## Categories ##################

//retrieves all Categories and displays them in a list
function retrieveCategories() {
    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/categories";
    xhr.open("GET", url, false);
    xhr.send();
    categorylistArray = JSON.parse(xhr.responseText);

    txt = "<table>" +
        "<tr><th>Categories</th></tr>"

    for (category in categorylistArray) {
        tableRow = "category" + categorylistArray[category].id;
        txt += "<tr id='" + tableRow + "' class='tableRows'>" +
            "<td onclick='javascript:targetCategory(" + category + ")'>" +
            categorylistArray[category].name +
            "</td><td>" +
            "<input id='deleteClass'" + categorylistArray[category].id + "class='iconButton' type='image' src='img/deleteIcon.png' width='20' height='20'" +
            "onclick='javascript:deleteCategory(" + category + ")' alt='Icon Delete'>" +
            "</td></tr>"
    }
    txt += "</table>"
    document.getElementById("tableCategories").innerHTML = txt;

    markCategories();
}

function markCategories() {
    for (category in eventArray.categories) {
        console.log(eventArray.categories[category].id);
        document.getElementById("category" + eventArray.categories[category].id).style.backgroundColor = "#5E4485";
    }

}

//handles a Click on a Category
function targetCategory(category) {
    if (document.getElementById("category" + categorylistArray[category].id).style.backgroundColor == "rgb(94, 68, 133)") {
        removeCategory(category);
        document.getElementById("category" + categorylistArray[category].id).style.backgroundColor = "white";
    }
    else {
        addCategory(category);
        document.getElementById("category" + categorylistArray[category].id).style.backgroundColor = "#5E4485";
    }
    setTimeout(retrieveEvent, 100);
}

function removeCategory(selectedCategory){
    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/categories/" + categorylistArray[selectedCategory].id +
        "/" + eventlistArray[selectedRow].id;
    xhr.open("DELETE", url, true);
    xhr.send();

}

function deleteCategory(selectedCategory){
    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/categories/" + categorylistArray[selectedCategory].id;
    xhr.open("DELETE", url, true);
    xhr.send();

    setTimeout(retrieveEvent, 100);
    setTimeout(retrieveCategories, 100);
}

//creates a new Category
function createCategory() {
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

//adds a Category to a Event
function addCategory(selectedCategory) {
    var xhr = new XMLHttpRequest();
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

//####################### View ########################

//handles a click on a row in the list view
function targetRow(row) {

    selectedRow = row;
    toggleView('entryDetails');
    retrieveEvent();

}

//handles which container is displayed
function toggleView(show) {
    if (show === "entryDetails" || show === "newCategory") {
        document.getElementsByClassName("newCategory")[0].style.zIndex = "1";
        document.getElementsByClassName("listView")[0].style.zIndex = "2";
        document.getElementsByClassName("monthView")[0].style.zIndex = "1";
    }
    else {
        document.getElementsByClassName("listView")[0].style.zIndex = "1";
        document.getElementsByClassName("monthView")[0].style.zIndex = "1";
        document.getElementsByClassName("entryDetails")[0].style.zIndex = "1";
        document.getElementsByClassName("createEntry")[0].style.zIndex = "1";
    }
    document.getElementsByClassName(show)[0].style.zIndex = "3";
}

function test() {

}


