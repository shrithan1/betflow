import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import { useState } from "react";
import { BettingCard } from "../components/BettingCard";
import { useReadContract } from "wagmi";
import Image, { StaticImageData } from "next/image";

import colts from "@/src/public/assets/colts.png";
import bengals from "@/src/public/assets/bengals.png";
import browns from "@/src/public/assets/browns.png";
import dolphins from "@/src/public/assets/dolphins.png";
import packers from "@/src/public/assets/packers.png";
import jaguars from "@/src/public/assets/jaguars.png";
import patriots from "@/src/public/assets/patriots.png";
import texans from "@/src/public/assets/texans.png";

// Object mapping team names to their logo URLs
const teamLogos: Record<string, StaticImageData> = {
  Patriots: patriots, // Replace with actual logo URL
  Jaguars: jaguars, // Replace with actual logo URL
  Texans: texans, // Replace with actual logo URL
  Packers: packers, // Replace with actual logo URL
  Bengals: bengals, // Replace with actual logo URL
  Browns: browns, // Replace with actual logo URL
  Dolphins: dolphins, // Replace with actual logo URL
  Colts: colts, // Replace with actual logo URL
};

const Home: NextPage = () => {
  const abi = [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "getA",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getB",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "viewVolume",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "placeBets",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "placeBetsJag",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ] as const;

  const { data } = useReadContract({
    address: "0x6224f3e0c3deDB6Da90A9545A9528cbed5DD7E53",
    abi,
    functionName: "viewVolume",
    args: [],
  });
  console.log(data?.toString());
  const tokenA = data?.[0] ? parseInt(data[0].toString()) : 0;
  const tokenB = data?.[1] ? parseInt(data[1].toString()) : 0;
  const total = tokenA + tokenB;
  const priceA = 100 * (tokenA / (tokenA + tokenB));
  const priceB = 100 * (tokenB / (tokenA + tokenB));
  console.log(tokenA, tokenB, priceA, priceB);

  const nflGames = [
    {
      time: "6:30 AM",
      volume: `$${total}`,
      teams: [
        { name: "Patriots", record: "1-5", price: priceA },
        { name: "Jaguars", record: "1-5", price: priceB },
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
  const [selectedGame, setSelectedGame] = useState<{
    game: string;
    team: string;
  } | null>(null);
  const [comment, setComment] = useState("");
  const [commentsList, setCommentsList] = useState<string[]>([]);

  const selectTeam = (game: string, team: string) => {
    setSelectedGame({ game, team });
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (comment.trim()) {
      setCommentsList([...commentsList, comment]);
      setComment(""); // Clear the input after submission
    }
  };
  return (
    <>
      <div
        style={{
          backgroundColor: "white",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column", // Stack items vertically
          alignItems: "flex-start", // Align items to the left
          padding: "20px", // Add padding around the container
        }}
      >
        {/* Connect Wallet Button at the Top Right */}
        <div
          style={{
            alignSelf: "flex-end", // Align to the right
            marginBottom: "20px", // Add margin below the button
          }}
        >
          <ConnectButton />
        </div>

        {/* Wallet Card
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            width: "300px", // Set a fixed width for the card
            marginBottom: "20px", // Add margin below the card
          }}
        >
        </div> */}

        {/* Left Column: NFL Games */}
        <div
          style={{
            backgroundColor: "#1c1e22",
            borderRadius: "10px",
            padding: "20px",
            width: "45%", // Adjusted width
            margin: "0 auto", // Center the panel
            color: "white",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
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
                    <Image
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
        <BettingCard />
        {/* Comment Section */}
        <div
          style={{
            display: "flex", // Use flexbox for layout
            justifyContent: "space-between", // Space between the panels
            alignItems: "flex-start", // Align items to the top
            padding: "20px", // Add padding around the container
          }}
        >
          {/* Leave a Comment Panel */}
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              width: "70%", // Adjust width as needed
              height: "400px", // Set a fixed height to match the NFL panel
              marginRight: "80px", // Add margin to the right for spacing
              marginTop: "-539px", // Remove any top margin
              marginLeft: "-10px",
            }}
          >
            <h3>Leave a Comment</h3>
            <form onSubmit={handleCommentSubmit}>
              <textarea
                value={comment}
                onChange={handleCommentChange}
                placeholder="Write your comment here..."
                style={{
                  width: "100%",
                  height: "150px", // Increased height for the textarea
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px",
                  resize: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Submit
              </button>
            </form>
            {/* Display Comments */}
            <div style={{ marginTop: "20px", textAlign: "left" }}>
              {commentsList.length > 0 ? (
                commentsList.map((c, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "10px",
                      borderBottom: "1px solid #ccc",
                      paddingBottom: "5px",
                    }}
                  >
                    {c}
                  </div>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
