const http = require('http');
const fs = require('fs');
const path = require('path');

const serverUrl = 'http://localhost:3000';

// Test if the server is running
http.get(serverUrl, (res) => {
  if (res.statusCode === 200) {
    console.log('Server is running: PASS');
  } else {
    console.error('Server is not running: FAIL');
    process.exit(1);
  }
}).on('error', (err) => {
  console.error('Server is not running: FAIL', err);
  process.exit(1);
});

// Test if the /questions endpoint returns valid data
http.get(`${serverUrl}/questions`, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const questions = JSON.parse(data);
      if (Array.isArray(questions) && questions.length > 0) {
        console.log('/questions endpoint: PASS');
      } else {
        console.error('/questions endpoint: FAIL - No questions found');
        process.exit(1);
      }
    } catch (err) {
      console.error('/questions endpoint: FAIL - Invalid JSON', err);
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error('/questions endpoint: FAIL - Server error', err);
  process.exit(1);
});

// Test if the frontend files are served correctly
const frontendFiles = ['index.html', 'style.css', 'script.js'];
frontendFiles.forEach((file) => {
  http.get(`${serverUrl}/${file}`, (res) => {
    if (res.statusCode === 200) {
      console.log(`${file} served correctly: PASS`);
    } else {
      console.error(`${file} served correctly: FAIL`);
      process.exit(1);
    }
  }).on('error', (err) => {
    console.error(`${file} served correctly: FAIL`, err);
    process.exit(1);
  });
});
