const {
  isNonEmptyString,
  trim,
  intToString,
  stringToInt,
  isArrayInstanceOf,
  isAValidEnum,
  timestampWithFormat
} = require("../../../src/util/index.util");

const {
  MessageStatusType,
  MessageStatusOrder
} = require("../../../src/common/enums");

const moment = require("moment");

describe("Index util unit test", () => {
  describe("test isNonEmptyString util method", () => {
    it("should return false when input string is null", async () => {
      expect(isNonEmptyString(null)).toBe(false);
    });

    it("should return false when input string is undefined", async () => {
      expect(isNonEmptyString(undefined)).toBe(false);
    });

    it("should return false when input string is empty", async () => {
      expect(isNonEmptyString("")).toBe(false);
    });

    it("should return false when input string contains only space", async () => {
      expect(isNonEmptyString("  ")).toBe(false);
    });

    it("should return true when input string contains some char", async () => {
      expect(isNonEmptyString(" test   string  ")).toBe(true);
    });
  });

  describe("test trim util method", () => {
    it("should return empty string when input string is empty", async () => {
      expect(trim("")).toBe("");
    });

    it("should return empty string when input string contains only space", async () => {
      expect(trim("    ")).toBe("");
    });

    it("should remove prefix and suffix space from input string", async () => {
      expect(
        trim(" test   string contains prefix     and suffic space   ")
      ).toBe("test   string contains prefix     and suffic space");
    });

    it("should return same input string when input don't have any prefix and siffix space", async () => {
      expect(trim("test   string without prefix and suffic space")).toBe(
        "test   string without prefix and suffic space"
      );
    });
  });

  describe("test intToString method", () => {
    it("should return string representation of postive number", async () => {
      expect(intToString(123)).toBe("123");
    });

    it("should return string representation of negative number", async () => {
      expect(intToString(-123)).toBe("-123");
    });
  });

  describe("test stringToInt method", () => {
    it("should return integer value if string contains only number", async () => {
      expect(stringToInt("123")).toBe(123);
    });

    it("should return Nan value of if string contains char other then number", async () => {
      expect(stringToInt("abcd")).toBe(NaN);
    });
  });

  describe("test isArrayInstanceOf method", () => {
    it("should return false object is not instance of array", async () => {
      expect(isArrayInstanceOf(123)).toBe(false);
    });

    it("should return false object is undefined", async () => {
      expect(isArrayInstanceOf(undefined)).toBe(false);
    });

    it("should return true object is instance of array", async () => {
      expect(isArrayInstanceOf([1, 2, 3])).toBe(true);
    });
  });

  describe("test isAValidEnum method", () => {
    describe("When input value is string", () => {
      it("should return false when input is not valid enum", async () => {
        expect(isAValidEnum("unsupported", MessageStatusType)).toBe(false);
      });

      it("should return true when input is valid enum", async () => {
        expect(isAValidEnum("read", MessageStatusType)).toBe(true);
        expect(isAValidEnum("unread", MessageStatusType)).toBe(true);
        expect(isAValidEnum("sent", MessageStatusType)).toBe(true);
        expect(isAValidEnum("deleted", MessageStatusType)).toBe(true);
      });
    });

    describe("When input value is string array", () => {
      it("should return false when input is not valid enum", async () => {
        expect(isAValidEnum([-1, 4, 5, 6], MessageStatusOrder)).toBe(false);
      });

      it("should return true when input is valid enum", async () => {
        expect(isAValidEnum([0, 1, 2, 3, 4], MessageStatusOrder)).toBe(true);
      });
    });
  });

  describe("test timestampWithFormat method", () => {
    it("validate return timestamp format", async () => {
      expect(
        moment(timestampWithFormat("YYYY-MM-DD"), "YYYY-MM-DD").isValid()
      ).toBe(true);
    });
  });
});
