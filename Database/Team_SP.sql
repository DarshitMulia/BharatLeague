-- Stored Procedures for Team Table

-- Procedure to Add a New Team
CREATE PROCEDURE PR_AddTeam
    @LeagueID INT,
    @TeamName NVARCHAR(100),
    @ImageUrl NVARCHAR(MAX),
    @City NVARCHAR(50),
    @CoachName NVARCHAR(50),
    @FoundedYear INT
AS
BEGIN
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM League WHERE league_id = @LeagueID)
        BEGIN
            RAISERROR ('League not found.', 16, 1);
            RETURN;
        END

        IF EXISTS (SELECT 1 FROM Team WHERE league_id = @LeagueID AND teamname = @TeamName)
        BEGIN
            RAISERROR ('A team with this name already exists in the selected league.', 16, 1);
            RETURN;
        END

        IF @FoundedYear > YEAR(GETDATE())
        BEGIN
            RAISERROR ('Founded year cannot be in the future.', 16, 1);
            RETURN;
        END

        INSERT INTO Team (league_id, teamname, image_url, city, coach_name, founded_year, created_at, updated_at)
        VALUES (@LeagueID, @TeamName, @ImageUrl, @City, @CoachName, @FoundedYear, GETDATE(), GETDATE());

        PRINT 'Team added successfully.';
    END TRY
    BEGIN CATCH
        PRINT ERROR_MESSAGE();
    END CATCH
END;


-- Procedure to Retrieve Teams by League ID
CREATE PROCEDURE PR_GetTeamsByLeagueID
    @LeagueID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM League WHERE league_id = @LeagueID)
    BEGIN
        RAISERROR ('League not found.', 16, 1);
        RETURN;
    END

    SELECT team_id, teamname, image_url, city, coach_name, founded_year, created_at, updated_at
    FROM Team
    WHERE league_id = @LeagueID
	ORDER BY created_at DESC;
END;


-- Procedure to Retrieve a Team by Team ID
CREATE PROCEDURE PR_GetTeamByID
    @TeamID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Team WHERE team_id = @TeamID)
    BEGIN
        RAISERROR ('Team not found.', 16, 1);
        RETURN;
    END

    SELECT team_id, league_id, teamname, image_url, city, coach_name, founded_year, created_at, updated_at
    FROM Team
    WHERE team_id = @TeamID;
END;


-- Procedure to Update Team Details   -- Left to execute and work upon
CREATE PROCEDURE PR_UpdateTeam
    @TeamID INT,
	@LeagueID INT,
    @TeamName NVARCHAR(100),
	@ImageUrl NVARCHAR(MAX),
    @City NVARCHAR(50),
    @CoachName NVARCHAR(50),
    @FoundedYear INT
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Team WHERE league_id = @LeagueID AND teamname = @TeamName AND team_id <> @TeamID)
	BEGIN
		RAISERROR ('A team with this name already exists in the selected league.', 16, 1);
		RETURN;
	END

    UPDATE Team
    SET teamname = @TeamName,
		image_url = @ImageUrl,
        city = @City,
        coach_name = @CoachName,
        founded_year = @FoundedYear,
        updated_at = GETDATE()
    WHERE team_id = @TeamID;
END; 


-- Procedure to Delete a Team   -- Left to execute and work upon
/* CREATE PROCEDURE PR_DeleteTeam
    @TeamID INT
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Player WHERE team_id = @TeamID)
	BEGIN
		RAISERROR ('Cannot delete team because players are associated with it.', 16, 1);
		RETURN;
	END
    DELETE FROM Team
    WHERE team_id = @TeamID;
END; */


-- Procedure to Search Teams by Name or City
CREATE PROCEDURE PR_SearchTeams
    @SearchTerm NVARCHAR(100)
AS
BEGIN
    SELECT team_id, league_id, teamname, image_url, city, coach_name, founded_year, created_at, updated_at
    FROM Team
    WHERE teamname LIKE '%' + @SearchTerm + '%'
       OR city LIKE '%' + @SearchTerm + '%';
END;

---> Have to work on Delete Procedure and Update Procedure in here if needed.