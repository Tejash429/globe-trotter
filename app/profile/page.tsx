import React from 'react';
import { Metadata } from 'next';
import { UserProfile } from '@/components/profile/user-profile';

export const metadata: Metadata = {
  title: 'User Profile — GlobeTrotter',
  description: 'View and manage your personalized travel profile, preplanned multi-city itineraries, and previous trip logs on GlobeTrotter.',
};

export default function ProfilePage() {
  return <UserProfile />;
}
