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
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="navbar bg-base-100 flex justify-between items-center p-4">
      {/* Logo and Title */}
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
        
        {/* Navigation for larger screens */}
        <NavigationMenu className="hidden md:block">
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

        {/* Hamburger Icon for mobile */}
        <button
          className="block md:hidden text-xl p-2"
          onClick={toggleDrawer}
        >
          ☰
        </button>
      </div>

      {/* Wallet for larger screens */}
      <div className="ml-auto hidden md:block">
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

      {/* Drawer Menu for mobile view */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="fixed left-0 top-0 w-64 h-full bg-white flex flex-col justify-between z-50 p-4">
            {/* Close Button */}
            <button
              className="text-xl mb-4"
              onClick={toggleDrawer}
            >
              ✕
            </button>

            {/* Navigation Links */}
            <NavigationMenu>
              <NavigationMenuList className="flex flex-col space-y-4">
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

            {/* Wallet in Drawer for mobile view */}
            <div className="mt-auto">
              <Wallet>
                <ConnectWallet className='bg-blue-800 text-white w-full p-2'>
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
      )}
    </div>
  );
}
