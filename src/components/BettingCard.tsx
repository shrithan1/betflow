"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWriteContract } from "wagmi";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const abi = [
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

const formSchema = z.object({
  amount: z.string().min(1).max(200),
});

export function BettingCard() {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const form = useForm({
    defaultValues: {
      amount: "",
    },
  });

  const onSubmit = async (data: { amount: string }) => {
    // Your bet placing logic here
    console.log("Placing bet:", { team: selectedTeam, amount: data.amount });
  };

  const selectTeam = (team: string) => {
    setSelectedTeam(team);
  };

  return (
    <Card className="w-[350px] bg-[#1c1e22] text-white shadow-lg fixed right-5 top-20">
      <CardHeader>
        <CardTitle className="mb-5">Outcome</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between mb-5">
          <Button
            onClick={() => selectTeam("Patriots")}
            className={`w-[48%] ${
              selectedTeam === "Patriots" ? "bg-[#007aff]" : "bg-[#1e293b]"
            }`}
          >
            Patriots 50¢
          </Button>
          <Button
            onClick={() => selectTeam("Jaguars")}
            className={`w-[48%] ${
              selectedTeam === "Jaguars" ? "bg-[#007aff]" : "bg-[#1e293b]"
            }`}
          >
            Jaguars 50¢
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter amount"
                      {...field}
                      className="bg-[#2d2f34] border-[#374151] text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="space-y-2">
          <p>Avg Price: {selectedTeam ? "50¢" : "0¢"}</p>
          <p>Shares: 0.00</p>
          <p>Potential return: $0.00</p>
        </div>

        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          className="w-full bg-[#10b981] hover:bg-[#0d9668]"
        >
          Place Bet
        </Button>
      </CardContent>
    </Card>
  );
}
