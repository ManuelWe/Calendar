//Prototype Function for Date Formatting
Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(),
        (mm>9 ? '' : '0') + mm,
        (dd>9 ? '' : '0') + dd
    ].join('-');
};

//Global variable Object containing all variables
var variables = {
    eventArray: null,
    eventlistArray: null,
    selectedRowId: null,
    categoryArray: [],
    categorylistArray: null,
    image: null,
    edit: true,
    events: null
};

//init function is called when the html body is loaded
//Retrieves all events and adds event listener
function init() {
    retrieveCategories("initCall");
    monthView();
    retrieveEvents();

    document.getElementById("checkAllday").addEventListener('change', toggleAllday);
    input = document.getElementById("uploadImage");
    input.style.opacity = 0;
    input.addEventListener('change', updateImageDisplay);

    document.getElementsByClassName("monthView")[0].style.display = "none";
    document.getElementsByClassName("createEntry")[0].style.display = "none";
    document.getElementsByClassName("monthView")[0].style.display = "none";

    $('.nav li').click(function () {
        $('.nav li').removeClass('active');
        $('.nav li').removeClass('focus');
        $(this).addClass('active');
        $(this).addClass('focus');
    });

    $(window).trigger("resize");
}

//configuration for the fullcallendar.io plugin which is used for
//month, week and day view
function monthView() {

    $('#calendar').fullCalendar({
        themeSystem: 'bootstrap3',
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        eventLimit: true,

        eventColor: '#87CEEB',
        eventBackgroundColor: '#87CEEB',
        eventBorderColor: '#4169E1',
        eventTextColor: 'black',

        eventClick: function (calEvent) {
            variables.selectedRowId = calEvent.id;
            $(".entryDetails").modal();
            retrieveEvent();
            $(this).css('border-color', 'red');
        },
        eventMouseover: function () {
            $(this).css('border-color', 'red');
        },
        eventMouseout: function () {
            $(this).css('border-color', '#4169E1');
        }
    });
}

//######################## Entries #######################

//Fills the selected event into the createEntry div, so that the
// user is able to edit it
function editEvent() {
    variables.edit = true;

    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/events/" + variables.selectedRowId;
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                variables.eventArray = JSON.parse(xhr.responseText);

                document.getElementById('title').value = variables.eventArray.title;
                document.getElementById('organizer').value = variables.eventArray.organizer;
                document.getElementById('startDate').value = variables.eventArray.start.split("T")[0];
                document.getElementById('startTime').value = variables.eventArray.start.split("T")[1];
                document.getElementById('endDate').value = variables.eventArray.end.split("T")[0];
                document.getElementById('endTime').value = variables.eventArray.end.split("T")[1];
                if (variables.eventArray.allday) {
                    document.getElementById("checkAllday").checked = true;
                    toggleAllday();
                }
                document.getElementById('location').value = variables.eventArray.location;
                document.getElementById('status').value = variables.eventArray.status;
                document.getElementById('webpage').value = variables.eventArray.webpage;
                if (variables.eventArray.imageurl) {
                    document.getElementById("imagePreview").style.backgroundImage = "url(" + variables.eventArray.imageurl + ")";

                }
                toggleView("createEntry");
            } else {
                alert("Error while editing an Event: " + xhr.statusText + "\n" + xhr.responseText);
            }
        }
    };

}


