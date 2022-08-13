# BanchaScript

## Abstract

- BanchaScript is a AltJS, a programming language compiled into JavaScript source code.
- [supports user-defined operators (演算子のユーザ定義が可能)](https://qiita.com/KDKTN/items/a151d8d003a62c7b2ca3#10%E5%88%86%E3%81%8F%E3%82%89%E3%81%84%E3%81%A7%E3%82%8F%E3%81%8B%E3%82%8Bbanchascript%E3%81%AE%E3%83%A6%E3%83%BC%E3%82%B6%E5%AE%9A%E7%BE%A9%E6%BC%94%E7%AE%97%E5%AD%90)
- [DEMO - BanchaScript Playground](https://taisukef.github.io/BanchaScript/demo/)
- [100行で書く俺様プログラミング言語コンパイラAltJS編 - Qiita](https://qiita.com/KDKTN/items/a151d8d003a62c7b2ca3)
- dependency: [Parsect : Parser Combinator for JavaScript/TypeScript](https://github.com/taisukef/Parsect)

## Usage

[hello.bancha](example/hello.bancha)
```
function log(s) {
  native "console.log(s)";
}
log("Hello BanchaScript!");
```

to run (need to install [Deno](https://deno.land/))
```
deno run -A https://taisukef.github.io/BanchaScript/banchac.js hello.bancha
```

to install command
```
deno install -A https://taisukef.github.io/BanchaScript/bancha.js
```

to run simply!
```
bancha hello.bancha
```

to uninstall command
```
deno uninstall bancha
```

## to build DEMO

```
deno bundle --no-check bancha_util.js demo/bundle.js
```

## License

Parsect is licensed under the MIT License.

    The MIT License
    
    Copyright 2013 Kon (http://phyzkit.net/)
    
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



Some of the codes of Parsect were ported from [Parsec](http://hackage.haskell.org/package/parsec-3.1.3). 
Parsec is provided under BSD-style license as below:

    Copyright 1999-2000, Daan Leijen; 2007, Paolo Martini. All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

    This software is provided by the copyright holders "as is" and any express or
    implied warranties, including, but not limited to, the implied warranties of
    merchantability and fitness for a particular purpose are disclaimed. In no
    event shall the copyright holders be liable for any direct, indirect,
    incidental, special, exemplary, or consequential damages (including, but not
    limited to, procurement of substitute goods or services; loss of use, data,
    or profits; or business interruption) however caused and on any theory of
    liability, whether in contract, strict liability, or tort (including
    negligence or otherwise) arising in any way out of the use of this software,
    even if advised of the possibility of such damage.    
