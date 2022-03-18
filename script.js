const clickToDisplay = document.querySelector(".click");
const input = document.querySelector(".input__section");
const songSection = document.querySelector(".songs");
const songs = document.querySelectorAll(".song");
const songName = document.querySelectorAll(".song-name");
const songArtist = document.querySelectorAll(".artist");
const allAudio = document.querySelectorAll("audio");
const dancing = document.querySelector(".dancing-wrapper");
const pause = document.querySelectorAll(".pause");
const play = document.querySelectorAll(".play");
const mute = document.querySelectorAll(".mute");
const volume = document.querySelectorAll(".volume");
const span = document.querySelectorAll("span");
const playPause = document.querySelectorAll(".playPause");
const body = document.querySelector("body");
let imageArr = [
  "./images/blinking.gif",
  "./images/DennyBusyet.gif",
  "./images/LiquidStrokes.gif",
  "./images/Loading.gif",
  "./images/Greg.gif",
  "./images/Tumblr.gif",
  "./images/GlitterPhoto.gif",
];

//Disable children from triggering the event on parent
function disableEvent(name) {
  name.forEach((el) => {
    el.style.pointerEvents = "none";
  });
}

disableEvent(songArtist);
disableEvent(songName);

//Stops download button from triggering the parent div from playing the song
span.forEach((el) => {
  el.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});

//Hide all the background color of play/pause initially
//Prevents the container div from triggering its parent's event
playPause.forEach((el) => {
  el.classList.add("hide");
  el.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});

//Function to play song
clickToDisplay.addEventListener("click", () => {
  const inputVal = document.querySelector(".name").value;

  const msg = new SpeechSynthesisUtterance();
  msg.text = `Hello ${inputVal}, enjoy some of my favourite songs`;
  window.speechSynthesis.speak(msg);

  const speakInterval = setInterval(() => {
    input.classList.add("hide");
    dancing.classList.add("hide");
    songSection.classList.remove("hide");
  }, 4300);
});

//Loop through songs
songs.forEach((song) => {
  //Add event to individual song
  song.addEventListener("click", (e) => {
    const targetName = e.target.dataset.name;
    const target = e.target;
    const audio = document.querySelector(`audio[data-name=${targetName}]`);
    const currentSong = document.querySelector(
      `div[data-name="${targetName}"]`
    );

    //Remove hightlight from songs not playing
    songs.forEach((notCurrent) => {
      notCurrent.classList.remove("playing");
    });

    //Stop all songs from playing at the same time when clicked
    allAudio.forEach((audio) => {
      audio.pause();
      currentTime = 0;
    });

    //If not audio, don't play
    if (!audio) return;

    //Play the selected song
    audio.play();
    audio.loop = true;

    //Displays audio duration
    audioDuration(audio, target);

    //Update time audio current time
    audio.addEventListener("timeupdate", () => {
      timeUpdate(audio, target);
    });

    //Hides the background of play/pause and only displays the current one
    displayIcon(currentSong, playPause);

    //Add highlight to currently playing song
    currentSong.classList.add("playing");

    //Pass bg change to setInterval to repeat it at interval and animate
    let count = 0;

    const handleInterval = setInterval(() => {
      body.style.background = "url(" + imageArr[count] + ")";
      body.style.backgroundSize = "cover";
      body.style.backgroundPosition = "center";
      body.style.backgroundRepeat = "no-repeat";
      count == imageArr.length - 1 ? (count = 0) : count++;
    }, 4000);

    //Only display the target's pause if play doesn't have the class show
    toggleDisplay(currentSong, play, pause);

    //Only display the target's mute if volume doesn't have the class show
    toggleDisplay(currentSong, volume, mute);

    //Pause the song when pause is clicked
    pause.forEach((pause) => {
      pause.addEventListener("click", () => {
        audio.pause();
        //Clears/pause bg change when song is paused
        clearInterval(handleInterval);
      });
    });

    //Play when song is clicked
    play.forEach((play) => {
      play.addEventListener("click", () => {

      //Prevents all songs from playing simultaneously when clicked  
      if(currentSong.contains(play)) {
        audio.play();
      }
    

        //Resumes bg change when song is played
        setInterval(() => {
          body.style.background = "url(" + imageArr[count] + ")";
          body.style.backgroundSize = "cover";
          body.style.backgroundPosition = "center";
          body.style.backgroundRepeat = "no-repeat";
          count == imageArr.length - 1 ? (count = 0) : count++;
        }, 4000);
      });
    });

    //Toggle Mute
    toggleMuteVolume(audio, target, mute, volume, true);
    // Toggle Volume
    toggleMuteVolume(audio, target, volume, mute, false);

    //Toggle Pause
    pausePlay(target, pause, play);

    //Toggle Play
    pausePlay(target, play, pause);
  });
});

function displayIcon(current, name) {
  name.forEach((el) => {
    if (current.contains(el)) {
      el.classList.add("show");
    } else {
      el.classList.remove("show");
    }
  });
}

//Display if the other icon isn't displayed
function toggleDisplay(current, elToCheck, elToDisplay) {
  elToCheck.forEach((el) => {
    if (current.contains(el) && !el.classList.contains("show")) {
      displayIcon(current, elToDisplay);
    }
  });
}

//Toggle mute and volume buttons
function toggleMuteVolume(audio, target, mutes, volumes, bool) {
  mutes.forEach((mute) => {
    //When mute/volume is clicked
    mute.addEventListener("click", () => {
      audio.muted = bool;
      //Display volume/mute icon
      volumes.forEach((vol) => {
        if (target.contains(vol)) {
          vol.classList.add("show");
        } else {
          vol.classList.remove("show");
        }
      });
      //Remove mute/volume icon
      mute.classList.remove("show");
    });
  });
}

//Toggle pause and play
function pausePlay(target, plays, pauses) {
  pauses.forEach((pause) => {
    //When play/pause is clicked
    pause.addEventListener("click", () => {
      //Display play/pause
      plays.forEach((play) => {
        if (target.contains(play)) {
          play.classList.add("show");
        } else {
          play.classList.remove("show");
        }
      });
      //Remove mute icon
      pause.classList.remove("show");
    });
  });
}

const curTime = document.querySelectorAll(".curTime");

function timeUpdate(audio, target) {
  let curMins = Math.floor(audio.currentTime / 60);
  let curSecs = Math.floor(audio.currentTime - curMins * 60);

  if (curSecs < 10) {
    curSecs = "0" + curSecs;
  }

  if (curMins < 10) {
    curMins = "0" + curMins;
  }

  curTime.forEach((cur) => {
    if (target.contains(cur)) {
      cur.innerHTML = `${curMins} : ${curSecs}`;
    } else {
      cur.innerHTML = 00 + ":" + 00;
    }
  });
}

function audioDuration(audio, target) {
  const durTime = document.querySelectorAll(".durTime");
  let durMins = Math.floor(audio.duration / 60);
  let durSecs = Math.floor(audio.duration - durMins * 60);

  durTime.forEach((dur) => {
    if (target.contains(dur)) {
      dur.innerHTML = `${durMins} : ${durSecs}`;
    } else {
      dur.innerHTML = 00 + ":" + 00;
    }
  });
}

body.addEventListener("click", (e) => {
  console.log(e.target);
});