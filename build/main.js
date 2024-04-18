"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const form = document.querySelector('.form');
const submit = document.querySelector('.form__submit');
const messageBox = document.querySelector('.message');
const isLoggedIn = false;
const token = '';
const logIn = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch('https://b2b.topsports.ru/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                username,
                password
            })
        });
        if (!response.ok) {
            throw new Error();
        }
        const result = yield response.json();
        messageBox.innerText = `Токен получен: ${result.token}`;
        form === null || form === void 0 ? void 0 : form.classList.add('hidden');
    }
    catch (error) {
        console.log(error);
    }
});
submit === null || submit === void 0 ? void 0 : submit.addEventListener('click', (e) => {
    e.preventDefault();
    const login = form === null || form === void 0 ? void 0 : form.querySelector("input[name='login']");
    const password = form === null || form === void 0 ? void 0 : form.querySelector("input[name='password']");
    logIn(login.value, password.value);
});
