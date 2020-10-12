### This api for Support a survey application where every authenticted user can create view and submit survey


### Api end points :

1. /login  : for login and generate api key [public]

2. /create : create a survey you have to pass name of survey and question as json object in request body.

3. /get-questions/:id  : To get questions of the specified survey

4. /take/:id : Take a survey means submit the answer as object on this route

5. /view-result/:id  : view result of particular  survey.