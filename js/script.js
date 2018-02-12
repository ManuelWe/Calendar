var eventArray;
var eventlistArray;
var selectedRowId;
var categorylistArray;
var image;

function init() {
    retrieveCategories("initCall");
    //categories("");
    retrieveEvents();

    document.getElementById("checkAllday").addEventListener('change', toggleAllday);
    input = document.getElementById("uploadImage");
    input.style.opacity = 0;
    input.addEventListener('change', updateImageDisplay);

    document.getElementsByClassName("monthView")[0].style.display = "none";
    document.getElementsByClassName("createEntry")[0].style.display = "none";
    document.getElementsByClassName("monthView")[0].style.display = "none";
}


//######################## Entries #######################
//creates an input field with a datalist from the Categories
function categories(inputValue) {
    var txt = "<input class='form-control' list='listCategory' id='category' value='" +
        inputValue +
        "'>" +
        "<datalist id='listCategory'>";
    for (category in categorylistArray) {
        txt = txt +
            "<option value='" +
            categorylistArray[category].name +
            "'>";
    }
    txt = txt + "</datalist>";
    //document.getElementById("list1").innerHTML = txt;
}


//Fills the selected event into the createEntry div
function editEvent() {

    document.getElementById("submitBtn").innerHTML = "<button onclick='updateEntry();' class='btn btn-primary'>Confirm</button>";

    console.log("Hier");
    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/events/" + selectedRowId;
    xhr.open("GET", url, false);
    xhr.send();

    eventArray = JSON.parse(xhr.responseText);

    document.getElementById('title').value = eventArray.title;
    document.getElementById('organizer').value = eventArray.organizer;
    document.getElementById('startDate').value = eventArray.end.split("T")[0];
    document.getElementById('startTime').value = eventArray.end.split("T")[1];
    document.getElementById('endDate').value = eventArray.end.split("T")[0];
    document.getElementById('endTime').value = eventArray.end.split("T")[1];
    if (eventArray.allday) {
        document.getElementById("checkAllday").checked = true;
        toggleAllday();
    }
    document.getElementById('location').value = eventArray.location;
    categories("Test");
    document.getElementById('status').value = eventArray.status;
    document.getElementById('webpage').value = eventArray.webpage;
    if (eventArray.imageurl) {
        document.getElementById("imagePreview").style.backgroundImage = "url(" + eventArray.imageurl + ")";

    }
    toggleView("createEntry");


}


//Retrieves every Event from the Server and displays them in a list
function retrieveEvents() {

    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/events";
    xhr.open("GET", url, false);
    xhr.send();

    eventlistArray = JSON.parse(xhr.responseText);
    sortArray("date ASC");

    var txt = "<table class='calenderList'>" +
        "<tr>" +
        "<th>Event name" +
        "</th>" +
        "<th>Start date" +
        "</th>" +
        "<th>Start time" +
        "</th>" +
        "<th>End time" +
        "</th>" +
        "<th>End date" +
        "</th>" +
        "</tr>"

    for (event in eventlistArray) {
        tableRow = "tableRow" + event
        txt += "<tr id='" + tableRow + "' class='tableRows' onclick='javascript:targetRow(" + event + ")'>" +
            "<td>" +
            eventlistArray[event].title +
            "</td>"
        if (eventlistArray[event].allday) {
            txt += "<td>" +
                eventlistArray[event].start.substr(0, 10) +
                "</td>" +
                "<td>" +
                "Allday" +
                "</td>" +
                "<td>" +
                "</td>" +
                "<td>" +
                "</td>"
        } else {
            txt += "<td>" +
                eventlistArray[event].start.substr(0, 10) +
                "</td>" +
                "<td>" +
                eventlistArray[event].start.substr(11, 5) +
                "</td>" +
                "<td>" +
                eventlistArray[event].end.substr(11, 5) +
                "</td>" +
                "<td>" +
                eventlistArray[event].end.substr(0, 10) +
                "</td>"
        }

        txt += "</tr>"

    }
    txt += "</table>";
    document.getElementById("listEntry").innerHTML = txt;
}

