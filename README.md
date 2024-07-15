# ping-identity-text-analysis
contains both frontend and backend source code 


# text-statistics-backend
This application contains an API that processes an uploaded text file and returns the required text statistic KPI's

# command to start the application
cd ./text-statistics-backend <br/>
npm install <br/>
npm run start <br/>

# commands to test the application features
if using systems other than mac, pls ensure to set NODE_ENV=test before running tests <br/>
cd ./text-statistics-backend<br/>
npm run test<br/>


# Design choices
1. this nodejs application is enabled to start as a cluster to take advantage of all available cores in the running system
2. when a file is uploaded, it is not stored anywhere either in disk or in memory as entire file content buffer, rather the read stream of the file is
directly used to process the chunks of buffer one line at a time. 
3. before the file is processed for text statistics, a validation middleware function is written that validates HTTP request form data, request headers, handles unsupported file types and other errors.
4. we iterate through each character in the line, categorize the character into
    * type 1: letters: an alphabet (a-zA-Z) or a number 
    * type 2: word:  a set of letters, may contain '-', '_'
    * type 3: symbol: which is not an alphabet, not a number 
    * type 4: word breaker: all white spaces, symboles except '-' '_'
5. To find most common word and letter, we keep track of the count and finally sort them accordingly.
6. Error handling middleware is kept common for errors and can be categorized based on types and can be written to the response.
7. is configured to support files upto 1GB, we can increase this here (file: FileUploadValidator, line number 4: maxFileSizeInBytes)



# text-statistics-frontend
UI application to upload a text file and see the text statistics results

# command to start the application
cd ./text-statistics-frontend <br/>
npm install<br/>
npm start<br/>

# working
1. this application has only one simple page and an App component rendered at root
2. It contains a form with a file upload element and a submit button
3. Once user chooses a file and submits it, we call our server api and show the results 
4. we handle errors and display the error message in the UI