export const fetchData = (endpoint) => {
  return fetch(`http://localhost:3001/api/v1/${endpoint}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error(`Fetching ${endpoint} failed due to`, error);
      throw error;
    });
};
export function postData(fileName, bodyData) {
  return fetch(`http://localhost:3001/api/v1/${fileName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyData),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Posting failed due to:', error);
      alert(`Posting failed: ${error.message}`);
      throw error;
    });
}
  