//retrieves a single Event and displays entrys in a table
function retrieveEvent() {

    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/events/" + selectedRowId;
    xhr.open("GET", url, false);
    xhr.send();

    eventArray = JSON.parse(xhr.responseText);

    var txt = "<table id='eventTable'>" +
        "<tr>" + "<td>" +
        "<img src='img/clockIcon.png' width='20' height='20'>" +
        "</td>" + "<td>" +
        eventArray.start.substr(0, 10)
    if (eventArray.allday) {
        txt += " Allday"
    } else {
        txt += " , " + eventArray.start.substr(11, 5) +
            " - " + eventArray.end.substr(0, 10) + " , " +
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
        "<img src='img/linkIcon.png' width='20' height='20'>" +
        "</td>" + "<td>" +
        "<a href='http://" + eventArray.webpage + "'>" + eventArray.webpage + "</a>" +
        "</td>" + "</tr>" +
        "</table>"
    document.getElementById("entryTitle").innerHTML = "<h3 class='modal-title'>" + eventArray.title + "</h3>";
    document.getElementById("entryTable").innerHTML = txt;
    if (eventArray.imageurl) {
        document.getElementById("detailsHeader").style.backgroundImage = 'url(' + eventArray.imageurl + ')';
    } else {
        document.getElementById("detailsHeader").style.backgroundImage = "none";
    }

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
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "json");
    /*console.log(document.getElementById('title').value);
    console.log(document.getElementById('location').value);
    console.log(document.getElementById('organizer').value);
    console.log(document.getElementById('start').value);
    console.log(document.getElementById('end').value);
    console.log(document.getElementById('status').value);
    console.log(document.getElementById('allDay').checked);
    console.log(document.getElementById('webpage').value);
    console.log("hi");*/

    var data = {};
    data.title = document.getElementById('title').value;
    data.location = document.getElementById('location').value;
    data.organizer = document.getElementById('organizer').value;
    data.start = document.getElementById('startDate').value + "T" + document.getElementById('startTime').value;
    data.end = document.getElementById('endDate').value + "T" + document.getElementById('endTime').value;
    data.status = document.getElementById('status').value;
    data.allday = document.getElementById("checkAllday").checked;
    data.webpage = document.getElementById('webpage').value;
    if (document.getElementById("imagePreview").style.backgroundImage === "url(img/logo.png)") {

    } else {
        data.imagedata = image;
    }


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
    xhr.onload = function () {
        retrieveEvents();
        //selectedRow = eventlistArray[eventlistArray.length - 1].id;
        toggleView("listView");
    };
    xhr.send(JSON.stringify(data));


}

function updateEntry() {

    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/events/" + selectedRowId;
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-type", "json");

    var data = {};
    data.title = document.getElementById('title').value;
    data.location = document.getElementById('location').value;
    data.organizer = document.getElementById('organizer').value;
    data.start = document.getElementById('startDate').value + "T" + document.getElementById('startTime').value;
    data.end = document.getElementById('endDate').value + "T" + document.getElementById('endTime').value;
    data.status = document.getElementById('status').value;
    data.allday = document.getElementById("checkAllday").checked;
    data.webpage = document.getElementById('webpage').value;
    if (document.getElementById("imagePreview").style.backgroundImage == 'url("img/logo.png")') {
        deleteImageFromServer();
    } else {
        data.imagedata = image;
    }

    console.log(data);
    xhr.onload = function () {
        retrieveEvents();
        //selectedRow = eventlistArray[eventlistArray.length - 1].id;
        toggleView("listView");
    };
    xhr.send(JSON.stringify(data));


}

function toggleAllday() {
    if (document.getElementById("checkAllday").checked) {
        document.getElementById("startTime").value = "00:00";
        document.getElementById("endTime").value = "23:59";
        document.getElementById("startTime").disabled = true;
        document.getElementById("endTime").disabled = true;
    } else {
        document.getElementById("startTime").value = "";
        document.getElementById("endTime").value = "";
        document.getElementById("startTime").disabled = false;
        document.getElementById("endTime").disabled = false;
    }
}


//creates a standard entry for testing
function createTestEntry() {
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

    xhr.onload = function () {
        retrieveEvents();
        toggleView("listView");
    };
    xhr.send(data);

}