//Retrieves every Event from the Server and displays them in a list
function retrieveEvents(callback) {

    var date;
    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/events";
    xhr.open("GET", url, true);
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                variables.eventlistArray = JSON.parse(xhr.responseText);
                variables.events = JSON.parse(JSON.stringify(variables.eventlistArray));
                for (event in variables.events) {
                    variables.events[event].allDay = variables.events[event].allday;
                    delete variables.events[event].allday;
                    if(variables.events[event].allDay){
                        date = new Date(variables.events[event].end);
                        date.setDate(date.getDate()+1);
                        variables.events[event].end = date.yyyymmdd();
                    }
                }
                $('#calendar').fullCalendar('removeEvents');
                $('#calendar').fullCalendar('addEventSource', variables.events);

                if(variables.eventlistArray.length !== 0) {
                    variables.selectedRowId = variables.eventlistArray[variables.eventlistArray.length - 1].id;
                }
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
                    "</tr>";

                for (event in variables.eventlistArray) {
                    tableRow = "tableRow" + event;
                    txt += "<tr id='" + tableRow + "' class='tableRows' onclick='javascript:targetRow(" + event + ")'>" +
                        "<td>" +
                        variables.eventlistArray[event].title +
                        "</td>"
                    if (variables.eventlistArray[event].allday) {
                        txt += "<td>" +
                            variables.eventlistArray[event].start.split("T")[0] +
                            "</td>" +
                            "<td>" +
                            "Allday" +
                            "</td>" +
                            "<td>" +
                            "Allday" +
                            "</td>" +
                            "<td>";
                            if(variables.eventlistArray[event].start.split("T")[0] !== variables.eventlistArray[event].end.split("T")[0]) {
                                txt += variables.eventlistArray[event].end.split("T")[0];
                            }
                            txt += "</td>";
                    } else {
                        txt += "<td>" +
                            variables.eventlistArray[event].start.split("T")[0] +
                            "</td>" +
                            "<td>" +
                            variables.eventlistArray[event].start.split("T")[1] +
                            "</td>" +
                            "<td>" +
                            variables.eventlistArray[event].end.split("T")[1] +
                            "</td>" +
                            "<td>" +
                            variables.eventlistArray[event].end.split("T")[0] +
                            "</td>";
                    }

                    txt += "</tr>";

                }
                txt += "</table>";
                document.getElementById("listEntry").innerHTML = txt;

                if (variables.categoryArray.length != 0) {
                    for (i in variables.categoryArray) {
                        addCategory(variables.categoryArray[i]);
                    }
                }
                if(typeof(callback) === undefined) callback();

            } else {
                alert("Error while retrieving Events: " + xhr.statusText + "\n" + xhr.responseText);
            }
        }
    };
    xhr.send();
}

//retrieves a single Event and displays the details in a table
function retrieveEvent() {

    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/events/" + variables.selectedRowId;
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                variables.eventArray = JSON.parse(xhr.responseText);

                var txt = "<table id='eventTable'>" +
                    "<tr>" + "<td>" +
                    "<img src='img/clockIcon.png' width='20' height='20' alt='Clock'>" +
                    "</td>" + "<td>" +
                    variables.eventArray.start.split("T")[0];
                if (variables.eventArray.allday && variables.eventArray.end.split("T")[0] === variables.eventArray.start.split("T")[0]) {
                    txt += " Allday";
                } else if(variables.eventArray.allday){
                    txt += " - " + variables.eventArray.end.split("T")[0] + " Allday";
                }else {
                    txt += ", " + variables.eventArray.start.split("T")[1] +
                        " - " + variables.eventArray.end.split("T")[0] + ", " +
                        variables.eventArray.end.split("T")[1];
                }
                txt += "</td>" + "</tr>" +
                    "<tr>" + "<td>" +
                    "<img src='img/locationIcon.png' width='20' height='20' alt='Location'>" +
                    "</td>" + "<td>";
                    if(variables.eventArray.location) {
                        txt += variables.eventArray.location;
                    } else {
                        txt += "No location specified";
                    }
                    txt += "</td>" + "</tr>" +
                    "<tr>" + "<td>" +
                    "<img src='img/organizerIcon.png' width='20' height='20' alt='Organizer'>" +
                    "</td>" + "<td>" +
                    variables.eventArray.organizer +
                    "</td>" + "</tr>" +
                    "<tr>" + "<td>" +
                    "<img src='img/statusIcon.png' width='20' height='20' alt='Status'>" +
                    "</td>" + "<td>" +
                    variables.eventArray.status +
                    "</td>" + "</tr>" +
                    "<tr>" + "<td>" +
                    "<img src='img/linkIcon.png' width='20' height='20' alt='Webpage'>" +
                    "</td>" + "<td>";
                    if(variables.eventArray.webpage) {
                        txt += "<a href='http://" + variables.eventArray.webpage + "'>" + variables.eventArray.webpage + "</a>";
                    } else {
                        txt += "No webpage specified";
                    }
                    txt += "</td>" + "</tr>" +
                    "</table>";
                document.getElementById("entryTitle").innerHTML = "<h3 class='modal-title'>" + variables.eventArray.title + "</h3>";
                document.getElementById("entryTable").innerHTML = txt;
                if (variables.eventArray.imageurl) {
                    document.getElementById("entryPicture").style.backgroundImage = 'url(' + variables.eventArray.imageurl + ')';
                } else {
                    document.getElementById("entryPicture").style.backgroundImage = "url(img/pictureBlue.png)";
                }

                if (variables.eventArray.categories.length !== 0) {
                    var categories = "";
                    for (i = 0; i < variables.eventArray.categories.length - 1; i++) {
                        categories += variables.eventArray.categories[i].name + ", ";
                    }
                    categories += variables.eventArray.categories[i].name;
                    document.getElementById("displayCategoriesEntry").innerHTML = categories;
                    document.getElementById("displayCategories").innerHTML = categories;
                } else {
                    document.getElementById("displayCategoriesEntry").innerHTML = "No Category yet";
                    document.getElementById("displayCategories").innerHTML = "No Category yet";
                }
            } else {
                alert("Error while retrieving Event: " + xhr.statusText + "\n" + xhr.responseText);
            }
        }
    };
}

