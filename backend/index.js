const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors'); // Import the cors package

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://szurqdvxmtcndzmowkgk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6dXJxZHZ4bXRjbmR6bW93a2drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY1NTQ5NTMsImV4cCI6MjAzMjEzMDk1M30.RsEMv-IT6DalaevTna5U7OxZK4BPQ42FrpJ2M7QceMI';

const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(bodyParser.json());

app.use(cors()); // Use the cors middleware

const EDEN_AI_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMmM1NTExMjUtYTRmYy00MThhLTg5Y2ItMmM3NjRjNTRlNmYzIiwidHlwZSI6ImFwaV90b2tlbiJ9.NPSklVi-fp6xYwIKxDw-s4S_d67ruA03NYDBFhDlImo';

app.post('/generate', async (req, res) => {

  const { Tone, Length, Features, Positioning } = req.body;

  let low = 15;
  let high = 20;
  if(Length === 'Short'){
    low = 4;
    high = 6;
  }
  else if(Length === 'Medium'){
    low = 8;
    high = 10;
  }

  const prompt = `You are a copywriter at a marketing agency working on a brochure for a real estate developer.
    Generate a narrative flow for the real estate brochure keeping in mind the brand positioning and features of the property.

    Make a heading of BRAND POSITIONING and write a few sentences about the ${Positioning}.
    Make a heading of FEATURES and write a few sentences about the ${Features}.

    Keep the tone of the narrative ${Tone}
    Also make sure that the length of the copy is ${low} to ${high} sentences long.`;

  try {
      const requestBody = {
          "text": prompt,
          "providers": "openai",
      };

      // Make POST request to the API
      const response = await axios.post('https://api.edenai.run/v2/text/generation', requestBody, {
          headers: {
              'Authorization': `Bearer ${EDEN_AI_API_KEY}`,
              'Content-Type': 'application/json'
          }
      });

      // Send the response from the API back to the client
      res.json(response.data.openai.generated_text);
      
  } catch (error) {
      // Handle errors
      console.error('Error:', error.response.data);
      res.status(error.response.status).json({ error: error.response.data });
  }
});

app.post('/insert', async (req, res) => {
  const { Tone, Length, Features, Positioning, Output } = req.body;

  // Insert into Supabase
  try {
    const { data, error } = await supabase
      .from('marketing_copies')
      .insert([{ Positioning, Features ,Tone, Length, Output }]);

    if (error) {

      console.error('Error inserting into DB:', error.message);
      res.status(500).json({ error: 'Failed to insert copy into DB' });

    } else {

      res.json({ message: 'Successfully inserted copy into DB' });

    }
  } catch (error) {

    console.error('Error inserting into DB:', error.message);
    res.status(500).json({ error: 'Failed to insert copy into DB' });
    
  }
});

app.post('/regenerate', async (req, res) => {
  const { selectedText, Output, regenOption } = req.body;
  const max_tokens =  regenOption === 'Make it shorter' ? 100 : 400;
  const prompt = `Regenerate the following text : ${selectedText}  in ${max_tokens} words.`;

  const requestBody = {
    "text": prompt,
    "providers": "openai",
  }; 

  try {
    const response = await axios.post('https://api.edenai.run/v2/text/generation', requestBody, {
          headers: {
              'Authorization': `Bearer ${EDEN_AI_API_KEY}`,
              'Content-Type': 'application/json'
          }
      });

    const newOutput = Output.replace(selectedText, response.data.openai.generated_text);
    res.json(newOutput);

  } catch (error) {
    console.error('Error regenerating copy:', error.message);
    res.status(500).json({ error: 'Failed to regenerate copy' });
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
