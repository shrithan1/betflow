import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import type { NextPage } from "next";

// Object mapping team names to their logo URLs
const teamLogos: Record<string, string> = {
  Patriots: "https://example.com/patriots-logo.png", // Replace with actual logo URL
  Jaguars: "https://example.com/jaguars-logo.png", // Replace with actual logo URL
  Texans: "https://example.com/texans-logo.png", // Replace with actual logo URL
  Packers: "https://example.com/packers-logo.png", // Replace with actual logo URL
  Bengals: "https://example.com/bengals-logo.png", // Replace with actual logo URL
  Browns: "https://example.com/browns-logo.png", // Replace with actual logo URL
  Dolphins: "https://example.com/dolphins-logo.png", // Replace with actual logo URL
  Colts: "https://example.com/colts-logo.png", // Replace with actual logo URL
};

const nflGames = [
  {
    time: "6:30 AM",
    volume: "$0",
    teams: [
      { name: "Patriots", record: "1-5", price: 50 },
      { name: "Jaguars", record: "1-5", price: 50 },
    ],
  },
  {
    time: "10:00 AM",
    volume: "$0",
    teams: [
      { name: "Texans", record: "5-1", price: 50 },
      { name: "Packers", record: "4-2", price: 50 },
    ],
  },
  {
    time: "10:00 AM",
    volume: "$0",
    teams: [
      { name: "Bengals", record: "2-4", price: 50 },
      { name: "Browns", record: "1-5", price: 50 },
    ],
  },
  {
    time: "10:00 AM",
    volume: "$0",
    teams: [
      { name: "Dolphins", record: "2-3", price: 50 },
      { name: "Colts", record: "3-3", price: 50 },
    ],
  },
];
const bet_abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "Disable",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "Enable",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getBettableMatches",
    outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "_matchId", type: "bytes32" }],
    name: "getMatch",
    outputs: [
      { internalType: "bytes32", name: "id", type: "bytes32" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "participants", type: "string" },
      { internalType: "uint8", name: "participantCount", type: "uint8" },
      { internalType: "uint256", name: "date", type: "uint256" },
      {
        internalType: "enum Oracle.MatchOutcome",
        name: "outcome",
        type: "uint8",
      },
      { internalType: "int8", name: "winner", type: "int8" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMatches",
    outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMostRecentMatch",
    outputs: [
      { internalType: "bytes32", name: "id", type: "bytes32" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "participants", type: "string" },
      { internalType: "uint256", name: "participantCount", type: "uint256" },
      { internalType: "uint256", name: "date", type: "uint256" },
      {
        internalType: "enum Oracle.MatchOutcome",
        name: "outcome",
        type: "uint8",
      },
      { internalType: "int8", name: "winner", type: "int8" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getOracleAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "_matchId", type: "bytes32" }],
    name: "getUserBet",
    outputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint8", name: "winner", type: "uint8" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getUserBets",
    outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "_matchId", type: "bytes32" },
      { internalType: "uint8", name: "_chosenWinner", type: "uint8" },
    ],
    name: "placeBet",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_oracleAddress", type: "address" },
    ],
    name: "setOracleAddress",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "testOracleConnection",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const Home: NextPage = () => {
  const [selectedGame, setSelectedGame] = useState<{
    game: string;
    team: string;
  } | null>(null);

  const selectTeam = (game: string, team: string) => {
    setSelectedGame({ game, team });
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: "60px",
        position: "relative",
      }}
    >
      {/* Connect Wallet Button */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
        }}
      >
        <ConnectButton />
      </div>

      {/* Left Column: NFL Games */}
      <div
        style={{
          backgroundColor: "#1c1e22",
          borderRadius: "10px",
          padding: "20px",
          width: "60%",
          marginLeft: "20px",
          color: "white",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>NFL Games - Week 7</h2>

        {nflGames.map((game, index) => (
          <div
            key={index}
            style={{
              marginBottom: "20px",
              borderBottom: "1px solid #374151",
              paddingBottom: "10px",
            }}
          >
            {/* Game Time and Volume */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                color: "#9ca3af",
              }}
            >
              <span>{game.time}</span>
              <span>{game.volume} Vol.</span>
            </div>

            {/* Teams and Prices */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {game.teams.map((team, teamIndex) => (
                <button
                  key={teamIndex}
                  onClick={() => selectTeam(game.time, team.name)}
                  style={{
                    backgroundColor:
                      selectedGame?.game === game.time &&
                      selectedGame?.team === team.name
                        ? "#007aff"
                        : "#1e293b",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "none",
                    width: "48%",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center", // Align logo and text
                    justifyContent: "space-between",
                  }}
                >
                  {/* Logo Image */}
                  <img
                    src={teamLogos[team.name]} // Logo URL from the teamLogos object
                    alt={`${team.name} logo`}
                    style={{
                      width: "24px", // Set the size of the logo
                      height: "24px",
                      marginRight: "10px", // Space between logo and text
                    }}
                  />
                  <span>
                    {team.name} ({team.record})
                  </span>
                  <span>{team.price}¢</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Right Column: Betting Card */}
      <div
        style={{
          backgroundColor: "#1c1e22",
          borderRadius: "10px",
          padding: "20px",
          width: "350px",
          color: "white",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          position: "fixed", // Fixed on the right side
          right: "20px",
          top: "80px",
        }}
      >
        <h3 style={{ marginBottom: "20px" }}>Outcome</h3>

        {/* Outcomes */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() => selectTeam("Patriots", 31)}
            style={{
              backgroundColor:
                selectedGame?.team === "Patriots" ? "#007aff" : "#1e293b",
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              border: "none",
              width: "48%",
              cursor: "pointer",
            }}
          >
            Patriots 50¢
          </button>
          <button
            onClick={() => selectTeam("Jaguars", 71)}
            style={{
              backgroundColor:
                selectedGame?.team === "Jaguars" ? "#007aff" : "#1e293b",
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              border: "none",
              width: "48%",
              cursor: "pointer",
            }}
          >
            Jaguars 50¢
          </button>
        </div>

        {/* Amount Input */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Amount
          </label>
          <input
            type="number"
            value={0}
            onChange={() => {}} // Add logic here to handle amount change
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #374151",
              backgroundColor: "#2d2f34",
              color: "white",
            }}
          />
        </div>

        {/* Avg Price, Shares, Potential Return */}
        <div style={{ marginBottom: "20px" }}>
          <p>
            Avg Price:{" "}
            {selectedGame?.team === "Patriots"
              ? "0¢"
              : selectedGame?.team === "Jaguars"
              ? "0¢"
              : "0¢"}
          </p>
          <p>Shares: 0.00</p>
          <p>Potential return: $0.00</p>
        </div>

        {/* Submit Button */}
        <button
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#10b981",
            color: "white",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Place Bet
        </button>
      </div>
    </div>
  );
};

export default Home;
