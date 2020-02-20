const Laptop = require("./laptop");
const Tablet = require("./tablet");

const gadget = { Laptop, Tablet };

module.exports = {
  creategadget(type, attributes) {
    const GadgetType = gadget[type];
    return new GadgetType(attributes);
  }
};
