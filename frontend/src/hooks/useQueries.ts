import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Player, Round, Time } from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetAllPlayers() {
  const { actor, isFetching } = useActor();

  return useQuery<Player[]>({
    queryKey: ['allPlayers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPlayers();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000, // Refetch every 5 seconds
  });
}

export function useGetPlayer(id: Principal | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Player | null>({
    queryKey: ['player', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      const result = await actor.getPlayer(id);
      return result || null;
    },
    enabled: !!actor && !isFetching && !!id,
    refetchInterval: 3000, // Refetch every 3 seconds to keep status updated
  });
}

export function useAddPlayer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (language: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPlayer(language);
    },
    onSuccess: () => {
      // Invalidate and refetch all players and current player data
      queryClient.invalidateQueries({ queryKey: ['allPlayers'] });
      queryClient.invalidateQueries({ queryKey: ['player'] });
      queryClient.invalidateQueries({ queryKey: ['readyPlayers'] });
    },
  });
}

export function useSetPlayerReady() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ language }: { language: string }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Use addPlayer to set the player with the selected language
      // This will create/update the player record and set ready=true
      await actor.addPlayer(language);
      return;
    },
    onSuccess: () => {
      // Invalidate and refetch all players and current player data
      queryClient.invalidateQueries({ queryKey: ['allPlayers'] });
      queryClient.invalidateQueries({ queryKey: ['player'] });
      queryClient.invalidateQueries({ queryKey: ['readyPlayers'] });
    },
  });
}

// Clear player readiness (for round end reset)
// Since there's no backend method to clear readiness, this will be handled by frontend state
export function useClearPlayerReadiness() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      // Since there's no backend method to clear readiness,
      // we'll just invalidate queries to refresh the data
      // The frontend will handle the reset logic
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear all player-related queries to force re-fetch
      queryClient.invalidateQueries({ queryKey: ['allPlayers'] });
      queryClient.invalidateQueries({ queryKey: ['player'] });
      queryClient.invalidateQueries({ queryKey: ['readyPlayers'] });
    },
  });
}

// Get ready players from onchain data (only players with ready=true)
export function useGetReadyPlayers() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<{ principalId: string; language: string }>>({
    queryKey: ['readyPlayers'],
    queryFn: async () => {
      if (!actor) return [];
      
      const allPlayers = await actor.getAllPlayers();
      // Only return players who are actually marked as ready
      return allPlayers
        .filter((player: Player) => player.ready)
        .map((player: Player) => ({
          principalId: player.id.toString(),
          language: player.language
        }));
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3000,
  });
}

export function useGetAllRounds() {
  const { actor, isFetching } = useActor();

  return useQuery<Round[]>({
    queryKey: ['allRounds'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRounds();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRound(startTime: Time) {
  const { actor, isFetching } = useActor();

  return useQuery<Round | null>({
    queryKey: ['round', startTime.toString()],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getRound(startTime);
      return result || null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateRound() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (language: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createRound(language);
    },
    onSuccess: () => {
      // Invalidate and refetch all rounds
      queryClient.invalidateQueries({ queryKey: ['allRounds'] });
    },
  });
}
