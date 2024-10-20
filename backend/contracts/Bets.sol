// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// import "./Disable.sol";
// import "./Oracle.sol";

contract Bets {
    
    // Struct to keep track of match details
    struct Match {
        uint teamAVolume; // Volume bet on team A
        uint teamBVolume; // Volume bet on team B
        uint totalPool;    // Total pool (team A + team B volume)
    }

    // Mapping to store the volume of bets on each match
    mapping(bytes32 => Match) public matches;
    uint internal minimumBet = 1000000000000;

    // Mapping to store user shares for each match and team
    mapping(bytes32 => mapping(address => uint)) public userSharesA; // Shares for Team A
    mapping(bytes32 => mapping(address => uint)) public userSharesB; // Shares for Team B   

    // Initial volume for both teams at the start of each match
    uint public constant initialVolume = 100 wei; // Use wei/ether for handling large numbers

    /// @notice Creates a new match with initial pools for both teams
    /// @param matchId The ID of the match
    function createMatch(bytes32 matchId) public {
        require(matches[matchId].totalPool == 0, "Match already exists");

        // Set the initial volume for both teams
        matches[matchId].teamAVolume = initialVolume;
        matches[matchId].teamBVolume = initialVolume;
        matches[matchId].totalPool = initialVolume * 2; // Both teams start with initialVolume
    }

    /// @notice Places a bet on a specified team
    /// @param matchId The ID of the match
    /// @param amount The amount bet on the match
    /// @param team A boolean indicating the team to bet on (true for Team A, false for Team B)
    function placeBet(bytes32 matchId, uint32 amount, bool team) public payable {
        require(msg.value > 0, "Must send a valid bet");

        // Retrieve the match
        Match storage matchDetails = matches[matchId];

        // Check that the match exists
        require(matchDetails.totalPool > 0, "Match not found");

        if (team) {
            // Price for Team A
            uint256 currentPrice = matchDetails.teamAVolume / matchDetails.totalPool;
            // Add bet to Team A's volume
            matchDetails.teamAVolume += amount;
            // Update user shares
            uint shares = amount / currentPrice;
            userSharesA[matchId][msg.sender] += shares;
        } else {
            // Price for Team B
            uint256 currentPrice = matchDetails.teamBVolume / matchDetails.totalPool;
            // Add bet to Team B's volume
            matchDetails.teamBVolume += amount;
            // Update user shares
            uint shares = amount / currentPrice;
            userSharesB[matchId][msg.sender] += shares;
        }

        // Update the total pool
        matchDetails.totalPool += amount;
    }

    /// @notice Calculates the current share price for Team A
    /// @param matchId The ID of the match
    /// @return The share price for Team A
    function getTeamAPrice(bytes32 matchId) public view returns (uint) {
        Match storage matchDetails = matches[matchId];
        return matchDetails.teamAVolume / matchDetails.totalPool; // Price in wei
    }

    /// @notice Calculates the current share price for Team B
    /// @param matchId The ID of the match
    /// @return The share price for Team B
    function getTeamBPrice(bytes32 matchId) public view returns (uint) {
        Match storage matchDetails = matches[matchId];
        return matchDetails.teamBVolume / matchDetails.totalPool; // Price in wei
    }

    /// @notice Returns the percentage of total volume for Team A
    /// @param matchId The ID of the match
    /// @return Percentage of total pool for Team A
    function getTeamAPercentage(bytes32 matchId) public view returns (uint) {
        Match storage matchDetails = matches[matchId];
        return (matchDetails.teamAVolume * 100) / matchDetails.totalPool; // Team A percentage
    }

    /// @notice Returns the percentage of total volume for Team B
    /// @param matchId The ID of the match
    /// @return Percentage of total pool for Team B
    function getTeamBPercentage(bytes32 matchId) public view returns (uint) {
        Match storage matchDetails = matches[matchId];
        return (matchDetails.teamBVolume * 100) / matchDetails.totalPool; // Team B percentage
    }

    /// @notice Retrieves the total pool for a match
    /// @param matchId The ID of the match
    /// @return The total pool for the match
    function getTotalPool(bytes32 matchId) public view returns (uint) {
        return matches[matchId].totalPool;
    }

    /// @notice Retrieves the current volume for Team A
    /// @param matchId The ID of the match
    /// @return The volume for Team A
    function getTeamAVolume(bytes32 matchId) public view returns (uint) {
        return matches[matchId].teamAVolume;
    }

    /// @notice Retrieves the current volume for Team B
    /// @param matchId The ID of the match
    /// @return The volume for Team B
    function getTeamBVolume(bytes32 matchId) public view returns (uint) {
        return matches[matchId].teamBVolume;
    }
}