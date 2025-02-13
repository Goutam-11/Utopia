import {  Account, AccountAddress, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useWallet, InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import React, { useEffect, useState } from "react";

// Specify which network to connect to via AptosConfig
  
export const aptos = new Aptos();
// change this to be your module account address
export const moduleAddress = "module_address";


function App() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<string>("");
    const { account, signAndSubmitTransaction } = useWallet();
    const [accountHasList, setAccountHasList] = useState<boolean>(false);
    const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  
    const onWriteTask = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setNewTask(value);
    };
  // Setup the client
  const config = new AptosConfig({ network: Network.DEVNET });

  
  const addNewList = async () => {
    if (!account) return [];
    setTransactionInProgress(true);

    const transaction:InputTransactionData = {
      data:{
        function:`${moduleAddress}::Event::create_event`,
        functionArguments:[, eventDetails.title, eventDetails.description,eventDetails.price],
      }
    }
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(transaction);
      // wait for transaction
      await aptos.waitForTransaction({transactionHash:response.hash});
      setAccountHasList(true);
    } catch (error: any) {
      setAccountHasList(false);
    } finally {
      setTransactionInProgress(false);
    }
  };
}
