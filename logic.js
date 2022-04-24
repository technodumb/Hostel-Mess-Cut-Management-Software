
class ListElement {
    constructor(name, startDate, endDate) {
        this.name = name;
        this.startDate = new DateZero(startDate);
        this.endDate = new DateZero(endDate);
    }
}

const timezone_correction = (5*60+30)*60*1000;

var mess_cut_daily_list = [];

var mess_cut_info = [];

function init (){ 
    // retrieve the list of mess cut from local storage
    mess_cut_info = getJSONArray(localStorage.getItem("mess_cut_info"));
    console.log(mess_cut_info);     // printing the list
 
    // get the list of mess cut for today
    listDateSet();
    mess_cut_daily_list = getDateList(new Date());  
    list2HTML(mess_cut_daily_list);
    // resetting the form
    clear();
}

function submit() {
    var name = document.getElementById("nameLabel").innerHTML;
    if(name == "Invalid College ID")
        return;
    var startDate = document.getElementById("startDate").value;
    var endDate = document.getElementById("endDate").value;
    var newEntry = new ListElement(name, startDate, endDate);
    mess_cut_info.push(newEntry);
    // store the new entry in local storage
    localStorage.setItem("mess_cut_info", JSON.stringify(mess_cut_info));
    // clear the fields
    let listDate = document.getElementById("listDate").valueAsDate;
    mess_cut_daily_list = getDateList(listDate);
    list2HTML(mess_cut_daily_list);
    console.log(mess_cut_daily_list);
    clear();
}

function clear() {
    // clear all the fields
    document.getElementById("idInput").value = "";
    var todayDate = new DateZero();
    // set value of nextDate as the day after today;
    var nextDate = new Date(todayDate.getTime() + 1000*60*60*24);
    var startDateBox = document.getElementById("startDate");
    startDateBox.valueAsDate = corrected_date(todayDate);
    var endDateBox = document.getElementById("endDate");
    endDateBox.valueAsDate = corrected_date(nextDate);
}

function getDateList(date) {
    // get the list of mess cut for today
    var todayDate = new DateZero(date);
    var todaysList = [];
    for (var i = 0; i < mess_cut_info.length; i++) {
        if (todayDate >= mess_cut_info[i].startDate && todayDate <= mess_cut_info[i].endDate) {
            todaysList.push(mess_cut_info[i]);
        }
    }
    return todaysList;
}


function list2HTML(nameList){
    // convert the list to HTML and add to list with ID listOfNames
    var listOfNames = document.getElementById("listOfNames");
    listOfNames.innerHTML = "";
    for (var i = 0; i < nameList.length; i++) {
        var newElement = document.createElement("li");
        newElement.innerHTML = nameList[i].name;
        listOfNames.appendChild(newElement);
    }
}

function listDateSet() {
    var today = new DateZero();
    var listDateBox = document.getElementById("listDate");
    listDateBox.valueAsDate = corrected_date(today);
}

function getSelectedDateList(){
    var listDateBox = document.getElementById("listDate");
    mess_cut_daily_list = getDateList(listDateBox.valueAsDate);
    list2HTML(mess_cut_daily_list);
}

function getNextDateList(){
    var listDateBox = document.getElementById("listDate");
    listDateBox.stepUp();
    mess_cut_daily_list = getDateList(listDateBox.valueAsDate);
    list2HTML(mess_cut_daily_list);

}

function getPrevDateList(){
    var listDateBox = document.getElementById("listDate");
    listDateBox.stepDown();
    mess_cut_daily_list = getDateList(listDateBox.valueAsDate);
    list2HTML(mess_cut_daily_list);

}

function getStartDate(){
    var today = corrected_date(new DateZero());
    var startDate = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    return startDate;
}

function getJSONArray(json) {
    // retrieve ListElement array from JSON file
    var jsonArray = [];
    var parsedJSON = JSON.parse(json);
    for (var i = 0; i < parsedJSON.length; i++) {
        jsonArray.push(new ListElement(parsedJSON[i]["name"], parsedJSON[i]["startDate"], parsedJSON[i]["endDate"]));
    }
    return jsonArray;
}

function corrected_date(date){
    var correct_date = date.getTime() + timezone_correction;
    return new Date(correct_date);
}


class DateZero {
    constructor(date) {
        if (date == undefined) 
            date = new Date();
        else
            date = new Date(date);
        date.setHours(0, 0, 0, 0);
        return date;
    }
}

