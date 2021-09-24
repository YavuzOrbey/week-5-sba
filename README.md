# week-5-sba


#How to use

#In postman you should be able to get a specific todo GET /todo/:id
#You should be able to create a new todo wth POST /todo. The request should send json in the format {"content": "todo text"}
#Likewise a put request given PUT /todo/:id should contain the todos id and send {"content": "updated todo text"}
# DELETE /todo/:id also works.

#VERY IMPORTANT to actually access GET /todos you need to create a user and login and pass in your access token 
go to POST /register and pass in {"email": "example@example.com", "password": "password"}
then POST /login and pass in that same json your response should have an access token COPY it 
in the GET /todos in the header section add a Authorization key and for the value pass in: "token ${that access token you got}" without the quotes
