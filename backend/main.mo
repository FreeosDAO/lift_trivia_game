import OrderedMap "mo:base/OrderedMap";
import Iter "mo:base/Iter";
import Int "mo:base/Int";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Debug "mo:base/Debug";

import MultiUserSystem "auth-multi-user/management";

persistent actor {
    type Player = {
        id : Principal;
        language : Text;
        ready : Bool;
    };

    type Round = {
        startTime : Time.Time;
        players : [Player];
        language : Text;
    };

    transient let roundMap = OrderedMap.Make<Time.Time>(Int.compare);
    var rounds : OrderedMap.Map<Time.Time, Round> = roundMap.empty();

    transient let playerMap = OrderedMap.Make<Principal>(Principal.compare);
    var players : OrderedMap.Map<Principal, Player> = playerMap.empty();

    let multiUserState = MultiUserSystem.initState();

    public shared ({ caller }) func initializeAuth() : async () {
        MultiUserSystem.initializeAuth(multiUserState, caller);
    };

    public shared ({ caller }) func addPlayer(language : Text) : async () {
        if (not (MultiUserSystem.hasPermission(multiUserState, caller, #user, false))) {
            Debug.trap("Unauthorized: Only approved users and admins delete data");
        };

        let newPlayer = {
            id = caller;
            language;
            ready = true;
        };
        players := playerMap.put(players, caller, newPlayer);
    };

    public query func getPlayer(id : Principal) : async ?Player {
        playerMap.get(players, id);
    };

    public query func getAllPlayers() : async [Player] {
        Iter.toArray(playerMap.vals(players));
    };

    public shared ({ caller }) func createRound(language : Text) : async () {
        if (not (MultiUserSystem.hasPermission(multiUserState, caller, #user, false))) {
            Debug.trap("Unauthorized: Only approved users and admins delete data");
        };

        let newRound = {
            startTime = Time.now();
            players = [];
            language;
        };
        rounds := roundMap.put(rounds, newRound.startTime, newRound);
    };

    public query func getRound(startTime : Time.Time) : async ?Round {
        roundMap.get(rounds, startTime);
    };

    public query func getAllRounds() : async [Round] {
        Iter.toArray(roundMap.vals(rounds));
    };
};

