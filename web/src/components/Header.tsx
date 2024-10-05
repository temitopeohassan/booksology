'use client';
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
  import Link from "next/link"
  import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import Image from 'next/image';

export default function Header() {
  return (
    <div className="navbar bg-base-100 flex justify-between items-center p-4">
      <div className="flex items-center">
        <div className="flex items-center mr-8">
          <Image
            src="/logo.png"
            alt="Booksology Logo"
            width={40}
            height={40}
            className="mr-3"
          />
          <h1 className="text-3xl font-bold">Booksology</h1>
        </div>
        
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-6">
            <NavigationMenuItem>
              <Link href="/home" legacyBehavior passHref>
                <NavigationMenuLink className="hover:font-bold transition-all">
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/marketplace" legacyBehavior passHref>
                <NavigationMenuLink className="hover:font-bold transition-all">
                  Market Place
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/userlibrary" legacyBehavior passHref>
                <NavigationMenuLink className="hover:font-bold transition-all">
                  Your Library
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/userprofile" legacyBehavior passHref>
                <NavigationMenuLink className="hover:font-bold transition-all">
                  Your Profile
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="ml-auto">
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
  );
}
