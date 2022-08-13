"use strict";
exports.__esModule = true;
//import { Parsect } from "../Parsect.js";
var parsect_ts_1 = require("../src/parsect.ts");
var qunit_js_1 = require("./qunit.js");
var test = qunit_js_1.QUnit.test;
var ok = qunit_js_1.QUnit.ok;
var p = parsect_ts_1.Parsect;
var Tests;
(function (Tests) {
    //import p = Parsect;
    function join(ss) {
        return ss.join();
    }
    function parse(parser, state) {
        return p.parse(parser, state);
    }
    function error(state, expected) {
        return p.error(state, function () { return expected; });
    }
    test("State object instantiation and equation", function () {
        var src = new p.State("hoge");
        ok(src.equals(new p.State("hoge", 0)));
        var src2 = new p.State("hoge", 2);
        ok(src2.equals(new p.State("hoge", 2)));
        ok(new p.State("hoge", 4).equals(new p.State("hoge", 4)));
        ok(new p.State("hoge", 5).equals(new p.State("hoge", 5)));
    });
    test("State object invariance test", function () {
        var src = new p.State("hoge");
        ok(src.equals(new p.State("hoge", 0)));
        p.ok(src.seek(2), "2");
        ok(src.equals(new p.State("hoge", 0)));
        error(src, "fail");
        ok(src.equals(new p.State("hoge", 0)));
    });
    test("parse function test", function () {
        var parser = p.string("hoge");
        // Success
        var s = parse(parser, new p.State("hoge"));
        ok(s.success);
        strictEqual(s.state.position, 4);
        strictEqual(s.value, "hoge");
        strictEqual(s.expected, undefined);
        // Success
        var s = parse(parser, new p.State("hoge", 0));
        ok(s.success);
        strictEqual(s.state.position, 4);
        strictEqual(s.value, "hoge");
        strictEqual(s.expected, undefined);
    });
    test("string parser test1", function () {
        var parser = p.string("hoge");
        var source = "hoge";
        var expected = p.ok(new p.State(source, 4), "hoge");
        var result = parse(parser, new p.State(source, 0));
        ok(result.equals(expected));
    });
    test("string parser test2", function () {
        var parser = p.string("hoge");
        var source = "piyo";
        var expected = error(new p.State(source), "\"hoge\"");
        var result = parse(parser, new p.State(source, 0));
        ok(result.equals(expected));
    });
    test("string parser test3", function () {
        var parser = p.string("hoge");
        var source = "hopo";
        var expected = error(new p.State(source), "\"hoge\"");
        var result = parse(parser, new p.State(source, 0));
        ok(result.equals(expected));
    });
    test("string parser test4", function () {
        var parser = p.string("hoge");
        var source = "";
        var expected = error(new p.State(source), "\"hoge\"");
        var result = parse(parser, new p.State(source, 0));
        ok(result.equals(expected));
    });
    test("string parser 5 case sensitive 1", function () {
        var parser = p.string("HOGE", false);
        var source = "hoge";
        var expected = p.ok(new p.State(source, 4), "hoge");
        var result = parse(parser, new p.State(source, 0));
        ok(result.equals(expected));
    });
    test("seq parser test", function () {
        var parser = p.seq(function (s) {
            s(p.string("("));
            var e = s(p.string("hoge"));
            s(p.string(")"));
            return { e: e };
        });
        // Success
        var source = "(hoge)";
        var expected = p.ok(new p.State(source, 6), { 'e': 'hoge' });
        ok(parse(parser, new p.State(source, 0)).equals(expected));
        // Fail
        var source = "(piyo)";
        var expected2 = error(new p.State(source, 1), "\"hoge\"");
        ok(parse(parser, new p.State(source, 0)).equals(expected2));
    });
    test("seq 1", function () {
        var parser = p.seq(function (s) {
            var a = s(p.string("a"));
            var b = s(p.string("b"));
            return s.success && a + b;
        });
        var source = "ab";
        var expected = p.ok(new p.State(source, 2), "ab");
        var result = parse(parser, new p.State(source, 0));
        ok(result.equals(expected));
    });
    test("triable 1", function () {
        var parens_a = p.between(p.string('('), p.string('a'), p.string(')'));
        var parens_b = p.between(p.string('('), p.string('b'), p.string(')'));
        var parser = p.or(parens_a, parens_b);
        var source = "(b)";
        var expected = error(new p.State("(b)", 1), "\"a\"");
        var result = parse(parser, new p.State(source, 0));
        ok(result.equals(expected));
    });
    test("count 1", function () {
        var parser = p.fmap(join, p.count(3, p.string("a")));
        var source = "aaa";
        var expected = p.ok(new p.State("aaa", 3), "a,a,a");
        var result = parse(parser, new p.State(source));
        ok(result.equals(expected));
    });
    test("many 1", function () {
        var parser = p.fmap(join, p.many(p.string("a")));
        var source = "aa";
        var expected = p.ok(new p.State("aa", 2), "a,a");
        var result = parse(parser, new p.State(source));
        ok(result.equals(expected));
    });
    test("many1 1", function () {
        var parser = p.fmap(join, p.many1(p.string("a")));
        var source = "aaaaaaa";
        var expected = p.ok(new p.State("aaaaaaa", 7), "a,a,a,a,a,a,a");
        var result = parse(parser, new p.State(source));
        ok(result.equals(expected));
    });
    test("many1 2", function () {
        var parser = p.fmap(join, p.many1(p.string("a")));
        var source = "aaaaaaa";
        var expected = p.ok(new p.State("aaaaaaa", 7), "a,a,a,a,a,a,a");
        var result = parse(parser, new p.State(source));
        ok(result.equals(expected));
    });
    test("number 1", function () {
        var parser = p.number;
        var source = "-123.567";
        var expected = p.ok(new p.State("-123.567", 8), -123.567);
        var result = parse(parser, new p.State(source));
        ok(result.equals(expected));
    });
    test("or 1", function () {
        var source = "baabbabaabbbazaabb";
        var parser = p.many(p.or(p.string("a"), p.string("b")));
        var expected = p.ok(new p.State(source, 13), ["b", "a", "a", "b", "b", "a", "b", "a", "a", "b", "b", "b", "a"]);
        var result = parse(parser, new p.State(source));
        ok(result.equals(expected));
    });
    test("or 2", function () {
        var source = "x";
        var parser = p.or(p.string("a"), p.string("b"), p.regexp(/c/));
        var expected = error(new p.State(source, 0), "one of \"a\",\"b\",/c/");
        var result = parse(parser, new p.State(source));
        ok(result.equals(expected));
    });
    test("head 1", function () {
        var parser = p.head(p.string("a"), p.string("b"));
        var source = "ab";
        var expected = p.ok(new p.State(source, 2), "a");
        var result = parse(parser, new p.State(source));
        ok(result.equals(expected));
    });
    /*
        test("tail 1", ()=>{
            var parser = p.tail(p.string("a"), p.string("b"));
            var source = "ab";
            var expected = p.ok(new p.State(source, 2), "b");
            var result = parse(parser, source);
            ok(result.equals(expected));
        });
    
        test("tail 2", ()=>{
            var parser = p.tail(p.string("a"), p.head(p.string("b"), p.string("c")));
            var source = "abc";
            var expected = p.ok(new p.State(source, 3), "b");
            var result = parse(parser, source);
            ok(result.equals(expected));
        });
    */
    test("sepBy1 1", function () {
        var source = "a_a_a";
        var parser = p.sepBy1(p.string("a"), p.string("_"));
        var expected = p.ok(new p.State(source, 5), ["a", "a", "a"]);
        var result = parse(parser, new p.State(source));
        ok(result.equals(expected));
    });
    test("sepBy1 2", function () {
        var parser = p.fmap(join, p.sepBy1(p.string("a"), p.string("_")));
        var source = "";
        var expected = error(new p.State(source), "\"a\"");
        var result = parse(parser, new p.State(source));
        ok(result.equals(expected));
    });
    test("sepBy1 3", function () {
        var parser = p.fmap(join, p.sepBy1(p.string("a"), p.string("_")));
        var source = "a";
        var expected = p.ok(new p.State(source, 1), "a");
        var result = parse(parser, new p.State(source));
        ok(result.equals(expected));
    });
    test("sepBy1 4", function () {
        var parser = p.fmap(join, p.sepBy1(p.string("a"), p.string("_")));
        var source = "a_b";
        var expected = error(new p.State(source, 2), "\"a\"");
        var result = parse(parser, new p.State(source));
        ok(result.equals(expected));
    });
    test("endByN 1", function () {
        var source = "a;a;a;";
        var parser = p.endBy(p.string("a"), p.string(";"));
        var expected = p.ok(new p.State(source, 6), ["a", "a", "a"]);
        var result = parse(parser, new p.State(source));
        ok(result.equals(expected));
    });
    test("between 1", function () {
        var parser = p.between(p.string('['), p.string('a'), p.string(']'));
        var source = "[a]";
        var expected = p.ok(new p.State(source, 3), "a");
        var result = parse(parser, new p.State(source));
        ok(result.equals(expected));
    });
    test("between 2", function () {
        var parser = p.between(p.string('['), p.string('a'), p.string(']'));
        var source = "[b]";
        var expected = error(new p.State(source, 1), "\"a\"");
        ok(parse(parser, new p.State(source)).equals(expected));
    });
    test("between 3", function () {
        var parser = p.between(p.string('['), p.string('a'), p.string(']'));
        var source = "[a]";
        var expected = p.ok(new p.State(source, 3), "a");
        ok(parse(parser, new p.State(source)).equals(expected));
    });
    test("pure 1", function () {
        var parser = p.pure("x");
        var source = "abc";
        var expected = p.ok(new p.State(source, 0), "x");
        var result = parse(parser, new p.State(source));
        ok(result.equals(expected));
    });
    test("eof 1", function () {
        var parser = p.eof;
        var source = "";
        var expected = p.ok(new p.State(source, 1), undefined);
        var result = parse(parser, new p.State(source));
        ok(result.equals(expected));
    });
    test("eof 2", function () {
        var parser = p.seq(function (s) {
            s(p.string("a"));
            return s(p.eof);
        });
        var source = "a";
        var expected = p.ok(new p.State(source, 2), undefined);
        var result = parse(parser, new p.State(source));
        ok(result.equals(expected));
    });
    test("eof 3", function () {
        var parser = p.eof;
        var source = "a";
        var expected = error(new p.State(source, 0), "end of file");
        var result = parse(parser, new p.State(source));
        ok(result.equals(expected));
    });
    test("empty 1", function () {
        var parser = p.empty;
        var source = "a";
        var expected = p.ok(new p.State(source, 0), undefined);
        var result = parse(parser, new p.State(source));
        ok(result.equals(expected));
    });
    test("satisfy 1", function () {
        var parser = p.fmap(join, p.many1(p.satisfy(function (c) {
            var i = c.charCodeAt(0);
            return i >= 80 && i <= 85;
        })));
        ;
        var source = "PQRRQPOPhoge";
        var expected = p.ok(new p.State(source, 6), 'P,Q,R,R,Q,P');
        var result = parse(parser, new p.State(source));
        ok(result.equals(expected));
    });
    test("satisfy 2", function () {
        var parser = p.fmap(join, p.many1(p.satisfy(function (c) {
            var i = c.charCodeAt(0);
            return i >= 80 && i <= 85;
        })));
        ;
        var source = "XXXXXXXXXXXX";
        var expected = error(new p.State(source), 'one of "PQRSTU"');
        var result = parse(parser, new p.State(source));
        ok(result.equals(expected));
    });
    test("regexp 1", function () {
        var parser = p.regexp(/abcde/);
        var source = "abcde";
        var expected = p.ok(new p.State(source, 5), source);
        var result = parse(parser, new p.State(source));
        ok(result.equals(expected));
    });
    test("regexp 2", function () {
        var parser = p.regexp(/abc/);
        var source = "xxabcxx";
        var expected = error(new p.State(source), '/abc/');
        var result = parse(parser, new p.State(source));
        ok(result.equals(expected));
    });
    test("regexp 3", function () {
        var parser = p.regexp(/a*/);
        var source = "aaaaabbbbb";
        var expected = p.ok(new p.State(source, 5), 'aaaaa');
        var result = parse(parser, new p.State(source));
        ok(result.equals(expected));
    });
    test("recursive parser 1", function () {
        var parser = p.or(p.regexp(/[a-z]/), p.between(p.string("["), p.lazy(function () { return parser; }), p.string("]")));
        var source = "[[[[x]]]]";
        var expected = p.ok(new p.State(source, 9), 'x');
        var result = parse(parser, new p.State(source));
        ok(result.equals(expected));
    });
    test("recursive parser 2", function () {
        var parser = p.or(p.regexp(/[a-z]/), p.between(p.string("["), p.lazy(function () { return parser; }), p.string("]")));
        var source = "[[[[x]]]";
        var expected = error(new p.State(source, 8), '"]"');
        var result = parse(parser, new p.State(source));
        ok(result.equals(expected));
    });
    test("non-cfg 1", function () {
        // { a^n b^n c^n | n >= 0 } = { "", "abc", "aabbcc", "aaabbbccc", ... }
        var parser = p.seq(function (s) {
            var a = s(p.many(p.string("a")));
            var b = s(p.count(a.length, p.string("b")));
            var c = s(p.count(a.length, p.string("c")));
            return [a, b, c];
        });
        var source = "aaaabbbbcccc";
        var expected = p.ok(new p.State(source, 12), [["a", "a", "a", "a"], ["b", "b", "b", "b"], ["c", "c", "c", "c"]]);
        var result = parse(parser, new p.State(source));
        ok(result.equals(expected));
        var source2 = "aaaabbbbcc";
        var expected2 = error(new p.State(source2, 10), "\"c\"");
        var result2 = parse(parser, new p.State(source2));
        ok(result2.equals(expected2));
    });
    test("implicit array parser 1", function () {
        var parser = ["x", "y", "z"].map(function (x) { return p.string(x); });
        var source = "xyz";
        var expected = p.ok(new p.State(source, 3), ["x", "y", "z"]);
        var result = parse(p.array(parser), new p.State(source));
        ok(result.equals(expected));
    });
    test("user sate 1", function () {
        var parser = p.seq(function (s) {
            var u = s.userState;
            s.userState = u * 2;
            return s(p.string("Hoge"));
        });
        var source = "Hoge";
        var input = new p.State(source, 0, 42);
        var expected = p.ok(new p.State(source, 4, 84), "Hoge");
        var result = parse(parser, input);
        ok(result.equals(expected));
    });
    var OperatorTableTest;
    (function (OperatorTableTest) {
        var lexer = p.makeTokenParser({
            commentStart: p.string('/*'),
            commentEnd: p.string('*/'),
            commentLine: p.string('//'),
            nestedComments: true,
            identStart: p.regexp(/[_a-zA-Z]/),
            identLetter: p.regexp(/[_a-zA-Z0-9]/),
            opStart: p.regexp(/[+\-*\/=!$%&\^~@?_]/),
            opLetter: p.regexp(/[+\-*\/=!$%&\^~@?_]/),
            reservedNames: [],
            reservedOpNames: [],
            caseSensitive: true
        });
        var reservedOp = lexer.reservedOp;
        var reserved = lexer.reserved;
        var parens = lexer.parens;
        function binary(name, fun, assoc) {
            return p.infix(p.fmap(function (_) { return fun; }, reservedOp(name)), assoc);
        }
        function prefix(name, fun) {
            return p.prefix(p.fmap(function (_) { return fun; }, reservedOp(name)));
        }
        function postfix(name, fun) {
            return p.postfix(p.fmap(function (_) { return fun; }, reservedOp(name)));
        }
        test("token parser: float", function () {
            var source = "42";
            var input = new p.State(source, 0);
            var expected = p.ok(new p.State(source, 2), 42);
            var result = parse(lexer.naturalOrFloat, input);
            ok(result.equals(expected));
        });
        test("token parser: whiteSpace", function () {
            var source = "    42";
            var input = new p.State(source, 0);
            var expected = p.ok(new p.State(source, 4), undefined);
            var result = parse(lexer.whiteSpace, input);
            ok(result.equals(expected));
        });
        test("token parser: reservedOp", function () {
            var source = "*  ";
            var input = new p.State(source, 0);
            var expected = p.ok(new p.State(source, 3), "*");
            var result = parse(lexer.reservedOp("*"), input);
            ok(result.equals(expected));
        });
        test("operator table 1", function () {
            var table = [
                [binary("*", function (x, y) { return x * y; }, p.Assoc.Left)],
            ];
            var term = p.or(parens(p.lazy(function () { return expr; })), lexer.naturalOrFloat);
            var expr = p.buildExpressionParser(table, term);
            var source = "3*5";
            var input = new p.State(source, 0);
            var expected = p.ok(new p.State(source, 3), 15);
            var result = parse(expr, input);
            ok(result.equals(expected));
        });
        test("operator table 2", function () {
            var table = [
                [binary("*", function (x, y) { return x * y; }, p.Assoc.Left), binary("/", function (x, y) { return x / y; }, p.Assoc.Left)],
                [binary("+", function (x, y) { return x + y; }, p.Assoc.Left), binary("-", function (x, y) { return x - y; }, p.Assoc.Left)]
            ];
            var term = p.or(parens(p.lazy(function () { return expr; })), lexer.naturalOrFloat);
            var expr = p.buildExpressionParser(table, term);
            var source = "3*5+1";
            var input = new p.State(source, 0);
            var expected = p.ok(new p.State(source, 5), 16);
            var result = parse(expr, input);
            ok(result.equals(expected));
        });
        test("operator table 3", function () {
            var table = [
                [binary("*", function (x, y) { return x * y; }, p.Assoc.Left), binary("/", function (x, y) { return x / y; }, p.Assoc.Left)],
                [binary("+", function (x, y) { return x + y; }, p.Assoc.Left), binary("-", function (x, y) { return x - y; }, p.Assoc.Left)]
            ];
            var term = p.or(parens(p.lazy(function () { return expr; })), lexer.naturalOrFloat);
            var expr = p.buildExpressionParser(table, term);
            var source = "1+3*5";
            var input = new p.State(source, 0);
            var expected = p.ok(new p.State(source, 5), 16);
            var result = parse(expr, input);
            ok(result.equals(expected));
        });
        test("operator table 4", function () {
            var table = [
                [binary("*", function (x, y) { return x * y; }, p.Assoc.Left), binary("/", function (x, y) { return x / y; }, p.Assoc.Left)],
                [binary("+", function (x, y) { return x + y; }, p.Assoc.Left), binary("-", function (x, y) { return x - y; }, p.Assoc.Left)]
            ];
            var term = p.or(parens(p.lazy(function () { return expr; })), lexer.naturalOrFloat);
            var expr = p.buildExpressionParser(table, term);
            var source = "(1  +3)*  5";
            var input = new p.State(source, 0);
            var expected = p.ok(new p.State(source, 11), 20);
            var result = parse(expr, input);
            ok(result.equals(expected));
        });
        test("operator table 4", function () {
            var table = [
                [binary("+", function (x, y) { return x + y; }, p.Assoc.Left), binary("-", function (x, y) { return x - y; }, p.Assoc.Left)]
            ];
            var term = p.or(lexer.parens(p.lazy(function () { return expr; })), lexer.naturalOrFloat);
            var expr = p.buildExpressionParser(table, term);
            var source = "7 - 3";
            var input = new p.State(source, 0);
            var expected = p.ok(new p.State(source, source.length), eval(source));
            var result = parse(expr, input);
            ok(result.equals(expected));
        });
        test("operator table 5", function () {
            var table = [
                [prefix("-", function (x) { return -x; }), prefix("+", function (x) { return x; })],
                [binary("*", function (x, y) { return x * y; }, p.Assoc.Left), binary("/", function (x, y) { return x / y; }, p.Assoc.Left)],
                [binary("+", function (x, y) { return x + y; }, p.Assoc.Left), binary("-", function (x, y) { return x - y; }, p.Assoc.Left)]
            ];
            var term = p.or(lexer.parens(p.lazy(function () { return expr; })), lexer.naturalOrFloat);
            var expr = p.buildExpressionParser(table, term);
            var source = "(7 * 3) + 3 /* comment */ * ((2) - 1) + (-10) * 2";
            var input = new p.State(source, 0);
            var expected = p.ok(new p.State(source, source.length), eval(source));
            var reply = parse(expr, input);
            ok(reply.equals(expected));
        });
    })(OperatorTableTest || (OperatorTableTest = {}));
    test("seq parser json ast", function () {
        var identifier = p.regexp(/[A-z]+/);
        var argParser = p.seq(function (s) {
            var name = s(identifier);
            var optional = s(p.optional(p.string('?')));
            s(p.string(':'));
            var type = s(identifier);
            return { name: name, optional: optional, type: type };
        });
        var argsParser = p.sepBy(argParser, p.string(','));
        var parser = p.seq(function (s) {
            var name = s(identifier);
            s(p.string('('));
            var args = s(argsParser);
            s(p.string(')'));
            s(p.string(':'));
            var ret = s(identifier);
            return { name: name, args: args, ret: ret };
        });
        // Success
        var source = "indexOf(searchString:string,position?:number):number";
        var expected = p.ok(new p.State(source, source.length), {
            'name': 'indexOf',
            'args': [
                { 'name': 'searchString', 'optional': undefined, 'type': 'string' },
                { 'name': 'position', 'optional': '?', 'type': 'number' },
            ],
            'ret': 'number'
        });
        var result = parse(parser, new p.State(source));
        ok(result.equals(expected));
    });
    test("URI", function () {
        var param = p.seq(function (s) {
            var name = s(p.regexp(/[_A-z0-9]+/));
            s(p.string('='));
            var value = s(p.regexp(/[^&]+/));
            return { name: name, value: value };
        });
        var parser = p.seq(function (s) {
            var scheme = s(p.regexp(/[a-z]+/));
            s(p.string('://'));
            var host = s(p.sepBy1(p.regexp(/[a-z]+/), p.string('.')));
            var port = s(p.optional(p.seq(function (s) {
                s(p.string(':'));
                return s(p.regexp(/\d+/));
            })));
            s(p.string('/'));
            var path = s(p.sepBy(p.regexp(/[^\/?]+/), p.string('/')));
            var params = s(p.optional(p.seq(function (s) {
                s(p.string("?"));
                return s(p.sepBy(param, p.string("&")));
            })));
            return { scheme: scheme, host: host, port: port, path: path, params: params };
        });
        var source = 'http://www.nicovideo.jp/watch/1356674833?via=thumb_watch';
        var result = parse(parser, new p.State(source));
        var expected = { "scheme": "http", "host": ["www", "nicovideo", "jp"], "path": ["watch", "1363247616"], "params": [{ "name": "via", "value": "thumb_watch" }] };
        ok(p.jsonEq(result.value, expected));
    });
})(Tests || (Tests = {}));
