// HubSpot Coding Assessment
fetch(
  "https://candidate.hubteam.com/candidateTest/v3/problem/dataset?userKey=8b6f600e9eb85a90612235051f71"
)
  .then((response) => response.json()) // Here to parse the JSON response
  .then((data) => {
    console.log("Fetched data:", data); // Log the data to check its structure

    // Ensure the data is an array before proceeding
    if (!Array.isArray(data.calls)) {
      console.error(
        "Data is not in the expected format or missing 'calls' property."
      );
      return;
    }

    // I am creating a map for the customers' data
    let customerData = {};

    // Then I am looping through the data and grouping calls by customer ID and date
    data.calls.forEach((call) => {
      const customerId = call.customerId;
      const startDate = new Date(call.startTimestamp)
        .toISOString()
        .split("T")[0];
      // Using the ISO standard - toISOString() for the dates

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
    let results = []; // Store the results in this array

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

        // Sorting the events by time (sort events so we can track concurrency)
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

        // Logging the result for easier testing
        console.log(
          `Customer: ${customerId}, Date: ${date}, Max Concurrent Calls: ${maxConcurrency}`
        );

        // Storing the result in the results array
        results.push({
          customerId: customerId,
          date: date,
          maxConcurrentCalls: maxConcurrency, // Fix: make sure we're consistent with naming
        });
      });
    });

    // Sending the results back to the server (POST request)
    fetch(
      "https://candidate.hubteam.com/candidateTest/v3/problem/result?userKey=8b6f600e9eb85a90612235051f71",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ results: results }),
      }
    )
      .then((response) => {
        if (response.ok) {
          console.log("Successfully posted results! 🎉");
        } else {
          console.error("Failed to post results:", response.statusText);
        }
      })
      .catch(
        (error) => console.error("Error posting results:", error) // Here to handle any errors with the POST request
      );
  })
  .catch((error) => console.error("Error fetching data:", error)); // Here to handle any potential errors
