-- Stored Procedures for Users Table

-- Procedure for SignUP a User
CREATE PROCEDURE PR_SignUpUser
    @Username NVARCHAR(50),
    @Email NVARCHAR(100),
    @Password NVARCHAR(200),
    @Role NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if the email is already registered
    IF EXISTS (SELECT 1 FROM Users WHERE email = @Email)
    BEGIN
        RAISERROR ('Email is already registered.', 16, 1);
        RETURN;
    END

    -- Check if the username is already taken
    IF EXISTS (SELECT 1 FROM Users WHERE username = @Username)
    BEGIN
        RAISERROR ('Username is already taken.', 16, 1);
        RETURN;
    END

    -- Insert the new user into the table
    INSERT INTO Users (username, email, password, role, created_at, updated_at)
    VALUES (@Username, @Email, @Password, @Role, GETDATE(), GETDATE());

    PRINT 'User registered successfully.';
	RETURN 1;
END;



-- Procedure to Authenticate a User
ALTER PROCEDURE PR_LoginUser
    @Email NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if the email exists
    IF NOT EXISTS (SELECT 1 FROM Users WHERE email = @Email)
    BEGIN
        RAISERROR ('Invalid email.', 16, 1);
        RETURN;
    END

    -- Retrieve the user details (excluding the password) for verification in the application layer
    SELECT 
        user_id,
        username,
        email,
        password,  -- Hashed password, compare it in the backend
        role,
        created_at,
        updated_at
    FROM Users
    WHERE email = @Email;
END;


-- Procedure to Add a New User
/* CREATE PROCEDURE PR_AddUser
    @Username NVARCHAR(50),
    @Email NVARCHAR(100),
    @Password NVARCHAR(100),
    @Role NVARCHAR(20)
AS
BEGIN
    IF @Role NOT IN ('Admin', 'User')
    BEGIN
        RAISERROR ('Invalid role specified.', 16, 1);
        RETURN;
    END
    INSERT INTO Users (username, email, password, role, created_at, updated_at)
	VALUES (@Username, @Email, @Password, @Role, GETDATE(), GETDATE());
END; */


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
    IF NOT EXISTS (SELECT 1 FROM Users WHERE user_id = @UserID)
    BEGIN
        RAISERROR ('User not found.', 16, 1);
        RETURN;
    END

    SELECT user_id, username, email, role, created_at, updated_at
    FROM Users
    WHERE user_id = @UserID;
END;


-- Procedure to Update User Details
/* CREATE PROCEDURE PR_UpdateUser
    @UserID INT,
    @Email NVARCHAR(100),
    @Password NVARCHAR(100),
    @Role NVARCHAR(20)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Users WHERE user_id = @UserID)
    BEGIN
        RAISERROR ('User not found.', 16, 1);
        RETURN;
    END

    IF @Role NOT IN ('Admin', 'User')
    BEGIN
        RAISERROR ('Invalid role specified.', 16, 1);
        RETURN;
    END

    UPDATE Users
    SET email = @Email,
        password = @Password,
        role = @Role,
        updated_at = GETDATE()
    WHERE user_id = @UserID;
END; */


-- Procedure to Delete a User
/* CREATE PROCEDURE PR_DeleteUser
    @UserID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Users WHERE user_id = @UserID)
    BEGIN
        RAISERROR ('User not found.', 16, 1);
        RETURN;
    END

    DELETE FROM Users
    WHERE user_id = @UserID;
END; */

--------------- Didn't executed the the commented parts.

-- Procedure to Search Users
ALTER PROCEDURE PR_SearchUsers
    @SearchTerm NVARCHAR(100)
AS
BEGIN
    SELECT user_id, username, email, role, created_at, updated_at
    FROM Users
    WHERE username LIKE '%' + @SearchTerm + '%'
       OR email LIKE '%' + @SearchTerm + '%';
END;



-- Testing

EXEC PR_SignUpUser 'testuser', 'testemail@example.com', 'password123', 'User';
SELECT * FROM Users WHERE email = 'testemail@example.com';


EXEC PR_LoginUser 'testemail@example.com', 'password123';
EXEC PR_LoginUser 'wrongemail@example.com', 'wrongpassword';


EXEC PR_AddUser 'newuser', 'newemail@example.com', 'password123', 'Admin';
EXEC PR_AddUser 'moderatoruser', 'modemail@example.com', 'password123', 'Moderator';


EXEC PR_GetAllUsers;


EXEC PR_GetUserByID 1;
EXEC PR_GetUserByID 999;


EXEC PR_UpdateUser 1, 'updatedemail@example.com', 'newpassword123', 'Admin';
SELECT * FROM Users WHERE user_id = 1;


EXEC PR_DeleteUser 12;
SELECT * FROM Users WHERE user_id = 5;
EXEC PR_DeleteUser 999;


EXEC PR_SearchUsers 'test3@gmail.com';
EXEC PR_SearchUsers 'example.com';
EXEC PR_SearchUsers 'nonexistent';