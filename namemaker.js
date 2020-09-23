const fs = require('fs').promises;

async function loadState() {
  const state = JSON.parse(await fs.readFile('./response.json', 'utf8'));
  console.log(state);
  const newstate = state.filter((element) => element.length <= 6);
  console.log(newstate);
  await fs.writeFile('./response.json', JSON.stringify(newstate));
  return state;
}

const file = loadState();
