"use client"
import { User, Settings, History, CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Address,
  EthBalance,
} from '@coinbase/onchainkit/identity';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';

interface PersonalInfo {
  displayName: string;
  email: string;
  bio: string;
}

interface Transaction {
  id: string;
  type: string;
  book: string;
  amount: string;
  date: string;
}

interface Preferences {
  emailNotifications: boolean;
  showReadingProgress: boolean;
  theme: string;
}

export default function UserProfile() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [personalInfoRes, transactionsRes, preferencesRes] = await Promise.all([
          fetch('`${process.env.API_URL}/api/profile/personal-info`'),
          fetch('`${process.env.API_URL}/api/profile/transactions`'),
          fetch('`${process.env.API_URL}/api/profile/preferences`')
        ]);

        const personalInfoData = await personalInfoRes.json();
        const transactionsData = await transactionsRes.json();
        const preferencesData = await preferencesRes.json();

        setPersonalInfo(personalInfoData);
        setTransactions(transactionsData);
        setPreferences(preferencesData);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handlePersonalInfoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedInfo = {
      displayName: formData.get('displayName'),
      email: formData.get('email'),
      bio: formData.get('bio')
    };

    try {
      const response = await fetch('`${process.env.API_URL}/api/profile/update-personal-info`', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedInfo),
      });
      const data = await response.json();
      setPersonalInfo(data);
    } catch (error) {
      console.error('Error updating personal info:', error);
    }
  };

  const handlePreferencesChange = async (key: keyof Preferences, value: boolean | string) => {
    try {
      const response = await fetch('`${process.env.API_URL}/api/profile/update-preferences`', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [key]: value }),
      });
      const data = await response.json();
      setPreferences(data);
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <User className="mr-2" /> Personal Information
            </h2>
            <form className="space-y-4" onSubmit={handlePersonalInfoSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1">Display Name</label>
                <input 
                  name="displayName"
                  type="text" 
                  className="w-full p-2 border rounded" 
                  defaultValue={personalInfo?.displayName} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  name="email"
                  type="email" 
                  className="w-full p-2 border rounded" 
                  defaultValue={personalInfo?.email} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea 
                  name="bio"
                  className="w-full p-2 border rounded h-24" 
                  defaultValue={personalInfo?.bio} 
                />
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Save Changes
              </button>
            </form>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <History className="mr-2" /> Transaction History
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Transaction ID</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Book</th>
                    <th className="text-left py-2">Amount</th>
                    <th className="text-left py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{tx.id}</td>
                      <td className="py-2">{tx.type}</td>
                      <td className="py-2">{tx.book}</td>
                      <td className="py-2">{tx.amount}</td>
                      <td className="py-2">{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div>          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Settings className="mr-2" /> Preferences
            </h2>
            <div className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={preferences?.emailNotifications}
                    onChange={(e) => handlePreferencesChange('emailNotifications', e.target.checked)}
                  />
                  Email notifications
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={preferences?.showReadingProgress}
                    onChange={(e) => handlePreferencesChange('showReadingProgress', e.target.checked)}
                  />
                  Show reading progress
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Default Theme</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={preferences?.theme}
                  onChange={(e) => handlePreferencesChange('theme', e.target.value)}
                >
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}