var Adder = require('../src/Adder');
describe('Adder', function () {
    describe('add', function () {
        // This spec should succeed:
        describe('(3, 3)', function () {
            it('should return 6', function () { return expect(Adder.add(3, 3)).toEqual(6); });
        });
        // This spec should succeed:
        describe('(3, 6)', function () {
            it('should return 9', function () { return expect(Adder.add(3, 6)).toEqual(9); });
        });
        // This spec should fail:
        describe('(3, 7)', function () {
            it('should return 9', function () { return expect(Adder.add(3, 7)).toEqual(9); });
        });
    });
});
//# sourceMappingURL=AdderSpec.js.map