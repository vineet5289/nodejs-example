export default {
  setResponseHeader(res: any) {
    res.setHeader('X-XSS-Protection', '1;mode=block');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy-Report-Only', "script-src 'self'");
  },

  getRequestHeaders(req: any) {
    const headers = {
      'Content-Type': req.header('Content-Type')
        ? req.header('Content-Type')
        : 'application/json',
      Authorization: req.headers.authorization,
    };

    return headers;
  },

  getUpdatedHeaders(req: any, res: any) {
    this.setResponseHeader(res);
    return this.getRequestHeaders(req);
  },
};
