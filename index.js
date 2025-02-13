//HubSpot Coding Assessment
fetch(
  "https://candidate.hubteam.com/candidateTest/v3/problem/dataset?userKey=8b6f600e9eb85a90612235051f71"
)
  .then((response) => response.json()) // Here to parse the JSON response
  .then((data) => {
    // I am creating a map for the customers' data
    let customerData = {};

    // Then I am looping through the data and grouping calls by customer ID and date
    data.forEach((call) => {
      const customerId = call.customerId;
      const startDate = new Date(call.startTimestamp)
        .toISOString()
        .split("T")[0];
      // Using the ISO standard- toISOString() for the dates

      if (!customerData[customerId]) {
        customerData[customerId] = {}; // If not already a customer, this will initialize it in the map
      }
      if (!customerData[customerId][startDate]) {
        customerData[customerId][startDate] = []; // If not already a date, this will initialize it in the map
      }
      // Pushing the call data into the correct customers and dates
      customerData[customerId][startDate].push(call);
    });

    // Here I am calculating the max concurrent calls for each of the customers and the dates
    // I am using Object.keys() to calculate the max concurrent calls without changing the original object
    Object.keys(customerData).forEach((customerId) => {
      Object.keys(customerData[customerId]).forEach((date) => {
        const calls = customerData[customerId][date];
        let events = [];

        // Converting the calls into event objects
        calls.forEach((call) => {
          events.push({
            time: new Date(call.startTimestamp).getTime(),
            type: "start",
          });
          events.push({
            time: new Date(call.endTimestamp).getTime(),
            type: "end",
          });
        });

        // Sorting the events by time
        events.sort((a, b) => {
          if (a.time === b.time) return a.type === "end" ? -1 : 1;
          return a.time - b.time;
        });

        // Calculating max concurrency
        let concurrency = 0;
        let maxConcurrency = 0;

        events.forEach((event) => {
          if (event.type === "start") {
            concurrency++;
            maxConcurrency = Math.max(maxConcurrency, concurrency);
          } else {
            concurrency--;
          }
        });

        console.log(
          `Customer: ${customerId}, Date: ${date}, Max Concurrent Calls: ${maxConcurrency}`
        );
      });
    });
  })
  .catch((error) => console.error("Error fetching data:", error)); // Here to handle any potential errors
// Next, I node index.js to retrieve the data from the URL
