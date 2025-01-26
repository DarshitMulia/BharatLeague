-- Stored Procedures for Users Table

-- Procedure for SignUP a User
CREATE PROCEDURE PR_SignUpUser
    @Username NVARCHAR(50),
    @Email NVARCHAR(100),
    @Password NVARCHAR(200),
    @Role NVARCHAR(20)
AS
BEGIN
    INSERT INTO Users (username, email, password, role, created_at, updated_at)
    VALUES (@Username, @Email, @Password, @Role, GETDATE(), GETDATE());

    PRINT 'User registered successfully.';
	RETURN 1;
END;



-- Procedure to Authenticate a User
CREATE PROCEDURE PR_LoginUser
    @Email NVARCHAR(100)
AS
BEGIN
    SELECT 
        user_id,
        username,
        email,
        password,  
        role,
        created_at,
        updated_at
    FROM Users
    WHERE email = @Email;
END;


-- Procedure to Retrieve All User Details
CREATE PROCEDURE PR_GetAllUsers
AS
BEGIN
    SELECT user_id, username, email, role, created_at, updated_at
    FROM Users;
END;


-- Procedure to Retrieve User Details by their ID
CREATE PROCEDURE PR_GetUserByID
    @UserID INT
AS
BEGIN
    SELECT user_id, username, email, role, created_at, updated_at
    FROM Users
    WHERE user_id = @UserID;
END;


-- Procedure to Search Users
CREATE PROCEDURE PR_SearchUsers
    @SearchTerm NVARCHAR(100)
AS
BEGIN
    SELECT user_id, username, email, role, created_at, updated_at
    FROM Users
    WHERE username LIKE '%' + @SearchTerm + '%'
       OR email LIKE '%' + @SearchTerm + '%';
END;