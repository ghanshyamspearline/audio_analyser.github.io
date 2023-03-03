var apiUrl = "http://localhost:3000";
var urlParams = new URLSearchParams(window.location.search); //get all parameters
var report_id = urlParams.get('report_id'); //extract the foo parameter - this will return NULL if foo isn't a parameter

if(report_id) { //check if foo parameter is set to anything
  $.ajax({
      url: apiUrl+"/report/"+report_id,
      method: "GET",
      success: function(response) {
      let _tableData = "";
      if(response.data) {
          const _localDate = new Date(response.data.report_created_time);
          const dateString = _localDate.toLocaleDateString();
          const timeString = _localDate.toLocaleTimeString();
          _tableData += "<tr>\
          <td>"+response.data.report_id+"</td>\
          <td>"+response.data.report_file_id+"</td>\
          <td>"+dateString+ " "+timeString+"</td>\
          <td>"+response.data.report_status+"</td>\
          <td><a href='"+response.data.aws_file_path+"' target='_blank'>Download</a></td>\
          <td><a href='reports.html?report_id="+response.data.report_file_id+"'><img src='images/eye-solid.svg' height='24px'></a></td>\
          </tr>";
      } else {
        _tableData += "No Record Found.";
      }
      $('._tableData').html(_tableData);    
    },
    error: function(xhr, status, error) {
      console.log("Error:", error);
    }
  });
} else {
    // NOTE: Send Data to REST API
    $.ajax({
      url: apiUrl+"/reports",
      method: "GET",
      success: function(response) {
      // console.log("Success:", response);
      let _tableData = "";
      if(response.data.length > 0) {
        for(let i = 0; i < response.data.length; i++) {
          const _localDate = new Date(response.data[i].report_created_time);
          const dateString = _localDate.toLocaleDateString();
          const timeString = _localDate.toLocaleTimeString();
          _tableData += "<tr>\
          <td>"+response.data[i].report_id+"</td>\
          <td>"+response.data[i].report_file_id+"</td>\
          <td>"+dateString+ " "+timeString+"</td>\
          <td>"+response.data[i].report_status+"</td>\
          <td><a href='"+response.data[i].aws_file_path+"' target='_blank'>Download</a></td>\
          <td><a href='reports.html?report_id="+response.data[i].report_file_id+"'><img src='images/eye-solid.svg' height='24px'></a></td>\
          </tr>";
        }  
      } else {
        _tableData += "No Record Found.";
      }
      $('._tableData').html(_tableData);    
    },
    error: function(xhr, status, error) {
      console.log("Error:", error);
    }
  });
  }

