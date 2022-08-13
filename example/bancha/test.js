/// <reference path="../../src/parsect.ts" />

// Sample program: BanchaScript compiler
//
// BanchaScript is a AltJS, a programming language compiled into JavaScript source code.
// See bancha.html for sample soruce codes.
//

import { Parsect } from "../../Parsect.js";

const p = Parsect;

// Lexer. 字句解析器
const identStart  = p.oneOf("_$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
const identLetter = p.oneOf("_$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
const opStart = p.oneOf("+-*/=!$%&^~@?_><:|\\.");
const opLetter = p.oneOf("+-*/=!$%&^~@?_><:|\\.");
const lexer = p.makeTokenParser({
  commentStart: p.string('/*'),
  commentEnd: p.string('*/'),
  commentLine: p.string('//'),
  nestedComments: true,
  identStart: identStart,
  identLetter: identLetter,
  opStart: opStart,
  opLetter: opLetter,
  reservedNames: ["function", "return", "operator", "infix", "infixl", "infixr", "prefix", "postfix", "var", "if", "else", "for", "native"],
  reservedOpNames: [],
  caseSensitive: true
});  

const opTable = [
  /*
  [
    lexer.prefix("-", x => "-" + x),
    lexer.prefix("+", x => x),
  ],
  */
  [
    lexer.binary("*", (x, y) => x + "*" + y, Parsect.Assoc.Left),
    lexer.binary("/",  (x, y) => x + "/" + y, Parsect.Assoc.Left)
  ], 
  [
    lexer.binary("+", (x, y) => x + "+" + y, Parsect.Assoc.Left),
    lexer.binary("-",  (x, y) => x + "-" + y, Parsect.Assoc.Left)
  ], 
  [
    lexer.binary("<", (x, y) => x + "<" + y, Parsect.Assoc.Left),
    lexer.binary(">", (x, y) => x + ">" + y, Parsect.Assoc.Left)
  ],
  [
    lexer.binary("==", (x, y) => x + "==" + y, Parsect.Assoc.Left),
    lexer.binary("!=", (x, y) => x + "!=" + y, Parsect.Assoc.Left)
  ],
];

const term = Parsect.or(
  lexer.naturalOrFloat,
  lexer.identifier
);

const expr = Parsect.buildExpressionParser(opTable, term);

const varStatement = p.seq((s) => {
  s(lexer.reserved("var"));
  const name = s(lexer.identifier);
  s(lexer.reservedOp("="));
  const value = s(expr);
  s(lexer.semi);
  return "var " + name + "=" + value + ";";
});

//var state = new p.State("var hoge /* この変数はほげ */ = 42;", 4);   // state は現在の状態
/*
var reply = p.parse(lexer.identifier, state);                     // reply は解析の結果
console.log("成功したかどうか: " + reply.success);
console.log("現在の位置: "    + reply.state.position);
console.log("読み取った情報: " + reply.value);
*/
const state = new p.State("var hoge /* comment */ = 42;", 0);   // state は現在の状態
const reply = Parsect.parse(varStatement, state); 
console.log("成功したかどうか: " + reply.success);          // true
console.log("現在の位置: "    + reply.state.position);   // 14 
console.log("読み取った情報: " + reply.value);             // "var hoge=42;""
