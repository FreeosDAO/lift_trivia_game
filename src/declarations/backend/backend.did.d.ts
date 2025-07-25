import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Player {
  'id' : Principal,
  'language' : string,
  'ready' : boolean,
}
export interface Round {
  'startTime' : Time,
  'language' : string,
  'players' : Array<Player>,
}
export type Time = bigint;
export interface _SERVICE {
  'addPlayer' : ActorMethod<[string], undefined>,
  'createRound' : ActorMethod<[string], undefined>,
  'getAllPlayers' : ActorMethod<[], Array<Player>>,
  'getAllRounds' : ActorMethod<[], Array<Round>>,
  'getPlayer' : ActorMethod<[Principal], [] | [Player]>,
  'getRound' : ActorMethod<[Time], [] | [Round]>,
  'initializeAuth' : ActorMethod<[], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
