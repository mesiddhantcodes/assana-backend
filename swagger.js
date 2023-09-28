const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./app.ts']



// swaggerAutogen(outputFile, endpointsFiles)




swaggerAutogen(outputFile, endpointsFiles,{host:"192.168.3.218:3000"})