import { DataKeeper } from "./auth.js";

//////////////////////////////      IndexedDB       ////////////////////////////

const request = indexedDB.open('userDatabase', 6);
let db;

request.onupgradeneeded = (event) => {
    let db = event.target.result;
    if (!db.objectStoreNames.contains("userDataStore")) {
        db.createObjectStore("userDataStore", { keyPath: "userId", autoIncrement: false });
    }
};
request.onsuccess = async (event) => {
    db = event.target.result;
};
request.onerror = (event) => {
    console.log(event.target.error);
};

/////////////////////////////////////   AddData    ///////////////////////////////

async function addData(userData) {
    return new Promise((resolve, reject) => {
        if (!db.objectStoreNames.contains("userDataStore")) {
            reject("Object store 'userDataStore' does not exist.")
            return;
        }

        let transaction = db.transaction(["userDataStore"], "readwrite");
        let objectStore = transaction.objectStore("userDataStore");

        let response = objectStore.put(userData);

        response.onsuccess = () => {
            resolve(`Data added successfully for ${userData.username}`);
        };

        response.onerror = (event) => {
            reject(`Error: ${event.target.errorCode}`);
        };
    });
}

/////////////////////////////////// Form Validator  /////////////////////////

let form = document.querySelector(".login-container__form");
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopPropagation();

    let username = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (username == '' || password == '') {
        alert("Invalid Information!\nPlease Enter Correct Information");
    }
    else {
        const data = {
            "email": username,
            "password": password
        };

        let response = await getData(data);

        if (typeof response.message == "string" && typeof response.error == "object" && typeof response.data == "object") {

            const userData = {
                "userId": 1,
                "username": response.data.username,
                "email": response.data.email,
                "id": response.data.id,
                "createdAt": response.data.createdAt,
                "updatedAt": response.data.updatedAt
            }
            let dataResponse = await addData(userData);
            form.action = `../index.html`;
            form.submit();
        } else {
            let errorMessage = document.getElementsByClassName("login-container__warning");
            errorMessage[0].style.color = 'red';
            errorMessage[0].innerHTML = `<i class="fa-solid fa-circle-exclamation"></i>
                                Username or Password incorrect.`;
            console.log(response.error);
        }
    }
});


/////////////////////////////////   Input Checker    /////////////////////////////////

form.addEventListener('input', (event) => {
    event.preventDefault();
    let password = document.getElementById("password").value;
    let username = document.getElementById("email").value;
    let errorMessage = document.getElementsByClassName("login-container__warning");

    if (username != '') {
        document.getElementById("email").style.border = '1px solid #fff';
        errorMessage[0].innerHTML = ``;
    } else {
        document.getElementById("email").style.border = '1px solid red';
        errorMessage[0].innerHTML = ` <i class="fa-solid fa-circle-exclamation"></i>
                                Please enter your spotify username or email address.`;
    }

    if (password != '') {
        document.getElementById("password").style.border = '1px solid #fff';
        errorMessage[1].innerHTML = ``;
    } else {
        document.getElementById("password").style.border = '1px solid red';
        errorMessage[1].innerHTML = `<i class="fa-solid fa-circle-exclamation"></i>
                                Please enter your password.`;
    }

});

/////////////////////////////////////////   ShowPassword    ////////////////////////

function showPassword(event) {
    event.preventDefault();
    let password = document.getElementById("password");
    let showBtn = document.getElementById("show-btn");
    if (password.type === 'password') {
        showBtn.innerHTML = ``;
        showBtn.innerHTML = `<i class="fa-regular fa-eye"></i>`;
        password.type = 'text';
    } else {
        showBtn.innerHTML = ``;
        showBtn.innerHTML = `<i class="fa-regular fa-eye-slash"></i>`;
        password.type = 'password';
    }
}
window.showPassword = showPassword;

////////////////////////////////////    GetAPIData     /////////////////////////

async function getData(data) {
    return new Promise(async (resolve, reject) => {
        try {
            await fetch(`http://localhost:3001/auth/login`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
                .then(async (e) => {
                    return await e.json();
                })
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    console.log(`${error}`);
                    reject(error);
                })
        } catch (error) {
            console.log(error);
        }
    });
}
