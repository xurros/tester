<?php

if($_POST)
{
	$to_Email   	= "support@dexifly.com"; //Replace with recipient email address
	$subject        = 'Message from my website'; //Subject line for emails
	
	//check if its an ajax request, exit if not
    if(!isset($_SERVER['HTTP_X_REQUESTED_WITH']) AND strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
	
		//exit script outputting json data
		$output = json_encode(
		array(
			'type'=>'error', 
			'text' => 'Request must come from Ajax'
		));
		
		die($output);
    } 
	
	//check $_POST vars are set, exit if any missing
	if(!isset($_POST["userName"]) || !isset($_POST["userEmail"]) || !isset($_POST["userMessage"]))
	{
		$output = json_encode(array('type'=>'error', 'text' => 'Input fields are empty!'));
		die($output);
	}

	//Sanitize input data using PHP filter_var().
	$user_Name        = filter_var($_POST["userName"], FILTER_SANITIZE_STRING);
	$user_Email       = filter_var($_POST["userEmail"], FILTER_SANITIZE_EMAIL);
	$user_Message     = filter_var($_POST["userMessage"], FILTER_SANITIZE_STRING);
	$user_Company     = filter_var($_POST["userCompany"], FILTER_SANITIZE_STRING);
	
	
	//additional php validation
	if(strlen($user_Name)<4) // If length is less than 4 it will throw an HTTP error.
	{
		$output = json_encode(array('type'=>'error', 'text' => 'Name is too short or empty!'));
		die($output);
	}
	if(!filter_var($user_Email, FILTER_VALIDATE_EMAIL)) //email validation
	{
		$output = json_encode(array('type'=>'error', 'text' => 'Please enter a valid email!'));
		die($output);
	}
	if(strlen($user_Message)<5) //check emtpy message
	{
		$output = json_encode(array('type'=>'error', 'text' => 'Too short message! Please enter something.'));
		die($output);
	}
	
	$headers  = 'MIME-Version: 1.0' . "\r\n";
	$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
	$headers .= 'From: ' . $user_Email . "\r\n";

	$message = '<html> 
       <head> 
          <title>Message</title> 
       </head>
       <body>
          <p><strong>Full name:</strong> ' . $user_Name . '</p>
          <p><strong>E-mail:</strong> ' . $user_Email . '</p>';
    $message.= $user_Company ?'<p><strong>Company:</strong> ' . $user_Company . '</p>':'';
    $message.=
          '<p><strong>Message:</strong> ' . $user_Message . '</p>
       </body>
       </html>';

    $sentMail = @mail($to_Email, $subject, $message, $headers);

	if(!$sentMail)
	{
		$output = json_encode(array('type'=>'error', 'text' => 'Could not send mail! Please check your PHP mail configuration.'));
		die($output);
	}else{
		$output = json_encode(array('type'=>'message', 'text' => 'Hi '.$user_Name .'! Thank you for your email'));
		die($output);
	}
}
?>