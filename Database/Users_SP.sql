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
    -- Insert the new user into the table
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
    SET NOCOUNT ON;
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
    DELETE FROM Users
    WHERE user_id = @UserID;
END; */

--------------- Didn't executed the the commented parts.

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