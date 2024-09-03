/////////////////////////////   GettingQueryParameter      //////////////////////////

function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

let email = getQueryParameter("email");
let username;
let password;

/////////////////////////////////////   FormEvent   ///////////////////////////

let form = document.getElementById("signup-container__form-2");
form.addEventListener('submit', async (event) => {

    event.preventDefault();
    try {
        username = document.getElementById("username").value;
        password = document.getElementById("password").value;
        if (username != '' && password != '' && email != '') {
            let response = await setData(email, username, password);

            if (response.error) {
                showError(response.error);
            }
            else {
                console.log(response.message);
                form.action = `../login.html?signup=${true}`;
                form.submit();
            }

        } else {
            alert("Enter Valid Information!");
        }
    } catch (error) {
        console.log(`Error validation: ${error.message}`);
        alert("Something went Wrong!");
    }
});


///////////////////////////////////     SetData     /////////////////////////

async function setData(em, uName, pass) {
    const data = {
        "username": uName,
        "password": pass,
        "email": em
    };

    return new Promise(async (resolve, reject) => {
        try {
            await fetch('http://localhost:3001/auth/signup', {
                method: 'POST',
                headers: {
                    Accept: '*/*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(async (response) => {
                    return await response.json();
                })
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                })
        } catch (error) {
            console.log(`Error in Promise: ${error.message}`);
        }
    });
}

/////////////////////////////////////////   ShowPassword    ////////////////////////

function showPassword(event) {
    event.preventDefault();
    let password = document.getElementById("password");
    let showBtn = document.getElementById("show-btn");
    if (password.type === 'password') {
        showBtn.innerHTML = ``;
        showBtn.innerHTML = `<i class="fa-regular fa-eye"></i>`;
        showBtn.style.transform = 'transform: scale(1) translateX(-160%) translateY(10%)';
        password.type = 'text';
    } else {
        showBtn.innerHTML = ``;
        showBtn.innerHTML = `<i class="fa-regular fa-eye-slash"></i>`;
        showBtn.style.transform ='transform: scale(0.6) translateX(-160%) translateY(10%)';
        password.type = 'password';
    }
}


////////////////////////////    ShowError       ////////////////////////////

function showError(error) {
    console.log(error);
    let username_Warning = document.getElementById("username-warning");
    let password_Warning = document.getElementById("password-warning");

    if (error.includes("username") || error.includes("email")) {
        username_Warning.innerHTML = `
        <i class="fa-solid fa-circle-exclamation"></i>
        ${error}
        `;
    } else {
        username_Warning.innerHTML = ``;
    }

    if (error.includes("password")) {
        password_Warning.innerHTML = `
        <i class="fa-solid fa-circle-exclamation"></i>
        ${error}
        `;
    } else {
        password_Warning.innerHTML = ``;
    }

}