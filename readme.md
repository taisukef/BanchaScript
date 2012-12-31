# Parsect / Parser Combinator for TypeScript

## Abstract

**Parsect** is a parser combinator library for [TypeScript](http://www.typescriptlang.org/). It provides a easy way to write a readable parser in only TypeScript/JavaScript without any other domain-specific language like yacc/lex or ANTLR. Naturally it can also be used from not only TypeScript and JavaScript.

I got the idea for Parsect from [Parsec](http://www.haskell.org/haskellwiki/Parsec) parser combinator library in Haskell, however this is not a porting of Parsec. Unfortunately, this library doesn't have underlying Monad or Fanctor and it doesn't deal a string as a list of charactor. However, you can combine parsers in the same manner as Parsec with Parsect. 

Parsect characteristically has Haskell's **do notation**-like notation style. This notation makes a parser more readable. Additionally, **Regular Expression Parser** also is supported. You can combine RegExp parsers with other parsers. Hoever, remember that the implementation of Parsect is highly experimental and lacks stability. 

## Getting Started

In the following sample codes, most of identifiers are not prefixed with the module name. All functions or Classes are in *Parsect* module but Parsect's *globals.ts* binds those identifiers to global namespace (It's a bad practice but I'm so lazy!). If you would not use those global indentifiers, you need to add a prefix of module name "Parsect" to all identifiers or *import* the module. 

### *number* parsers

Parsect provides some commonly-used parsers. **number** is a parser that parse a numeral strings. **number** is a **Persect.Parser** object and a Parser object has **parse** function in it's property. *parse* takes a string parameter as input. So following code parses numeric riteral "−273.15" with *number* parser. 

    var r:State = number.parse("−273.15");

*parse* function returns a **Parsect.State** object. It contains the parsed numeric value, either succeed or failed, and a position in input.

    var r:State = number.parse("−273.15");
    
    var success:bool  = r.success;	       // successed or failed?
    var value:any     = r.value;           // any parsing raw result value	
    var source:string = r.source.input;    // whole of input string
    var pos:number    = r.source.position; // position in input

You can consider all parsers a imutable objects. Any parsing would not modify the parser and you can reuse those parsers as many times you want. Additionally you should not change any parser's property.

### *string* parser

**string** parser is the most simple parser. *string* parses a specific string and return it. To get a *string* parser, use *string* function. If you want to parse a string "apple", use *string* as follows:

    var p:Parser = string("apple");
    var r:State  = p.parse("apple, grape, banana");
    console.log(r.value);   // prints "apple".

If the parser recieve a unexpected input string like "application", the parser would consume no charactors and fail. The both two words have first four letter "appl" but the parser don't throw a exception and parsing would continue to search other matchings. 

### *regexp* parser

**regexp** parser parses a string represented by regular expressions. *regexp* function takes a RegExp object. For example, the folllowing parser accepts any numerical string:

    var number = regexp(/^[-+]?\d+(\.\d+)?/);

*regexp* parser consumes a charactors from first charactor of input to end charactor of the matched string.

### *many* combinator

Combinator is a function takes parsers as a parameter and returns new parser. **many** combinator create a parser parses infinitely repeat of a string pattern. *many* function takes a parser and return new parser. For example, the following parser comsumes a string like "abcabcabcabc...":

    many(string("abc"))

Of course, *many* combinator can take a *regexp* parser:

    many(number)

It consumes iteration of number, like "-33+29+0.2+4.4". 

### *seq* combinator

**seq** combinator provides *do notaion* like notaion for Parsect. *seq* function take a other function for parameter. The parameter function is called back when the *seq* parses a string. The parameter function recieves a other function as a parameter. Typically, *seq* function is used as: 

    var p:Parser = seq((s)=>{
    	s(string("("));
    	var v:number = s(number);
    	s(string(")"));
    	return v;
    });

This parser parses a numeric string between parenses. *s* function recieves a parser. A return value of *s(number)* is not Parsect.State object but a **raw value** of result of parsing. So, variable *v* is bounded a *number* object. When *p* parses a string "(100)", *v* is "100". 

If a parser applied to *s* failed, all following parsers would be ignore. 

When the parsing succeeded, *seq* returns a State object contains the value returned from the parameter function. Otherwise, the value of state object is *undefined*, regardless of the parameter function returns any value.

### *or* combinator

**or** combinator takes some parsers as parameter and try parsing in sequence. If one of them could parse the input, the State object would be returned. For example, the following parser will consume any combination of "a" or "b":

    many(or(string("a"), string("b")));

## Sample Code

Here is a four arithmetic operations calculator sample code. 

    var tok_number = map(parseFloat, regexp(/^\s*[-+]?\d+(\.\d+)?\s*/));
    var tok_plus  = regexp(/^\s*\+\s*/);
    var tok_minus = regexp(/^\s*\-\s*/);
    var tok_div   = regexp(/^\s*\/\s*/);
    var tok_mul   = regexp(/^\s*\*\s*/);
    var tok_left  = regexp(/^\s*\(\s*/);
    var tok_right = regexp(/^\s*\)\s*/);
    
    // expr := term ("+" expr | "-" expr)?
    var expr = seq((s)=>{
        var v = s(term);
        s(option(v, or(
            seq((s)=>{  
                s(tok_plus);
                var e = s(expr);
                return v + e;
            }),
            seq((s)=>{
                s(tok_minus);
                var e = s(expr);
                return v - e;
            })
        )));
    });
    
    // term := factor ("*" term | "/" term)?
    var term = seq((s)=>{
        var v = s(factor);
        s(option(v, or(
            seq((s)=>{
                s(tok_mul);
                var t = s(term);
                return v * t;
            }),
            seq((s)=>{
                s(tok_div);
                var t = s(term);
                return v / t;
            })
        )));
    });
    
    // factor := "(" expr ")"  |  number
    var factor = choice((c)=>{
        c(seq((s)=>{
            s(tok_left);                
            var v = s(expr);
            s(tok_right);
            s(ret(()=>v));
        }));
        c(tok_number);
    });
    
    console.log(expr.parse(new Source("(4+1.5+-2.5)*2/0.5", 0)).value);    

## Change log

2013 01 01 **ver. 0,1**

* First release

## TODO

* Adding more useful functions like *sepBy*, *endBy*.
* Adding more test cases or examples.
* Performance tuning.

## License

Parsect is licensed under MIT License.

    The MIT License
    
    Copyright (c) 2013 Kon
    
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.

## Contact

http://phyzkit.net/ 

[@KDKTN](http://twitter.com/KDKTN/) in twitter
    
日本語でもおｋ Japanese also available to contact me.