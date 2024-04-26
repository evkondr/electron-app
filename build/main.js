"use strict";
// const { ipcRenderer } = require('electron');
const form = document.querySelector('.form');
const submit = document.querySelector('.form__submit');
const messageBox = document.querySelector('.message');
const errorBox = document.querySelector('.error-box');
const controllerBox = document.querySelector('.controller');
const changeLoginBtn = document.querySelector('#change-login');
const fetchDataBtn = document.querySelector('#fetch-data');
const exportBtn = document.querySelector('#export');
let fetchedData;
const isLoggedIn = false;
let token = '';
// Functions
const clearMessages = () => {
    errorBox.innerText = '';
    messageBox.innerText = '';
};
const logIn = (username, password) => {
    clearMessages();
    // @ts-expect-error
    ipcRenderer.send('fetch-token', { username, password });
};
const logOut = () => {
    token = '';
    form.classList.toggle('hidden');
    controllerBox.classList.toggle('hidden');
    exportBtn.classList.add('hidden');
    clearMessages();
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
fetchDataBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // @ts-expect-error
    ipcRenderer.send('fetch-data', { token });
    messageBox.innerText = 'Загрузка данных...';
});
exportBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // @ts-expect-error
    ipcRenderer.send('export-data', { data: fetchedData });
    messageBox.innerText = 'Выполняется экспорт данных. Ожидайте...';
});
//Emmiters
// @ts-expect-error
ipcRenderer.on('fetch-token-response', (event, data) => {
    token = data.result.token;
    form === null || form === void 0 ? void 0 : form.classList.toggle('hidden');
    controllerBox.classList.toggle('hidden');
});
// @ts-expect-error
ipcRenderer.on('fetch-data-response', (event, data) => {
    messageBox.innerText = 'Загрузка данных завершена';
    fetchedData = [...data.result.products];
    exportBtn.classList.remove('hidden');
});
// @ts-expect-error
ipcRenderer.on('export-data-response', (event, data) => {
    messageBox.innerText = data.message;
});
// @ts-expect-error
ipcRenderer.on('fetch-data-error', (event, data) => {
    clearMessages();
    errorBox.innerText = data.message;
});
