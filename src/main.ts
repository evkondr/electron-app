// const { ipcRenderer } = require('electron');
const form = document.querySelector('.form') as HTMLElement;
const submit = document.querySelector('.form__submit') as HTMLElement;
const messageBox = document.querySelector('.message') as HTMLElement;
const errorBox = document.querySelector('.error-box') as HTMLElement;
const controllerBox = document.querySelector('.controller') as HTMLElement;
const changeLoginBtn = document.querySelector('#change-login') as HTMLElement;
const fetchDataBtn = document.querySelector('#fetch-data') as HTMLElement;
const exportBtn = document.querySelector('#export') as HTMLElement;
let fetchedData:any;

const isLoggedIn = false;
let token = '';
// Functions
const clearMessages = () => {
  errorBox.innerText = ''
  messageBox.innerText = ''
}
const logIn = (username:string, password:string) => {
  clearMessages();
  // @ts-expect-error
  ipcRenderer.send('fetch-token', {username, password})
}
const logOut = () => {
  token = '';
  form.classList.toggle('hidden');
  controllerBox.classList.toggle('hidden')
  exportBtn.classList.add('hidden')
  clearMessages()
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
fetchDataBtn.addEventListener('click', (e) => {
  e.preventDefault();
  // @ts-expect-error
  ipcRenderer.send('fetch-data', { token });
  messageBox.innerText = 'Загрузка данных...';
})
exportBtn.addEventListener('click', (e) => {
  e.preventDefault();
  // @ts-expect-error
  ipcRenderer.send('export-data', { data: fetchedData });
  messageBox.innerText = 'Выполняется экспорт данных. Ожидайте...'
})
//Emmiters
// @ts-expect-error
ipcRenderer.on('fetch-token-response', (event, data) => {
  token = data.result.token
  form?.classList.toggle('hidden')
  controllerBox.classList.toggle('hidden')
});
// @ts-expect-error
ipcRenderer.on('fetch-data-response', (event, data) => {
  messageBox.innerText = 'Загрузка данных завершена'
  fetchedData = [...data.result.products]
  exportBtn.classList.remove('hidden')
});
// @ts-expect-error
ipcRenderer.on('export-data-response', (event, data) => {
  messageBox.innerText = data.message
});
// @ts-expect-error
ipcRenderer.on('fetch-data-error', (event, data) => {
  errorBox.innerText = data.message
});