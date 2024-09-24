import { DataKeeper } from "./auth.js";

var body = document.body;
let cardContainer = document.querySelector(".card-container");
let cardId = 1;

//////////////////////////////      IndexedDB       ////////////////////////////

let db;
async function DbOpener() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('userDatabase', 6);

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            if (!db.objectStoreNames.contains("userDataStore")) {
                db.createObjectStore("userDataStore", { keyPath: "userId", autoIncrement: false });
            }
            resolve(db);
        };
        request.onsuccess = async (event) => {
            db = event.target.result;
            resolve(db);
        };
        request.onerror = (event) => {
            console.log(event.target.error);
            reject(event.target.error);
        };
    })
}

///////////////////////////////////     GetData     ///////////////////////////////

function getData() {
    return new Promise((resolve, reject) => {
        let transaction = db.transaction(["userDataStore"], "readonly");
        let objectStore = transaction.objectStore("userDataStore");

        let getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = (event) => {
            let userData = event.target.result;
            resolve(userData);
        };

        getAllRequest.onerror = (event) => {
            let error = event.target.errorCode;
            console.log("Error retrieving data: ", event.target.errorCode);
            reject(error);
        };
    });
}

//////////////////////////////////       DeleteData     /////////////////////////

function deleteData() {
    return new Promise((resolve, reject) => {
        let transaction = db.transaction(["userDataStore"], "readwrite");
        let objectStore = transaction.objectStore("userDataStore");

        let request = objectStore.delete(6);
        objectStore.delete(1);

        request.onsuccess = (event) => {
            let userData = event.target.result;
            resolve(userData);
        };

        request.onerror = (event) => {
            let error = event.target.errorCode;
            console.log("Error retrieving data: ", event.target.errorCode);
            reject(error);
        };
    });
}

//////////////////////////      DataChecker     ///////////////////////////////

async function dataChecker() {
    await DbOpener();
    let userData = await getData();
    let signupBtn = document.getElementsByClassName("signup-Btn");
    let loginBtn = document.getElementById("login-Btn");
    let logoutBtn = document.getElementById("logout-Btn");
    let userIcon = document.getElementById("userIcon");
    let userIconName = document.getElementById("userIconName");
    if (userData[0]) {
        console.log("Data found");
        userIconName.innerHTML = `${userData[0].username.charAt(0).toUpperCase()}`;
        for (let i = 0; i < signupBtn.length; i++) {
            signupBtn[i].style.display = "none";
        }
        loginBtn.style.display = "none";
        userIcon.style.display = 'block';
        logoutBtn.style.display = 'block';
    } else {
        console.log("No Data Found");
        userIcon.style.display = 'none';
        logoutBtn.style.display = 'none';
        for (let i = 0; i < signupBtn.length; i++) {
            signupBtn[i].style.display = "block";
        }
        loginBtn.style.display = "block";
    }
}

dataChecker();
///////////////////////     Search      /////////////////////////////////


let search = document.getElementById("search");
search.addEventListener('mousedown', () => {
    let searchbar = document.getElementById("searchbar-box");
    searchbar.style.opacity = '1';
});


//////////////////////////////      LanguagePoppup      ////////////////


function showLibraryPoppup() {
    let poppup_HTML = `<div class="content">
    <div class="library__poppup--1">
    <div>
    <h2 class="heading-2 u-mb-small">Choose a language</h2>
    <p class="paragraph">This updates what you read on MySpotify.com</p>
    </div>
    <button class="close-btn" id="close-btn" onclick="hideLibraryPoppup()">
                <i class="fa-solid fa-xmark"></i>
            </button>
            </div>
            <div class="library__poppup--2">
            <div class="language">
            <h4 class="heading-3">English</h4>
            <p class="language__para">English</p>
            </div>
            <div class="language">
            <h4 class="heading-3">English</h4>
            <p class="language__para">United Kingdom</p>
            </div>
            <div class="language">
            <h4 class="heading-3">Afrikaans</h4>
            <p class="language__para">Afrikaans</p>
            </div>
            <div class="language">
                <h4 class="heading-3">አማርኛ</h4>
                <p class="language__para">Amharic</p>
                </div>
                <div class="language">
                <h4 class="heading-3">العربي</h4>
                <p class="language__para">Arabic</p>
            </div>
            <div class="language">
                <h4 class="heading-3">Bosanski</h4>
                <p class="language__para">Bosnian</p>
            </div>
            <div class="language">
            <h4 class="heading-3">Dansk</h4>
            <p class="language__para">Danish</p>
            </div>
            <div class="language">
            <h4 class="heading-3">Deutsch</h4>
            <p class="language__para">German</p>
            </div>
            <div class="language">
            <h4 class="heading-3">Eesti</h4>
            <p class="language__para">Estonian</p>
            </div>
            <div class="language">
            <h4 class="heading-3">Euskara</h4>
            <p class="language__para">Basque</p>
            </div>
            <div class="language">
            <h4 class="heading-3">فارسي</h4>
            <p class="language__para">Persan</p>
            </div>
            <div class="language">
            <h4 class="heading-3">Suomeksi</h4>
            <p class="language__para">Finnish</p>
            </div>
            <div class="language">
                <h4 class="heading-3">Filipino</h4>
                <p class="language__para">Filipino</p>
                </div>
            <div class="language">
            <h4 class="heading-3">Eλληνικά</h4>
            <p class="language__para">Greek</p>
            </div>
            <div class="language">
            <h4 class="heading-3">Galego</h4>
                <p class="language__para">Galecian</p>
                </div>
                <div class="language">
                <h4 class="heading-3">हिन्दी</h4>
                <p class="language__para">Hindi</p>
            </div>
            <div class="language">
            <h4 class="heading-3">Hrvatski</h4>
            <p class="language__para">Croatian</p>
            </div>
            <div class="language">
            <h4 class="heading-3">Magyar</h4>
            <p class="language__para">Hungarian</p>
            </div>
            <div class="language">
            <h4 class="heading-3">Bahasa Indonesia</h4>
            <p class="language__para">Indonesian</p>
            </div>
            <div class="language">
            <h4 class="heading-3">Italiano</h4>
            <p class="language__para">Italian</p>
            </div>
            <div class="language">
            <h4 class="heading-3">मराठी</h4>
            <p class="language__para">Marathi</p>
            </div>
            <div class="language">
            <h4 class="heading-3">Melayu</h4>
            <p class="language__para">Melay</p>
            </div>
            <div class="language">
            <h4 class="heading-3">Nederlands</h4>
            <p class="language__para">Dutch</p>
            </div>
            <div class="language">
                <h4 class="heading-3">ଓଡ଼ିଆ</h4>
                <p class="language__para">Odia</p>
            </div>
            <div class="language">
                <h4 class="heading-3">українська</h4>
                <p class="language__para">Ukranian</p>
                </div>
            <div class="language">
                <h4 class="heading-3">اردو</h4>
                <p class="language__para">Urdu</p>
                </div>
                </div>
                </div>`;

    let poppup = document.createElement('div');
    poppup.className = 'library__poppup';
    poppup.innerHTML = poppup_HTML;
    body.appendChild(poppup);
}
document.getElementById("language-btn").addEventListener('click', showLibraryPoppup)


