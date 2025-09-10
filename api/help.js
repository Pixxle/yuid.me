const helpMessage = `Usage:
    GET /               - Returns a single V4 UUID
    GET /<count>        - Returns <count> V4 UUIDS. Up to 1000
    GET /v/<UUID>       - Validates UUID, returns VALID or INVALID in body

    GET /v3/            - Returns a single V3 UUID
    GET /v3/<count>     - Returns <count> V3 UUIDS. Up to 1000
    GET /v3/v/<UUID>    - Validates V3 UUID, returns VALID or INVALID in body

    GET /v4/            - Returns a single V4 UUID
    GET /v4/<count>     - Returns <count> V4 UUIDS. Up to 1000
    GET /v4/v/<UUID>    - Validates V4 UUID, returns VALID or INVALID in body
    
`

const help = (req, res) => {
    res.send(helpMessage);
};

export {
    help,
    helpMessage
}