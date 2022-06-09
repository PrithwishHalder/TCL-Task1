const axios = require("axios").default;
const fs = require("fs");

// Creating random 50 user id to fetch data from
const randomIdGenerator = (min, max) => {
  let userIds = new Set();
  while (userIds.size < 50) {
    userIds.add(Math.floor(Math.random() * (max - min + 1)) + 1);
  }

  return Array.from(userIds);
};

const randomDate = (start) => {
  end = new Date(Date.now());
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const todolistFetch = async (req, res) => {
  try {
    const userIds = randomIdGenerator(1, 200);
    let data = {};

    // Creating array of Promise by looping through the array
    const urls = userIds.map((id) =>
      axios
        .get(`https://jsonplaceholder.typicode.com/todos/${id}`)
        .then((result) => {
          return {
            data: { ...result.data, timestamp: randomDate(new Date(2012, 0, 1)) },
          };
        })
        .catch((err) => {
          return { data: { message: err.message, id: err } };
        })
    );

    // Executing all the Promises and creating the response in JSON format
    const a = await Promise.all(urls)
      .then((results) =>
        results.forEach((result, index) => {
          data[index] = result.data;
        })
      )
      .catch((err) => {
        return res.status(404).json(err.message);
      });

    // Storing the Data in a JSON file
    fs.writeFile("todolist.json", JSON.stringify(data), (err) => {
      if (err) {
        console.log(err.message);
        return res.status(404).json({ message: err.message });
      }
    });

    return res.json(data);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = {
  todolistFetch,
};
