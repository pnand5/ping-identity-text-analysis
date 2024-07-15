# Text Statistics Backend

This application contains an API that handles and process any text file uploaded and returns a result of required text statistic KPI's

# command to start the application
npm install
npm run start

# commands to test the application features
# if using systems other than mac, pls ensure to set NODE_ENV=test before running tests
npm run test


# design choices
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