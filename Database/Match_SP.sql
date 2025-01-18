-- Stored Procedures for Match Table

-- Procedure to Add a Match
CREATE PROCEDURE PR_AddMatch
    @LeagueID INT,
    @Team1ID INT,
    @Team2ID INT,
    @MatchDate DATE,
    @Venue NVARCHAR(100),
    @Status NVARCHAR(20) = 'Scheduled'
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM League WHERE league_id = @LeagueID)
    BEGIN
        RAISERROR ('League with ID %d does not exist.', 16, 1, @LeagueID);
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM Team WHERE team_id = @Team1ID)
    BEGIN
        RAISERROR ('Team1 with ID %d does not exist.', 16, 1, @Team1ID);
        RETURN;
    END
    IF NOT EXISTS (SELECT 1 FROM Team WHERE team_id = @Team2ID)
    BEGIN
        RAISERROR ('Team2 with ID %d does not exist.', 16, 1, @Team2ID);
        RETURN;
    END

    IF @Team1ID = @Team2ID
    BEGIN
        RAISERROR ('Team1 and Team2 cannot be the same.', 16, 1);
        RETURN;
    END

    IF @MatchDate < GETDATE()
    BEGIN
        RAISERROR ('Match date cannot be in the past.', 16, 1);
        RETURN;
    END

    IF @Status NOT IN ('Scheduled', 'Ongoing', 'Completed')
    BEGIN
        RAISERROR ('Invalid match status.', 16, 1);
        RETURN;
    END

    INSERT INTO Match (league_id, team1_id, team2_id, match_date, venue, status, created_at, updated_at)
    VALUES (@LeagueID, @Team1ID, @Team2ID, @MatchDate, @Venue, @Status, GETDATE(), GETDATE());
END;


-- Procedure to Get All the Matches
CREATE PROCEDURE PR_GetAllMatches
AS
BEGIN
    SELECT 
        m.match_id,
        m.league_id,
        l.leaguename AS league_name,
        m.team1_id,
        t1.teamname AS team1_name,
        m.team2_id,
        t2.teamname AS team2_name,
        m.match_date,
        m.venue,
        m.team1_score,
        m.team2_score,
        m.status,
        m.created_at,
        m.updated_at
    FROM [Match] m
    JOIN League l ON m.league_id = l.league_id
    JOIN Team t1 ON m.team1_id = t1.team_id
    JOIN Team t2 ON m.team2_id = t2.team_id
    ORDER BY m.match_date ASC, m.status DESC; 
END;


-- Procedure to Update Match Details
/* ALTER PROCEDURE PR_UpdateMatch
    @MatchID INT,
    @Team1Score INT,
    @Team2Score INT,
    @Venue NVARCHAR(100),
    @Status NVARCHAR(20)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Match WHERE match_id = @MatchID)
    BEGIN
        RAISERROR ('Match with ID %d not found.', 16, 1, @MatchID);
        RETURN;
    END

    IF @Status NOT IN ('Scheduled', 'Ongoing', 'Completed')
    BEGIN
        RAISERROR ('Invalid match status.', 16, 1);
        RETURN;
    END

    UPDATE Match
    SET team1_score = @Team1Score,
        team2_score = @Team2Score,
        venue = @Venue,
        status = @Status,
        updated_at = GETDATE()
    WHERE match_id = @MatchID;
END; */


-- Procedure to Delete a Match
/* CREATE PROCEDURE PR_DeleteMatch
    @MatchID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Match WHERE match_id = @MatchID)
    BEGIN
        RAISERROR ('Match not found.', 16, 1);
        RETURN;
    END

    DELETE FROM Match
    WHERE match_id = @MatchID;
END; */


-- Procedure to Retrieve Matches by League
CREATE PROCEDURE PR_GetMatchesByLeague
    @LeagueID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM League WHERE league_id = @LeagueID)
    BEGIN
        RAISERROR ('League with ID %d does not exist.', 16, 1, @LeagueID);
        RETURN;
    END

    SELECT match_id, league_id, team1_id, team2_id, match_date, venue, team1_score, team2_score, status, created_at, updated_at
    FROM Match
    WHERE league_id = @LeagueID;