//creates a new event
function createEntry() {

    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/events";
    xhr.open("POST", url, true);
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
    if (document.getElementById("imagePreview").style.backgroundImage !== "url(img/pictureGrey.png)") {
        data.imagedata = variables.image;
    }

    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                retrieveEvents(clearFields);
                toggleView("listView");
            } else {
                alert("Error while creating Event: " + xhr.statusText + "\n" + xhr.responseText);
            }
        }
    };
    xhr.send(JSON.stringify(data));

}

//updates an existing event
function updateEntry() {

    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/events/" + variables.selectedRowId;
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
    if (document.getElementById("imagePreview").style.backgroundImage === 'url("img/pictureGrey.png")') {
        if(variables.eventlistArray.find(x => x.id === variables.selectedRowId).imageurl !== null) {
            deleteImageFromServer();
        }
    } else {
        data.imagedata = variables.image;
    }

    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                retrieveEvents();
                toggleView("listView");
                clearFields();
            } else{
                alert("Error while updating Event: " + xhr.statusText + "\n" + xhr.responseText);
            }
        }
    };
    xhr.send(JSON.stringify(data));

}

//Toggles the input fields of start and end time
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

// deletes an entry and updates the list
function deleteEntry() {
    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/events/" + variables.selectedRowId;
    xhr.open("DELETE", url, true);
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 204) {
                retrieveEvents();
            } else {
                alert("Error while deleting Event: " + xhr.statusText + "\n" + xhr.responseText);
            }
        }
    };
    xhr.send();

    $(".entryDetails").modal("hide");

}

//displays as many events as retrieved in count
function updateList(count) {

    if (count > variables.eventlistArray.length || count === -1) {
        count = variables.eventlistArray.length;
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
            variables.eventlistArray[i].title +
            "</td>"
        if (variables.eventlistArray[i].allday) {
            txt += "<td>" +
                variables.eventlistArray[i].start.split("T")[0] +
                "</td>" +
                "<td>" +
                "Allday" +
                "</td>" +
                "<td>" +
                "Allday" +
                "</td>" +
                "<td>";
            if(variables.eventlistArray[i].start.split("T")[0] !== variables.eventlistArray[i].end.split("T")[0]) {
                txt += variables.eventlistArray[i].end.split("T")[0];
            }
            txt += "</td>";
        } else {
            txt += "<td>" +
                variables.eventlistArray[i].start.split("T")[0] +
                "</td>\n" +
                "<td>" +
                variables.eventlistArray[i].start.split("T")[1] +
                "</td>" +
                "<td>" +
                variables.eventlistArray[i].end.split("T")[1] +
                "</td>" +
                "<td>" +
                variables.eventlistArray[i].end.split("T")[0] +
                "</td>" +
                "</tr>"
        }
    }

    txt += "</table>"
    document.getElementById("listEntry").innerHTML = txt;
}

