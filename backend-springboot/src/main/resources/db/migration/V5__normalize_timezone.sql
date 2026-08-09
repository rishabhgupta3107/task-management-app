-- Use a UTC offset for the seed user's timezone so it matches the profile picker options.
UPDATE users SET timezone = 'UTC+05:30' WHERE username = 'rishabh' AND timezone = 'Asia/Kolkata';
