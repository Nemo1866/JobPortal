const swaggerDocs=require("swagger-jsdoc")


const options = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'My Jobs Portal',
            description: 'This project describes the APIs below.',
            version: '1.0.0',
            contact: {
                email: 'naeemkhan@nimapinfotech.com'
            }
        },
        servers: [
            {
                url: `http://localhost:3000`
            }
        ]
    },
    apis: ["./route/*.js"]
    
  }
  
  const swaggerSpec=swaggerDocs(options)
  
  
 module.exports=swaggerSpec