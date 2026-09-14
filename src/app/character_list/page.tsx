'use client'
import React from 'react'
import { EpisodesList } from '../components/EpisodesList/EpisodesList'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function page(){
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <EpisodesList />
    </QueryClientProvider>
  )
}
