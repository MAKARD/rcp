Feature: Players hands

  Scenario: Asking players for their hands
    Given At least two players are in an active game
    When The next round starts
    Then All joined players are asked for their hand

  Scenario: Invalid response
    Given At least two players are in an active game
    When A player responds with a hand other than 'paper', 'rock', or 'scissors'
    Then The player still has the ability to respond with a hand

  Scenario: Valid response
    Given At least two players are in an active game
    When A player responds with 'paper', 'rock', or 'scissors'
    Then The game accepts their response

  Scenario: No response
    Given At least two players are in an active game
    When A player does not respond within 10 seconds
    Then The player is removed from the game

  Scenario: All set
    Given At least two players are in an active game
    When All players respond with 'paper', 'rock', or 'scissors'
    Then The game declares the results
