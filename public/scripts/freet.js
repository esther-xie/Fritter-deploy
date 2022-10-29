/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewAllFreets(fields) {
  fetch('/api/freets')
    .then(showResponse)
    .catch(showResponse);
}

function viewFreetsByAuthor(fields) {
  fetch(`/api/freets?author=${fields.author}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewFreetsByDom(fields) {
  fetch(`/api/freets?dom=${fields.dom}`)
    .then(showResponse)
    .catch(showResponse);
}

function createFreet(fields) {
  fetch(`/api/freets/${fields.dom}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function editFreet(fields) {
  fetch(`/api/freets/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteFreet(fields) {
  fetch(`/api/freets/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function alertFreet(fields) {
  fetch(`/api/alerts/${fields.freetId}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
  .then(showResponse)
  .catch(showResponse);
}

function unalertFreet(fields) {
  fetch(`/api/alerts/${fields.freetId}`, {method: 'DELETE'})
  .then(showResponse)
  .catch(showResponse);
}
