import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
};

export async function getUsers(lang: 'en' | 'ar'): Promise<User[]> {
  try {
    const usersEntry = await getCollection('users', (entry) => 
      entry.id === lang
    );
    
    if (usersEntry.length === 0) {
      console.warn(`No users found for language: ${lang}`);
      return [];
    }
    
    return usersEntry[0].data.users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function getUserById(lang: 'en' | 'ar', userId: number): Promise<User | null> {
  const users = await getUsers(lang);
  return users.find(user => user.id === userId) || null;
}

export async function getUsersByRole(lang: 'en' | 'ar', role: string): Promise<User[]> {
  const users = await getUsers(lang);
  return users.filter(user => user.role.toLowerCase().includes(role.toLowerCase()));
}