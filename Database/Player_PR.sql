-- Stored Procedures for Player Table

-- Procedure to Add a New Player
CREATE PROCEDURE PR_AddPlayer
    @TeamID INT,
    @PlayerName NVARCHAR(100),
	@ImageUrl NVARCHAR(MAX),
    @Age INT,
    @JerseyNumber INT,
    @Position NVARCHAR(50)
AS
BEGIN
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
    SELECT player_id, team_id, playername, image_url, age, jersey_number, position, created_at, updated_at
    FROM Player
    WHERE player_id = @PlayerID;
END;


-- Procedure to Retrieve Players by Team
CREATE PROCEDURE PR_GetPlayersByTeam
    @TeamID INT
AS
BEGIN
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
    UPDATE Player
    SET playername = @PlayerName,
		image_url = @ImageUrl,
        age = @Age,
        jersey_number = @JerseyNumber,
        position = @Position,
        updated_at = GETDATE()
    WHERE player_id = @PlayerID;
END;


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
