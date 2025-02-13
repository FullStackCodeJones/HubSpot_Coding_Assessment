//HubSpot Coding Assessment
fetch(
  "https://candidate.hubteam.com/candidateTest/v3/problem/dataset?userKey=8b6f600e9eb85a90612235051f71"
)
  .then((response) => response.json()) // Here to Parse the JSON response
  .then((data) => {
    //I am creating a map for the customers data
    let customerData = {};
    //Then I am looping through the data and group calls by customer ID and dates
    data.forEach((call) => {
      const customerId = call.customerId;
      const startDate = new Date(call.startTimestamp)
        .toISOString()
        .split("T")[0];
      //using the ISO standard- toISOString() for the dates
      if (!customerData[customerId]) {
        customerData[customerId] = {}; // If not already a customer this will Initialize it in the map
      }
      if (!customerData[customerId][startDate]) {
        customerData[customerId][startDate] = []; // If not already a date this will Initialize it in the map
      }
      // Pushing the call dtata into the correct customers and dates
      customerData[customerId][startDate].push(call);
    });

    console.log(data);
  })
  .catch((error) => console.error("Error fetching data:", error)); //Here to handle any potential errors
//next I node index.js to retrieve the data from the url
