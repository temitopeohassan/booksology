import { 
    ConnectWallet, 
    Wallet, 
    WalletDropdown, 
    WalletDropdownLink, 
    WalletDropdownDisconnect, 
  } from '@coinbase/onchainkit/wallet'; 
  import {
    Address,
    Avatar,
    Name,
    Identity,
    EthBalance,
  } from '@coinbase/onchainkit/identity';

  export default function Header() {

    return (
      <>
        <div>
          <div className="navbar bg-base-100 flex justify-between">
          <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Booksology</h1>
      </header>
            <div style={{ padding: '10px' }}>
            <Wallet>
  <ConnectWallet className='bg-blue-800 text-white'>
    <Avatar className="h-6 w-6" />
    <Name className='text-white' />
  </ConnectWallet>
  <WalletDropdown>
    <Identity 
      className="px-4 pt-3 pb-2 hover:bg-blue-200" 
      hasCopyAddressOnClick
      schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
>
      <Avatar />
      <Name />
      <Address />
      <EthBalance />
    </Identity>
    <WalletDropdownLink 
      className='hover:bg-blue-200' 
      icon="wallet" 
      href="https://wallet.coinbase.com"
    >
      Wallet
    </WalletDropdownLink>
    <WalletDropdownDisconnect className='hover:bg-blue-200' />
  </WalletDropdown>
            </Wallet>
            </div>
          </div>
        </div>
      </>
    );
  }
