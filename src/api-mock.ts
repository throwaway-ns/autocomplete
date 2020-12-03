import { createServer } from "miragejs";

const people = [
  { id: 1, name: "Albert" },
  { id: 2, name: "Beatrice" },
  { id: 3, name: "Cecil" },
  { id: 4, name: "Diane" },
  { id: 5, name: "Edward" },
  { id: 6, name: "Ferdinand" },
  { id: 7, name: "Ivone" },
  { id: 8, name: "Jane" },
  { id: 9, name: "Katherine" },
  { id: 10, name: "Luke" }
];

// creates API mock server
// - intercepts all XMLHttpRequests/fetch requests

createServer({
  routes() {
    this.get("/api/suggest", async (_, request) => {
      const { term = "" } = request.queryParams;
      const sanitizedTerm = term.trim();

      // add random latency
      await new Promise((r) => setTimeout(r, Math.random() * 1000));

      if (sanitizedTerm) {
        const regex = new RegExp(sanitizedTerm.replace(/\s+/g, ".+"));

        return people.filter((person) => regex.test(person.name));
      }

      return [];
    });
  }
});
