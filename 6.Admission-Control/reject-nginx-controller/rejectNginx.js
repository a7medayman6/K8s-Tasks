
module.exports = function rejectNginx (req, res) 
{
  var admissionRequest = req.body;

  // Get a reference to the pod spec
  var object = admissionRequest.request.object;

  console.log(`validating the ${object.metadata.name} pod`);

  var admissionResponse = {
    allowed: false
  };

  var found = false;
  for (var container of object.spec.containers) 
  {
    var image = container.image;
    if(image.includes('nginx'))
    {
      console.log(`${container.name} is using nginx`);
          
        admissionResponse.status = {
          status: 'Failure',
          message: `${container.name} is using nginx`,
          reason: `${container.name} is using nginx`,
          code: 402
        };
    
        found = true;
    }
  };

  if (!found) {
    admissionResponse.allowed = true;
  }

  var admissionReview = {
    response: admissionResponse
  };

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(admissionReview));
  res.status(200).end();
};