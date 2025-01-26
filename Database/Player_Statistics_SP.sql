-- This procedure inserts and updates the statistics for a player (e.g., goals, assists, yellow cards, etc.) based on actions taken in a match.
CREATE PROCEDURE SP_InsertAndUpdatePlayerStatistics
    @match_id INT,
    @team_id INT,
    @player_id INT,
    @goals INT = 0,
    @assists INT = 0,
    @fouls INT = 0,
    @yellow_cards INT = 0,
    @red_cards INT = 0
AS
BEGIN
    SET NOCOUNT ON;

    -- Update the PlayerStatistics table with the latest actions
    IF EXISTS (SELECT 1 FROM PlayerStatistics WHERE player_id = @player_id)
    BEGIN
        -- Update existing player statistics
        UPDATE PlayerStatistics
        SET matches_played = matches_played + 1,
            goals = goals + @goals,
            assists = assists + @assists,
            fouls = fouls + @fouls,
            yellow_cards = yellow_cards + @yellow_cards,
            red_cards = red_cards + @red_cards,
            updated_at = GETDATE()
        WHERE player_id = @player_id;
    END
    ELSE
    BEGIN
        -- Insert new player statistics if it doesn't exist
        INSERT INTO PlayerStatistics (player_id, matches_played, goals, assists, fouls, yellow_cards, red_cards, created_at, updated_at)
        VALUES (@player_id, 1, @goals, @assists, @fouls, @yellow_cards, @red_cards, GETDATE(), GETDATE());
    END
END;


-- This procedure retrieves the statistics of a player, such as goals, assists, fouls, etc.
CREATE PROCEDURE PR_GetPlayerStatisticsByPlayer
    @player_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT player_id, matches_played, goals, assists, fouls, yellow_cards, red_cards, created_at, updated_at
    FROM PlayerStatistics
    WHERE player_id = @player_id;
END;


-- This procedure allows you to reset the statistics for a player (e.g., for a new season or tournament).
/* CREATE PROCEDURE SP_ResetPlayerStatistics
    @player_id INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE PlayerStatistics
    SET matches_played = 0,
        goals = 0,
        assists = 0,
        fouls = 0,
        yellow_cards = 0,
        red_cards = 0,
        updated_at = GETDATE()
    WHERE player_id = @player_id;
END; */