//########################## Categories ##################

//checks if the user wants to add a category to an existing or to a new event
function categoryWindow() {
    if (variables.edit) retrieveCategories();
    else showCategoryList();
}

//retrieves all Categories and displays them in a list
function retrieveCategories(initCall) {

    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/categories";
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                variables.categorylistArray = JSON.parse(xhr.responseText);

                txt = "<table>" +
                    "<tr><th>Categories</th></tr>";

                for (category in variables.categorylistArray) {
                    tableRow = "category" + variables.categorylistArray[category].id;
                    txt += "<tr id='" + tableRow + "' class='tableRows'>" +
                        "<td onclick='javascript:targetCategory(" + category + ")'>" +
                        variables.categorylistArray[category].name +
                        "</td><td>" +
                        "<input id='deleteClass'" + variables.categorylistArray[category].id + "class='iconButton' type='image' src='img/deleteIcon.png' width='20' height='20'" +
                        "onclick='javascript:deleteCategory(" + category + ")' alt='Icon Delete'>" +
                        "</td></tr>"
                }
                txt += "</table>";
                document.getElementById("tableCategories").innerHTML = txt;

                if (initCall != "initCall") {              //soll beim init Call nicht ausgeführt werden
                    $(".newCategory").modal();
                    markCategories();
                }
            } else {
                alert("Error while retrievig Categories: " + xhr.statusText + "\n" + xhr.responseText);
            }
        }
    };
}

//marks every category that is already added to the event
function markCategories() {
    if(variables.eventArray.categories != undefined) {
        for (category in variables.eventArray.categories) {
            document.getElementById("category" + variables.eventArray.categories[category].id).style.backgroundColor = "#4169E1";
        }
    }

}

//handles a Click on a Category and removes or adds her accordingly
function targetCategory(category) {

    if (variables.edit) {
        if (document.getElementById("category" + variables.categorylistArray[category].id).style.backgroundColor == "rgb(65, 105, 225)") {
            removeCategory(category);
            if (category % 2 == 0) {
                document.getElementById("category" + variables.categorylistArray[category].id).style.backgroundColor = "#87CEEB";
            } else {
                document.getElementById("category" + variables.categorylistArray[category].id).style.backgroundColor = "#F0F8FF";
            }
        } else {
            addCategory(category);
            document.getElementById("category" + variables.categorylistArray[category].id).style.backgroundColor = "#4169E1";
        }
    } else {
        if ($.inArray(category, variables.categoryArray) != -1) {
            variables.categoryArray.splice(variables.categoryArray.indexOf(category), 1);
            if (category % 2 == 0) {
                document.getElementById("category" + variables.categorylistArray[category].id).style.backgroundColor = "#87CEEB";
            } else {
                document.getElementById("category" + variables.categorylistArray[category].id).style.backgroundColor = "#F0F8FF";
            }
        } else {
            variables.categoryArray[variables.categoryArray.length] = category;
            document.getElementById("category" + variables.categorylistArray[category].id).style.backgroundColor = "#4169E1";
        }

        if (variables.categoryArray.length !== 0) {
            var categories = "";
            for (i = 0; i < variables.categoryArray.length - 1; i++) {
                categories += variables.categorylistArray[variables.categoryArray[i]].name + ", ";
            }
            categories += variables.categorylistArray[variables.categoryArray[i]].name;
            document.getElementById("displayCategories").innerHTML = categories;
        } else {
            document.getElementById("displayCategories").innerHTML = "No Category yet";
        }

    }
}

//removes a category from an event
function removeCategory(selectedCategory) {
    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/categories/" + variables.categorylistArray[selectedCategory].id +
        "/" + variables.selectedRowId;
    xhr.open("DELETE", url, true);
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 204) {
                retrieveEvent();
            } else {
                alert("Error while removing Category from Event: " + xhr.statusText + "\n" + xhr.responseText);
            }
        }
    };
    xhr.send();

}

