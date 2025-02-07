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
    UPDATE League
    SET leaguename = @LeagueName,
        country = @Country,
		image_url = @ImageUrl,
        start_date = @StartDate,
        end_date = @EndDate,
        updated_at = GETDATE()
    WHERE league_id = @LeagueID;
END; 


-- Procedure to get the League By User
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


-- Procedure to Search the Leagues by LeagueName
CREATE PROCEDURE PR_SearchLeagues
    @SearchTerm NVARCHAR(100)
AS
BEGIN
    SELECT * FROM League
    WHERE leaguename LIKE '%' + @SearchTerm + '%'
END;
