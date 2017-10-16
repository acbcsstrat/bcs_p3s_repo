<!doctype html>
<html lang="en">

   <head>



      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

      <link href="https://fonts.googleapis.com/css?family=Maven+Pro:400,500,700" rel="stylesheet">

      <link rel="stylesheet" type="text/css" href="assets/css/normalize.css">
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
      <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">

      <link rel="stylesheet" type="text/css" href="assets/css/style.css">

      <title>Patent Place</title>

   </head>

   <body class="bg-light-grey">
      <div class="pre-app-container d-flex justify-content-center align-items-center">
         <div class="center-container p-a-sm border">
            <div class="content-panel">
               <div class="content-panel__head text-center">
                  <div class="row">
                     <div class="col-md-12  d-flex justify-content-center align-items-center">
                        <div class="m-r-md">
                           <img src="assets/imgs/logos/PP-Icon.png">
                        </div>
                        <h1 class="font-weight-bold">Login</h1>
                     </div>
                  </div>
               </div>
               <div class="content-panel__body bg-white">
                  <div class="row">
                     <div class="col-md-12">
                        <form id="ppLoginForm" action="resources/j_spring_security_check" method="post" class="form">
                           <div class="form-group row">
                              <label class="col-md-4 d-flex flex-column justify-content-center font-lg font-weight-bold" for="j_username">Name: </label>
                              <div class="col-md-8">
                                 <input type="text" name="j_username" class="form-control font-md pill-radius input-p-sm">
                              </div>
                           </div>
                           <div class="form-group row">
                              <label class="col-md-4 d-flex flex-column justify-content-center font-lg font-md font-weight-bold">Password: </label>         
                                 <div class="col-md-8">
                                    <input type="password" name="j_password" class="form-control font-md pill-radius input-p-sm">
                                 </div>
                              </div>
                              <div class="form-group row no-margin-btm">
                                 <div class="col-md-8 offset-md-4 text-right">
                                    <input type="submit" value="Login" class="btn btn-block pill-radius bg-phase-green font-lg txt-white btn--event-p-sm font-weight-bold">
                                 </div>
                              </div>
                        </form>
                        <div class="row m-t-md">
                           <div class="col-md-4">
                              <a class="btn btn-block pill-radius bg-phase-green font-md txt-white btn--event-p-sm font-weight-weight" href="/p3sweb/register">New User</a>
                           </div>
                           <div class="col-md-4">
                              <a class="btn btn-block pill-radius bg-phase-green font-md txt-white btn--event-p-sm font-weight-weight" href="/p3sweb/register">Register</a>
                           </div>
                        </div>          
                     </div>
                  </div>
               </div>
            </div>
         </div>         
      </div>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.form/4.2.2/jquery.form.min.js" integrity="sha384-FzT3vTVGXqf7wRfy8k4BiyzvbNfeYjK+frTVqZeNDFl8woCbF0CYG6g2fMEFFo/i" crossorigin="anonymous"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
      
   </body>






</html>


