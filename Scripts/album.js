let body = document.body;

const info = getAllParameter();
let img = document.querySelector(".album-container__img");
img.src = info[0];
let heading = document.querySelector(".album-container__heading");
heading.innerHTML = info[1];
document.title = info[1];
let text = document.querySelector(".album-container__text");
text.innerHTML = info[2];
let folder = info[3];

let song_container = document.querySelector(".album-container__songs");
var id = 1;
var audio = new Audio();
var play_pause = document.getElementById("play-pause");
let volume_Btn = document.getElementById("volume-btn");
let volumeRange = document.getElementById("volumeRange");

volumeRange.addEventListener('input', (e) => {
    e.stopPropagation();
    const currentVolume = volumeRange.value / 100;
    audio.volume = currentVolume;
})

volume_Btn.addEventListener('click', (event) => {
    event.stopPropagation();

    if (audio.volume == 0) {
        // volumeRange.value = 0.5;
        audio.volume = 0.5;
        volume_Btn.innerHTML = ``;
        volume_Btn.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
    } else {
        audio.volume = 0;
        // volumeRange.value = 1;
        volume_Btn.innerHTML = ``;
        volume_Btn.innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`;
    }
})


let loopBtn = document.getElementById("loop");
loopBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    let repeat = loopBtn.getAttribute('data-loop');

    if (repeat === "true") {
        loopBtn.setAttribute('data-loop', "false");
        audio.loop = false;
        loopBtn.style.color = `#b1b1b1`;
    } else {
        loopBtn.setAttribute('data-loop', "true");
        audio.loop = true;
        loopBtn.style.color = `#3b3276`;
    }
})

function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function getAllParameter() {
    const img = getQueryParameter('img');
    const heading = getQueryParameter('heading');
    const text = getQueryParameter('text');
    const folder = getQueryParameter('folder');

    return [img, heading, text, folder];
}


async function getSongsFolder(song_folder) {
    let songs = await fetch(`/songs/${song_folder}/ganna`);
    let response = await songs.text();

    let div = document.createElement('div');
    div.innerHTML = response;

    let anchors = div.getElementsByTagName('a');
    let songs_list = [];

    for (let i = 0; i < anchors.length; i++) {
        const element = anchors[i];
        if (element.href.includes('ganna/song-')) {
            songs_list.push(element.href.split('/ganna/')[1]);
        }
    }
    return (songs_list);
}

async function getSongs(song_folder, song) {
    let songs = await fetch(`/songs/${song_folder}/ganna/${song}/`);
    let response = await songs.text();

    let div = document.createElement('div');
    div.innerHTML = response;

    let anchors = div.getElementsByTagName('a');
    const song_info = [];

    for (let i = 0; i < anchors.length; i++) {
        if (anchors[i].href.includes(song)) {
            song_info.push(anchors[i].href);
        }
    }
    return song_info;
}

async function displaySongs(info) {
    let song = info[0];
    let song_json = await fetch(info[1]);
    let response = await song_json.json();

    song_container.innerHTML = song_container.innerHTML + `
            <div data-href="${song}" class="album-container__songs--list" id="${id}">
                <div>
                    <h4 class="heading-4">${response.name}</h4>
                    <p class="album-container__songs--text">${response.artist}</p>
                </div>
                <div>
                    <button><i class="fa-solid fa-play"></i></button>
                </div>
            </div>
            `;
    id++;
}

async function playSong(href, elementId, name, artist) {

    elementId = Number(elementId);
    audio.src = href;
    audio.play();
    chngToPause();
    let songRange = document.getElementById("songRange");
    let songName = document.querySelector(".album-container__playbar--text");
    let songArtist = document.querySelector(".album-container__playbar--artist");

    songName.innerHTML = name;
    songArtist.innerHTML = artist;

    audio.addEventListener('timeupdate', () => {
        let time = (audio.currentTime / audio.duration) * 100;
        songRange.value = `${time}`;

        if (audio.currentTime == audio.duration) {
            elementId++;
            if (elementId < id) {
                let div = document.getElementById(elementId);
                songName.innerHTML = div.querySelector(".heading-4").innerHTML;
                songArtist.innerHTML = div.querySelector(".album-container__songs--text").innerHTML;
                audio.src = div.getAttribute('data-href');
                audio.play();
                chngToPause();
            } else {
                audio.pause();
                chngToPlay();
            }
        }
    })

    songRange.addEventListener('input', (e) => {
        e.stopPropagation();
        const currentValue = songRange.value;
        audio.currentTime = (currentValue * audio.duration) / 100;
    })

    let previous = document.getElementById("previous");
    previous.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();

        if ((elementId - 1) == 0) {
            audio.pause();
            chngToPlay();
        } else {
            elementId--;
            let div = document.getElementById(elementId);
            songName.innerHTML = div.querySelector(".heading-4").innerHTML;
            songArtist.innerHTML = div.querySelector(".album-container__songs--text").innerHTML;
            audio.src = div.getAttribute('data-href');
            audio.play();
            chngToPause();
        }
    })

    play_pause.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (audio.paused) {
            audio.play();
            chngToPause();
        } else {
            audio.pause();
            chngToPlay()
        }

    })

    let next = document.getElementById("next");
    next.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();

        if ((elementId + 1) == id) {
            audio.pause();
            chngToPlay();
        } else {
            elementId++;
            let div = document.getElementById(elementId);
            songName.innerHTML = div.querySelector(".heading-4").innerHTML;
            songArtist.innerHTML = div.querySelector(".album-container__songs--text").innerHTML;
            audio.src = div.getAttribute('data-href');
            audio.play();
            chngToPause();
        }
    })
}

async function main() {
    let songsList = await getSongsFolder(folder);

    for (let i = 0; i < songsList.length; i++) {
        let song = await getSongs(folder, songsList[i]);
        await displaySongs(song);
    }

    let songsArr = document.getElementsByClassName("album-container__songs--list");
    Array.from(songsArr).forEach(element => {
        element.addEventListener('click', (event) => {
            event.stopPropagation();
            let name = element.querySelector(".heading-4").innerHTML;
            let artist = element.querySelector(".album-container__songs--text").innerHTML;
            const href = element.getAttribute('data-href');

            playSong(href, element.id, name, artist);
        })
    });

    let playNow = document.getElementById("playNow");
    playNow.addEventListener('click', (e) => {
        e.stopPropagation();

        let first_song = songsArr[0];
        console.log(first_song);
        playSong(first_song.getAttribute('data-href'), first_song.id);
    })
}
main();

function chngToPause() {
    play_pause.innerHTML = ``;
    play_pause.innerHTML = `<i class="fa-solid fa-pause"></i>`;
}

function chngToPlay() {
    play_pause.innerHTML = ``;
    play_pause.innerHTML = `<i class="fa-solid fa-play"></i>`;
}