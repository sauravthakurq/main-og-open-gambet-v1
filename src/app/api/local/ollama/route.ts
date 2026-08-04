export async function GET() {
  try {
    const res = await fetch('http://localhost:11434/api/tags');
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Ollama is not running' }), { status: 503 });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to connect to Ollama' }), { status: 503 });
  }
}
