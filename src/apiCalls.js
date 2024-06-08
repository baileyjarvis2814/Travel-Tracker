function fetchData(fileName) {
  return fetch(`http://localhost:3001/api/v1/${fileName}`)
    .then(response => response.json())
    .catch(error =>
      console.log(
        'Fetching failed due to', error));
}
  
function postData(fileName, bodyData) {
  return fetch(`http://localhost:3001/api/v1/${fileName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyData),
  })
    .then((response) => response.json())
    .catch((error) => 
      alert(
        'Posting failed due to', error));
}
  
export { fetchData, postData };