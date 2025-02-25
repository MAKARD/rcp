Feature: Declaring game results

  Scenario: Single winner
    Given At least two players are in an active game
    And All players have responded with 'paper', 'rock', or 'scissors'
    When The game declares a winner
    Then The game determines the next game starting quorum

  Scenario: Multiple winners
    Given At least two players are in an active game
    And All players have responded with 'paper', 'rock', or 'scissors'
    When The game declares a draw
    Then The game starts the next round with all winners

  Scenario: No winners
    Given At least two players are in an active game
    And All players have responded with 'paper', 'rock', or 'scissors'
    When The game declares a draw
    Then The game starts the next round with all players who initially played the round

