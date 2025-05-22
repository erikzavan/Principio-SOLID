# Principio-SOLID
## Livro de visitas

# 1. Escolham 4 dos 7 princípios abaixo
Os princípios escolhidos foram: SRP, DIP, ISP Composição a Herança.

# 2. Utilize o Readme do projeto para linkar os códigos e documentar a explicação do exemplo.

## - O que é? Para que serve?
SRP: Cada módulo, classe e função deve ter apenas uma responsabilidade. Isso evita algo muito excessivo dentro de alguma dessas coisas e deixa testes e manutenções mais fáceis.

DIP: Módulos de alto nível não podem depender de módulos de baixo nível, os dois devem depender das abstrações. Isso reduz dependência direta e deixa substituições mais fáceis.

ISP: Uma classe nao pode depender de um método que ela nao usa. Isso deixa o código limpo de coisas desnecessárias.

Composição a herança: Evita um rabbit hole de heranças e ao invés disso compõe objetos com funcionalidades. Isso deixa o código mais flexível.

## - Exemplo que ilustre a sua importância. Explique o código detalhadamente e onde o princípio esta sendo usado e qual pooblema ele tem resolvido.

SRP: 

```javascript
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
```
- `EntryValidator` apenas valida entradas;
Lógica do código:
.Classe com método estático validate;
.Verifica se o objeto entry tem name e message;
.Se faltar algum, lança erro;
.Se a mensagem for maior que 300 caracteres, lança erro;

```javascript
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
```
- A classe`Guestbook` apenas tem a lógica de adicionar e listar.

Como o código esta com as responsabilidades espalbhadas, foi evitado módulos difíceis de manter por conta de aglomeração.
Lógica do código:
.constructor(storage) recebe objeto responsável por armazenar dados;
.addEntry(entry) valida, adiciona timestamp e salva;
.listEntries() retorna todas as entradas.

---

DIP:

```javascript
class GuestbookStorage {
  async saveEntry(entry) {
    throw new Error("Método não implementado");
  }
  
  async getEntries() {
    throw new Error("Método não implementado");
  }
}
```
- `Guestbook`(Código em SRP) depende da abstração do `GuestbookStorage` e não de uma implementação concreta. Isso é bom pois seria possível trocar o Storage por outro, evitando relação direta com a implementação.
Lógica do código:
.Classe base com dois métodos, saveEntry e getEntries;
.Ambos lançam erro padrão, serve como interface para implementações depois.

ISP:

- `GuestbookStorage`(Código em DIP) define apenas o que `Guestbook` vai usar, evitando, por exemplo, implementar uma função de apagar a entry, que `Guestbook` não usa. Assim o código fica limpo de métodos inúteis que não estão implementados ainda.

Composição a Herança:

```javascript
const TimeStampedEntry = (entry) => ({
  ...entry,
  timestamp: new Date().toISOString(),
});
```
- A classe `TimeStampedEntry` é algo que implementa uma funcionalidade sem precisar herdar nada. Isso permite adicionar outros tipos de comportamento sem dificuldades, o que não seria o caso com heranças rígidas.
Lógica do código:
.Função que recebe um objeto entry;
.Retorna uma cópia do objeto com uma nova propriedade timestamp;
.Usa spread (...entry) para copiar os dados originais.