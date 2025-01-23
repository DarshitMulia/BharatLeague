-- Stored Procedures for Player Table

-- Procedure to Add a New Player with Validation for Age and Jersey Number
CREATE PROCEDURE PR_AddPlayer
    @TeamID INT,
    @PlayerName NVARCHAR(100),
	@ImageUrl NVARCHAR(MAX),
    @Age INT,
    @JerseyNumber INT,
    @Position NVARCHAR(50)
AS
BEGIN
    IF @Age <= 0 OR @Age > 100
    BEGIN
        RAISERROR ('Invalid age. Age should be between 1 and 100.', 16, 1);
        RETURN;
    END

    IF @JerseyNumber < 1 OR @JerseyNumber > 99
    BEGIN
        RAISERROR ('Invalid jersey number. Jersey number should be between 1 and 99.', 16, 1);
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM Team WHERE team_id = @TeamID)
    BEGIN
        RAISERROR ('Team does not exist.', 16, 1);
        RETURN;
    END

    INSERT INTO Player (team_id, playername, image_url, age, jersey_number, position, created_at, updated_at)
    VALUES (@TeamID, @PlayerName, @ImageUrl, @Age, @JerseyNumber, @Position, GETDATE(), GETDATE());
END;


-- Procedure to Retrieve All Players
CREATE PROCEDURE PR_GetAllPlayers
AS
BEGIN
    SELECT player_id, team_id, playername, image_url, age, jersey_number, position, created_at, updated_at
    FROM Player;
END;


-- Procedure to Retrieve Player by ID
CREATE PROCEDURE PR_GetPlayerByID
    @PlayerID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Player WHERE player_id = @PlayerID)
    BEGIN
        RAISERROR ('Player does not exist.', 16, 1);
        RETURN;
    END

    SELECT player_id, team_id, playername, image_url, age, jersey_number, position, created_at, updated_at
    FROM Player
    WHERE player_id = @PlayerID;
END;


-- Procedure to Retrieve Players by Team
CREATE PROCEDURE PR_GetPlayersByTeam
    @TeamID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Team WHERE team_id = @TeamID)
    BEGIN
        RAISERROR ('Team does not exist.', 16, 1);
        RETURN;
    END

    SELECT player_id, team_id, playername, image_url, age, jersey_number, position, created_at, updated_at
    FROM Player
    WHERE team_id = @TeamID;
END;


-- Procedure to Update Player Details
CREATE PROCEDURE PR_UpdatePlayer
    @PlayerID INT,
	@TeamID INT,
    @PlayerName NVARCHAR(100),
	@ImageUrl NVARCHAR(MAX),
    @Age INT,
    @JerseyNumber INT,
    @Position NVARCHAR(50)
AS
BEGIN
    IF @Age <= 0 OR @Age > 100
    BEGIN
        RAISERROR ('Invalid age. Age should be between 1 and 100.', 16, 1);
        RETURN;
    END

    IF @JerseyNumber < 1 OR @JerseyNumber > 99
    BEGIN
        RAISERROR ('Invalid jersey number. Jersey number should be between 1 and 99.', 16, 1);
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM Player WHERE player_id = @PlayerID)
    BEGIN
        RAISERROR ('Player does not exist.', 16, 1);
        RETURN;
    END

    UPDATE Player
    SET playername = @PlayerName,
		image_url = @ImageUrl,
        age = @Age,
        jersey_number = @JerseyNumber,
        position = @Position,
        updated_at = GETDATE()
    WHERE player_id = @PlayerID;
END;

-- Procedure to Delete a Player
/* CREATE PROCEDURE PR_DeletePlayer
    @PlayerID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Player WHERE player_id = @PlayerID)
    BEGIN
        RAISERROR ('Player does not exist.', 16, 1);
        RETURN;
    END

    DELETE FROM Player
    WHERE player_id = @PlayerID;
END; */


-- Procedure to Search for Players
CREATE PROCEDURE PR_SearchPlayers
    @SearchTerm NVARCHAR(100)
AS
BEGIN
    SELECT player_id, team_id, playername, image_url, age, jersey_number, position, created_at, updated_at
    FROM Player
    WHERE playername LIKE '%' + @SearchTerm + '%'
       OR position LIKE '%' + @SearchTerm + '%';
END;


---> Have to work on Delete in here if needed.