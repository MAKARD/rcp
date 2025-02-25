Feature: Determining game result

  Scenario: Two players: paper vs. rock
    Given Two players are in an active game
    When The first player responds with 'paper'
    And The second player responds with 'rock'
    Then The game declares the first player the winner

  Scenario: Two players: scissors vs. paper
    Given Two players are in an active game
    When The first player responds with 'scissors'
    And The second player responds with 'paper'
    Then The game declares the first player the winner

  Scenario: Two players: rock vs. scissors
    Given Two players are in an active game
    When The first player responds with 'rock'
    And The second player responds with 'scissors'
    Then The game declares the first player the winner

  Scenario: Three players: no winners
    Given Three players are in an active game
    When All players respond with different hands
    Then The game declares a draw

  Scenario: N+1 players: multiple winners
    Given At least three players are in an active game
    When At least two players respond with 'scissors'
    And The remaining players respond with 'paper'
    Then The game declares a draw

  Scenario: Identical hands
    Given At least two players are in an active game
    When All players respond with the same hand
    Then The game declares a draw