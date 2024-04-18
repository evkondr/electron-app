const { ipcRenderer } = require('electron');
const form = document.querySelector('.form') as HTMLElement;
const submit = document.querySelector('.form__submit') as HTMLElement;
const messageBox = document.querySelector('.message') as HTMLElement;
const errorBox = document.querySelector('.error-box') as HTMLElement;
const controllerBox = document.querySelector('.controller') as HTMLElement;
const changeLoginBtn = document.querySelector('#change-login') as HTMLElement;
const fetchDataBtn = document.querySelector('#fetch-data') as HTMLElement;

const isLoggedIn = false;
let token = '';
// Functions
const logIn = (username:string, password:string) => {
  errorBox.innerText = ""
  ipcRenderer.send('fetch-token', {username, password})
}
const logOut = () => {
  token = '';
  form.classList.toggle('hidden');
  controllerBox.classList.toggle('hidden')
}

// Handlers
submit?.addEventListener('click', (e) => {
  e.preventDefault();
  const login = form?.querySelector("input[name='login']") as HTMLInputElement;
  const password = form?.querySelector("input[name='password']") as HTMLInputElement;
  logIn(login.value, password.value);
});

changeLoginBtn.addEventListener('click', (e) => {
  e.preventDefault();
  logOut()
});

//Emmiters
ipcRenderer.on('fetch-token-response', (event, data) => {
  token = data.result.token
  form?.classList.toggle('hidden')
  messageBox.innerText = token
});

ipcRenderer.on('fetch-data-error', (event, data) => {
  errorBox.innerText = data.message
});