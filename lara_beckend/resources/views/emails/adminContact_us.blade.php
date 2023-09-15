<!DOCTYPE html>
<html>
<head>
    <title>New Contact Form Submission</title>
</head>
<body>
    <p>There has been a new contact form submission:</p>
    <p>Email: {{ $contact->email }}</p>
    <p>Message: {{ $contact->message }}</p>
</body>
</html>
