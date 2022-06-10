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

// Creating random timestamp for task
const randomDate = (start) => {
  end = new Date(Date.now());
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const todolistFetch = async (req, res) => {
  try {
    const userIds = randomIdGenerator(1, 200);
    let finalTaskList = {};

    // Create array of promises using axios
    const urls = userIds.map((id) => axios.get(`https://jsonplaceholder.typicode.com/todos/${id}`));

    // Executing all the Promises and creating the response in JSON format
    const tasks = await Promise.all(urls);

    // Organizing the response and adding timestamp to each task
    tasks.forEach((task, index) => {
      const temp = { ...task.data, timestamp: randomDate(new Date(2012, 0, 1)) };
      finalTaskList[index] = temp;
    });

    // Storing the Data in a JSON file
    fs.writeFile("todolist.json", JSON.stringify(finalTaskList), (err) => {
      if (err) {
        console.log(err.message);
        return res.status(404).json({ message: err.message });
      }
    });

    return res.json(finalTaskList);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = {
  todolistFetch,
};
