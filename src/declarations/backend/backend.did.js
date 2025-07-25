export const idlFactory = ({ IDL }) => {
  const Player = IDL.Record({
    'id' : IDL.Principal,
    'language' : IDL.Text,
    'ready' : IDL.Bool,
  });
  const Time = IDL.Int;
  const Round = IDL.Record({
    'startTime' : Time,
    'language' : IDL.Text,
    'players' : IDL.Vec(Player),
  });
  return IDL.Service({
    'addPlayer' : IDL.Func([IDL.Text], [], []),
    'createRound' : IDL.Func([IDL.Text], [], []),
    'getAllPlayers' : IDL.Func([], [IDL.Vec(Player)], ['query']),
    'getAllRounds' : IDL.Func([], [IDL.Vec(Round)], ['query']),
    'getPlayer' : IDL.Func([IDL.Principal], [IDL.Opt(Player)], ['query']),
    'getRound' : IDL.Func([Time], [IDL.Opt(Round)], ['query']),
    'initializeAuth' : IDL.Func([], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
