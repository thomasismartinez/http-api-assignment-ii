const users = {};
const notRealError = 'Not Real';

// responds with json object
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// responds without body (only metadata)
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// return user object as json
const getUsers = (request, response, method) => {
  // if GET request
  if (method === 'GET') {
    const responseJSON = {
      message: users,
    };

    respondJSON(request, response, 200, responseJSON);
  }
  // otherwise it is a HEAD request
  else {
    respondJSONMeta(request, response, 200);
  }
};

const notReal = (request, response, method) => {
  // if GET request
  if (method === 'GET') {
    const responseJSON = {
      id: 'notFound',
      message: notRealError,
    };

    respondJSON(request, response, 404, responseJSON);
  }
  // otherwise it is a HEAD request
  else {
    respondJSONMeta(request, response, 404);
  }
};

const addUser = (request, response, body) => {
  console.log(body);
  // default response
  const responseJSON = {
    message: 'Name and age are both required',
  };

  // if a name and age are not given
  if (!body.name || !body.age) {
    // give failure id
    responseJSON.id = 'addUserMissingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204; // updating pre-existing user

  // if this user does not exist yet
  if (!users[body.name]) {
    responseCode = 201; // adding new user
    users[body.name] = {}; // create new user with given name
  }

  // set fields
  users[body.name].name = body.name;
  users[body.name].age = body.age;

  console.log(users);

  // return 201
  if (responseCode === 201) {
    responseJSON.message = 'Created Succesfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  // return 204
  return respondJSONMeta(request, response, responseCode);
};

module.exports = {
  addUser,
  getUsers,
  notReal,
};
