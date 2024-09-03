let form = document.getElementById("signup-container__form");
let input = document.getElementById("email");
let errorMessage = document.getElementById("signup-container__form--warning");


form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (input.value == '') {
        alert("Enter Valid Information!");
    } 
    else if (input.checkValidity()) {
        const email = input.value;
        form.action = `../signup-2.html?email=${email}`;
        form.submit();
    }
});

input.addEventListener('input', () => {
    if (input.checkValidity()) {
        errorMessage.textContent = '';
    }
    else {
        errorMessage.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i>
                    This email is invalid. Make sure it's written like example@email.com`;
    }
});
