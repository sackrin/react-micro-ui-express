const ExampleEndpoint = ({ res, req }) => {
  res.set('Content-Type', 'application/json');
  res.send({ data: { name: 'John Smith' }});
};

export default ExampleEndpoint;
