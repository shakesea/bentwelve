'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function AdminProfileSettings() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: 'Admin',
    image: '/Kucing.png' // Menggunakan gambar yang sama dengan ProfileSummary
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (session?.user) {
      // Menggunakan username dari email seperti di ProfileSummary
      const username = session.user.email?.split('@')[0] || '';
      
      setProfile({
        name: session.user.name || username,
        email: session.user.email || '',
        role: 'Admin',
        image: '/Kucing.png'
      });
      
      setFormData({
        name: session.user.name || username,
        email: session.user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({ text: 'New passwords do not match', type: 'error' });
      return;
    }

    try {
      // Simulasi update profile - dalam implementasi nyata, ini akan memanggil API
      setMessage({ text: 'Profile updated successfully', type: 'success' });
      setIsEditing(false);
      
      // Update local profile data
      setProfile(prev => ({
        ...prev,
        name: formData.name,
        email: formData.email
      }));
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      setMessage({ text: 'Failed to update profile', type: 'error' });
    }
  };

  if (status === "loading") {
    return <div className="p-6">Loading...</div>;
  }

  if (!session) {
    return <div className="p-6">Please login to view this page</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Profile Settings</h1>
      
      {message.text && (
        <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-green-500">
            <Image 
              src={profile.image} 
              alt="Profile" 
              fill
              className="object-cover"
            />
          </div>
          <p className="text-lg font-medium">{profile.name}</p>
          <p className="text-gray-500">{profile.role}</p>
        </div>

        {/* Profile Form Section */}
        <div className="flex-1">
          {!isEditing ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p className="text-lg text-gray-600">{profile.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="text-lg text-gray-600">{profile.email}</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 px-4 py-2 bg-[#D3628B] text-white rounded hover:bg-[#c0547a]"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#D3628B] focus:border-[#D3628B]"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#D3628B] focus:border-[#D3628B]"
                  required
                />
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-lg font-medium mb-2">Change Password</h3>
                
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#D3628B] focus:border-[#D3628B]"
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mt-3">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#D3628B] focus:border-[#D3628B]"
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mt-3">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#D3628B] focus:border-[#D3628B]"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D3628B] text-white rounded hover:bg-[#c0547a]"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: profile.name,
                      email: profile.email,
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                    setMessage({ text: '', type: '' });
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}