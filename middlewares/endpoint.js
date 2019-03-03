const logger = require("../utils/logger");

module.exports = logic => (
  async (req, res) => {
    const startTime = Date.now();
    try {
      const beforeData = (logic.before && typeof logic.before === "function")
        ? await logic.before(req)
        : undefined;
      const endpointData = await logic(beforeData || req);
      const afterData = (logic.after && typeof logic.after === "function")
        ? await logic.after(endpointData, req)
        : undefined;
      const resp = afterData || endpointData || {};
      const took = Date.now() - startTime;
      return res.status(resp.status || 200).send(Object.assign({}, { took }, resp));
    } catch (ex) {
      if (!ex.value || ex.value >= 500) logger.error(ex);
      if (logic.onFail && typeof logic.onFail === "function") {
        await logic.onFail(ex);
      }
      const value = ex.value || 500;
      const errors = [
        {
          status: value,
          title: ex.message.title || ex.name || "",
          details: ex.message.details || ex.message || "",
          source: req.originalUrl
        }
      ];
      const took = Date.now() - startTime;
      return res.status(value).send({ errors, took });
    }
  }
);
