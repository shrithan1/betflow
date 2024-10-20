"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useReadContract, useWriteContract } from "wagmi";
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

const formSchema = z.object({
  amount: z.string().min(1).max(200),
});

export function BettingCard() {
  const { data } = useReadContract({
    address: "0x6224f3e0c3deDB6Da90A9545A9528cbed5DD7E53",
    abi,
    functionName: "viewVolume",
    args: [],
  });
  console.log(data?.toString());

  const tokenA = data?.[0] ? parseInt(data[0].toString()) : 0;
  const tokenB = data?.[1] ? parseInt(data[1].toString()) : 0;
  const priceA = 100 * (tokenA / (tokenA + tokenB));
  const priceB = 100 * (tokenB / (tokenA + tokenB));
  console.log(tokenA, tokenB, priceA, priceB);

  const { writeContract } = useWriteContract();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    writeContract({
      address: "0x6224f3e0c3deDB6Da90A9545A9528cbed5DD7E53",
      abi: abi,
      functionName: "placeBets",
      args: [BigInt(values.amount)],
    });
  }

  const selectTeam = (team: string) => {
    setSelectedTeam(team);
  };

  return (
    <Card className="w-[300px] bg-[#1c1e22] text-white shadow-lg fixed right-5 top-20">
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
            Patriots {priceA}¢
          </Button>
          <Button
            onClick={() => selectTeam("Jaguars")}
            className={`w-[48%] ${
              selectedTeam === "Jaguars" ? "bg-[#007aff]" : "bg-[#1e293b]"
            }`}
          >
            Jaguars {priceB}¢
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
          <p>Avg Price: {selectedTeam ? `${priceA}¢` : `${priceB}¢`}</p>
          <p>
            Shares:{" "}
            {((Number(form.watch("amount") || 0) * 100) / priceA).toFixed(2)}
          </p>
          <p>
            Potential return: ${""}
            {((Number(form.watch("amount") || 0) * 100) / priceA).toFixed(2)}
            {" ("}
            {(((Number(form.watch("amount")) / priceA) * 100 -
              Number(form.watch("amount"))) /
              Number(form.watch("amount"))) *
              100}
            {"%) "}
          </p>
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
