
 //var c_id = {{ camp_id|tojson }};
 console.log('value of c_id is: ', c_id);


 function buildSchoolSummary(sample) {

  // function that builds the schoolsummary panel

  // Use `d3.json` to fetch the metadata for a sample
  // url will match the route setup via Flask and what's in index.html: /schoolsummary/<sample>
  var url = "/schoolsummary/" + sample
  console.log(url);

  // Setup success handler and error handler when fetching data
  d3.json(url).then(handleSuccess).catch(handleError)

  // error handler function
  function handleError(error){
  console.log('An error occurred. Here is the error: ', error)
  }
  
  // success handler function
  function handleSuccess(response){
  console.log('Able to successfully retrieve schoolsummary data. Here it is: ', response)
  
  // Use d3 to select the panel with id of `#school-summary`
  var panel_body = d3.select("#school-summary");

  // Use `.html("") to clear any existing metadata
  panel_body.html("");

  // take object called response and make into array of objects
  var response_arr = [response];
  console.log("response_arr is: ", response_arr);

  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.

  /*
  response_arr.forEach(function(report){
    console.log(report);
    Object.entries(report).forEach(function([key, value]){
      console.log(key, value);
      // Append a cell to the row for each value
      // first output key as text along with a colon
      var cell_key = panel_body.append("td");
      cell_key.text(key + ": ");
      // next output value as text
      var cell_val = panel_body.append("td");
      cell_val.text(value);
      // insert a single line break
      panel_body.append("br");
    });
  });
  */

  response_arr.forEach(function(item){
    console.log('now inside response_arr forEach');
    console.log(item);
    var cell_key = panel_body.append("td");
    cell_key.text('Campus Name: ' + item["Campus Name"]);
    var cell_val = panel_body.append("td");
    panel_body.append("br");
    //
    var cell_key = panel_body.append("td");
    cell_key.text('Address: ' + item["Address"]);
    var cell_val = panel_body.append("td");
    panel_body.append("br");
    //
    var cell_key = panel_body.append("td");
    cell_key.text('Zip Code: ' + item["Zipcode"]);
    var cell_val = panel_body.append("td");
    panel_body.append("br");
    //
    var cell_key = panel_body.append("td");
    cell_key.text('Phone Number: ' + item["Phone Number"]);
    var cell_val = panel_body.append("td");
    panel_body.append("br");
    //
    var cell_key = panel_body.append("td");
    cell_key.text('County: ' + item["County"]);
    var cell_val = panel_body.append("td");
    panel_body.append("br");
    //
    var cell_key = panel_body.append("td");
    cell_key.text('District: ' + item["District"]);
    var cell_val = panel_body.append("td");
    panel_body.append("br");
    //
    var cell_key = panel_body.append("td");
    cell_key.text('Enrollment Size: ' + item["Enrollment Size"]);
    var cell_val = panel_body.append("td");
    panel_body.append("br");
    //
    var cell_key = panel_body.append("td");
    cell_key.text('Grade Levels: ' + item["Grade Range"]);
    var cell_val = panel_body.append("td");
    panel_body.append("br");
    //
    var cell_key = panel_body.append("td");
    cell_key.text('Student/Teacher Ratio: ' + item["Student/Teacher Ratio"]);
    var cell_val = panel_body.append("td");
    panel_body.append("br");
    //
    var cell_key = panel_body.append("td");
    var eco_dis_pct_num = item["Pct Eco Dis"];
    eco_dis_pct_num = eco_dis_pct_num.toFixed(2);
    cell_key.text('% Economically Disadvantaged: ' + eco_dis_pct_num);
    var cell_val = panel_body.append("td");
    panel_body.append("br");
    //

  });



  }
}
 
function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  // url will match the route setup via Flask and what's in index.html: /samples/<sample>

  var url = "/metadata/" + sample
  console.log(url);

  // Setup success handler and error handler when fetching data
  d3.json(url).then(handleSuccess).catch(handleError)

  // error handler function
  function handleError(error){
    console.log('An error occurred. Here is the error: ', error)
  }

  // success handler function
  function handleSuccess(result){
    console.log('Able to successfully retrieve sample data. Here it is: ', result)

    // Build a Pie Chart showing the Demographics at a particular school using the sample data
    var school_name = result.campus_name
    var school_enrollment = result.enrollment
    var pie_pct_other = 100 - (result.pct_african_american + result.pct_asian + result.pct_hispanic + result.pct_white)
    console.log(pie_pct_other);
    var pie_demographic_pct_values = [result.pct_african_american, result.pct_asian, result.pct_hispanic, result.pct_white, pie_pct_other]
    console.log(pie_demographic_pct_values);

    pie_values = [];
    for (var i = 0; i < pie_demographic_pct_values.length; i++) {
      var val = school_enrollment * (pie_demographic_pct_values[i] / 100)
      console.log(val);
      pie_values.push(val)
    }
    console.log(pie_values);

    var pie_labels = ["African American", "Asian", "Hispanic", "White", "Other"]
    console.log(pie_labels);

    var pie_trace = {
      labels: pie_labels,
     values: pie_values,
     type: 'pie'
   };
  
   var pie_data = [pie_trace];
  
   var pie_layout = {
     title: school_name + " Demographics" + " (Enrollment: " + school_enrollment + ")"
   };
  
   Plotly.newPlot("pie", pie_data, pie_layout);
   //


   // Build a Grouped Bar Chart showing the STAAR Reading and Math scores at a particular school using the sample data
   // compared to the district and state averages

   var bar_trace1 = {
    x: ['Reading', 'Math'],
    y: [result.pct_meets_grade_level_reading, result.pct_meets_grade_level_math],
    name: school_name,
    type: 'bar'
  };
  
  var bar_trace2 = {
    x: ['Reading', 'Math'],
    y: [result.district_pct_meets_grade_level_reading, result.district_pct_meets_grade_level_math],
    name: 'District',
    type: 'bar'
  };

  var bar_trace3 = {
    x: ['Reading', 'Math'],
    y: [result.state_pct_meets_grade_level_reading, result.state_pct_meets_grade_level_math],
    name: 'State',
    type: 'bar'
  };
  
  var bar_data = [bar_trace1, bar_trace2, bar_trace3];
  
  var bar_layout = {
    title: "STAAR Testing Scores (Students that Meet Grade Level Standard)",
    yaxis: { 
      title: '% of Students',
      range: [0, 100]
    },
    barmode: 'group',
  };
  
  Plotly.newPlot("bar", bar_data, bar_layout);




  }

}

// Display the school summary (address, phone, enrollment, student teacher ratio, etc.)
buildSchoolSummary(c_id);
// Display the charts
buildCharts(c_id);
