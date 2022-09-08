/**
Provide the correct code for the following function parseBookingEnquiry.
This function must parse the string 
in the input parameter bookingEnquiry to find:
* the name for the booking,
* the time of the booking,
* the number of people for the booking.
Some of the above information may not be present in the enquiry.
After finding all the information included in the enquiry,
this function must pack the information in an object literal having this structure:
{
  bookingName: ...., //here it goes the parsed name
  bookingTime: ...., //here it goes the parsed time
  bookingNumber: .... //here it goes the number of people in the booking
}
and return it.

Missing information must be recorded with the value null in the appropriate property of
the object structure above.
For example:
Sentence 1: "I have a booking for Mike Stanley at 7:30pm for five people"
Return value 1: {bookingName: "Mike Stanley", bookingTime: "7:30pm", bookingNumber: "five"}
Sentence 2: "I booked a table for two"
Return value 2: {bookingName: null, bookingTime: null, bookingNumber: "two"}

To get the extra 0.5 marks your code must reach at least a 60% success rate
and be simple, elegan, short and easy to read, without too many if conditional statements
*/

// you can also add your code here if you need to do so

function parseBookingEnquiry(bookingEnquiry){
    // your code goes here
  
    // you can modify this instruction to return
    // the correct information you will
    // retrieve by parsing the string in
    // the parameter bookingEnquiry
    return {
        bookingName: null,
        bookingTime: null,
        bookingNumber: null
    };
}