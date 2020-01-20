const params = {
  break: {
    name: "Break",
    delay: 5,
    css: "break"
  },
  work: {
    name: "Work",
    delay: 25,
    css: "work"
  }
};
const steps = [ params.work, params.break ];


//---------------------------------------------------------------------
// View
//---------------------------------------------------------------------

const view = {
  start: document.getElementById("start"),
  pause: document.getElementById("pause"),
  timer: document.getElementById("timer"),
  container: document.getElementById("container"),
  stepText: document.getElementById("steptext"),
  playSound() {
    const audio = new Audio('alarm.mp3');
    audio.play();
  }
}


//---------------------------------------------------------------------
// State
//---------------------------------------------------------------------

const state = {
  _currentStep: null,
  endTime: null,
  _paused: false,
  pauseTime: 0,


//---------------------------------------------------------------------
// State -> View
//---------------------------------------------------------------------

  set time(time) {
    log("time = " + time);
    view.timer.innerHTML = time;
    document.title = time;
  },

  set paused(paused) {
    log("paused = " + paused);
    this._paused = paused;
    view.start.disabled = !paused;
    view.pause.disabled = paused;
  },

  get paused() { return this._paused },

  set currentStep(currentStep) {
    log("currentStep = " + currentStep);
    if (currentStep >= steps.length) {
      currentStep = 0;
    }
    if (this._currentStep !== null && this._currentStep !== currentStep) {
      view.playSound();
    }
    this._currentStep = currentStep;

    view.container.className = steps[state.currentStep].css;
    view.stepText.innerHTML = steps[state.currentStep].name;
    view.stepText.className = "animate";
    setTimeout(function() {
      view.stepText.className = "";
    }, 5000);
  },

  get currentStep() { return this._currentStep; }
};


//---------------------------------------------------------------------
// View -> Actions
//---------------------------------------------------------------------

view.start.addEventListener('click', start);
view.pause.addEventListener('click', pause);
setInterval(refresh, 1000);
init();


//---------------------------------------------------------------------
// Actions -> State
//---------------------------------------------------------------------

function start() {
  if (state.paused) {
    state.endTime += new Date().getTime() - state.pauseTime;
    state.paused = false;
    if (state.currentStep === null) {
      state.currentStep = 0;
    }
    refresh();
  }
}

function pause() {
  if (!state.paused) {
    state.paused = true;
    state.pauseTime = new Date().getTime();
  }
}

function refresh() {
  if (!state.paused) {
    const t = Math.max(0, Math.ceil((state.endTime - new Date().getTime()) / 1000));
    const mins = Math.floor(t / 60);
    const secs = Math.floor(t - mins * 60);

    state.time = ("0" + mins).slice(-2) + ":" + ("0" + secs).slice(-2);

    if (t <= 0) {
      state.currentStep++;
      state.endTime = new Date().getTime() + steps[state.currentStep].delay * 60 * 1000;
    }
  }
}

function init() {
  state.endTime = new Date().getTime() + steps[0].delay * 60 * 1000;
  refresh();
  pause();
}


//---------------------------------------------------------------------
// Misc
//---------------------------------------------------------------------

function log(t) {
  console.log(t);
}
