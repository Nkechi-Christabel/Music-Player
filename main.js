const clickToDisplay = document.querySelector(".click");
const input = document.querySelector(".input__section");
const songSection = document.querySelector(".songs");
const songs = document.querySelectorAll(".song");
const allAudio = document.querySelectorAll("audio");
const dancing = document.querySelector(".dancing-wrapper");
const pause = document.querySelectorAll(".pause");
const download = document.querySelectorAll(".download");
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

//Stops download button from triggering the parent div from playing the song
download.forEach((download) => {
  download.addEventListener("click", (e) => {
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
    const audio = document.querySelector(`audio[data-name=${targetName}]`);
    const currentSong = document.querySelector(
      `div[data-name="${targetName}"]`
    );

    //Stop all songs from playing at the same time
    allAudio.forEach((audio) => {
      audio.pause();
      // audio.currentTime = 0;
    });

    //Remove hightlight from songs not playing
    songs.forEach((notCurrent) => {
      notCurrent.classList.remove("playing");
    });

    //If not audio, don't play
    if (!audio) return;

    //Play current song
    audio.play();

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

    //Display the pause icon according to the target.
    pause.forEach((pause) => {
      if (e.target.contains(pause)) {
        pause.classList.add("show");
      } else {
        pause.classList.remove("show");
      }

      pause.addEventListener("click", (e) => {
        e.stopPropagation();
        audio.pause();
        //Clears/pause bg change when song is paused
        clearInterval(handleInterval);
      });
    });
  });
});
