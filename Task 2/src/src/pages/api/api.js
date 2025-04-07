// lib/api.js

const API_URL = 'http://localhost:8000/posts'; // Replace with your actual API base URL

// Generalized fetch function
async function fetchAPI(endpoint, method = 'GET', body = null, queryParams = {}) {
  // Create URL with query parameters
  const url = new URL(`${API_URL}${endpoint}`);

  // Append query parameters to the URL if provided
  Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));

  const headers = {
    'Content-Type': 'application/json',
  };

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  return response.json();
}

// Example GET Request (like Get All Messages or Get User Messages)
export const getAllMessages = () => fetchAPI('/getall', 'GET');

// Updated GET Request for User Messages, now includes UserName as query parameter
export const getUserMessages = (userName) => 
  fetchAPI('/getuser', 'GET', null, { UserName: userName }); // Pass UserName in query parameters

export const getChatMessages = (userName, chatTitle) => 
  fetchAPI('/gethistory', 'GET', null, { UserName: userName, ChatTitle: chatTitle }); // Pass multiple query params

// Example POST Request (Create a new message)
export const createMessage = (messageData) => fetchAPI('/createmessage', 'POST', messageData);

// Example PUT Request (Update a post)
export const sendQuery = (UserName, ChatTitle, query) => {
  const messageData = { query: query };
  
  return fetch('/query', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messageData),
  })
  .then(response => response.json())
  .then(data => {
    console.log("Query sent successfully:", data);
    return data;
  })
  .catch(error => {
    console.error("Error sending query:", error);
  });
};

// Example DELETE Request (Delete a message)
export const deleteMessage = (messageId) => fetchAPI('/delete', 'DELETE');