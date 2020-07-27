import React from 'react';

// GET http://localhost:9000?name=Brian changes the name to Brian
const ExampleComponent = ({ name = 'John' }) => <div>This is Example Component {name}</div>;

export default ExampleComponent;
