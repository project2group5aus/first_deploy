// from data.js
var tableData = data;
console.log('tableData is: ', tableData);

function populateZipCodeDropdown(table_d) {
    // create options array
    var options = [];
    for (var i = 0; i < table_d.length; i++) {
        var zipcode_option = table_d[i].zipcode;
        console.log('zipcode_option is: ', zipcode_option);
        //only push zipcode_option to options array if indexOf not found previously
        if (options.indexOf(zipcode_option) === -1) options.push(zipcode_option);
    }
    console.log('options is: ', options);
    // now sort options array in ascending order
    options.sort(function (a,b){return a-b});
    console.log('sorted options is: ', options);

    var sel = document.getElementById("zip");
    // clear all existing options first
    sel.innerHTML = "";
    for (var i = 0; i < options.length; i++) {
        var value_counter = 1;
        var opt = options[i];
        sel.innerHTML += "<option value=" + "'" + value_counter + "'>" + opt + "</option>";
        value_counter = value_counter + 1;
        console.log('value_counter is: ', value_counter);
    }

}


populateZipCodeDropdown(tableData);


// create function called makeTable that will make a table using HTML elements
// argument passed in is the array of data
function makeTable(tableData) {

console.log(tableData);

// create variable called table_html that will be used to make the 
// schools table using campus_name, address, and zipcode data from data.js

// start with making table border
var table_html = "<table border='1|1'>";

// use for loop with tableData to bring in elements for campus_name, address, and zipcode
for (var i = 0; i < tableData.length; i++) {
    var campus_designator = tableData[i].campus_id
    console.log('campus_designator is: ', campus_designator);
    var campus_link = '/campusdashboard/' + campus_designator
    console.log('campus_link is: ', campus_link);
    table_html+="<tr>";
    // add table data object and align in center for campus_name
    table_html+="<td align='center'>"+"<a href="+campus_link+">"+tableData[i].campus_name+"</a>"+"</td>";
    // add table data object and align in center for address
    table_html+="<td align='center'>"+tableData[i].address+"</td>";
    // add table data object and align in center for zipcode
    table_html+="<td align='center'>"+tableData[i].zipcode+"</td>";
    // end of row
    table_html+="</tr>";

}
// end of table creation
table_html+="</table>";
// create a full html variable to add column headers (School Name, Address, Zipcode) to the table_html we just created
full_html = "<thead><tr><th>School Name</th><th>Address</th><th>Zipcode</th></tr></thead>" + table_html;

// access by table id="school-table" from index.html file and populate with values from full_html variable
return document.getElementById("school-table").innerHTML = full_html;

}

// call function makeTable to render table on HTML page
makeTable(tableData);


// This is code that will listen for events and search through to find rows that match user input.
//
// Select the Filter Table button
var filterTable = d3.select("#filter-btn");

// Handler for when user clicks on Filter Table button
filterTable.on("click", function() {
    
    console.log("I am inside this click Filter Table button portion.")
    
    // Prevent the page from refreshing
    d3.event.preventDefault();

    // make filteredData a blank array to start
    var filteredData = [];
    console.log(filteredData);

    // Code for filtering by zipcode when user selects option from 'Select a Zipcode' dropdown
    //
    // Select the input element and get the raw HTML node
    var inputZipElement = d3.select("#zip option:checked");
    // Get the text of the input element
    var inputZipValue = inputZipElement.text();
    console.log('inputZipValue is: ', inputZipValue);
    console.log(tableData);
    // filter tableData and return only ones where zipcode matches what the user selects option from 'Select a Zipcode' dropdown
    var first_filteredData = tableData.filter(school => school.zipcode === inputZipValue);
    console.log(first_filteredData);
    // push first_filteredData to filteredData array
    filteredData.push.apply(filteredData, first_filteredData);
    
    

    

    // Code for filtering by schooltype when user selects option from 'Select a Zipcode' dropdown
    //
    // Select the input element and get the raw HTML node
    var inputSchoolTypeElement = d3.select("#schooltype option:checked")
    // Get the text of the input element
    var inputSchoolTypeValue = inputSchoolTypeElement.text();
    console.log('inputSchoolTypeValue is: ', inputSchoolTypeValue);

    // if user selected 'Both Elem and Middle' from dropdown
    if (inputSchoolTypeValue === "Both Elem and Middle") {
        console.log('no further filtering needed since Both Elem and Middle were selected');
        console.log('filteredData is: ', filteredData);
    }
    // if user selected 'Both Elementary' from dropdown
    else if (inputSchoolTypeValue == "Elementary") {
        var filteredData = filteredData.filter(school => school.elementary_school === "Y");
    }
    // if user selected 'Middle' from dropdown
    else if (inputSchoolTypeValue == "Middle") {
        var filteredData = filteredData.filter(school => school.middle_school === "Y");
    }

    // Finally, call function makeTable to render the filteredData table on HTML page
    console.log(filteredData);
    makeTable(filteredData);

});




