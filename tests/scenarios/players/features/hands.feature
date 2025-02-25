Feature: Players hands

  Scenario: Asking players for their hands
    Given At least two players are in an active game
    When The next round starts
    Then All joined players are asked for their hand

  Scenario: Invalid response
    Given At least two players are in an active game
    And All players have been asked for their hand
    When A player responds with a hand other than 'paper', 'rock', or 'scissors'
    Then The game keeps waiting for a valid response

  Scenario: Valid response
    Given At least two players are in an active game
    And All players have been asked for their hand
    When A player responds with 'paper', 'rock', or 'scissors'
    Then The game accepts their response

  Scenario: No response
    Given At least two players are in an active game
    And All players have been asked for their hand
    When A player does not respond within 10 seconds
    Then The player is removed from the game

  Scenario: All set
    Given At least two players are in an active game
    When All players respond with 'paper', 'rock', or 'scissors'
    Then The game declares the results
