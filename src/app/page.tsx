'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CharactersList } from './components/CharactersList/CharactersList';
export default function Home() {
  const queryClient = new QueryClient();
  return (
   <QueryClientProvider client={queryClient} >
    <CharactersList />
   </QueryClientProvider>
  );
}
