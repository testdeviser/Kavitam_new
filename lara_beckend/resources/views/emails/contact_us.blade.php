<!DOCTYPE html>
<html>
<head>
    <title>New Contact Form Submission</title>
</head>
<body>
    <p>There has been a new contact form submission:</p>
    <p>Email/Phone: {{ $contact->emailPhone }}</p>
    <p>Message: {{ $contact->message }}</p>
</body>
</html>
