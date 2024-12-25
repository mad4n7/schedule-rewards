'use client';

import { useSession } from 'next-auth/react';
import { Button } from '../../components/ui/button';
import { useState } from 'react';
import { Input } from '../../components/ui/input';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(session?.user?.name || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      await update({ ...session, user: { ...session?.user, name } });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings
          </p>
        </div>
        <div className="border rounded-lg p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={session?.user?.email || ''}
              disabled
              className="max-w-md"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            {isEditing ? (
              <div className="flex gap-2 max-w-md">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
                <Button
                  onClick={handleUpdateProfile}
                  disabled={isLoading}
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setName(session?.user?.name || '');
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 items-center max-w-md">
                <Input
                  value={session?.user?.name || ''}
                  disabled
                />
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
