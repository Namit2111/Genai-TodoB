const content = "Hello my email is namitjain3121@gmail.com meshge me her e"
const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;
const emailMatches = content.match(emailRegex);
console.log(emailMatches[0])