// dependencia pra guestbook
class GuestbookStorage {
  async saveEntry(entry) {
    throw new Error("Método não implementado");
  }
  
  async getEntries() {
    throw new Error("Método não implementado");
  }
}
  
// dip
class ApiGuestbookStorage extends GuestbookStorage {
  constructor(apiUrl) {
    super();
    this.apiUrl = apiUrl;
  }
  
  async saveEntry(entry) {
    const response = await fetch(`${this.apiUrl}/entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    if (!response.ok) throw new Error('Erro ao salvar entrada');
  }
  
  async getEntries() {
    const response = await fetch(`${this.apiUrl}/entries`);
    if (!response.ok) throw new Error('Erro ao carregar entradas');
    return response.json();
  }
}
  
// validator
class EntryValidator {
  static validate(entry) {
    if (!entry.name || !entry.message) {
      throw new Error("Nome e mensagem são obrigatórios.");
    }
    if (entry.message.length > 300) {
      throw new Error("Mensagem muito longa.");
    }
  }
}
  
// timestamp
function TimeStampedEntry(entry) {
  return {
    ...entry,
    timestamp: new Date().toISOString()
  };
}
  
// logica

class Guestbook {
  constructor(storage) {
    this.storage = storage;
  }

  async addEntry(entry) {
    EntryValidator.validate(entry);
    const withTimestamp = TimeStampedEntry(entry);
    await this.storage.saveEntry(withTimestamp);
  }
  
  async listEntries() {
    return await this.storage.getEntries();
  }
}
// interface dom
const storage = new ApiGuestbookStorage('http://localhost:3000/api'); // simulado
const guestbook = new Guestbook(storage);
const form = document.getElementById('guestbook-form');
const entriesDiv = document.getElementById('entries');
 
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const message = document.getElementById('message').value.trim();
  
  try {
    await guestbook.addEntry({ name, message });
    form.reset();
    await renderEntries();
  } catch (err) {
    alert(err.message);
    console.error(err);
  }
});


// mostrar mensagens

async function renderEntries() {
  try {
    const entries = await guestbook.listEntries();
    entriesDiv.innerHTML = '';

    entries.reverse().forEach(entry => {
      const div = document.createElement('div');
      div.className = 'entry';
      div.innerHTML = `<strong>${entry.name}</strong> 
      <em>(${new Date(entry.timestamp).toLocaleString()})</em><br/>
      ${entry.message}`;
      entriesDiv.appendChild(div);
    });
  } catch (err) {
    entriesDiv.innerHTML = `<p>Erro ao carregar mensagens</p>`;
  }
}

renderEntries();