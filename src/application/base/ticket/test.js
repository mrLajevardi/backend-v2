const fetch = require('node-fetch-commonjs');
const myHeaders = new Headers();
myHeaders.append(
  'Cookie',
  '_zammad_session_a138cfd0f37=b051b73e9273f19899cc535d7cd9390e',
);

const requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow',
};

fetch(
  'http://185.213.10.206:9090/api/v1/ticket_attachment/31/45/5',
  requestOptions,
)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
