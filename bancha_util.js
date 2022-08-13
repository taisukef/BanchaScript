import * as bancha from "./bancha_core.ts";

export const transpile = (srcs) => {
  let errorText = "";
  const compileScript = (scope, title, source) => {
    const reply = bancha.compile(scope, source);
    if (reply.success) {
      return reply.value;
    } else {
      const pos = reply.state.getRowColumn();
      errorText += "[" + title + "] (" + (pos.raw + 1) + "," + (pos.column + 1) + "): expected " + reply.expected() + "\n";
      return "";
    }
  };

  let compiledText = "";
  const scope = new bancha.Scope();
  for (const src of srcs) {
    compiledText += compileScript(scope, src.title, src.source);
  }
  if (errorText) {
    throw new Error(errorText);
  }
  return compiledText;
};

export const run = (compiledText, retoutput) => {
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
  return outputText;
};