// deletes an entry and updates the list
function deleteEntry() {
    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/events/" + selectedRowId;
    xhr.open("DELETE", url, true);
    xhr.onload = function () {
        retrieveEvents();
    };
    xhr.send();

    $(".entryDetails").modal("hide");

}

//displays as many events as retrieved in count
function updateList(count) {

    if (count > eventlistArray.length || count === -1) {
        count = eventlistArray.length;
    }

    var txt = "<table class='calenderList'>" +
        "<tr>" +
        "<th>Event name" +
        "</th>" +
        "<th>Start date" +
        "</th>" +
        "<th>Start time" +
        "</th>" +
        "<th>End time" +
        "</th>" +
        "<th>End date" +
        "</th>" +
        "</tr>"

    for (i = 0; i < count; i++) {
        tableRow = "tableRow" + i;
        txt += "<tr id='" + tableRow + "' class='tableRows' onclick='javascript:targetRow(" + i + ")'>" +
            "<td>" +
            eventlistArray[i].title +
            "</td>"
        if (eventlistArray[i].allday) {
            txt += "<td>" +
                eventlistArray[i].start.substr(0, 10) +
                "</td>" +
                "<td>" +
                "Allday" +
                "</td>" +
                "<td>" +
                "</td>" +
                "<td>" +
                "</td>"
        } else {
            txt += "<td>" +
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
    }

    txt += "</table>"
    document.getElementById("listEntry").innerHTML = txt;
}


//########################## Categories ##################

//retrieves all Categories and displays them in a list
function retrieveCategories(initCall) {

    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/categories";
    xhr.open("GET", url, false);
    xhr.send();

    categorylistArray = JSON.parse(xhr.responseText);

    txt = "<table>" +
        "<tr><th>Categories</th></tr>";

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
    txt += "</table>";
    document.getElementById("tableCategories").innerHTML = txt;

    if (initCall != "initCall") {              //soll beim init Call nicht ausgeführt werden
        $(".newCategory").modal();
        markCategories();
    }
}

function markCategories() {
    for (category in eventArray.categories) {
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
}

function removeCategory(selectedCategory) {
    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/categories/" + categorylistArray[selectedCategory].id +
        "/" + selectedRowId;
    xhr.open("DELETE", url, true);
    xhr.onload = function () {
        retrieveEvent();
    };
    xhr.send();

}

function deleteCategory(selectedCategory) {
    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/categories/" + categorylistArray[selectedCategory].id;
    xhr.open("DELETE", url, true);
    xhr.onload = function () {
        retrieveEvent();
        retrieveCategories();
    };
    xhr.send();
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

    xhr.onload = function () {
        retrieveCategories();
    };
    xhr.send(data);

}

//adds a Category to a Event
function addCategory(selectedCategory) {
    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/categories/" + categorylistArray[selectedCategory].id +
        "/" + selectedRowId;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");

    var data = JSON.stringify(
        {
            "name": categorylistArray[selectedCategory].name
        }
    );

    xhr.onload = function () {
        retrieveEvent();
    };
    xhr.send(data);
}

function showCategoryList(){
    $(".newCategory").modal();

}

//####################### Images ####################
function updateImageDisplay() {
    var preview = document.querySelector('.preview');
    while (preview.firstChild) {
        preview.removeChild(preview.firstChild);
    }

    var curFiles = document.getElementById("uploadImage").files;
    if (curFiles.length === 0) {
        var para = document.createElement('p');
        para.textContent = 'No files currently selected for upload';
        preview.appendChild(para);
    } else {

        var list = document.createElement('ol');
        preview.appendChild(list);
        for (var i = 0; i < curFiles.length; i++) {
            var listItem = document.createElement('li');
            var para = document.createElement('p');
            if (validFileType(curFiles[i]) && returnFileSize(curFiles[i].size) != 'Zu Groß') {
                var reader = new FileReader();
                reader.readAsDataURL(this.files[0]);
                reader.onload = function () {
                    document.getElementById("imagePreview").style.backgroundImage = "url(" + reader.result + ")";
                    image = reader.result;
                }

                para.textContent = 'File name ' + curFiles[i].name + ', file size ' + returnFileSize(curFiles[i].size) + '.';
                listItem.appendChild(para);
                list.appendChild(listItem);

            } else if (validFileType(curFiles[i]) === false) {
                para.textContent = 'File name ' + curFiles[i].name + ': Not a valid file type. Update your selection.';
                listItem.appendChild(para);
                list.appendChild(listItem);
                document.getElementById("imagePreview").style.backgroundImage = "url(img/logo.png)";
                window.alert("Please select an JPEG or PNG File format!");
            } else {
                para.textContent = 'File name ' + curFiles[i].name + ': Image too large. Update your selection.';
                listItem.appendChild(para);
                list.appendChild(listItem);
                document.getElementById("imagePreview").style.backgroundImage = "url(img/logo.png)";
                window.alert("Please select a picture smaller than 500kB!");
            }


        }
    }
}


function validFileType(file) {
    var fileTypes = [
        'image/jpeg',
        'image/png'
    ]
    for (var i = 0; i < fileTypes.length; i++) {
        if (file.type === fileTypes[i]) {
            return true;
        }
    }

    return false;
}

function returnFileSize(number) {
    if (number < 1024) {
        return number + 'bytes';
    } else if (number > 1024 && number < 500000) {
        return (number / 1024).toFixed(1) + 'KB';
    } else if (number > 500000) {
        return 'Zu Groß';
    }
}


function addImage() {
    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/images/" + selectedRowId;
    xhr.open("POST", url, true);
    data = {"imagedata": image};
    xhr.send(JSON.stringify(data));

}

function deleteImage() {
    image = null;
    document.getElementById("imagePreview").style.backgroundImage = "url(img/logo.png)";
}

function deleteImageFromServer() {
    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/images/" + selectedRowId;
    xhr.open("DELETE", url, true);
    xhr.send();
}

//####################### View ########################

//handles a click on a row in the list view
function targetRow(row) {

    selectedRowId = eventlistArray[row].id;
    $(".entryDetails").modal();
    retrieveEvent();
}


//handles which container is displayed
function toggleView(show) {
    $(".entryDetails").modal("hide");
    $(".newCategory").modal("hide");

    document.getElementsByClassName("listView")[0].style.display = "none";
    document.getElementsByClassName("monthView")[0].style.display = "none";
    document.getElementsByClassName("createEntry")[0].style.display = "none";
    document.getElementsByClassName("monthView")[0].style.display = "none";

    document.getElementsByClassName(show)[0].style.display = "block";
    $('.nav li').click(function(){
        $('.nav li').removeClass('active');
        $('.nav li').removeClass('focus');
        $(this).addClass('active');
        $(this).addClass('focus');
    })
}

function changeButton(){
    document.getElementById("submitBtn").innerHTML = "<button onclick='createEntry();' class='btn btn-primary'>Confirm</button>";
}

function sortArray(value) {
    valueArray = value.split(" ");

    if (valueArray[1] == 'DESC') {
        if (valueArray[0] == 'date') {
            eventlistArray.sort(function (a, b) {
                return new Date(b.start) - new Date(a.start);
            });
        } else {
            eventlistArray.sort(function (a, b) {
                if (b.title < a.title) return -1;
                if (b.title > a.title) return 1;
                return 0;
            });
        }
    } else {
        if (valueArray[0] == 'date') {
            eventlistArray.sort(function (a, b) {
                return new Date(a.start) - new Date(b.start);
            });
        } else {
            eventlistArray.sort(function (a, b) {
                if (b.title > a.title) return -1;
                if (b.title < a.title) return 1;
                return 0;
            });
        }
    }
    updateList(-1);
}

function validateInput(){
    if(!getElementsByTagName("title").value || getElementsByTagName("title").value.length>50){
        return;
    }
    if(!getElementsByTagName("organizer").value || getElementsByTagName("organizer").value.length>50){
        return;
    }
    if(!getElementsByTagName("startTime").value){
        return;
    }
    if(!getElementsByTagName("endTime").value){
        return;
    }
    if(!getElementsByTagName("startDate").value){
        return;
    }
    if(!getElementsByTagName("endDate").value){
        return;
    }
    if(getElementsByTagName("location").value>50){
        return;
    }
    if(!getElementsByTagName("status").value){
        return;
    }
    if(getElementsByTagName("webpage").value>100){
        return;
    }
}
function test() {

}








