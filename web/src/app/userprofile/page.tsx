import { User, Settings, History, CreditCard } from 'lucide-react';

export default function UserProfile() {
  const transactions = [
    { 
      id: '0x1234...5678',
      type: 'Purchase',
      book: 'The Future of DeFi',
      amount: '0.05 ETH',
      date: '2024-03-15'
    },
    { 
      id: '0x5678...9012',
      type: 'Sale',
      book: 'Crypto Trading Guide',
      amount: '0.03 ETH',
      date: '2024-03-10'
    },
    { 
      id: '0x9012...3456',
      type: 'Purchase',
      book: 'Web3 Development',
      amount: '0.04 ETH',
      date: '2024-03-05'
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <User className="mr-2" /> Personal Information
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Display Name</label>
                <input type="text" className="w-full p-2 border rounded" defaultValue="CryptoReader123" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="w-full p-2 border rounded" defaultValue="user@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea className="w-full p-2 border rounded h-24" defaultValue="Blockchain enthusiast and avid reader. Always looking to learn more about Web3 and cryptocurrency." />
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
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CreditCard className="mr-2" /> Wallet
            </h2>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Connected Address</p>
              <p className="font-mono">0x1234...5678</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Balance</p>
              <p className="font-semibold">2.5 ETH</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Settings className="mr-2" /> Preferences
            </h2>
            <div className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  Email notifications
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  Show reading progress
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Default Theme</label>
                <select className="w-full p-2 border rounded">
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