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
    INSERT INTO Team (league_id, teamname, image_url, city, coach_name, founded_year, created_at, updated_at)
	VALUES (@LeagueID, @TeamName, @ImageUrl, @City, @CoachName, @FoundedYear, GETDATE(), GETDATE());

    PRINT 'Team added successfully.';
END;


-- Procedure to Retrieve Teams by League ID
CREATE PROCEDURE PR_GetTeamsByLeagueID
    @LeagueID INT
AS
BEGIN
    SELECT team_id, teamname, image_url, city, coach_name, founded_year, created_at, updated_at
    FROM Team
    WHERE league_id = @LeagueID
	ORDER BY created_at DESC;
END;


-- Procedure to Retrieve Teams by Match ID
CREATE PROCEDURE PR_GetTeamsByMatchID
    @MatchID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        team_id,
        league_id,
        teamname,
        image_url,
        city,
        coach_name,
        founded_year,
        created_at,
        updated_at
    FROM Team
    WHERE team_id IN (
         SELECT team1_id FROM Match WHERE match_id = @MatchID
         UNION
         SELECT team2_id FROM Match WHERE match_id = @MatchID
    );
END;


-- Procedure to Retrieve a Team by Team ID
CREATE PROCEDURE PR_GetTeamByID
    @TeamID INT
AS
BEGIN
    SELECT team_id, league_id, teamname, image_url, city, coach_name, founded_year, created_at, updated_at
    FROM Team
    WHERE team_id = @TeamID;
END;


-- Procedure to Update Team Details
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
    UPDATE Team
    SET teamname = @TeamName,
		image_url = @ImageUrl,
        city = @City,
        coach_name = @CoachName,
        founded_year = @FoundedYear,
        updated_at = GETDATE()
    WHERE team_id = @TeamID;
END; 


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
