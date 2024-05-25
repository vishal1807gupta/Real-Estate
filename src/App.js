import React, { useState } from 'react';
import './App.css';

function App() {
  const [Tone, setTone] = useState('Casual');
  const [Length, setLength] = useState('Short');
  const [Features, setFeatures] = useState('');
  const [Positioning, setPositioning] = useState('');
  const [Output, setOutput] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [regenOption, setRegenOption] = useState('');

  const handleGenerate = async () => {
    const response = await fetch('http://localhost:5000/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Tone, Length, Features, Positioning}),
    });
    const data = await response.json();
    setOutput(data);
  };

  const handleInsert = async () => {
    await fetch('http://localhost:5000/insert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Tone, Length, Features, Positioning, Output }),
    });
  };

  const handleRegenerate = async () => {
    const response = await fetch('http://localhost:5000/regenerate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedText, Output, regenOption }),
    });
    const data = await response.json();
    setOutput(data);
  };

  return (
    <div className="App">
      <h1>Real Estate Marketing Copy Generator</h1>
      <div className='section'>
      <div className="form-group">
        <label>Features of the Building:</label>
        <textarea value={Features} onChange={(e) => setFeatures(e.target.value)}></textarea>
      </div>
      <div className="form-group">
        <label>Brand Positioning:</label>
        <textarea value={Positioning} onChange={(e) => setPositioning(e.target.value)}></textarea>
      </div>
      </div>
      <div className='section'>
      <div className="form-group">
        <label>Tone:</label>
        <select value={Tone} onChange={(e) => setTone(e.target.value)}>
          <option value="Casual">Casual</option>
          <option value="Formal">Formal</option>
          <option value="Grandiose">Grandiose</option>
        </select>
      </div>
      <div className="form-group">
        <label>Length of the Copy:</label>
        <select value={Length} onChange={(e) => setLength(e.target.value)}>
          <option value="Short">Short</option>
          <option value="Medium">Medium</option>
          <option value="Long">Long</option>
        </select>
      </div>
      </div>
      <div className='container'>
      <button onClick={handleGenerate}>Generate</button>
      </div>
      <div className="output-group container">
        <textarea value={Output} onChange={(e) => setOutput(e.target.value)}></textarea>
      </div>
      <div className='container'>
      <button className="btn" onClick={handleInsert}>Insert in DB</button>
      </div>
        <div className='section'>
        <div className='form-group'>
        <label>Regenerate Selected Text:</label>
        <textarea value={selectedText} onChange={(e) => setSelectedText(e.target.value)}></textarea>
        </div>
        <div className='form-group'>
        <select value={regenOption} onChange={(e) => setRegenOption(e.target.value)}>
          <option value="Make it longer">Make it longer</option>
          <option value="Make it shorter">Make it shorter</option>
        </select>
        </div>
        </div>
        <div className='container'>
        <button onClick={handleRegenerate}>Regenerate</button>
        </div>
    </div>
  );
}

export default App;