//deletes a Category from the server
function deleteCategory(selectedCategory) {
    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/categories/" + variables.categorylistArray[selectedCategory].id;
    xhr.open("DELETE", url, true);
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 204) {
                retrieveEvent();
                retrieveCategories();
            } else {
                alert("Error while deleting Category: " + xhr.statusText + "\n" + xhr.responseText);
            }
        }
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

    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                retrieveCategories();
            } else{
                alert("Error creating Category: " + xhr.statusText + "\n" + xhr.responseText);
            }
        }
    };
    if(!validateCategory(categoryName)){
        clearFields();
        return;
    }
    xhr.send(data);
    clearFields();
}

//adds a Category to a Event
function addCategory(selectedCategory) {
    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/categories/" + variables.categorylistArray[selectedCategory].id +
        "/" + variables.selectedRowId;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");

    var data = JSON.stringify(
        {
            "name": variables.categorylistArray[selectedCategory].name
        }
    );

    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 204) {
                retrieveEvent();
            } else {
                alert("Error adding Category to Event: " + xhr.statusText + "\n" + xhr.responseText);
            }
        }
    };
    xhr.send(data);
}

//opens the Category modal
function showCategoryList() {
    $(".newCategory").modal();

}

//####################### Images ####################

//Handles a Image upload and Validates it
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
                    variables.image = reader.result;
                }

                para.textContent = 'File name ' + curFiles[i].name + ', file size ' + returnFileSize(curFiles[i].size) + '.';
                listItem.appendChild(para);
                list.appendChild(listItem);

            } else if (validFileType(curFiles[i]) === false) {
                para.textContent = 'File name ' + curFiles[i].name + ': Not a valid file type. Update your selection.';
                listItem.appendChild(para);
                list.appendChild(listItem);
                document.getElementById("imagePreview").style.backgroundImage = "url(img/pictureGrey.png)";
                window.alert("Please select an JPEG or PNG File format!");
            } else {
                para.textContent = 'File name ' + curFiles[i].name + ': Image too large. Update your selection.';
                listItem.appendChild(para);
                list.appendChild(listItem);
                document.getElementById("imagePreview").style.backgroundImage = "url(img/pictureGrey.png)";
                window.alert("Please select a picture smaller than 500kB!");
            }


        }
    }
}

//returns if the file type is valid
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

//returns if the image size is valid
function returnFileSize(number) {
    if (number < 1024) {
        return number + 'bytes';
    } else if (number > 1024 && number < 500000) {
        return (number / 1024).toFixed(1) + 'KB';
    } else if (number > 500000) {
        return 'Zu Groß';
    }
}

//deletes the image from the preview container
function deleteImage() {
    variables.image = null;
    document.getElementById("imagePreview").style.backgroundImage = "url(img/pictureGrey.png)";
}

//deletes the Image from the server
function deleteImageFromServer() {
    var xhr = new XMLHttpRequest();
    var url = "https://dhbw.ramonbisswanger.de/calendar/MeJa/images/" + variables.selectedRowId;
    xhr.open("DELETE", url, true);
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status !== 204) {
                alert("Error while deleting Image: " + xhr.statusText + "\n" + xhr.responseText);
            }
        }
    };
    xhr.send();
}

//####################### View ########################

//handles a click on a row in the list view
function targetRow(row) {

    variables.selectedRowId = variables.eventlistArray[row].id;
    $(".entryDetails").modal();
    retrieveEvent();
}


//handles which container is displayed
function toggleView(show) {
    if (show === "listView") {
        variables.edit = true;
    } else if (show === "monthView") {
        //$(window).trigger("resize");
    }
    $(".entryDetails").modal("hide");
    $(".newCategory").modal("hide");

    document.getElementsByClassName("listView")[0].style.display = "none";
    document.getElementsByClassName("monthView")[0].style.display = "none";
    document.getElementsByClassName("createEntry")[0].style.display = "none";

    document.getElementsByClassName(show)[0].style.display = "block";

}

