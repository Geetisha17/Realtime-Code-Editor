export const LANGS_VERSION = {
    typescript : "5.0.3",
    java :"15.0.2",
    csharp: "6.12.0",
    php: "8.2.3",
    cpp: "10.2.3",
};

export const CODE_SNIPPETS = {
    typescript: `function main(x: number) {
    console.log(x);
}
main(10);
`,
    java: `public class Main {
    public static void main(String[] args) {
        int x = 10;
        System.out.println(x);
    }
}
`,
    csharp: `using System;

class Program {
    static void Main(string[] args) {
        int x = 10;
        Console.WriteLine(x);
    }
}
`,
    php: `<?php
function main($x) {
    echo $x;
}

main(10);
?>
`,
    cpp: `#include <iostream>

int main() {
    int x = 10;
    std::cout << x;
    return 0;
}
`
};
