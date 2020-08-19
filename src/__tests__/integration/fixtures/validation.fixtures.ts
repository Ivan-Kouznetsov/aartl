export const allRules = `
Test that it should get a post
Expect HTTP request
    url: http://www.example.com/posts/
    method: get
To match JSON rules
    "$..xx": < 10
	"$..xx": <= 10
	"$..xx": > 10
	"$..xx": >= 10
	"$..xx": count < 10
	"$..xx": count <= 10
	"$..xx": count = 10
	"$..xx": count > 10
	"$..xx": count >= 10
	"$..xx": each has AAAA
	"$..xx": is a date
	"$..xx": is a number
	"$..xx": is after "Jan 1 2000"
	"$..xx": is any of 1 2 3
	"$..xx": is as early as "Jan 1 2000"
	"$..xx": is as late as "Jan 1 2000"
	"$..xx": is earlier than "Jan 1 2000"
	"$..xx": is not 5
	"$..xx": is same date and time as "Jan 1 2000 10:30"
	"$..xx": is same date as "Jan 1 2000"
	"$..xx": is sorted asc
	"$..xx": is text
	"$..xx": is text containing AAAA
	"$..xx": is text not containing AAAA
	"$..xx": matches \d+
	"$..xx": properties limited to AAA BB C  
	"$..xx": is today 
	"$..xx": is after today 
	"$..xx": is before today 
`;
