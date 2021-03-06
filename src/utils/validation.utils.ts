import { body, param, ValidationChain, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

type RouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

// validation middleware
export const validate = (validations: ValidationChain[]): RouteHandler => {
  return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    await Promise.all(validations.map((val: ValidationChain): Promise<any> => val.run(request)));

    const result = validationResult(request);

    if (!result.isEmpty()) {
      response.status(422).json(result);
      return;
    }
    next();
  };
};

export const idValidator: ValidationChain[] = [param('id', 'Invalid Id').isInt()];
export const emailValidator: ValidationChain[] = [body('email', 'Invalid Email').isEmail()];
export const authTokenValidator: ValidationChain[] = [body('token', 'Invalid Token').isString()];
