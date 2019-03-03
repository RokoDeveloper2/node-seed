/**
 * @swagger
 * /hello:
 *  get:
 *   tags:
 *     - Example
 *   description: Say hello!
 *   responses:
 *     200:
 *       description: Hello!
 */

module.exports.endpoint = () => ({ status: 200, data: "Hello" });

