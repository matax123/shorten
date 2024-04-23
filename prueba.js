const inputText = `public int persona_validada { get; set; }
public int EXTRANJERO { get; set; }
public IEnumerable<Persona>? listapersonas { get; set; }`;
var output = ''

// Dividir el texto en líneas
const lines = inputText.split('\n');

lines.forEach((line) =>{
    let nombreVariable = line.split(" ")[2]
    output += `[JsonPropertyName("${nombreVariable}")]\n`
    output += line + "\n";
})

// Procesar cada línea
console.log(output)