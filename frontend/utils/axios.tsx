import axios from 'axios';
import * as constants from '../constants';

// CSRF not necessary since api only being used for mobile
// app, and CSRF protects against browser attacks but
// I might create a website in the future so I'll keep it
// in for now
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

// Fetch CSRF token and set default csrf header for all post requests
axios.get(constants.HOST_ADDRESS + ':8000/api/csrf/')
  .then(response => {
    const csrfToken = response.data.csrfToken;

    axios.defaults.headers.post['X-CSRFToken'] = csrfToken;
  })
  .catch(error => {
    console.error(error);
  });

const client = axios.create({
  baseURL: constants.HOST_ADDRESS + ":8000"
});

export default client;