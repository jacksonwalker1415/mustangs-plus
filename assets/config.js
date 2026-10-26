/* SMU+ live backend settings.
   Paste your Supabase Project URL and anon (public) key below to turn on real accounts, boards,
   newsletter signups, saved athletes and Continue Watching sync. Leave them empty and the site runs
   in demo mode, saving everything in this browser only.
   The anon key is meant to be public: Row Level Security in supabase/schema.sql protects the data.
   NEVER put the service_role key (or any secret key) in this file or anywhere in this repo. */
window.SMU_CONFIG = {
  SUPABASE_URL: 'https://lpoguzstqpwzcmjxeaik.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwb2d1enN0cXB3emNtanhlYWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5OTMzMjksImV4cCI6MjEwODU2OTMyOX0.beC7fma6vWOXKS5zfgGJV1-BzJAKRvT8ZBiLDyoA5sU', // anon / public key (role=anon). Safe to publish; RLS protects the data.
  // Email-link return URL. Kept on the github.io address (already in Supabase Auth's allow-list; GitHub redirects it to fanplatformdemo.com).
  // Switch to 'https://fanplatformdemo.com/' once Auth > URL Configuration lists https://fanplatformdemo.com/**.
  SITE_URL: 'https://fanplatformdemo.com/'
};
