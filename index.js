const express = require('express');
const app = express();


const requestCounts = new Map();

const requestTimers = new Map();
const requestBlocks = new Map();

app.use((req, res, next) => {
  const clientIP = req.ip;

  if(!requestBlocks.get(clientIP)){

    if (!requestCounts.has(clientIP)) {
        requestCounts.set(clientIP, 1);
    
      
        requestTimers.set(clientIP, setTimeout(() => {
          requestCounts.delete(clientIP);
          requestTimers.delete(clientIP);
        }, 60000));
      } else {
      
        requestCounts.set(clientIP, requestCounts.get(clientIP) + 1);
    
      
        if (requestCounts.get(clientIP) > 10) {
    
            requestBlocks.set(clientIP,setTimeout(()=>{
                requestBlocks.delete(clientIP)
            },300000))
          return res.status(429).send('Too many requests. You are blocked.');
        }
      }
    
  }
  else{
    return res.send('You are blocked for 5 minutes please wait')
  }
 
  next();
});

app.get('/', (req, res) => {
  res.send(`Hello server request count <h1>${requestCounts.get(req.ip)}</h1>`);
});

app.listen(4040, () => {
  console.log('Server running on http://localhost:4040/');
});