END;


-- Procedure to Retrieve Match by ID
CREATE PROCEDURE PR_GetMatchByID
    @MatchID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Match WHERE match_id = @MatchID)
    BEGIN
        RAISERROR ('Match not found.', 16, 1);
        RETURN;
    END

    SELECT match_id, league_id, team1_id, team2_id, match_date, venue, team1_score, team2_score, status, created_at, updated_at
    FROM Match
    WHERE match_id = @MatchID;
END;


-- Procedure to Search Matches by Teams or Venue
CREATE PROCEDURE PR_SearchMatches
    @SearchTerm NVARCHAR(100)
AS
BEGIN
    SELECT 
        m.match_id,
        m.league_id,
        l.leaguename AS league_name,
        m.team1_id,
        t1.teamname AS team1_name,
        m.team2_id,
        t2.teamname AS team2_name,
        m.match_date,
        m.venue,
        m.team1_score,
        m.team2_score,
        m.status,
        m.created_at,
        m.updated_at
    FROM [Match] m
    JOIN Team t1 ON m.team1_id = t1.team_id
    JOIN Team t2 ON m.team2_id = t2.team_id
    JOIN League l ON m.league_id = l.league_id
    WHERE t1.teamname LIKE '%' + @SearchTerm + '%'
       OR t2.teamname LIKE '%' + @SearchTerm + '%'
       OR m.venue LIKE '%' + @SearchTerm + '%';
END;




-- Testing
-- Valid Input
EXEC PR_AddMatch @LeagueID = 2, @Team1ID = 3, @Team2ID = 4, @MatchDate = '2024-12-30', @Venue = 'Stadium A', @Status = 'Scheduled';
-- Invalid: Same Team IDs
EXEC PR_AddMatch @LeagueID = 2, @Team1ID = 3, @Team2ID = 3, @MatchDate = '2024-12-30', @Venue = 'Stadium A', @Status = 'Scheduled';
-- Invalid: Non-existent League
EXEC PR_AddMatch @LeagueID = 999, @Team1ID = 2, @Team2ID = 3, @MatchDate = '2024-12-30', @Venue = 'Stadium A', @Status = 'Scheduled';
-- Invalid: Past Match Date
EXEC PR_AddMatch @LeagueID = 2, @Team1ID = 3, @Team2ID = 4, @MatchDate = '2023-12-25', @Venue = 'Stadium A', @Status = 'Scheduled';
-- Invalid: Incorrect Status
EXEC PR_AddMatch @LeagueID = 2, @Team1ID = 3, @Team2ID = 4, @MatchDate = '2024-12-30', @Venue = 'Stadium A', @Status = 'InvalidStatus';


EXEC PR_GetAllMatches

-- Valid Input
EXEC PR_UpdateMatch @MatchID = 3, @Team1Score = 3, @Team2Score = 4, @Venue = 'Stadium B', @Status = 'Ongoing';
-- Invalid: Non-existent Match
EXEC PR_UpdateMatch @MatchID = 999, @Team1Score = 2, @Team2Score = 3, @Venue = 'Stadium B', @Status = 'Ongoing';
-- Invalid: Incorrect Status
EXEC PR_UpdateMatch @MatchID = 3, @Team1Score = 3, @Team2Score = 4, @Venue = 'Stadium B', @Status = 'InvalidStatus';


-- Valid Input
EXEC PR_DeleteMatch @MatchID = 1;
-- Invalid: Non-existent Match
EXEC PR_DeleteMatch @MatchID = 999;


-- Valid Input
EXEC PR_GetMatchesByLeague @LeagueID = 2;
-- Non-existent League
EXEC PR_GetMatchesByLeague @LeagueID = 999;


-- Valid Input
EXEC PR_GetMatchByID @MatchID = 3;
-- Invalid Match ID
EXEC PR_GetMatchByID @MatchID = 999;


-- Search by Partial Team Name
EXEC PR_SearchMatches @SearchTerm = 'Team';
-- Search by Partial Venue Name
EXEC PR_SearchMatches @SearchTerm = 'Stadium';
-- No Results
EXEC PR_SearchMatches @SearchTerm = 'NonExistentTerm';