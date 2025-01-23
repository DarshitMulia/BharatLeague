-- Create Database
CREATE DATABASE Bharat_League;

-- Table: Users
CREATE TABLE Users (
    user_id INT PRIMARY KEY IDENTITY(1,1),
    username NVARCHAR(50) NOT NULL UNIQUE,
    email NVARCHAR(100) NOT NULL UNIQUE,
    password NVARCHAR(200) NOT NULL,
    role NVARCHAR(20) CHECK (role IN ('Admin', 'User')), 
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Table: League
CREATE TABLE League (
    league_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL FOREIGN KEY REFERENCES Users(user_id),
    leaguename NVARCHAR(100) NOT NULL UNIQUE,
    image_url NVARCHAR(MAX), 
    country NVARCHAR(50),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL, 
    status AS (
        CASE 
            WHEN start_date > GETDATE() THEN 'Scheduled' 
            WHEN GETDATE() BETWEEN start_date AND end_date THEN 'Ongoing' 
            ELSE 'Completed' 
        END
    ),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);


-- Table: Team
CREATE TABLE Team (
    team_id INT PRIMARY KEY IDENTITY(1,1),
    league_id INT NOT NULL FOREIGN KEY REFERENCES League(league_id),
    teamname NVARCHAR(100) NOT NULL,
	image_url NVARCHAR(MAX), 
    city NVARCHAR(50),
    coach_name NVARCHAR(50),
    founded_year INT CHECK (founded_year > 1800 AND founded_year <= YEAR(GETDATE())),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    UNIQUE (league_id, teamname)
);


-- Table: Player
CREATE TABLE Player (
    player_id INT PRIMARY KEY IDENTITY(1,1),
    team_id INT NOT NULL FOREIGN KEY REFERENCES Team(team_id),
    playername NVARCHAR(100) NOT NULL,
	image_url NVARCHAR(MAX),
    age INT CHECK (age > 0 AND age <= 100),
    jersey_number INT CHECK (jersey_number BETWEEN 1 AND 99),
    position NVARCHAR(50) CHECK (position IN ('Forward', 'Midfielder', 'Defender', 'Goalkeeper')),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);


-- Table: Match
CREATE TABLE Match (
    match_id INT PRIMARY KEY IDENTITY(1,1),
    league_id INT NOT NULL FOREIGN KEY REFERENCES League(league_id),
    team1_id INT NOT NULL FOREIGN KEY REFERENCES Team(team_id),
    team2_id INT NOT NULL FOREIGN KEY REFERENCES Team(team_id),
    match_date DATE NOT NULL,
    start_time DATETIME NOT NULL, 
    venue NVARCHAR(100) NOT NULL,
    status AS (
        CASE 
            WHEN start_time > GETDATE() THEN 'Scheduled' 
            WHEN GETDATE() BETWEEN start_time AND DATEADD(HOUR, 2, start_time) THEN 'Ongoing' 
            ELSE 'Completed' 
        END
    ),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    CHECK (team1_id <> team2_id)
);


-- Table: MatchEventLogs
CREATE TABLE MatchEventLogs (
    event_id INT PRIMARY KEY IDENTITY(1,1),
    match_id INT NOT NULL FOREIGN KEY REFERENCES Match(match_id),
    team1_id INT NOT NULL FOREIGN KEY REFERENCES Team(team_id),
	team2_id INT NOT NULL FOREIGN KEY REFERENCES Team(team_id),
    player_id INT NOT NULL FOREIGN KEY REFERENCES Player(player_id),
    event_type NVARCHAR(50) CHECK (event_type IN ('Goal', 'Assist', 'Yellow Card', 'Red Card', 'Foul')),
    event_time INT, 
	team1_score INT DEFAULT 0,
    team2_score INT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);


-- Table: PlayerActions
CREATE TABLE PlayerActions (
    match_id INT NOT NULL FOREIGN KEY REFERENCES Match(match_id),
    team_id INT NOT NULL FOREIGN KEY REFERENCES Team(team_id),
    player_id INT NOT NULL FOREIGN KEY REFERENCES Player(player_id),
    goals INT DEFAULT 0,
    assists INT DEFAULT 0,
    fouls INT DEFAULT 0,
    yellow_cards INT DEFAULT 0,
    red_cards INT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (match_id, team_id, player_id)  
);


-- Table: PlayerStatistics
CREATE TABLE PlayerStatistics (
    player_id INT PRIMARY KEY FOREIGN KEY REFERENCES Player(player_id),
    matches_played INT DEFAULT 0,
    goals INT DEFAULT 0,
    assists INT DEFAULT 0,
    yellow_cards INT DEFAULT 0,
    red_cards INT DEFAULT 0,
    fouls INT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);


-- Table: League Standings
CREATE TABLE LeagueStandings (
    standing_id INT PRIMARY KEY IDENTITY(1,1),
    league_id INT NOT NULL FOREIGN KEY REFERENCES League(league_id),
    team_id INT NOT NULL FOREIGN KEY REFERENCES Team(team_id),
    matches_played INT DEFAULT 0,
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    draws INT DEFAULT 0,
    points INT DEFAULT 0,
    goals_scored INT DEFAULT 0,
    goals_conceded INT DEFAULT 0,
    goals_difference AS (goals_scored - goals_conceded),
    UNIQUE (league_id, team_id)
);





select * from Users

select * from League

select * from Team

select * from Player

select * from Match

select * from MatchEventLogs

select * from PlayerActions

select * from PlayerStatistics

select * from LeagueStandings