# 🏆 Utopia - Ai and Blockchain Event Ticketing Platform

Utopia is a decentralized event management and ticketing platform that harnesses the power of blockch
ain and AI to offer a seamless experience for event organizers and attendees. 
[Video Link](https://youtu.be/U33PISp47U0)

## 📦 VENICE AI ENDPOINT
- [Venice AI](https://venice.ai/api/docs/introduction)
- We use the "fluently-xl" model to generate the event images for the posters to use in the cards.
- We used the uncensored Ai endpoint to generate the images.

  ## 📦 HYPERBOLIC AI Based on Eigenlayer Endpoint
- We use the Hyperbolic AI.
- Our backend bot is being powered by Hyperbolic which using langchain open ai function to call Hyperbolic Model AVS based on Eigenlayer and generated out text data at the backend server file or Utopia.

## 🚀 Features
- **NFT Ticketing:** Events and tickets are minted as **NFTs** on the **Base network**, preventing ticket duplication.
- **AI Event Recommendations:** Custom AI models analyze event data and suggest events based on user preferences.
- **IPFS/Arweave Storage:** Ensures **decentralized and permanent** storage of event details and ticket metadata.
- **Secure Ticket Resale:** Secondary market transactions occur within Utopia, preventing fraud.
- **Wallet Integration:** Connect **MetaMask, Coinbase Wallet**, and other Web3 wallets.
- **Low Gas Fees:** Leveraging Base Layer-2 for cost-effective transactions.

## 🎟️ How It Works
1. **Event Creation:** Organizers create an event, which is minted as an NFT.Venice ai api is used to create the event image and model is "fluently-xl".
2. **Ticket Sales:** Attendees purchase NFT-based tickets using cryptocurrency.
3. **Verification:** Tickets are verified via **on-chain smart contracts**.
4. **Resale & Transfer:** Users can resell tickets within the platform, ensuring legitimacy.

## 📦 Tech Stack
- **Blockchain:** Aptos
- **Smart Contracts:** Move
- **Frontend:** React, Vite, TailwindCSS
- **Storage:** IPFS
- **AI Models:** Langchain, Hyperbolic on eigenlayer
- **Wallets:** MetaMask, Petra Wallet
- **VENICE AI API:** For the uncensored Ai endpoint to generate event images for the posters to use in the cards.

- [Aptos Contracts](https://explorer.aptoslabs.com/account/0x903a8c9e37c744674108ea208c81e60ff09d78c612ffa9df78396e99634f8204/modules/run/AptosEvent5/create_event?network=testnet)
![Screenshot 2025-02-10 024011](https://github.com/user-attachments/assets/487a6a3b-1e9f-42af-b520-dade043b3f3c)


## 🛠️ Setup & Deployment
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/utopia.git
   cd utopia
