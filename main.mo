import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";

actor LostAndFound {
    // Types
    type ItemId = Nat;
    type Status = {
        #lost;
        #found;
        #claimed;
    };

    type Item = {
        id: ItemId;
        name: Text;
        description: Text;
        category: Text;
        location: Text;
        status: Status;
        reportedBy: Principal;
        timestamp: Time.Time;
        contact: Text;
    };

    // State
    private stable var nextId : Nat = 0;
    private var items = HashMap.HashMap<ItemId, Item>(0, Nat.equal, Hash.hash);

    // Functions
    public shared(msg) func reportLostItem(
        name: Text,
        description: Text,
        category: Text,
        location: Text,
        contact: Text
    ) : async ItemId {
        let id = nextId;
        nextId += 1;

        let newItem : Item = {
            id;
            name;
            description;
            category;
            location;
            status = #lost;
            reportedBy = msg.caller;
            timestamp = Time.now();
            contact;
        };

        items.put(id, newItem);
        id
    };

    public shared(msg) func reportFoundItem(
        name: Text,
        description: Text,
        category: Text,
        location: Text,
        contact: Text
    ) : async ItemId {
        let id = nextId;
        nextId += 1;

        let newItem : Item = {
            id;
            name;
            description;
            category;
            location;
            status = #found;
            reportedBy = msg.caller;
            timestamp = Time.now();
            contact;
        };

        items.put(id, newItem);
        id
    };

    public query func getItem(id: ItemId) : async ?Item {
        items.get(id)
    };

    public query func getAllItems() : async [(ItemId, Item)] {
        Iter.toArray(items.entries())
    };

    public shared(msg) func claimItem(id: ItemId) : async Bool {
        switch (items.get(id)) {
            case (null) { false };
            case (?item) {
                let updatedItem : Item = {
                    id = item.id;
                    name = item.name;
                    description = item.description;
                    category = item.category;
                    location = item.location;
                    status = #claimed;
                    reportedBy = item.reportedBy;
                    timestamp = item.timestamp;
                    contact = item.contact;
                };
                items.put(id, updatedItem);
                true
            };
        }
    };
}
