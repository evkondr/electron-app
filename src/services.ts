import axios from 'axios';
export default class APISerives {
  static async login (username: string, password:string) {
    const result = await axios.post('https://b2b.topsports.ru/api/login', {
      username,
      password
    })
    return result.data;
  }
  static async fetchData(token:string) {
    const result = await axios.get('https://b2b.topsports.ru/api/catalog', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return result.data;
  }
}
