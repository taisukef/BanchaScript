import { runBancha } from "./runBancha.js";

const srcs = [];
for (const fn of Deno.args) {
  const source = await Deno.readTextFile(fn);
  srcs.push({ title: fn, source });
}

const [error, compiledText, output] = runBancha(srcs);
console.log(error);
console.log(output);
