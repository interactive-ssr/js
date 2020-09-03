/**
 * descendant
 * Return the node that is the indexed descendant of document.
 * INDEXES: a list of indexes.
 */
function descendant (indexes) {
    let node = document;
    for (let i of indexes) {
        node = node.childNodes[i];
    }
    return node;
}

/**
 * update
 * Modify the dom to be up to date with the server.
 * INSTRUCTIONS: An array containing objects like such
 */
function update (instructions) {
    console.log(instructions);
}

let socket;
/**
 * setup
 * Connect to the websocket on the server.
 * ID: the unique server generated id for identifying with the websocket.
 * PORT: The port to connect to.
 * PROTOCOL (optional): Either "wss" or "ws" (default).
 *
 */
function setup (id, port, protocol) {
    if (!window.WebSocket) {
        alert("Your browser doesn't support websockets. This website might not work properly.");
        return;
    }
    if (!protocol) {
        protocol = "ws"
    }
    socket = new WebSocket(`${protocol}://${location.hostname}:${port}`);
    socket.onmessage = function (event) {
        update(JSON.parse(event.data));
    };
    socket.onopen = function (event) {
        socket.send(`id:${id}`);
    };
}

/**
 * rr - re-render
 * Generate the url parameter list and send it over the server throught the socket.
 * Any element that has a "name" attribute will be put in the parameter list.
 * OBJ (optional): Make OBJ.name be the only one of its kind in the parameter list.
 *
 * Usually, you would want to call rr as rr() or rr(this) from something like onclick="rr(this)", but it can be called as rr({name:"custom-name",value:"custom-value"}) for custom results.
 */
function rr (obj) {
    let elements = document.querySelectorAll("[name]"),
        params = "?" + Array.from(elements, function (element) {
            return (!element.name ||
                    (obj? element.name === obj.name : false))?
                "" : `${element.name}=${element.value}`;
        })
        .concat(obj && obj.name? `${obj.name}=${obj.value}` : "")
        .filter(function (arg) { return arg !== ""; })
        .join("&");
    console.log(params);
    if (!socket) {
        console.error("Socket is not set up yet; try calling setup before calling rr.");
    } else {
        socket.send(params);
    }
}
