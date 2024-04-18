const form = document.querySelector('.form');
const submit = document.querySelector('.form__submit');
const messageBox = document.querySelector('.message') as HTMLElement;
const isLoggedIn = false;
const token = '';
const logIn = async (username:string, password:string) => {
  try {
    const response = await fetch('https://b2b.topsports.ru/api/login', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        username,
        password
      })
    })
    if (!response.ok){
      throw new Error()
    }
    const result = await response.json()
    messageBox.innerText = `Токен получен: ${result.token}`
    form?.classList.add('hidden');
  } catch (error) {
    console.log(error);
  }
}

submit?.addEventListener('click', (e) => {
  e.preventDefault();
  const login = form?.querySelector("input[name='login']") as HTMLInputElement;
  const password = form?.querySelector("input[name='password']") as HTMLInputElement;
  logIn(login.value, password.value);
});
