/* Wrap all code that interacts with the DOM in a call to jQuery to ensure that
  the code isn't run until the browser has finished rendering all the elements
  in the html. 
*/
$(document).ready(function () {
  /* 
    TODO: Add code to display the current date in the header of the page.
  ================================================================================================================  
  */
    var today = dayjs();
    $("#currentDay").text(today.format("dddd, MMMM D"));

  /*TODO: Add a listener for click events on the save button. This code should
    use the id in the containing time-block as a key to save the user input in
    local storage. 
  =================================================================================================================
  */
    $("body").on("click", function (event) {
      var targetElement = $(event.target);

      //if we click on the icon, set parent button as the target
      if (targetElement.is("i")) {
        targetElement = targetElement.parent();
      }

      //making sure a button was clicked
      if (targetElement.is("button")) {
        //get id of the Time Block
        var timeBlockId = targetElement.parent().attr("id");

        //get data from text area of the same timeBlock
        var textData = $("#" + timeBlockId)
          .children("textarea")
          .val();

        //save to local storage
        saveData(timeBlockId, textData);
      } else {
        console.log("Not a button");
      }
    });

  /* TODO: Add code to apply the past, present, or future class to each time
    block by comparing the id to the current hour.
  ================================================================================================================ 
  */

    var hour = today.get("hour"); //get current hour  
    //hour = 13;                                                              <------ chnage the value of hour to test the application

    for (let index = 9; index < 22; index++) {
      var timeBlock = $("#hour-" + index);

      if (index < hour) {
        timeBlock.addClass("past");
      } else if (index > hour) {
        timeBlock.addClass("future");
      } else {
        timeBlock.addClass("present");
      }
    }

  /* TODO: Add code to get any user input that was saved in localStorage and set
    the values of the corresponding textarea elements. 
  ===============================================================================================================
  */

    //get and parse any existing local storage objects
    var dayShedule = JSON.parse(localStorage.getItem("dayShedule"));

    //initialise array if empty
    if (dayShedule == null) {
      dayShedule = [];
    }

    //display data in text area
    for (let index = 0; index < dayShedule.length; index++) {
      var timeBlockId = dayShedule[index].timeBlock;
      $("#" + timeBlockId)
        .children("textarea")
        .text(dayShedule[index].data);
    }
});

/* 
  Saving data to local storage
    - handling empty array event
    - duplicate prevention
  ===============================================================================================================
*/
function saveData(timeBlock, textdata) {
  //creating the object
  var hourData = {
    timeBlock: timeBlock,
    data: textdata,
  };

  //get and parse any existing local storage objects
  var dayShedule = JSON.parse(localStorage.getItem("dayShedule"));

  //Accounting for case of empty array
  if (dayShedule == null) {
    dayShedule = [hourData];
    //Save first day shedule to local storage
    localStorage.setItem("dayShedule", JSON.stringify(dayShedule));
    //Exit function after saving for this case
    return;
  }

  //Accounting for case when data override needed
  var ovrrideDone = false;
  dayShedule.forEach(element => {
    if(element.timeBlock == timeBlock){
      //replace the old data with new
      element.data = textdata;
      // Set override done flag to true and exit function
      ovrrideDone = true;
      return;
    }
  });

  //Push data only if no override has been done
  if(!ovrrideDone){
    //push hourData into array
    dayShedule.push(hourData);
  }

  //Save day shedule to local storage
    localStorage.setItem("dayShedule", JSON.stringify(dayShedule));
}
