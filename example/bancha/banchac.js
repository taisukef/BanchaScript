import * as bancha from "./bancha.ts";

const srcs = [];
for (const fn of Deno.args) {
  const src = await Deno.readTextFile(fn);
  srcs.push({ fn, src });
}

const compile = () => {
  const compileScript = (scope, title, source) => {
    const start = performance.now();
    const reply = bancha.compile(scope, source);
    const time = (performance.now() - start) * 0.001;
    const timeString = "time: " + /[0-9]+(\.[0-9]{1,3})?/.exec(time.toString())[0] + "sec.";
    if (reply.success) {
      error.value += "[" + title + "] Compiled successfully. \n";
      error.value += "[" + title + "] " + timeString + "\n";
      return reply.value;
    } else {
      const pos = reply.state.getRowColumn();
      error.value += "[" + title + "] (" + (pos.raw + 1) + "," + (pos.column + 1) + "): expected " + reply.expected() + "\n";
      error.value += "[" + title + "] " + timeString + "\n";
      return "";
    }
  };

  // Initialize fields
  const error = {};
  error.value = "";

  // Compile
  const compiled = {};
  let compiledText = "";
  const scope = new bancha.Scope();
  for (const src of srcs) {
    compiledText += compileScript(scope, src.fn, src.src);
  }
  compiled.value = compiledText;
  //console.log("compiledText: ", compiledText);
  console.log("error: ", error.value);

  // Evaluation
  let outputText = "";
  (function(){
    try {
      const console = { log: (x) => outputText += x + "\n" };
      eval(compiledText);
    } catch (e) {
      console.log(e);
    }
  }());
  console.log(outputText);
};

compile();
