export default function getLanguageList(input, callback) {
  const suggestion = languages
  .filter(s => s.value.toLowerCase().indexOf(input.toLowerCase()) !== -1)

  callback(suggestion)
}

const languages = [
  "C",
  "C++",
  "Java",
  "Python",
  "PHP",
  "JavaScript",
  "Ruby",
  "Groovy",
  "Scala",
].map(l => { return { value: l } })
