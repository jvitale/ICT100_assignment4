/*
This is some sample code.
You can copy and paste this code in the function parseBookingEnquiry() and see
what is the result.
You can re-use and adapt this code in your solution as you wish.
*/

// You can also solve this task by using string functions or regular expressions
// However, this approach might be more challenging
// and time consuming (it is recommended to use nlp-compromise).

// In this example, let's use a regular expression to get
// all the words ending with the characters 'am'
// We need to create a regular expression first
let amRegex = /\w+am\b/;
// \w stands for any word character and \b for the word's boundary
// you can find a regex cheatsheet here:
// https://www.debuggex.com/cheatsheet/regex/javascript

// we can execute this regex for the booking enquiry with
// the exec method:
let result = amRegex.exec(bookingEnquiry);
// if result is not null then the matched string will be at index 0
if (result !== null){
    log(`Found a match: ${result[0]}`);
} else {
    log(`No matches found for ${amRegex}`);
}

// another way to get words ending with 'am' is to
// split the sentence using the spaces and then return words
// ending with am
let words = bookingEnquiry.split(' ');
let results = [];
for (let i = 0; i < words.length; i++){
    if (words[i].endsWith('am')){
        results.push(words[i]);
    }
}
if (results.length > 0){
    log(`Matches found with the method endsWith: ${results}`);
} else {
    log("No matches found with the method endsWith");
}

// You can use many more techniques to get the information
// you need by using JavaScript string functions.
