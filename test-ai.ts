import 'dotenv/config';



console.log('Key loaded:', GEMINI_API_KEY ? 'YES, length ' + GEMINI_API_KEY.length : 'NO - undefined');

async function test() {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Say hello in one word' }] }],
      }),
    }
  );
  const data = await response.json();
  console.log('STATUS:', response.status);
  console.log('RESPONSE:', JSON.stringify(data, null, 2));
}

test();