// Main Script: index.js

// 1. Import necessary libraries
require('dotenv').config(); // Loads secrets from the .env file
const RPC = require('discord-rpc');
const axios = require('axios');

// 2. Load credentials and check if they exist
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const ROBLOX_COOKIE = process.env.ROBLOX_COOKIE;

if (!CLIENT_ID || !ROBLOX_COOKIE) {
    console.error('Error: Please make sure DISCORD_CLIENT_ID and ROBLOX_COOKIE are set in your .env file.');
    process.exit(1); // Exit the script if credentials are not found
}

// 3. Initialize the Discord RPC Client
const rpc = new RPC.Client({ transport: 'ipc' });
let robloxUser; // This will store your Roblox user details after authentication

/**
 * This is the main function that runs after we connect to Discord.
 * It authenticates with Roblox and then starts a loop to update your status.
 */
async function main() {
    // First, let's authenticate with Roblox to make sure the cookie is valid
    try {
        const response = await axios.get('https://users.roblox.com/v1/users/authenticated', {
            headers: {
                'Cookie': `.ROBLOSECURITY=${ROBLOX_COOKIE}`
            }
        });
        robloxUser = response.data;
        console.log(`✅ Successfully authenticated with Roblox as: ${robloxUser.name} (ID: ${robloxUser.id})`);
    } catch (error) {
        console.error('❌ Failed to authenticate with Roblox. Please check your ROBLOX_COOKIE in the .env file.');
        // We stop the script here because nothing else will work
        process.exit(1);
    }

    // For now, let's set a simple, static status
    // In the next step, we will replace this with a dynamic status checker
    rpc.setActivity({
        details: `Chilling on Roblox`,
        state: `as ${robloxUser.name}`,
        startTimestamp: Date.now(),
        largeImageKey: 'roblox_logo', // We will set this up next
        largeImageText: 'Roblox',
        instance: false,
    });
    
    console.log('✅ Discord status has been set. It will not update until we add the game checker.');
}

// Fired when the RPC client is connected and ready
rpc.on('ready', () => {
    console.log(`✅ Discord RPC connected! Logged in as ${rpc.user.username}.`);
    // Start the main logic
    main().catch(err => console.error(err));
});

// Start the connection process
console.log('Connecting to Discord...');
rpc.login({ clientId: CLIENT_ID }).catch(err => {
    console.error('❌ Failed to connect to Discord. Is your Discord client running?');
});
