// current date at top of page
var today = moment();
$("#currentDay").text(today.format("dddd, MMMM Do"));

// tasks object to store in localStorage.
var tasks = {
    "9": [],
    "10": [],
    "11": [],
    "12": [],
    "13": [],
    "14": [],
    "15": [],
    "16": [],
    "17": []
};

var setTasks = function() {
    /* add tasks to localStorage */
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

var getTasks = function() {
    /* load tasks from localStorage and create tasks in right row */

    var loadedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (loadedTasks) {
        tasks = loadedTasks

        // for each key/value pair in tasks, create a task
        $.each(tasks, function(hour, task) {
            var hourDiv = $("#" + hour);
            createTask(task, hourDiv);
        })
    }

    // ensure past/current/future time is reflected
    auditTasks()
}

var createTask = function(taskText, hourDiv) {
    /* create task in the row that corresponds to specified hour */

    var taskDiv = hourDiv.find(".task");
    var taskP = $("<p>")
        .addClass("description")
        .text(taskText)
    taskDiv.html(taskP);
}

var auditTasks = function() {
    /* update background of each row based on time of day */

    var currentHour = moment().hour();
    $(".task-info").each( function() {
        var elementHour = parseInt($(this).attr("id"));

        // handle past, present, and future
        if ( elementHour < currentHour ) {
            $(this).removeClass(["present", "future"]).addClass("past");
        }
        else if ( elementHour === currentHour ) {
            $(this).removeClass(["past", "future"]).addClass("present");
        }
        else {
            $(this).removeClass(["past", "present"]).addClass("future");
        }
    })
};

var replaceTextarea = function(textareaElement) {
    /* replaces provided textarea element with p element + persists data in localStorage */

    // get the necessary elements
    var taskInfo = textareaElement.closest(".task-info");
    var textArea = taskInfo.find("textarea");

    // get the time and task
    var time = taskInfo.attr("id");
    var text = textArea.val().trim();

    // persist data
    tasks[time] = [text];
    setTasks();

    // replace textarea element with p element
    createTask(text, taskInfo);
}

/* click handlers */

// tasks
$(".task").click(function() {

    // save other tasks if clicked
    $("textarea").each(function() {
        replaceTextarea($(this));
    })

    // convert to a textarea element if the time hasn't passed
    var time = $(this).closest(".task-info").attr("id");
    if (parseInt(time) >= moment().hour()) {

        // create textInput element that includes the current task
        var text = $(this).text();
        var textInput = $("<textarea>")
            .addClass("form-control")
            .val(text);

        // add textInput element to parent div
        $(this).html(textInput);
        textInput.trigger("focus");
    }
})

// save button
$(".saveBtn").click(function() {
    replaceTextarea($(this));
})

// update task backgrounds hourly
timeToHour = 3600000 - today.milliseconds();  // check how much time is left until the next hour
setTimeout(function() {
    setInterval(auditTasks, 3600000)
}, timeToHour);

// get tasks from localStorage
getTasks();
