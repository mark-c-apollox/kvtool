require("@nomiclabs/hardhat-waffle");

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "local",
  networks: {
    local: {
      url: "http://10.100.42.143:8545/",
      accounts: ["92c7ecba91de7c08393420d17a8e99cefc649a4b6c42bd355d241e07586c5bc5"]
    }
  },
};

task("totalSupply", "Total supply of ERC-20 token")
  .addParam("token", "Token address")
  .setAction(async function ({ token }) {
    const tokenFactory = await ethers.getContractFactory("Token")
    const tokenInstance = tokenFactory.attach(token)
    const [minter] = await ethers.getSigners();
    const totalSupply = Number(await (await tokenInstance.connect(minter)).totalSupply());
    console.log(`Total Supply is ${totalSupply}`);
});

task("balanceOf", "Account balance of ERC-20 token")
  .addParam("token", "Token address")
  .addParam("account", "Account address")
  .setAction(async function ({ token, account }) {
    const tokenFactory = await ethers.getContractFactory("Token")
    const tokenInstance = tokenFactory.attach(token)
    const [minter] = await ethers.getSigners();
    const balance = Number(await (await tokenInstance.connect(minter)).balanceOf(account))
    const symbol = await tokenInstance.symbol()
    console.log(`${account} token balance: ${balance} ${symbol}`);
});

task("transfer", "ERC-20 transfer")
  .addParam("token", "Token address")
  .addParam("recipient", "Recipient address")
  .addParam("amount", "Token amount")
  .setAction(async function ({ token, recipient, amount }) {
    const tokenFactory = await ethers.getContractFactory("Token")
    const tokenInstance = tokenFactory.attach(token)
    const [minter] = await ethers.getSigners();
    await (await tokenInstance.connect(minter).transfer(recipient, amount)).wait()
    const symbol = await tokenInstance.symbol()
    console.log(`${minter.address} has transferred ${amount} ${symbol} to ${recipient}`);
});

task("approve", "ERC-20 approve")
  .addParam("token", "Token address")
  .addParam("spender", "Spender address")
  .addParam("amount", "Token amount")
  .setAction(async function ({ token, spender, amount }) {
    const tokenFactory = await ethers.getContractFactory("Token")
    const tokenInstance = tokenFactory.attach(token)
    const [sender] = await ethers.getSigners();
    await (await tokenInstance.connect(sender).approve(spender, amount)).wait()
    console.log(`${sender.address} has approved ${amount} ${symbol} tokens to ${spender}`);
});

task("transferFrom", "ERC-20 transferFrom")
  .addParam("token", "Token address")
  .addParam("sender", "Sender address")
  .addParam("amount", "Token amount")
  .setAction(async function ({ token, sender, amount }) {
    const tokenFactory = await ethers.getContractFactory("Token")
    const tokenInstance = tokenFactory.attach(token)
    const [recipient] = await ethers.getSigners()
    console.log(recipient.address);
    await (await tokenInstance.connect(recipient).transferFrom(sender, recipient.address, amount)).wait()
    console.log(`${recipient.address} has received ${amount} ${symbol} tokens from ${sender}`)
});
