-- Test if the delete policies are working correctly
-- Let's check what happens when we try to delete without auth

-- First check current policies
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'categories';