function hideLibraryPoppup() {
    let poppup = document.querySelector(".library__poppup");
    body.removeChild(poppup);
}
window.hideLibraryPoppup = hideLibraryPoppup;



///////////////////////////     Navigation      ////////////////////////////////

function homePage() {
    window.location.href = 'index.html';
}
document.getElementById("home-btn").addEventListener('click', homePage);

function NavigateToSignup() {
    window.location.href = 'signup.html';
}
Array.from(document.getElementsByClassName("signup-Btn")).forEach(element => {
    element.addEventListener('click', NavigateToSignup);
});

function NavigateToLogin() {
    window.location.href = 'login.html';
}
document.getElementById("login-Btn").addEventListener('click', NavigateToLogin);

///////////////////////////     GetAlbums       ///////////////////////////

async function getAlbums() {
    let songs = await fetch('/songs/');
    let response = await songs.text();

    let div = document.createElement('div');
    div.innerHTML = response;
    
    let as = div.getElementsByTagName('a');
    let folder = [];

    for (let i = 0; i < as.length - 1; i++) {
        if (as[i].href.includes("/songs/")) {
            folder.push((as[i].href.split("/songs/"))[1]);
        }
    }
    return folder;
}


///////////////////////////     FoldersCreation     /////////////////////////////

async function createFolders(folders) {
    for (let i = 0; i < folders.length; i++) {
        let a = await fetch(`/songs/${folders[i]}`);
        let response = await a.text();

        let div = document.createElement('div');
        div.innerHTML = response;

        let as = div.getElementsByTagName('a');
        let folder = [];

        for (let i = 0; i < as.length; i++) {
            if (as[i].href.includes("/songs/")) {
                folder.push(as[i].href);
            }
        }
        createAlbums(folder);
    }
    return folders;
}

////////////////////////        CreateAlbums        //////////////////////////////

async function createAlbums(folder) {
    let img = folder[1];
    let a = await fetch(folder[2]);
    let response = await a.json();

    let card = document.createElement('div');
    card.className = 'card';
    card.id = `${cardId}`;
    cardId++;
    card.innerHTML = `<img src="${img}" alt="Angry Mood">
                            <h4 class="heading-4">${response.title}</h4>
                            <p>${response.description}</p>
                            <button class="play-btn"><i class="fa-solid fa-play"></i></button>`;
    cardContainer.appendChild(card);
}

//////////////////////////      MAIN      ////////////////////////////////////

async function main() {
    let albums = await getAlbums();
    let folders = await createFolders(albums);
    await delay(500);

    const card_divs = document.getElementsByClassName("card");
    Array.from(card_divs).forEach(element => {
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = e.target.closest('.card');

            if (card) {
                const img = card.querySelector('img').src;
                const heading = card.querySelector('h4').innerHTML;
                const text = card.querySelector('p').innerHTML;
                window.location.href = `./album.html?img=${img}&heading=${heading}&text=${text}&folder=${folders[card.id - 1]}`;
            }
        });
    });
}

main();


///////////////////////     Delay      ///////////////////////////////////

async function delay(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time)
    });
}

async function logout() {
    await deleteData();
    location.reload(true);
}
window.logout = logout;