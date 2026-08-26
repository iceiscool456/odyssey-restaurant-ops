export class HttpError extends Error {
  constructor(
    public status: 400 | 404 | 409,
    public body: { error: string },
  ) {
    super(body.error);
    this.name = 'HttpError';
  }
}
