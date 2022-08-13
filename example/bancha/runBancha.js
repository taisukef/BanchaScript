import * as bancha from "./bancha.ts";

export const runBancha = (srcs) => {
  // Initialize fields
  const error = {};
  error.value = "";

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
      console.log(pos);
      return "";
    }
  };

  // Compile
  let compiledText = "";
  const scope = new bancha.Scope();
  for (const src of srcs) {
    compiledText += compileScript(scope, src.title, src.source);
  }
  //console.log("compiledText: ", compiledText);
  //console.log("error: ", error.value);

  // Evaluation
  let outputText = "";
  try {
    const bk = window.console;
    window.console = { log: (x) => outputText += x + "\n" };
    eval(compiledText);
    window.console = bk;
  } catch (e) {
    console.log(e);
    outputText += e.message;
  }
  return [error.value, compiledText, outputText];
};
