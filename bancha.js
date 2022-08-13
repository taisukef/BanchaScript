import { transpile } from "./bancha_util.js";

if (Deno.args.length == 0) {
  console.log("bancha (*.bancha)+");
  Deno.exit(1);
}

const srcs = [];
for (const fn of Deno.args) {
  const source = await Deno.readTextFile(fn);
  srcs.push({ title: fn, source });
}

const js = transpile(srcs);
eval(js);