//removes the edit flag and clears all fields of create entry
function changeButton() {
    variables.edit = false;
    for (cat in variables.categorylistArray) {
        if (cat % 2 == 0) {
            document.getElementById("category" + variables.categorylistArray[cat].id).style.backgroundColor = "#87CEEB";
        } else {
            document.getElementById("category" + variables.categorylistArray[cat].id).style.backgroundColor = "#F0F8FF";
        }
    }
    clearFields();
}

//sorts all events
function sortArray(value) {
    valueArray = value.split(" ");

    if (valueArray[1] == 'DESC') {
        if (valueArray[0] == 'date') {
            variables.eventlistArray.sort(function (a, b) {
                return new Date(b.start) - new Date(a.start);
            });
        } else {
            variables.eventlistArray.sort(function (a, b) {
                if (b.title < a.title) return -1;
                if (b.title > a.title) return 1;
                return 0;
            });
        }
    } else {
        if (valueArray[0] == 'date') {
            variables.eventlistArray.sort(function (a, b) {
                return new Date(a.start) - new Date(b.start);
            });
        } else {
            variables.eventlistArray.sort(function (a, b) {
                if (b.title > a.title) return -1;
                if (b.title < a.title) return 1;
                return 0;
            });
        }
    }
    updateList(-1);
}

//validates the input of the new entry
function validateInput() {
    var title = document.getElementById("title").value
    var organizer = document.getElementById("organizer").value
    var location = document.getElementById("location").value
    var webpage = document.getElementById("webpage").value
    var valid = false;
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    }

    if(mm<10) {
        mm = '0'+mm
    }
    today = yyyy + '-' + mm + '-' + dd;

    if (!title) {
        alert("You need a Title!");
    } else if (title.length > 50){
        alert("Your Title is too long! (Max. 50 characters)");
    } else if (!organizer) {
        alert("You need an Organizer!");
    } else if(!re.test(organizer)) {
        alert("The Organizer has to be an Email address!");
    } else if (!document.getElementById("startDate").value) {
        alert("Your Event has no start Date!");
    } else if (!document.getElementById("endDate").value) {
        alert("Your Event has no end Date!");
    } else if (!document.getElementById("startTime").value) {
        alert("You need a start Time!");
    } else if (!document.getElementById("endTime").value) {
        alert("Your Event has no end Time!");
    } else if (document.getElementById("startDate").value.split("T")[0] < today ){
        alert("No Entries in the past are allowed!");
    } else if (document.getElementById("startDate").value > document.getElementById("endDate").value ) {
        alert("Your Event ends before it starts!");
    } else if (document.getElementById("startDate").value === document.getElementById("endDate").value &&
        document.getElementById("startTime").value > document.getElementById("endTime").value ) {
        alert("Your Event ends before it starts!");
    } else if (location.length > 50) {
        alert("Your Location name is too long! (max. 50 characters)");
    } else if (!document.getElementById("status").value) {
        alert("You need to select a status!");
    } else if (webpage.length > 100) {
        alert("Your webpage URL is too long! (max. 100 characters)");
    } else {
        valid = true;
    }


    if (valid) {
        if (variables.edit) {
            updateEntry();
        } else {
            createEntry();
        }
        document.getElementById("listBtn").click();
    } else {
        return;
    }

}

//validates the category name
function validateCategory(categoryName){

    if(!categoryName){
        alert("Please enter a Category name!");
        return false;
    }
    if(categoryName.length > 30){
        alert("Your name is too long!");
        return false;
    }
    for(cat in variables.categorylistArray){
        if(variables.categorylistArray[cat].name.toLowerCase() === categoryName.toLowerCase()){
            alert("Category name already exists!");
            return false;
        }
    }
    return true;
}

//clears all entry fields of "Create Entry"
function clearFields() {
    document.getElementById("checkAllday").checked = false;
    document.getElementById("title").value = '';
    document.getElementById('location').value = '';
    document.getElementById('organizer').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('startTime').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('endTime').value = '';
    toggleAllday();
    document.getElementById('webpage').value = '';
    variables.categoryArray.length = 0;
    document.getElementById("displayCategories").innerHTML = "No Category yet";
    document.getElementById("inputCategory").value = '';

    deleteImage();
}









