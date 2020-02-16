class Namespace{
    constructor(id, nsTitle, img, endpoint){
        this.id = id;
        this.img = img;
        this.nsTitle = nsTitle;
        this.endpoint = endpoint;
        this.rooms = [];
    }

    addRoom(roomObj){
        this.rooms.push(roomObj);
    }

}

// Add default namespace
const CreateNamespace = async (namespaces, namespace) => {
    try {
        const results = await namespaces.insertOne(namespace)
        return results.ops[0]
    } catch (e) {
        throw e
    }
}

const FetchNamespaces = async (namespaces) => {
    try {
        const results = await namespaces.find().toArray()
        return results
    } catch (e) {
        throw e
    }
}

module.exports = {Namespace, FetchNamespaces, CreateNamespace};