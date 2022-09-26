// Jon Buresh 2018
function Job()
{
  this.isSalary = false;
  this.compensation = 15;
  this.worksSaturday = false;
  this.worksMonday = true;
  this.worksTuesday = true;
  this.worksWednesday = true;
  this.worksThursday = true;
  this.worksFriday = true;
  this.worksSunday = false;
  this.startTime = "09:00:00";
  this.endTime = "17:00:00";

  // return the amound of money earned per sec based on compensation calculations
  this.getEarnedPerSecond = function()
  {
      if (this.isSalary) 
      {
        return (this.compensation / (3600 * (40 * 52)));
      }
      else 
      {
        return (this.compensation / 3600);
      }
  }

  // returns true if today is a working day
  this.getIsWorkingToday = function()
  {
    switch (new Date().getDay())
    {
      case 0:
        return this.worksSunday;
      case 1:
        return this.worksMonday;
      case 2:
        return this.worksTuesday;
      case 3:
        return this.worksWednesday;
      case 4:
        return this.worksThursday;
      case 5:
        return this.worksFriday;
      case 6:
        return this.worksSaturday;
    }
  }
}

(function () {
  'use strict';

  var app =
    {
      isLoading: true,
      currentJob: new Job(),
      startTime: new Date(),
      endTime: new Date(),
      loader: document.querySelector('.loader'),
      content: document.querySelector('.content'),
      mainCard: document.getElementById('current-job-card'),
      settingsCard: document.getElementById('settings-card'),
      isEditing: false,
      isDoneCounting: false
    };

  // save relevant data to local storage
  app.saveJobData = function () 
  {
    // salary
    var wageType =  document.getElementById('wage-type-input');
    var value = wageType.options[wageType.selectedIndex].value;
    
    if (value == "salary")
    {
      app.currentJob.isSalary = true;
    }
    else
    {
      app.currentJob.isSalary = false;
    }

    // work daysOfWeek
    app.currentJob.worksSunday = JSON.parse(document.getElementById('sunday-button').checked);
    app.currentJob.worksMonday = JSON.parse(document.getElementById('monday-button').checked);
    app.currentJob.worksTuesday = JSON.parse(document.getElementById('tuesday-button').checked);
    app.currentJob.worksWednesday = JSON.parse(document.getElementById('wednesday-button').checked);
    app.currentJob.worksThursday = JSON.parse(document.getElementById('thursday-button').checked);
    app.currentJob.worksFriday = JSON.parse(document.getElementById('friday-button').checked);
    app.currentJob.worksSaturday = JSON.parse(document.getElementById('saturday-button').checked);

    // start and end time
    app.currentJob.startTime = document.getElementById('start-time-input').value;
    app.currentJob.endTime = document.getElementById('end-time-input').value;
  
    var startTimeStrings = app.currentJob.startTime.split(":");
    app.startTime.setHours(startTimeStrings[0]);
    app.startTime.setMinutes(startTimeStrings[1]);

    var endTimeStrings = app.currentJob.endTime.split(":");
    app.endTime.setHours(endTimeStrings[0]);
    app.endTime.setMinutes(endTimeStrings[1]);

    // compensation
    var select = document.getElementById('wage-input').value;
    app.currentJob.compensation = select;

    // save to local
    app.saveDataToLocal();
  }

  app.toggleEditJob = function () 
  {
    if (app.isEditing) 
      {
        app.mainCard.setAttribute('hidden', true);
        app.settingsCard.removeAttribute('hidden');
      }
      else
      {
        app.settingsCard.setAttribute('hidden', true);
        app.mainCard.removeAttribute('hidden');
      }
    app.isEditing = !app.isEditing;
  }

  app.saveButtonClicked = function ()
  {
    app.saveJobData();
    app.toggleEditJob();
    app.updateUI();
  };

  app.cancelButtonClicked = function ()
  {
    app.refreshUI();
    app.updateUI();
    app.toggleEditJob();
  }

  // set UI values to currentJob data
  app.refreshUI  = function() 
  {
    // wage
    var wageType = document.getElementById('wage-type-input');
    // salary 
    if (app.currentJob.isSalary)
    {
      wageType.selectedIndex = 0;
    }
    else
    {
      wageType.selectedIndex = 1;
    }
    document.getElementById('wage-input').value = app.currentJob.compensation;

    // work days
    document.getElementById('sunday-button').checked = app.currentJob.worksSunday;
    document.getElementById('monday-button').checked = app.currentJob.worksMonday;
    document.getElementById('tuesday-button').checked = app.currentJob.worksTuesday;
    document.getElementById('wednesday-button').checked = app.currentJob.worksWednesday;
    document.getElementById('thursday-button').checked = app.currentJob.worksThursday;
    document.getElementById('friday-button').checked = app.currentJob.worksFriday;
    document.getElementById('saturday-button').checked = app.currentJob.worksSaturday;

    // start and end times
    document.getElementById('start-time-input').value = app.currentJob.startTime;
    document.getElementById('end-time-input').value = app.currentJob.endTime;

    var startTimeStrings = app.currentJob.startTime.split(":");
    app.startTime.setHours(startTimeStrings[0]);
    app.startTime.setMinutes(startTimeStrings[1]);

    var endTimeStrings = app.currentJob.endTime.split(":");
    app.endTime.setHours(endTimeStrings[0]);
    app.endTime.setMinutes(endTimeStrings[1]);
  }

  // update the constantly changing UI
  app.updateUI = function ()
  {
    // turn off loading bar, show content
    if (app.isLoading)
      {
       app.loader.setAttribute('hidden', true);
       app.content.removeAttribute('hidden');
       app.isLoading = false;
     }

    var today = new Date();

    // check if we are working today
    if (!app.currentJob.getIsWorkingToday())
    {
      app.mainCard.querySelector('.earned-text').textContent = '';
      document.getElementById('card-description').textContent = 'enjoy the day off!';
      return;
    }

    // find how much we've earned so far
    var earnedPerSec = app.currentJob.getEarnedPerSecond();
    var elapsedTime = app.timeBetween(app.startTime, today);

    var timeInWorkday = app.timeBetween(app.startTime, app.endTime);
    // find percentOfWorkday
    var percentOfWorkday = Math.round((elapsedTime / timeInWorkday) * 100);

    // have not started working
    if (elapsedTime < 0)
    {
      app.mainCard.querySelector('.earned-text').textContent = '$0.00';
      document.getElementById('card-description').textContent = 'starting soon';
    }
    else
    {
      // finished working
      if (elapsedTime > timeInWorkday)
      {
        elapsedTime = timeInWorkday;
        document.getElementById('card-description').textContent = 'great job!';
      }
      // currently working
      else
      {
        document.getElementById('card-description').textContent = 'earned today';
      }
      app.mainCard.querySelector('.earned-text').textContent = '$' + ((earnedPerSec * elapsedTime).toFixed(2));
    }

    //app.todayCard.querySelector('.determinate').setAttribute('style', "width: " + percentOfWorkday + "%");
  };

  // return time between two dates
  app.timeBetween = function (date1, date2)
   {
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    var difference_ms = date2_ms - date1_ms;

    // milliseconds to seconds
    return Math.round(difference_ms / 1000);
  }

  // update loop
  app.updateLoop = function () 
  {
    app.updateUI();
  };

  // save currentJob data to local storage
  app.saveDataToLocal = function () 
  {
    localStorage.setItem('currentJob', JSON.stringify(app.currentJob));
  };

  /*****************************************************************************
   UI event listeners
   ****************************************************************************/

  document.getElementById('button-edit').addEventListener('click', app.toggleEditJob);
  document.getElementById('button-save').addEventListener('click', app.saveButtonClicked);
  document.getElementById('button-cancel').addEventListener('click', app.cancelButtonClicked);

  /*****************************************************************************
     setup
  ****************************************************************************/
  app.setup = function ()
  {
    // load localStorage
    if(localStorage.getItem('currentJob'))
    {
      var loadedJob = JSON.parse(localStorage.getItem('currentJob'));
      app.currentJob.isSalary = loadedJob.isSalary;
      app.currentJob.compensation = loadedJob.compensation;
      app.currentJob.worksSunday = loadedJob.worksSunday;
      app.currentJob.worksMonday = loadedJob.worksMonday;
      app.currentJob.worksTuesday = loadedJob.worksTuesday;
      app.currentJob.worksWednesday = loadedJob.worksWednesday;
      app.currentJob.worksThursday = loadedJob.worksThursday;
      app.currentJob.worksFriday = loadedJob.worksFriday;
      app.currentJob.worksSaturday = loadedJob.worksSaturday;
      app.currentJob.startTime = loadedJob.startTime;
      app.currentJob.endTime = loadedJob.endTime;
    }

    app.refreshUI();
    app.updateUI();
    
    //update job info once every second
    var cashTimer = setInterval(function () { app.updateLoop() }, 1000);
  }
  app.setup();

})();