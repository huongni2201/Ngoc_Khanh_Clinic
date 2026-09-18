export class ApiError extends Error {
  public statusCode: number;
  public details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }

  static async fromResponse(response: Response): Promise<ApiError> {
    try {
      const data = await response.json();
      return new ApiError(data.message || response.statusText, response.status, data);
    } catch {
      return new ApiError(response.statusText, response.status);
    }
  }
}
