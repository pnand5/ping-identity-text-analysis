import { useState } from 'react'
import './App.css';

function App() {
  const [apiloader, setApiLoader] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [results, setResults] = useState(null);
  const [error, setErrored] = useState(null);

  const onFileUpload = (event) => {
    setSelectedFile(event.target.files[0]);
    setResults(null);
    setErrored(null);
    setApiLoader(false);
  }

  const onSubmit = () => {
    setResults(null);
    setErrored(null);
    setApiLoader(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    fetch(
      'http://localhost:8000/upload',
      {
        method: 'POST',
        body: formData,
      }
    ).then(async (response) => {
      const jsonResponse = await response.json();
      if (!response.ok) throw new Error(jsonResponse.message);

      return jsonResponse;
    }).then((result) => {
      setApiLoader(false);
      setResults(result);
    }).catch((error) => {
      setApiLoader(false);
      setErrored(error);
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>
          Welcome to Text File Statistics Application. Upload your file below and get the results.
        </h2>
        <h6>
          Note: <br />
          * This application doesn't store the uploaded file on the server. <br />
          * Accepted file types: Only text files <br />
          * A word can contain alphabets and numbers and '-', '_' <br />
          * A letter can be an alphabet or number<br />
          * All Whitespaces and symbols except ('-' '_' ) are considered as word breakers    <br />
        </h6>
      </header>
      <div className="App-body">
        <form>
          <input data-testid="uploader" id="uploader" type="file" name="file" onChange={onFileUpload} disabled={apiloader}></input>
        </form>
        <button onClick={onSubmit} disabled={apiloader}>Submit</button>
        {
          error &&
          <p className='errored'>{error.message}</p>
        }
        {
          apiloader &&
          <p>Loading ...</p>
        }
        {results &&
          <div className='result-body'>
            Results are: <br />
            Number of words in the file: {results.numberOfWords} <br />
            Number of letters in the file: {results.numbersOfLetters} <br />
            Number of symbols in the file: {results.numberOfSymbols} <br />
            Top three most common words in order : <br />
            {results.topCommonWords.map((item) => (<p>{item}</p>))} <br />

            Top three most common letters in order : <br />
            {results.topCommonLetter.map((item) => (<p>{item}</p>))} <br />
          </div>
        }
      </div>
    </div>
  );
}

export default App;
