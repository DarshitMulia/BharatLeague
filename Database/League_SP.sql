-- Stored Procedures for League Table

-- Procedure for Add a New League
CREATE PROCEDURE PR_AddLeague
    @UserID INT,
    @LeagueName NVARCHAR(100),
    @Country NVARCHAR(50),
	@ImageUrl NVARCHAR(MAX),
    @StartDate DATE,
    @EndDate DATE
AS
BEGIN
    INSERT INTO League (user_id, leaguename, country, image_url, start_date, end_date, created_at, updated_at)
    VALUES (@UserID, @LeagueName, @Country, @ImageUrl, @StartDate, @EndDate, GETDATE(), GETDATE());
END;


-- Procedure to Get All League
CREATE PROCEDURE PR_GetAllLeagues
AS
BEGIN
    SELECT league_id, user_id, leaguename, country, image_url, start_date, end_date, status, created_at, updated_at
    FROM League;
END;


-- Procedure to Get League by their ID
CREATE PROCEDURE PR_GetLeagueByID
    @LeagueID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM League WHERE league_id = @LeagueID)
    BEGIN
        RAISERROR ('League not found.', 16, 1);
        RETURN;
    END

    SELECT league_id, user_id, leaguename, country, image_url, start_date, end_date, status, created_at, updated_at
    FROM League
    WHERE league_id = @LeagueID;
END;


-- Procedure to Update League Details
CREATE PROCEDURE PR_UpdateLeague
	@UserID INT,
    @LeagueID INT,
    @LeagueName NVARCHAR(100),
    @Country NVARCHAR(50),
	@ImageUrl NVARCHAR(MAX),
    @StartDate DATE,
    @EndDate DATE
AS
BEGIN
    IF EXISTS (SELECT 1 FROM League WHERE leaguename = @LeagueName AND league_id <> @LeagueID)
	BEGIN
		RAISERROR ('League name already exists.', 16, 1);
		RETURN;
	END

    UPDATE League
    SET leaguename = @LeagueName,
        country = @Country,
		image_url = @ImageUrl,
        start_date = @StartDate,
        end_date = @EndDate,
        updated_at = GETDATE()
    WHERE league_id = @LeagueID;
END; 


-- Procedure to Delete League 
/* CREATE PROCEDURE PR_DeleteLeague
    @LeagueID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM League WHERE league_id = @LeagueID)
    BEGIN
        RAISERROR ('League not found.', 16, 1);
        RETURN;
    END
    DELETE FROM Game_Statistics
    WHERE match_id IN (SELECT match_id FROM [Match] WHERE league_id = @LeagueID);

    -- Delete matches associated with the league
    DELETE FROM [Match]
    WHERE league_id = @LeagueID;

    -- Delete league standings associated with the league
    DELETE FROM League_Standings
    WHERE league_id = @LeagueID;

    -- Delete players associated with the league's teams
    DELETE FROM Player
    WHERE team_id IN (SELECT team_id FROM Team WHERE league_id = @LeagueID);

    -- Delete teams associated with the league
    DELETE FROM Team
    WHERE league_id = @LeagueID;

    -- Finally, delete the league
    DELETE FROM League
    WHERE league_id = @LeagueID;

    -- Return success message
    PRINT 'League and associated data successfully deleted.';
END; */


-- Procedure to Get Leagues Created by a Specific User
CREATE PROCEDURE PR_GetLeaguesByUser
    @UserID INT
AS
BEGIN
    SELECT league_id, user_id, leaguename, country, image_url, start_date, end_date, status, created_at, updated_at
    FROM League
    WHERE user_id = @UserID
    ORDER BY start_date DESC;
END;


-- Procedure to Get All Ongoing Leagues
CREATE PROCEDURE PR_GetOngoingLeagues
AS
BEGIN
    SELECT league_id, user_id, leaguename, country, image_url, start_date, end_date, status, created_at, updated_at
    FROM League
    WHERE status = 'Ongoing'
	ORDER BY start_date DESC;
END;


------------------------------------------ OPTIONAL -------------------------------

/* CREATE PROCEDURE PR_GetLeaguesByStatus
    @Status NVARCHAR(20)
AS
BEGIN
    IF @Status NOT IN ('Scheduled', 'Ongoing', 'Completed')
    BEGIN
        RAISERROR ('Invalid status.', 16, 1);
        RETURN;
    END

    SELECT league_id, user_id, name, country, start_date, end_date, status, created_at, updated_at
    FROM League
    WHERE status = @Status
    ORDER BY start_date DESC;
END; */

/* CREATE PROCEDURE PR_GetLeagueStats
    @LeagueID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM League WHERE league_id = @LeagueID)
    BEGIN
        RAISERROR ('League not found.', 16, 1);
        RETURN;
    END

    SELECT 
        (SELECT COUNT(*) FROM Team WHERE league_id = @LeagueID) AS TotalTeams,
        (SELECT COUNT(*) FROM [Match] WHERE league_id = @LeagueID) AS TotalMatches,
        (SELECT COUNT(*) FROM MatchEventLogs WHERE match_id IN (SELECT match_id FROM [Match] WHERE league_id = @LeagueID)) AS TotalEvents
    FROM League
    WHERE league_id = @LeagueID;
END; */