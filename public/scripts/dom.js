/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function createDom(fields) {
  fetch('/api/doms', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function editDom(fields) {
  fetch(`/api/doms/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteDom(fields) {
  fetch('/api/doms', {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function viewDomsByAuthor(fields) {
  fetch(`/api/doms?author=${fields.author}`)
    .then(showResponse)
    .catch(showResponse);
}
