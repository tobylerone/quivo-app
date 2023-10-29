import axios from 'axios';
import * as constants from '../constants';

// CSRF not necessary since api only being used for mobile
// app, and CSRF protects against browser attacks but
// I might create a website in the future so I'll keep it
// in for now
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

// Fetch CSRF token and set default csrf header for all post requests

/*
axios.get(constants.HOST_ADDRESS + ':8000/api/csrf')
  .then(response => {
    csrfToken = response.data.csrfToken;
    //axios.defaults.headers.post['X-CSRFToken'] = csrfToken;
    axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
  })
  .catch(error => {
    console.error(error);
  });
*/

// Need to wait for promise to be resolved so use async/await
async function fetchCsrfToken() {

  let csrfToken = null;

  try {
    const response = await axios.get(constants.HOST_ADDRESS + ':8000/api/csrf');
    csrfToken = response.data.csrfToken;
    axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
  } catch (error) {
    console.error(error);
  }

  return csrfToken;

}

const client = axios.create({
  baseURL: constants.HOST_ADDRESS + ":8000",
  //headers: {
  //  common: {
  //    'X-CSRFToken': csrfToken //Fix the headers: https://stackoverflow.com/questions/59712034/how-to-properly-set-axios-default-headers
  //  }
  //}
});
  
fetchCsrfToken().then(csrfToken => {
  client.defaults.headers.common['X-CSRFToken'] = csrfToken;
});

export default client;