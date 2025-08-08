console.log("Let's listen to songs!");

let currentSong = new Audio();
let play = document.getElementById("play");
let currFolder;
let songs = [];

function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

async function getSongs(folder) {
    try {
        currFolder = folder;
        let response = await fetch(`http://127.0.0.1:5500/${folder}/`);
        let html = await response.text();
        let div = document.createElement("div");
        div.innerHTML = html;

        let links = div.getElementsByTagName("a");
        let songList = [];

        for (let link of links) {
            let href = link.href;
            if (href.endsWith(".mp3")) {
                songList.push(href.split(`/${folder}/`)[1]);
            }
        }

        return songList;
    } catch (error) {
        console.error("Failed to fetch songs:", error);
        return [];
    }
}

function playMusic(track) {
    currentSong.src = `/${currFolder}/` + track;
    currentSong.play();

    document.querySelector(".songinfo").textContent = decodeURIComponent(track);
    document.querySelector(".songtime").textContent = `00:00 / 00:00`;
    play.src = "img/pausebtn.svg";
}

async function DisplayAllbums() {
    let response = await fetch(`http://127.0.0.1:5500/songs/`);
    let html = await response.text();
    let div = document.createElement("div");
    div.innerHTML = html;
    let allas = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");

    for (let e of Array.from(allas)) {
        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").filter(Boolean).pop();
            try {
                let res = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
                let info = await res.json();

                cardContainer.innerHTML += `
                    <div data-folder="${folder}" class="card">
                        <img src="/songs/${folder}/cover.jpg" alt="" class="img fixed-img">
                        <div class="play">
                            <img src="img/play.svg" alt="" width="16px" height="16px" class=" playitin">
                        </div>
                        <h3>${info.title}</h3>
                        <div class="infoinit">${info.description || ""}</div>
                        <span class="span"></span>
                    </div>`;
            } catch (err) {
                console.warn(`Could not load info for folder: ${folder}`, err);
            }
        }
    }

    // Bind click event to cards
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", async e => {
            let folder = e.currentTarget.dataset.folder;
            songs = await getSongs(`songs/${folder}`);
            playMusic(songs[0])
            const songUL = document.querySelector(".songlist ul");
            songUL.innerHTML = "";

            for (const song of songs) {
                songUL.innerHTML += `
                    <li>
                        <div class="info">
                            <div><img src="img/music.svg" alt="">${decodeURIComponent(song)}</div>
                            <div>Rida</div>
                        </div>
                        <img  src="img/playit.svg" alt="" class="invert">
                    </li>`;
            }

            // Bind song click events
            document.querySelectorAll(".songlist li").forEach((li, index) => {
                li.addEventListener("click", () => {
                    playMusic(songs[index]);
                });
            });
        });
    });
}

async function main() {
    const songUL = document.querySelector(".songlist ul");
    const previous = document.getElementById("previous");
    const next = document.getElementById("next");

    // Load default folder (e.g., "cs")
    songs = await getSongs("songs/cs");

    for (const song of songs) {
        songUL.innerHTML += `
            <li>
                <div class="info">
                    <div><img src="img/music.svg" alt="">${decodeURIComponent(song)}</div>
                    <div>Rida</div>
                </div>
                <img src="img/playit.svg" alt="" class="invert">
            </li>`;
    }

    document.querySelectorAll(".songlist li").forEach((li, index) => {
        li.addEventListener("click", () => {
            playMusic(songs[index]);
        });
    });

    // Play/Pause Button
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pausebtn.svg";
        } else {
            currentSong.pause();
            play.src = "img/plays.svg";
        }
    });

    // Time update
    currentSong.addEventListener("timeupdate", () => {
        const current = formatTime(currentSong.currentTime);
        const duration = formatTime(currentSong.duration);
        document.querySelector(".songtime").textContent = `${current} / ${duration}`;

        if (!isNaN(currentSong.duration)) {
            document.querySelector(".circle").style.left = `${(currentSong.currentTime / currentSong.duration) * 100}%`;
        }
    });

    // Seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width);
        currentSong.currentTime = currentSong.duration * percent;
        document.querySelector(".circle").style.left = `${percent * 100}%`;
    });

    // Previous
    previous.addEventListener("click", () => {
        let fileName = currentSong.src.split("/").pop();
        let index = songs.indexOf(fileName);
        if (index > 0) playMusic(songs[index - 1]);
    });

    // Next
    next.addEventListener("click", () => {
        let fileName = currentSong.src.split("/").pop();
        let index = songs.indexOf(fileName);
        if (index >= 0 && index < songs.length - 1) playMusic(songs[index + 1]);
    });

    // Volume
    document.querySelector("#volumeit").addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    });
}

// Call everything
DisplayAllbums();
main();