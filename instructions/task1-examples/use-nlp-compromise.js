/*
This is some sample code.
You can copy and paste this code in the function parseBookingEnquiry() and see
what is the result.
You can re-use and adapt this code in your solution as you wish.
*/

// the function parseBookingEnquiry takes a string
// containing a booking enquiry as its input parameter
// let's start by logging it to the Log panel
log(`The current enquiry is: ${bookingEnquiry}`);

// If you want to use nlp compromise, you first need to
// parse the sentence with the function nlp
// This function will return an object with information
// about the parsed tokens (words) in the sentece
let doc = nlp(bookingEnquiry);

// unfortunately, this object is too complex
// to be logged in the Log panel.
// However, you can inspect this object by logging it to
// the debugging console:
console.log(doc);

// If you inspect one of the nlp objects in the debugging console
// under the property 'document' and then in the index 0
// you will see the array of words composing the sentence
// Try to inspect one of them. You will find the property tag
// with a list of tags for that word.
// For example, you may see that people's names have the tag
// Noun among others.
// You can use tags to select a subset of words within the sentence.
// Let's try to select all the Nouns.
// You can use the method match for that:
let nouns = doc.match("#Noun");
// and then you can output them as a json object literal
// with the method .json()
let nounsAsJson = nouns.json();
// try to log this in the debugging console and inspect it
console.log('All the nouns:');
console.log(nounsAsJson);
// if you want to access a specific element of the
// array (list of nouns), you can simply access
// it by providing the array index and using the
// property text.
// Let's use a for loop to print all the nouns in
// the log panel
for (let i = 0; i < nounsAsJson.length; i++){
    log(`Noun ${i+1}: ${nounsAsJson[i].text}`);
}

// To complete the assignment, try to identify
// the tags that you can use in the match method
// to retrieve the correct information from the
// booking enquiry

