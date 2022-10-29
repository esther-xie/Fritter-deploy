/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewFreetsByFollowing(fields) {
  fetch('/api/follows/following/freets')
    .then(showResponse)
    .catch(showResponse);
}

function viewFollowingDoms(fields) {
  fetch('/api/follows/following')
    .then(showResponse)
    .catch(showResponse);
}

function viewDomsFollowers(fields) {
  fetch(`/api/follows/follower/${fields.dom}`)
    .then(showResponse)
    .catch(showResponse);
}

function follow(fields) {
  fetch(`/api/follows/${fields.dom}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function unfollow(fields) {
  fetch(`/api/follows/${fields.dom}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}