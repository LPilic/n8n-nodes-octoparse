import {Octoparse} from "./Octoparse.node";

test("smoke", () => {
    const node = new Octoparse()
    expect(node.description.properties).toBeDefined()
})
