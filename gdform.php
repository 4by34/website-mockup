<?php
mb_language('uni');
mb_internal_encoding('UTF-8');


$mail_to = 'annie@spappc.ca';
$mail_from = '"SPAPPC Website Contact Form Submission" <annie@spappc.ca>';
$redirect_url = '';

// Fail if _POST and _GET are empty. Nothing to process.
if(count($_POST) == 0 AND count($_GET) == 0):
echo 'This form handler does nothing if visited directly. You must submit form data to this script.';
exit;
endif;

// Set $fields to whichever method is being used.
$fields = (count($_POST) > 0 ) ? $_POST : $_GET;

$message_body = "Details of Form Submission \n\n";

foreach ($fields as $field => $value):

// $cleanData = trim(preg_replace('/ +/', ' ', urldecode(html_entity_decode(strip_tags($value)))));
$cleanData = trim(preg_replace('/ +/', ' ', preg_replace('/=/', ' ', urldecode(html_entity_decode(strip_tags($value))))));
$value = $cleanData;

switch(strtolower($field)):
case 'redirect':
$redirect = $value;
break;
case 'subject':
$subject = $value;
break;
case 'first_name':
case 'prenom':
$firstName = $value;
break;
case 'last_name':
case 'nom_de_famille':
$lastName = $value;
break;
case 'email':
$email = $value;
break;
endswitch;

if (strtolower($field) != 'redirect' AND strtolower($field) != 'submit' AND strtolower($field) != 'subject'):
$message_body .= strtoupper(preg_replace('/_/', ' ', $field)) . ": " . $value . "\r\n";
endif;
endforeach;

$message_body = wordwrap($message_body, 70, "\r\n");

// Set the redirect URL from the form (if set). $host_url is a default action if $redirect isn't set
$redirect = (empty($redirect_url)) ? $redirect : $redirect_url;
$host_url = $_SERVER['HTTP_HOST'];

// Set the message subject based upon a subject field being set or not.
$message_subject = (!empty($subject)) ? $subject . " - " . $lastName . ", " . $firstName : 'Message from '.$_SERVER['HTTP_HOST'];

$headers = 'From: ' . $mail_from . "\r\n" .
'Reply-To: ' . $email . "\r\n" .
'X-Mailer: PHP/' . phpversion();

// Remove potentially injected headers from the body
if (!mb_send_mail($mail_to, $message_subject, $message_body, $headers)):
echo "Message Send Failed.";
endif;

if(empty($redirect)):
header("Location: http://{$host_url}");
else:
header("Location: {$redirect}");
endif;
?>