import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

export type Player = {
  id: Principal;
  language: string;
  ready: boolean;
};

export type Round = {
  startTime: bigint;
  players: Array<Player>;
  language: string;
};

export type Time = bigint;

// Candid interface for the backend canister
export interface _SERVICE {
  addPlayer: (language: string) => Promise<void>;
  createRound: (language: string) => Promise<void>;
  getAllPlayers: () => Promise<Array<{
    id: import("@dfinity/principal").Principal;
    language: string;
    ready: boolean;
  }>>;
  getAllRounds: () => Promise<Array<{
    startTime: bigint;
    players: Array<{
      id: import("@dfinity/principal").Principal;
      language: string;
      ready: boolean;
    }>;
    language: string;
  }>>;
  getPlayer: (id: import("@dfinity/principal").Principal) => Promise<{
    id: import("@dfinity/principal").Principal;
    language: string;
    ready: boolean;
  } | undefined>;
  getRound: (startTime: bigint) => Promise<{
    startTime: bigint;
    players: Array<{
      id: import("@dfinity/principal").Principal;
      language: string;
      ready: boolean;
    }>;
    language: string;
  } | undefined>;
  initializeAuth: () => Promise<void>;
}

export const canisterId = 'uxrrr-q7777-77774-qaaaq-cai';

export const createActor = (canisterId: string, options?: {
  agent?: HttpAgent;
}): _SERVICE => {
  const agent = options?.agent || new HttpAgent({
    host: "http://127.0.0.1:4943",
  });

  // Always fetch root key for local development
  agent.fetchRootKey().catch(err => {
    console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
    console.error(err);
  });

  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
};

export const backendInterface = createActor(canisterId);

// Simple IDL factory - this would normally be auto-generated
const idlFactory = ({ IDL }: any) => {
  const Player = IDL.Record({
    'id' : IDL.Principal,
    'language' : IDL.Text,
    'ready' : IDL.Bool,
  });
  const Round = IDL.Record({
    'startTime' : IDL.Int,
    'players' : IDL.Vec(Player),
    'language' : IDL.Text,
  });
  return IDL.Service({
    'addPlayer' : IDL.Func([IDL.Text], [], []),
    'createRound' : IDL.Func([IDL.Text], [], []),
    'getAllPlayers' : IDL.Func([], [IDL.Vec(Player)], ['query']),
    'getAllRounds' : IDL.Func([], [IDL.Vec(Round)], ['query']),
    'getPlayer' : IDL.Func([IDL.Principal], [IDL.Opt(Player)], ['query']),
    'getRound' : IDL.Func([IDL.Int], [IDL.Opt(Round)], ['query']),
    'initializeAuth' : IDL.Func([], [], []),
  });
};