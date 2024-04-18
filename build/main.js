"use strict";
const { ipcRenderer } = require('electron');
const form = document.querySelector('.form');
const submit = document.querySelector('.form__submit');
const messageBox = document.querySelector('.message');
const errorBox = document.querySelector('.error-box');
const controllerBox = document.querySelector('.controller');
const changeLoginBtn = document.querySelector('#change-login');
const fetchDataBtn = document.querySelector('#fetch-data');
const isLoggedIn = false;
let token = '';
// Functions
const logIn = (username, password) => {
    errorBox.innerText = "";
    ipcRenderer.send('fetch-token', { username, password });
};
const logOut = () => {
    token = '';
    form.classList.toggle('hidden');
    controllerBox.classList.toggle('hidden');
};
// Handlers
submit === null || submit === void 0 ? void 0 : submit.addEventListener('click', (e) => {
    e.preventDefault();
    const login = form === null || form === void 0 ? void 0 : form.querySelector("input[name='login']");
    const password = form === null || form === void 0 ? void 0 : form.querySelector("input[name='password']");
    logIn(login.value, password.value);
});
changeLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logOut();
});
//Emmiters
ipcRenderer.on('fetch-token-response', (event, data) => {
    token = data.result.token;
    form === null || form === void 0 ? void 0 : form.classList.toggle('hidden');
    messageBox.innerText = token;
});
ipcRenderer.on('fetch-data-error', (event, data) => {
    errorBox.innerText = data.message;
});
